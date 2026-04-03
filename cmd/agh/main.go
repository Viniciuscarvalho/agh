// Package main is the entry point for the AGH daemon CLI.
package main

import (
	"fmt"

	"github.com/pedronauck/agh/internal/version"
)

func main() {
	fmt.Printf("agh %s\n", version.Version)
}
