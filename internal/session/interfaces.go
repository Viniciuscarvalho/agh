// Package session orchestrates AGH session lifecycle around ACP-backed agents.
package session

import (
	"context"
	"errors"
	"time"

	"github.com/pedronauck/agh/internal/acp"
	"github.com/pedronauck/agh/internal/store"
)

// StartOpts defines how a runtime agent process should be launched.
type StartOpts = acp.StartOpts

// PromptRequest describes one prompt turn sent to an active session.
type PromptRequest = acp.PromptRequest

// AgentEvent is the streamed runtime event emitted by an active prompt.
type AgentEvent = acp.AgentEvent

// ACPCaps captures the capabilities reported by the ACP agent runtime.
type ACPCaps = acp.ACPCaps

// TokenUsage captures per-turn usage reported by the agent runtime.
type TokenUsage = acp.TokenUsage

// AgentProcess is the session-owned handle for a running agent process.
type AgentProcess struct {
	PID       int
	AgentName string
	Command   string
	Args      []string
	Cwd       string
	SessionID string
	Caps      ACPCaps
	StartedAt time.Time

	done     <-chan struct{}
	waitFn   func() error
	stderrFn func() string
	native   any
}

// Done reports when the underlying runtime process exits.
func (p *AgentProcess) Done() <-chan struct{} {
	if p == nil || p.done == nil {
		ch := make(chan struct{})
		close(ch)
		return ch
	}
	return p.done
}

// Wait blocks until the runtime process exits and returns its terminal error state.
func (p *AgentProcess) Wait() error {
	if p == nil {
		return errors.New("session: agent process is required")
	}
	<-p.Done()
	if p.waitFn == nil {
		return nil
	}
	return p.waitFn()
}

// Stderr returns any captured stderr output for the runtime process.
func (p *AgentProcess) Stderr() string {
	if p == nil || p.stderrFn == nil {
		return ""
	}
	return p.stderrFn()
}

func wrapACPProcess(proc *acp.AgentProcess) *AgentProcess {
	if proc == nil {
		return nil
	}

	return &AgentProcess{
		PID:       proc.PID,
		AgentName: proc.AgentName,
		Command:   proc.Command,
		Args:      append([]string(nil), proc.Args...),
		Cwd:       proc.Cwd,
		SessionID: proc.SessionID,
		Caps:      proc.Caps,
		StartedAt: proc.StartedAt,
		done:      proc.Done(),
		waitFn:    proc.Wait,
		stderrFn:  proc.Stderr,
		native:    proc,
	}
}

// AgentDriver defines the ACP functionality consumed by the session manager.
type AgentDriver interface {
	Start(ctx context.Context, opts StartOpts) (*AgentProcess, error)
	Prompt(ctx context.Context, proc *AgentProcess, req PromptRequest) (<-chan AgentEvent, error)
	Cancel(ctx context.Context, proc *AgentProcess) error
	Stop(ctx context.Context, proc *AgentProcess) error
}

// EventRecorder defines the per-session storage operations consumed by session/.
type EventRecorder interface {
	Record(ctx context.Context, event store.SessionEvent) error
	RecordTokenUsage(ctx context.Context, usage store.TokenUsage) error
	Query(ctx context.Context, query store.EventQuery) ([]store.SessionEvent, error)
	History(ctx context.Context, query store.EventQuery) ([]store.TurnHistory, error)
	Close(ctx context.Context) error
}

// Notifier fans out session lifecycle and prompt events to downstream observers.
type Notifier interface {
	OnSessionCreated(ctx context.Context, session *Session)
	OnSessionStopped(ctx context.Context, session *Session)
	OnAgentEvent(ctx context.Context, sessionID string, event AgentEvent)
}

type nopNotifier struct{}

func (nopNotifier) OnSessionCreated(context.Context, *Session) {}

func (nopNotifier) OnSessionStopped(context.Context, *Session) {}

func (nopNotifier) OnAgentEvent(context.Context, string, AgentEvent) {}

// ACPDriverAdapter adapts the concrete ACP driver to the session-local interface.
type ACPDriverAdapter struct {
	driver *acp.Driver
}

var _ AgentDriver = (*ACPDriverAdapter)(nil)

// NewACPDriverAdapter wraps the provided ACP driver for use by the session manager.
func NewACPDriverAdapter(driver *acp.Driver) *ACPDriverAdapter {
	return &ACPDriverAdapter{driver: driver}
}

// Start launches a new ACP-backed runtime process.
func (a *ACPDriverAdapter) Start(ctx context.Context, opts StartOpts) (*AgentProcess, error) {
	if a == nil || a.driver == nil {
		return nil, errors.New("session: acp driver is required")
	}

	proc, err := a.driver.Start(ctx, opts)
	if err != nil {
		return nil, err
	}
	return wrapACPProcess(proc), nil
}

// Prompt streams prompt events from the wrapped ACP runtime.
func (a *ACPDriverAdapter) Prompt(ctx context.Context, proc *AgentProcess, req PromptRequest) (<-chan AgentEvent, error) {
	if a == nil || a.driver == nil {
		return nil, errors.New("session: acp driver is required")
	}

	native, err := a.nativeProcess(proc)
	if err != nil {
		return nil, err
	}
	return a.driver.Prompt(ctx, native, req)
}

// Cancel cooperatively cancels the active ACP prompt.
func (a *ACPDriverAdapter) Cancel(ctx context.Context, proc *AgentProcess) error {
	if a == nil || a.driver == nil {
		return errors.New("session: acp driver is required")
	}

	native, err := a.nativeProcess(proc)
	if err != nil {
		return err
	}
	return a.driver.Cancel(ctx, native)
}

// Stop stops the wrapped ACP runtime process.
func (a *ACPDriverAdapter) Stop(ctx context.Context, proc *AgentProcess) error {
	if a == nil || a.driver == nil {
		return errors.New("session: acp driver is required")
	}

	native, err := a.nativeProcess(proc)
	if err != nil {
		return err
	}
	return a.driver.Stop(ctx, native)
}

func (a *ACPDriverAdapter) nativeProcess(proc *AgentProcess) (*acp.AgentProcess, error) {
	if proc == nil {
		return nil, errors.New("session: agent process is required")
	}

	native, ok := proc.native.(*acp.AgentProcess)
	if !ok || native == nil {
		return nil, errors.New("session: unsupported agent process implementation")
	}
	return native, nil
}
