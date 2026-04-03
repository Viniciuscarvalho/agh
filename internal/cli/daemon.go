package cli

import (
	"context"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"syscall"
	"time"

	aghconfig "github.com/pedronauck/agh/internal/config"
	aghdaemon "github.com/pedronauck/agh/internal/daemon"
	"github.com/pedronauck/agh/internal/version"
	"github.com/spf13/cobra"
)

const internalChildFlagName = "internal-child"

type daemonProcess interface {
	PID() int
	Wait() error
}

type execDaemonProcess struct {
	cmd *exec.Cmd
}

func (p *execDaemonProcess) PID() int {
	if p == nil || p.cmd == nil || p.cmd.Process == nil {
		return 0
	}
	return p.cmd.Process.Pid
}

func (p *execDaemonProcess) Wait() error {
	if p == nil || p.cmd == nil {
		return nil
	}
	return p.cmd.Wait()
}

func newDaemonCommand(deps commandDeps) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "daemon",
		Short: "Manage the AGH daemon",
	}

	cmd.AddCommand(newDaemonStartCommand(deps))
	cmd.AddCommand(newDaemonStopCommand(deps))
	cmd.AddCommand(newDaemonStatusCommand(deps))
	return cmd
}

func newDaemonStartCommand(deps commandDeps) *cobra.Command {
	var (
		foreground    bool
		internalChild bool
	)

	cmd := &cobra.Command{
		Use:   "start",
		Short: "Start the AGH daemon",
		RunE: func(cmd *cobra.Command, _ []string) error {
			if foreground || internalChild {
				return runDaemonForeground(cmd.Context(), deps)
			}
			status, err := runDaemonDetached(cmd.Context(), deps)
			if err != nil {
				return err
			}
			return writeCommandOutput(cmd, daemonStatusBundle(status, deps.now))
		},
	}
	cmd.Flags().BoolVar(&foreground, "foreground", false, "Run the daemon in the foreground")
	cmd.Flags().BoolVar(&internalChild, internalChildFlagName, false, "Internal detached child mode")
	_ = cmd.Flags().MarkHidden(internalChildFlagName)
	return cmd
}

func newDaemonStatusCommand(deps commandDeps) *cobra.Command {
	return &cobra.Command{
		Use:   "status",
		Short: "Show daemon status",
		RunE: func(cmd *cobra.Command, _ []string) error {
			runtime, err := loadRuntimeContext(deps)
			if err != nil {
				return err
			}

			status, err := daemonStatusFromDeps(cmd.Context(), deps, runtime)
			if err != nil {
				return err
			}
			return writeCommandOutput(cmd, daemonStatusBundle(status, deps.now))
		},
	}
}

func newDaemonStopCommand(deps commandDeps) *cobra.Command {
	return &cobra.Command{
		Use:   "stop",
		Short: "Stop the AGH daemon",
		RunE: func(cmd *cobra.Command, _ []string) error {
			runtime, err := loadRuntimeContext(deps)
			if err != nil {
				return err
			}

			info, running, err := daemonInfo(runtime.HomePaths, deps)
			if err != nil {
				return err
			}
			if !running {
				return errors.New("cli: daemon is not running")
			}

			if err := deps.signalProcess(info.PID, syscall.SIGTERM); err != nil {
				return err
			}

			status, err := waitForDaemonStop(cmd.Context(), deps, runtime, info)
			if err != nil {
				return err
			}
			return writeCommandOutput(cmd, daemonStatusBundle(status, deps.now))
		},
	}
}

func runDaemonForeground(ctx context.Context, deps commandDeps) error {
	runtime, err := loadRuntimeContext(deps)
	if err != nil {
		return err
	}
	if err := deps.ensureHome(runtime.HomePaths); err != nil {
		return err
	}

	if _, running, err := daemonInfo(runtime.HomePaths, deps); err != nil {
		return err
	} else if running {
		return errors.New("cli: daemon already running")
	}

	runner, err := deps.newDaemon()
	if err != nil {
		return err
	}
	return runner.Run(ctx)
}

