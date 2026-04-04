package observe

import (
	"context"

	"github.com/pedronauck/agh/internal/store"
)

// QueryEvents returns cross-session event summaries ordered for CLI/API consumption.
func (o *Observer) QueryEvents(ctx context.Context, query store.EventSummaryQuery) ([]store.EventSummary, error) {
	return o.registry.ListEventSummaries(ctx, query)
}

// QueryTokenStats returns aggregated per-session token usage rows.
func (o *Observer) QueryTokenStats(ctx context.Context, query store.TokenStatsQuery) ([]store.TokenStats, error) {
	return o.registry.ListTokenStats(ctx, query)
}

// QueryPermissionLog returns permission audit rows.
func (o *Observer) QueryPermissionLog(ctx context.Context, query store.PermissionLogQuery) ([]store.PermissionLogEntry, error) {
	return o.registry.ListPermissionLog(ctx, query)
}
