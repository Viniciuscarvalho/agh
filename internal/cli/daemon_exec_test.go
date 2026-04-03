package cli

import (
	"os"
	"path/filepath"
	"testing"

	aghconfig "github.com/pedronauck/agh/internal/config"
)

func TestSpawnDetachedDaemonProcess(t *testing.T) {
	t.Parallel()

	homePaths, err := aghconfig.ResolveHomePathsFrom(t.TempDir())
	if err != nil {
		t.Fatalf("ResolveHomePathsFrom() error = %v", err)
	}

	scriptPath := filepath.Join(t.TempDir(), "agh-test-daemon.sh")
	if err := os.WriteFile(scriptPath, []byte("#!/bin/sh\nexit 0\n"), 0o755); err != nil {
		t.Fatalf("os.WriteFile(script) error = %v", err)
	}

	process, err := spawnDetachedDaemonProcess(homePaths, func() (string, error) {
		return scriptPath, nil
	})
	if err != nil {
		t.Fatalf("spawnDetachedDaemonProcess() error = %v", err)
	}
	if process.PID() <= 0 {
		t.Fatalf("process.PID() = %d, want positive pid", process.PID())
	}
	if err := process.Wait(); err != nil {
		t.Fatalf("process.Wait() error = %v", err)
	}
}