func runDaemonDetached(ctx context.Context, deps commandDeps) (DaemonStatus, error) {
	runtime, err := loadRuntimeContext(deps)
	if err != nil {
		return DaemonStatus{}, err
	}
	if err := deps.ensureHome(runtime.HomePaths); err != nil {
		return DaemonStatus{}, err
	}

	if info, running, err := daemonInfo(runtime.HomePaths, deps); err != nil {
		return DaemonStatus{}, err
	} else if running {
		return DaemonStatus{}, fmt.Errorf("cli: daemon already running (pid=%d)", info.PID)
	}

	child, err := deps.spawnDetached(runtime.HomePaths)
	if err != nil {
		return DaemonStatus{}, err
	}

	status, err := waitForDaemonStart(ctx, deps, child)
	if err != nil {
		return DaemonStatus{}, err
	}
	return status, nil
}

func waitForDaemonStart(ctx context.Context, deps commandDeps, child daemonProcess) (DaemonStatus, error) {
	waitCtx := ctx
	if waitCtx == nil {
		waitCtx = context.Background()
	}
	if _, hasDeadline := waitCtx.Deadline(); !hasDeadline {
		var cancel context.CancelFunc
		waitCtx, cancel = context.WithTimeout(waitCtx, deps.startTimeout)
		defer cancel()
	}

	client, _, err := clientFromDeps(deps)
	if err != nil {
		return DaemonStatus{}, err
	}

	childErrCh := make(chan error, 1)
	go func() {
		if child != nil {
			childErrCh <- child.Wait()
			return
		}
		childErrCh <- nil
	}()

	ticker := time.NewTicker(deps.pollInterval)
	defer ticker.Stop()

	for {
		select {
		case <-waitCtx.Done():
			return DaemonStatus{}, errors.New("cli: daemon did not become ready before timeout")
		case err := <-childErrCh:
			if err != nil {
				return DaemonStatus{}, fmt.Errorf("cli: detached daemon exited before readiness: %w", err)
			}
			return DaemonStatus{}, errors.New("cli: detached daemon exited before readiness")
		case <-ticker.C:
			status, statusErr := client.DaemonStatus(waitCtx)
			if statusErr == nil {
				return status, nil
			}
		}
	}
}

func waitForDaemonStop(ctx context.Context, deps commandDeps, runtime runtimeContext, info aghdaemon.Info) (DaemonStatus, error) {
	waitCtx := ctx
	if waitCtx == nil {
		waitCtx = context.Background()
	}
	if _, hasDeadline := waitCtx.Deadline(); !hasDeadline {
		var cancel context.CancelFunc
		waitCtx, cancel = context.WithTimeout(waitCtx, deps.stopTimeout)
		defer cancel()
	}

	client, _, clientErr := clientFromDeps(deps)
	ticker := time.NewTicker(deps.pollInterval)
	defer ticker.Stop()

	for {
		select {
		case <-waitCtx.Done():
			return DaemonStatus{}, errors.New("cli: daemon did not stop before timeout")
		case <-ticker.C:
			if _, running, err := daemonInfo(runtime.HomePaths, deps); err == nil && !running {
				return stoppedDaemonStatus(runtime, info), nil
			}
			if clientErr == nil {
				if _, err := client.DaemonStatus(waitCtx); err != nil {
					if _, running, infoErr := daemonInfo(runtime.HomePaths, deps); infoErr == nil && !running {
						return stoppedDaemonStatus(runtime, info), nil
					}
				}
			}
		}
	}
}

func daemonStatusFromDeps(ctx context.Context, deps commandDeps, runtime runtimeContext) (DaemonStatus, error) {
	client, _, err := clientFromDeps(deps)
	if err == nil {
		status, statusErr := client.DaemonStatus(ctx)
		if statusErr == nil {
			return status, nil
		}
	}

	info, running, err := daemonInfo(runtime.HomePaths, deps)
	if err != nil {
		return DaemonStatus{}, err
	}
	if !running {
		return stoppedDaemonStatus(runtime, info), nil
	}
	return startingDaemonStatus(runtime, info), nil
}

