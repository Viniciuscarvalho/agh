package main

import (
	"bytes"
	"io"
	"os"
	"strings"
	"testing"

	"github.com/pedronauck/agh/internal/version"
)

func TestMainPrintsVersion(t *testing.T) {
	original := version.Version
	version.Version = "test-version"
	t.Cleanup(func() {
		version.Version = original
	})

	reader, writer, err := os.Pipe()
	if err != nil {
		t.Fatalf("os.Pipe() error = %v", err)
	}

	originalStdout := os.Stdout
	os.Stdout = writer
	t.Cleanup(func() {
		os.Stdout = originalStdout
	})

	main()

	if err := writer.Close(); err != nil {
		t.Fatalf("writer.Close() error = %v", err)
	}

	var output bytes.Buffer
	if _, err := io.Copy(&output, reader); err != nil {
		t.Fatalf("io.Copy() error = %v", err)
	}
	if got := strings.TrimSpace(output.String()); got != "agh test-version" {
		t.Fatalf("main() output = %q, want %q", got, "agh test-version")
	}
}
