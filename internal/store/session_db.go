package store

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

const (
	sessionStateOpen int32 = iota
	sessionStateClosing
	sessionStateClosed
)

type sessionWriteKind int

const (
	sessionWriteEvent sessionWriteKind = iota + 1
	sessionWriteUsage
)

type sessionWriteRequest struct {
	ctx    context.Context
	kind   sessionWriteKind
	event  SessionEvent
	usage  TokenUsage
	result chan error
}

type sessionShutdownRequest struct {
	ctx    context.Context
	result chan error
}

// SessionDB owns a per-session SQLite database and its dedicated writer loop.
type SessionDB struct {
	db         *sql.DB
	path       string
	sessionID  string
	writeCh    chan sessionWriteRequest
	shutdownCh chan sessionShutdownRequest
	writerDone chan struct{}

	acceptMu sync.RWMutex
	state    atomic.Int32

	drainTimeout time.Duration
	now          func() time.Time
	nextSequence int64
}

var _ EventRecorder = (*SessionDB)(nil)

// OpenSessionDB opens or creates the per-session events database at path.
func OpenSessionDB(ctx context.Context, sessionID string, path string) (*SessionDB, error) {
	if ctx == nil {
		return nil, errors.New("store: open session database context is required")
	}
	if strings.TrimSpace(sessionID) == "" {
		return nil, errors.New("store: session database session id is required")
	}

	db, err := openSessionSQLite(ctx, path)
	if err != nil {
		return nil, err
	}

	nextSequence, err := currentMaxSequence(ctx, db)
	if err != nil {
		closeQuietly(db)
		return nil, fmt.Errorf("store: load current sequence for %q: %w", path, err)
	}

	sessionDB := &SessionDB{
		db:           db,
		path:         strings.TrimSpace(path),
		sessionID:    strings.TrimSpace(sessionID),
		writeCh:      make(chan sessionWriteRequest, defaultWriteBufferSize),
		shutdownCh:   make(chan sessionShutdownRequest, 1),
		writerDone:   make(chan struct{}),
		drainTimeout: defaultDrainTimeout,
		now: func() time.Time {
			return time.Now().UTC()
		},
		nextSequence: nextSequence,
	}
	sessionDB.state.Store(sessionStateOpen)

	go func() {
		defer close(sessionDB.writerDone)
		sessionDB.writerLoop()
	}()

	return sessionDB, nil
}

// Path reports the on-disk path for the database file.
func (s *SessionDB) Path() string {
	if s == nil {
		return ""
	}
	return s.path
}

// SessionID reports the owning session identifier for the database.
func (s *SessionDB) SessionID() string {
	if s == nil {
		return ""
	}
	return s.sessionID
}

// Record appends a session event using the dedicated writer goroutine.
func (s *SessionDB) Record(ctx context.Context, event SessionEvent) error {
	if s == nil {
		return errors.New("store: session database is required")
	}
	if ctx == nil {
		return errors.New("store: record event context is required")
	}
	if err := event.Validate(); err != nil {
		return err
	}
	if event.SessionID != "" && event.SessionID != s.sessionID {
		return fmt.Errorf("store: event session id %q does not match session database %q", event.SessionID, s.sessionID)
	}
	event.SessionID = s.sessionID

	return s.enqueueWrite(ctx, sessionWriteRequest{
		ctx:    ctx,
		kind:   sessionWriteEvent,
		event:  event,
		result: make(chan error, 1),
	})
}

// RecordTokenUsage stores or merges per-turn usage data for the session.
func (s *SessionDB) RecordTokenUsage(ctx context.Context, usage TokenUsage) error {
	if s == nil {
		return errors.New("store: session database is required")
	}
	if ctx == nil {
		return errors.New("store: record token usage context is required")
	}
	if err := usage.Validate(); err != nil {
		return err
	}

	return s.enqueueWrite(ctx, sessionWriteRequest{
		ctx:    ctx,
		kind:   sessionWriteUsage,
		usage:  usage,
		result: make(chan error, 1),
	})
}

