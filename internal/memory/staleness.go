package memory

import (
	"fmt"
	"time"
)

// AgeDays reports the number of elapsed calendar-day boundaries since modTime.
func AgeDays(modTime time.Time) int {
	now := time.Now().In(modTime.Location())
	days := calendarDayNumber(now) - calendarDayNumber(modTime.In(modTime.Location()))
	if days < 0 {
		return 0
	}

	return days
}

// AgeText returns a human-readable label for the memory age.
func AgeText(modTime time.Time) string {
	switch age := AgeDays(modTime); age {
	case 0:
		return "today"
	case 1:
		return "yesterday"
	default:
		return fmt.Sprintf("%d days ago", age)
	}
}

// FreshnessWarning returns a staleness caveat for memories older than one day.
func FreshnessWarning(modTime time.Time) string {
	age := AgeDays(modTime)
	if age <= 1 {
		return ""
	}

	return fmt.Sprintf("This memory is %d days old. Verify against current state before asserting as fact.", age)
}

func calendarDayNumber(value time.Time) int {
	year, month, day := value.Date()
	return int(time.Date(year, month, day, 12, 0, 0, 0, time.UTC).Unix() / int64(24*time.Hour/time.Second))
}