func daemonInfo(homePaths aghconfig.HomePaths, deps commandDeps) (aghdaemon.Info, bool, error) {
	info, err := deps.readDaemonInfo(homePaths.DaemonInfo)
	switch {
	case err == nil:
	case errors.Is(err, os.ErrNotExist):
		return aghdaemon.Info{}, false, nil
	default:
		return aghdaemon.Info{}, false, err
	}

	if !deps.processAlive(info.PID) {
		return info, false, nil
	}
	return info, true, nil
}

func startingDaemonStatus(runtime runtimeContext, info aghdaemon.Info) DaemonStatus {
	return DaemonStatus{
		Status:         "starting",
		PID:            info.PID,
		StartedAt:      info.StartedAt,
		Socket:         runtime.Config.Daemon.Socket,
		HTTPHost:       runtime.Config.HTTP.Host,
		HTTPPort:       runtime.Config.HTTP.Port,
		ActiveSessions: 0,
		TotalSessions:  0,
		Version:        version.Version,
	}
}

func stoppedDaemonStatus(runtime runtimeContext, info aghdaemon.Info) DaemonStatus {
	return DaemonStatus{
		Status:         "stopped",
		PID:            info.PID,
		StartedAt:      info.StartedAt,
		Socket:         runtime.Config.Daemon.Socket,
		HTTPHost:       runtime.Config.HTTP.Host,
		HTTPPort:       runtime.Config.HTTP.Port,
		ActiveSessions: 0,
		TotalSessions:  0,
		Version:        version.Version,
	}
}

func daemonStatusBundle(status DaemonStatus, now func() time.Time) outputBundle {
	return outputBundle{
		jsonValue: status,
		human: func() (string, error) {
			return renderHumanSection("Daemon", []keyValue{
				{Label: "Status", Value: stringOrDash(status.Status)},
				{Label: "PID", Value: intOrDash(status.PID)},
				{Label: "Started", Value: stringOrDash(formatTime(status.StartedAt))},
				{Label: "Uptime", Value: stringOrDash(formatAge(now, status.StartedAt))},
				{Label: "Socket", Value: stringOrDash(status.Socket)},
				{Label: "HTTP", Value: stringOrDash(strings.TrimSpace(status.HTTPHost) + ":" + intOrDash(status.HTTPPort))},
				{Label: "Active Sessions", Value: strconv.Itoa(status.ActiveSessions)},
				{Label: "Total Sessions", Value: strconv.Itoa(status.TotalSessions)},
				{Label: "Version", Value: stringOrDash(status.Version)},
			}), nil
		},
		toon: func() (string, error) {
			return renderToonObject("daemon", []string{
				"status", "pid", "started_at", "uptime", "socket", "http_host", "http_port", "active_sessions", "total_sessions", "version",
			}, []string{
				status.Status,
				strconv.Itoa(status.PID),
				formatTime(status.StartedAt),
				formatAge(now, status.StartedAt),
				status.Socket,
				status.HTTPHost,
				strconv.Itoa(status.HTTPPort),
				strconv.Itoa(status.ActiveSessions),
				strconv.Itoa(status.TotalSessions),
				status.Version,
			}), nil
		},
	}
}

func spawnDetachedDaemonProcess(homePaths aghconfig.HomePaths, executable func() (string, error)) (daemonProcess, error) {
	if err := aghconfig.EnsureHomeLayout(homePaths); err != nil {
		return nil, err
	}

	logFile, err := os.OpenFile(homePaths.LogFile, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o600)
	if err != nil {
		return nil, fmt.Errorf("cli: open daemon log %q: %w", homePaths.LogFile, err)
	}

	binary, err := executable()
	if err != nil {
		_ = logFile.Close()
		return nil, fmt.Errorf("cli: resolve executable: %w", err)
	}

	child := exec.Command(binary, "daemon", "start", "--foreground", "--"+internalChildFlagName)
	child.Env = os.Environ()
	child.Stdin = nil
	child.Stdout = logFile
	child.Stderr = logFile
	child.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}

	if err := child.Start(); err != nil {
		_ = logFile.Close()
		return nil, fmt.Errorf("cli: spawn detached daemon: %w", err)
	}
	if err := logFile.Close(); err != nil {
		return nil, fmt.Errorf("cli: close daemon log handle: %w", err)
	}

	return &execDaemonProcess{cmd: child}, nil
}
