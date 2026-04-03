package udsapi

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	aghconfig "github.com/pedronauck/agh/internal/config"
	"github.com/pedronauck/agh/internal/observe"
	"github.com/pedronauck/agh/internal/session"
)

func TestCreateSessionHandlerRejectsBadJSONAndNotFound(t *testing.T) {
	homePaths := newTestHomePaths(t)
	engine := newTestRouter(t, newTestHandlers(t, stubSessionManager{}, stubObserver{}, homePaths))

	badJSON := performRequest(t, engine, http.MethodPost, "/api/sessions", []byte(`{"agent_name":`))
	if badJSON.Code != http.StatusBadRequest {
		t.Fatalf("bad JSON status = %d, want %d", badJSON.Code, http.StatusBadRequest)
	}

	notFoundEngine := newTestRouter(t, newTestHandlers(t, stubSessionManager{
		createFn: func(context.Context, session.CreateOpts) (*session.Session, error) {
			return nil, os.ErrNotExist
		},
	}, stubObserver{}, homePaths))
	notFound := performRequest(t, notFoundEngine, http.MethodPost, "/api/sessions", []byte(`{"agent_name":"coder"}`))
	if notFound.Code != http.StatusNotFound {
		t.Fatalf("not found status = %d, want %d", notFound.Code, http.StatusNotFound)
	}
}

func TestGetSessionAndResumeHandlersReturnNotFound(t *testing.T) {
	homePaths := newTestHomePaths(t)
	manager := stubSessionManager{
		statusFn: func(context.Context, string) (*session.SessionInfo, error) {
			return nil, session.ErrSessionNotFound
		},
		resumeFn: func(context.Context, string) (*session.Session, error) {
			return nil, session.ErrSessionNotFound
		},
	}
	engine := newTestRouter(t, newTestHandlers(t, manager, stubObserver{}, homePaths))

	getResp := performRequest(t, engine, http.MethodGet, "/api/sessions/missing", nil)
	if getResp.Code != http.StatusNotFound {
		t.Fatalf("GET status = %d, want %d", getResp.Code, http.StatusNotFound)
	}
	resumeResp := performRequest(t, engine, http.MethodPost, "/api/sessions/missing/resume", nil)
	if resumeResp.Code != http.StatusNotFound {
		t.Fatalf("POST resume status = %d, want %d", resumeResp.Code, http.StatusNotFound)
	}
}

func TestListAndStopHandlersReturnErrors(t *testing.T) {
	homePaths := newTestHomePaths(t)
	manager := stubSessionManager{
		listAllFn: func(context.Context) ([]*session.SessionInfo, error) {
			return nil, errors.New("list failed")
		},
		stopFn: func(context.Context, string) error {
			return session.ErrSessionNotFound
		},
	}
	engine := newTestRouter(t, newTestHandlers(t, manager, stubObserver{}, homePaths))

	listResp := performRequest(t, engine, http.MethodGet, "/api/sessions", nil)
	if listResp.Code != http.StatusInternalServerError {
		t.Fatalf("list status = %d, want %d", listResp.Code, http.StatusInternalServerError)
	}
	stopResp := performRequest(t, engine, http.MethodDelete, "/api/sessions/missing", nil)
	if stopResp.Code != http.StatusNotFound {
		t.Fatalf("stop status = %d, want %d", stopResp.Code, http.StatusNotFound)
	}
}

func TestSessionHandlersRejectBadQueryAndHeaderValues(t *testing.T) {
	homePaths := newTestHomePaths(t)
	manager := stubSessionManager{
		statusFn: func(context.Context, string) (*session.SessionInfo, error) {
			return newSessionInfo("sess-123"), nil
		},
	}
	handlers := newTestHandlers(t, manager, stubObserver{}, homePaths)
	engine := newTestRouter(t, handlers)

	eventsResp := performRequest(t, engine, http.MethodGet, "/api/sessions/sess-123/events?since=bad", nil)
	if eventsResp.Code != http.StatusBadRequest {
		t.Fatalf("events bad query status = %d, want %d", eventsResp.Code, http.StatusBadRequest)
	}

	req := httptest.NewRequest(http.MethodGet, "/api/sessions/sess-123/stream", nil)
	req.Header.Set("Last-Event-ID", "bad")
	recorder := httptest.NewRecorder()
	engine.ServeHTTP(recorder, req)
	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("stream bad header status = %d, want %d", recorder.Code, http.StatusBadRequest)
	}
}