// Query returns events filtered by the supplied options.
func (s *SessionDB) Query(ctx context.Context, query EventQuery) ([]SessionEvent, error) {
	if s == nil {
		return nil, errors.New("store: session database is required")
	}
	if ctx == nil {
		return nil, errors.New("store: query events context is required")
	}
	if err := query.Validate(); err != nil {
		return nil, err
	}

	baseQuery := `SELECT id, sequence, turn_id, type, agent_name, content, timestamp FROM events`
	where, args := buildClauses(
		stringClause("type", query.Type),
		stringClause("agent_name", query.AgentName),
		stringClause("turn_id", query.TurnID),
		timeClause("timestamp", ">=", query.Since),
		int64Clause("sequence", ">", query.AfterSequence),
	)
	baseQuery = appendWhere(baseQuery, where)

	sqlQuery := baseQuery
	if query.Limit > 0 {
		sqlQuery = `SELECT id, sequence, turn_id, type, agent_name, content, timestamp
			FROM (` + baseQuery + ` ORDER BY sequence DESC LIMIT ?) AS recent_events
			ORDER BY sequence ASC`
		args = append(args, query.Limit)
	} else {
		sqlQuery += " ORDER BY sequence ASC"
	}

	rows, err := s.db.QueryContext(ctx, sqlQuery, args...)
	if err != nil {
		return nil, fmt.Errorf("store: query session events: %w", err)
	}
	defer func() {
		_ = rows.Close()
	}()

	events := make([]SessionEvent, 0)
	for rows.Next() {
		event, scanErr := s.scanSessionEvent(rows)
		if scanErr != nil {
			return nil, scanErr
		}
		events = append(events, event)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("store: iterate session events: %w", err)
	}

	return events, nil
}

// History returns ordered session events grouped by turn id.
func (s *SessionDB) History(ctx context.Context, query EventQuery) ([]TurnHistory, error) {
	events, err := s.Query(ctx, query)
	if err != nil {
		return nil, err
	}

	turns := make([]TurnHistory, 0)
	indexByTurnID := make(map[string]int, len(events))
	for _, event := range events {
		if idx, ok := indexByTurnID[event.TurnID]; ok {
			turns[idx].Events = append(turns[idx].Events, event)
			continue
		}

		indexByTurnID[event.TurnID] = len(turns)
		turns = append(turns, TurnHistory{
			TurnID: event.TurnID,
			Events: []SessionEvent{event},
		})
	}

	return turns, nil
}

// Close drains queued writes, checkpoints the WAL, and closes the database.
func (s *SessionDB) Close(ctx context.Context) error {
	if s == nil {
		return nil
	}
	if ctx == nil {
		return errors.New("store: close session database context is required")
	}
	if !s.state.CompareAndSwap(sessionStateOpen, sessionStateClosing) {
		if s.state.Load() == sessionStateClosed {
			return nil
		}
		return ErrClosed
	}

	drainCtx, cancel := context.WithTimeout(ctx, s.drainTimeout)
	defer cancel()

	s.acceptMu.Lock()
	resultCh := make(chan error, 1)
	s.shutdownCh <- sessionShutdownRequest{
		ctx:    drainCtx,
		result: resultCh,
	}
	s.acceptMu.Unlock()

	writerErr := waitForShutdownResult(drainCtx, resultCh)
	writerExitErr := waitForWriterExit(drainCtx, s.writerDone)
	checkpointErr := checkpoint(drainCtx, s.db)
	closeErr := s.db.Close()

	s.state.Store(sessionStateClosed)

	return errors.Join(writerErr, writerExitErr, checkpointErr, closeErr)
}

func (s *SessionDB) enqueueWrite(ctx context.Context, req sessionWriteRequest) error {
	s.acceptMu.RLock()
	defer s.acceptMu.RUnlock()

	if s.state.Load() != sessionStateOpen {
		return ErrClosed
	}

	select {
	case s.writeCh <- req:
	case <-ctx.Done():
		return fmt.Errorf("store: enqueue session write: %w", ctx.Err())
	}

	select {
	case err := <-req.result:
		return err
	case <-ctx.Done():
		return fmt.Errorf("store: wait for session write completion: %w", ctx.Err())
	}
}

func (s *SessionDB) writerLoop() {
	for {
		select {
		case req := <-s.writeCh:
			req.result <- s.executeWrite(req)
		case shutdown := <-s.shutdownCh:
			shutdown.result <- s.drainWrites(shutdown.ctx)
			return
		}
	}
}

func (s *SessionDB) drainWrites(ctx context.Context) error {
	var drainErr error

	for {
		select {
		case <-ctx.Done():
			return errors.Join(drainErr, fmt.Errorf("%w: %w", ErrDrainTimeout, ctx.Err()))
		case req := <-s.writeCh:
			err := s.executeWrite(req)
			req.result <- err
			if err != nil {
				drainErr = errors.Join(drainErr, err)
			}
		default:
			return drainErr
		}
	}
}

func (s *SessionDB) executeWrite(req sessionWriteRequest) error {
	if err := req.ctx.Err(); err != nil {
		return fmt.Errorf("store: session write canceled before execution: %w", err)
	}

	switch req.kind {
	case sessionWriteEvent:
		return s.writeEvent(req.ctx, req.event)
	case sessionWriteUsage:
		return s.writeTokenUsage(req.ctx, req.usage)
	default:
		return fmt.Errorf("store: unsupported session write kind %d", req.kind)
	}
}

