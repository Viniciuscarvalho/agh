package store

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// ReadSessionMeta loads a session metadata document from disk.
func ReadSessionMeta(path string) (SessionMeta, error) {
	cleanPath := strings.TrimSpace(path)
	if cleanPath == "" {
		return SessionMeta{}, errors.New("store: session meta path is required")
	}

	data, err := os.ReadFile(cleanPath)
	if err != nil {
		return SessionMeta{}, fmt.Errorf("store: read session meta %q: %w", cleanPath, err)
	}

	var meta SessionMeta
	if err := json.Unmarshal(data, &meta); err != nil {
		return SessionMeta{}, fmt.Errorf("store: decode session meta %q: %w", cleanPath, err)
	}
	if err := meta.Validate(); err != nil {
		return SessionMeta{}, err
	}

	return meta, nil
}

// WriteSessionMeta writes the metadata file atomically via temp file and rename.
func WriteSessionMeta(path string, meta SessionMeta) error {
	cleanPath := strings.TrimSpace(path)
	if cleanPath == "" {
		return errors.New("store: session meta path is required")
	}
	if err := meta.Validate(); err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(cleanPath), 0o755); err != nil {
		return fmt.Errorf("store: create session meta directory for %q: %w", cleanPath, err)
	}

	payload, err := json.MarshalIndent(meta, "", "  ")
	if err != nil {
		return fmt.Errorf("store: encode session meta %q: %w", cleanPath, err)
	}
	payload = append(payload, '\n')

	file, err := os.CreateTemp(filepath.Dir(cleanPath), filepath.Base(cleanPath)+".tmp-*")
	if err != nil {
		return fmt.Errorf("store: create temp session meta for %q: %w", cleanPath, err)
	}
	tempPath := file.Name()
	defer func() {
		_ = os.Remove(tempPath)
	}()

	if _, err := file.Write(payload); err != nil {
		_ = file.Close()
		return fmt.Errorf("store: write temp session meta %q: %w", tempPath, err)
	}
	if err := file.Sync(); err != nil {
		_ = file.Close()
		return fmt.Errorf("store: sync temp session meta %q: %w", tempPath, err)
	}
	if err := file.Close(); err != nil {
		return fmt.Errorf("store: close temp session meta %q: %w", tempPath, err)
	}
	if err := os.Rename(tempPath, cleanPath); err != nil {
		return fmt.Errorf("store: replace session meta %q: %w", cleanPath, err)
	}

	return syncDirectory(filepath.Dir(cleanPath))
}

func syncDirectory(path string) error {
	dir, err := os.Open(path)
	if err != nil {
		return fmt.Errorf("store: open directory %q for sync: %w", path, err)
	}
	defer func() {
		_ = dir.Close()
	}()

	if err := dir.Sync(); err != nil {
		return fmt.Errorf("store: sync directory %q: %w", path, err)
	}
	return nil
}
