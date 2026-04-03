// Package version provides build metadata injected via ldflags.
package version

import "fmt"

// Values set at build time via -ldflags.
var (
	Version   = "dev"
	Commit    = "unknown"
	BuildDate = "unknown"
)

// Info describes the current build metadata.
type Info struct {
	Version   string
	Commit    string
	BuildDate string
}

// Current returns the active build metadata snapshot.
func Current() Info {
	return Info{
		Version:   Version,
		Commit:    Commit,
		BuildDate: BuildDate,
	}
}

// String returns a readable single-line build summary.
func (i Info) String() string {
	return fmt.Sprintf("%s (%s, %s)", i.Version, i.Commit, i.BuildDate)
}