func (s *SessionDB) writeEvent(ctx context.Context, event SessionEvent) error {
	if strings.TrimSpace(event.ID) == "" {
		event.ID = newID("ev")
	}
	if event.Timestamp.IsZero() {
		event.Timestamp = s.now()
	}

	s.nextSequence++
	event.Sequence = s.nextSequence

	if _, err := s.db.ExecContext(
		ctx,
		`INSERT INTO events (id, sequence, turn_id, type, agent_name, content, timestamp)
		 VALUES (?, ?, ?, ?, ?, ?, ?)`,
		event.ID,
		event.Sequence,
		event.TurnID,
		event.Type,
		event.AgentName,
		event.Content,
		formatTimestamp(event.Timestamp),
	); err != nil {
		s.nextSequence--
		return fmt.Errorf("store: insert session event: %w", err)
	}

	return nil
}

func (s *SessionDB) writeTokenUsage(ctx context.Context, usage TokenUsage) error {
	if usage.Timestamp.IsZero() {
		usage.Timestamp = s.now()
	}

	if _, err := s.db.ExecContext(
		ctx,
		`INSERT INTO token_usage (
			turn_id, input_tokens, output_tokens, total_tokens, thought_tokens,
			cache_read_tokens, cache_write_tokens, context_used, context_size,
			cost_amount, cost_currency, timestamp
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT(turn_id) DO UPDATE SET
			input_tokens = COALESCE(excluded.input_tokens, token_usage.input_tokens),
			output_tokens = COALESCE(excluded.output_tokens, token_usage.output_tokens),
			total_tokens = COALESCE(excluded.total_tokens, token_usage.total_tokens),
			thought_tokens = COALESCE(excluded.thought_tokens, token_usage.thought_tokens),
			cache_read_tokens = COALESCE(excluded.cache_read_tokens, token_usage.cache_read_tokens),
			cache_write_tokens = COALESCE(excluded.cache_write_tokens, token_usage.cache_write_tokens),
			context_used = COALESCE(excluded.context_used, token_usage.context_used),
			context_size = COALESCE(excluded.context_size, token_usage.context_size),
			cost_amount = COALESCE(excluded.cost_amount, token_usage.cost_amount),
			cost_currency = COALESCE(excluded.cost_currency, token_usage.cost_currency),
			timestamp = excluded.timestamp`,
		usage.TurnID,
		nullableInt64(usage.InputTokens),
		nullableInt64(usage.OutputTokens),
		nullableInt64(usage.TotalTokens),
		nullableInt64(usage.ThoughtTokens),
		nullableInt64(usage.CacheReadTokens),
		nullableInt64(usage.CacheWriteTokens),
		nullableInt64(usage.ContextUsed),
		nullableInt64(usage.ContextSize),
		nullableFloat64(usage.CostAmount),
		nullableStringPointer(usage.CostCurrency),
		formatTimestamp(usage.Timestamp),
	); err != nil {
		return fmt.Errorf("store: upsert token usage: %w", err)
	}

	return nil
}

func (s *SessionDB) scanSessionEvent(scanner rowScanner) (SessionEvent, error) {
	var (
		event     SessionEvent
		timestamp string
	)
	if err := scanner.Scan(
		&event.ID,
		&event.Sequence,
		&event.TurnID,
		&event.Type,
		&event.AgentName,
		&event.Content,
		&timestamp,
	); err != nil {
		return SessionEvent{}, fmt.Errorf("store: scan session event: %w", err)
	}

	parsed, err := parseTimestamp(timestamp)
	if err != nil {
		return SessionEvent{}, err
	}
	event.Timestamp = parsed
	event.SessionID = s.sessionID
	return event, nil
}

func currentMaxSequence(ctx context.Context, db *sql.DB) (int64, error) {
	var sequence int64
	if err := db.QueryRowContext(ctx, "SELECT COALESCE(MAX(sequence), 0) FROM events").Scan(&sequence); err != nil {
		return 0, err
	}
	return sequence, nil
}

func waitForShutdownResult(ctx context.Context, resultCh <-chan error) error {
	select {
	case err := <-resultCh:
		return err
	case <-ctx.Done():
		return fmt.Errorf("%w: %w", ErrDrainTimeout, ctx.Err())
	}
}

func waitForWriterExit(ctx context.Context, done <-chan struct{}) error {
	if done == nil {
		return nil
	}
	select {
	case <-done:
		return nil
	case <-ctx.Done():
		return fmt.Errorf("%w: %w", ErrDrainTimeout, ctx.Err())
	}
}
