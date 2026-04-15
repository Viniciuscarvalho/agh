package globaldb

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
)

func rollbackTx(tx *sql.Tx, action string) error {
	if tx == nil {
		return nil
	}
	if err := tx.Rollback(); err != nil && !errors.Is(err, sql.ErrTxDone) {
		return fmt.Errorf("store: rollback %s transaction: %w", action, err)
	}
	return nil
}

func rollbackImmediate(ctx context.Context, conn *sql.Conn, action string) error {
	if conn == nil {
		return nil
	}
	if _, err := conn.ExecContext(ctx, "ROLLBACK"); err != nil {
		return fmt.Errorf("store: rollback %s transaction: %w", action, err)
	}
	return nil
}

func restoreForeignKeys(ctx context.Context, conn *sql.Conn) error {
	if conn == nil {
		return nil
	}
	if _, err := conn.ExecContext(ctx, "PRAGMA foreign_keys = ON"); err != nil {
		return fmt.Errorf("store: restore sqlite foreign keys: %w", err)
	}
	return nil
}

func joinCleanupError(target *error, cleanupErr error) {
	if cleanupErr == nil || target == nil {
		return
	}
	if *target == nil {
		*target = cleanupErr
		return
	}
	*target = errors.Join(*target, cleanupErr)
}
