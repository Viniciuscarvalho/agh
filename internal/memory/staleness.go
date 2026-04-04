package memory

import (
	"fmt"
	"time"
)

// AgeDays reports the number of elapsed calendar-day boundaries since modTime using the supplied clock value.
func AgeDays(modTime time.Time, now time.Time) int {
	days := calendarDayNumber(now.In(modTime.Location())) - calendarDayNumber(modTime.In(modTime.Location()))
	if days < 0 {
		return 0
	}

	return days
}

// AgeText returns a human-readable label for the memory age using the supplied clock value.
func AgeText(modTime time.Time, now time.Time) string {
	switch age := AgeDays(modTime, now); age {
	case 0:
		return "today"
	case 1:
		return "yesterday"
	default:
		return fmt.Sprintf("%d days ago", age)
	}
}

// FreshnessWarning returns a staleness caveat for memories older than one day using the supplied clock value.
func FreshnessWarning(modTime time.Time, now time.Time) string {
	age := AgeDays(modTime, now)
	if age <= 1 {
		return ""
	}

	return fmt.Sprintf("This memory is %d days old. Verify against current state before asserting as fact.", age)
}

func calendarDayNumber(value time.Time) int {
	year, month, day := value.Date()
	return int(time.Date(year, month, day, 12, 0, 0, 0, time.UTC).Unix() / int64(24*time.Hour/time.Second))
}