func TestGetAgentAndObserveHandlersReturnErrors(t *testing.T) {
	homePaths := newTestHomePaths(t)
	handlers := newTestHandlers(t, stubSessionManager{}, stubObserver{
		queryEventsFn: func(context.Context, observe.EventQuery) ([]observe.Event, error) {
			return nil, errors.New("boom")
		},
	}, homePaths)
	handlers.agentLoader = func(_ string, _ aghconfig.HomePaths) (aghconfig.AgentDef, error) {
		return aghconfig.AgentDef{}, os.ErrNotExist
	}
	engine := newTestRouter(t, handlers)

	agentResp := performRequest(t, engine, http.MethodGet, "/api/agents/missing", nil)
	if agentResp.Code != http.StatusNotFound {
		t.Fatalf("agent status = %d, want %d", agentResp.Code, http.StatusNotFound)
	}

	observeResp := performRequest(t, engine, http.MethodGet, "/api/observe/events", nil)
	if observeResp.Code != http.StatusInternalServerError {
		t.Fatalf("observe status = %d, want %d", observeResp.Code, http.StatusInternalServerError)
	}
}

func TestListAgentsHandlesMissingDirectory(t *testing.T) {
	homePaths := newTestHomePaths(t)
	if err := os.RemoveAll(homePaths.AgentsDir); err != nil {
		t.Fatalf("os.RemoveAll(AgentsDir) error = %v", err)
	}
	engine := newTestRouter(t, newTestHandlers(t, stubSessionManager{}, stubObserver{}, homePaths))

	recorder := performRequest(t, engine, http.MethodGet, "/api/agents", nil)
	if recorder.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusOK)
	}
}

func TestObserveStreamAndHealthAndDaemonStatusErrorPaths(t *testing.T) {
	homePaths := newTestHomePaths(t)
	observer := stubObserver{
		queryEventsFn: func(context.Context, observe.EventQuery) ([]observe.Event, error) {
			return nil, errors.New("query failed")
		},
		healthFn: func(context.Context) (observe.Health, error) {
			return observe.Health{}, errors.New("health failed")
		},
	}
	handlers := newTestHandlers(t, stubSessionManager{}, observer, homePaths)
	engine := newTestRouter(t, handlers)

	req := httptest.NewRequest(http.MethodGet, "/api/observe/events/stream", nil)
	req.Header.Set("Last-Event-ID", "bad")
	recorder := httptest.NewRecorder()
	engine.ServeHTTP(recorder, req)
	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("observe stream bad header status = %d, want %d", recorder.Code, http.StatusBadRequest)
	}

	healthResp := performRequest(t, engine, http.MethodGet, "/api/observe/health", nil)
	if healthResp.Code != http.StatusInternalServerError {
		t.Fatalf("health status = %d, want %d", healthResp.Code, http.StatusInternalServerError)
	}

	statusHandlers := newTestHandlers(t, stubSessionManager{
		listAllFn: func(context.Context) ([]*session.SessionInfo, error) {
			return nil, errors.New("list failed")
		},
	}, stubObserver{
		healthFn: func(context.Context) (observe.Health, error) {
			return observe.Health{Status: "ok"}, nil
		},
	}, homePaths)
	statusEngine := newTestRouter(t, statusHandlers)
	statusResp := performRequest(t, statusEngine, http.MethodGet, "/api/daemon/status", nil)
	if statusResp.Code != http.StatusInternalServerError {
		t.Fatalf("daemon status = %d, want %d", statusResp.Code, http.StatusInternalServerError)
	}
}
