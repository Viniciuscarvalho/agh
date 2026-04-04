package cli

import (
	"os"
	"path/filepath"
	"strings"
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

func TestSpawnDetachedDaemonProcessWaitIncludesStderr(t *testing.T) {
	t.Parallel()

	homePaths, err := aghconfig.ResolveHomePathsFrom(t.TempDir())
	if err != nil {
		t.Fatalf("ResolveHomePathsFrom() error = %v", err)
	}

	scriptPath := filepath.Join(t.TempDir(), "agh-test-daemon-error.sh")
	script := "#!/bin/sh\nprintf 'bind failed on localhost:2123\\n' >&2\nexit 1\n"
	if err := os.WriteFile(scriptPath, []byte(script), 0o755); err != nil {
		t.Fatalf("os.WriteFile(script) error = %v", err)
	}

	process, err := spawnDetachedDaemonProcess(homePaths, func() (string, error) {
		return scriptPath, nil
	})
	if err != nil {
		t.Fatalf("spawnDetachedDaemonProcess() error = %v", err)
	}

	waitErr := process.Wait()
	if waitErr == nil {
		t.Fatal("process.Wait() error = nil, want non-nil")
	}
	if !strings.Contains(waitErr.Error(), "bind failed on localhost:2123") {
		t.Fatalf("process.Wait() error = %v, want captured stderr", waitErr)
	}
}
