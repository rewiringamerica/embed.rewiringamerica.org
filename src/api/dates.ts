/**
 * Returns the earliest possible timestamp for the given API date string.
 * (`start_date` and `end_date` in the API can represent a range of dates
 * rather than just a single one.)
 */
export function parseApiDate(apiDate: string): number {
  // Construct the timestamp at UTC midnight on the earliest possible day that
  // the API date refers to.
  let earliestPossibleInstant: number;
  const match = apiDate.match(/^(\d{4})(Q|H)(\d)$/);
  if (match) {
    // Quarter or half
    const parsedYear = parseInt(match[1]);
    const halfOrQuarterNumber = parseInt(match[3]);
    // Date.getMonth is 0-based, so the first month of Q1 is 0, first month of
    // Q2 is 3, and so on.
    const firstPossibleMonth =
      match[2] === 'Q'
        ? (halfOrQuarterNumber - 1) * 3
        : (halfOrQuarterNumber - 1) * 6;
    earliestPossibleInstant = Date.UTC(parsedYear, firstPossibleMonth, 1);
  } else {
    // It's year, year-month, or year-month-day.
    const parts = apiDate.split('-');
    const parsedYear = parseInt(parts[0]);
    const parsedMonth = parts[1] ? parseInt(parts[1]) - 1 : 0; // 0-based month
    const parsedDay = parts[2] ? parseInt(parts[2]) : 1;
    earliestPossibleInstant = Date.UTC(parsedYear, parsedMonth, parsedDay);
  }

  return earliestPossibleInstant;
}

/**
 * Returns whether the given API date is unambiguously in the future, relative
 * to "now". (start_date and end_date in the API can represent a range of dates
 * rather than just a single one.)
 *
 * The [now] param will be interpreted in local time.
 */
export function isInFuture(apiDate: string, now: Date): boolean {
  const earliestPossibleInstant = parseApiDate(apiDate);
  // Construct the timestamp at UTC midnight, with the Y/M/D of now, as
  // interpreted in local time. This avoids timezone issues by only comparing
  // timestamps with the same time and timezone component.
  const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return utcNow < earliestPossibleInstant;
}

/**
 * Returns whether the given API date is within 60 days in the future, relative
 * to "now". (start_date and end_date in the API can represent a range of dates
 * rather than just a single one.)
 *
 * The [now] param will be interpreted in local time.
 */
export function isChangingSoon(apiDate: string, now: Date): boolean {
  const earliestPossibleInstant = parseApiDate(apiDate);
  // Construct the timestamp at UTC midnight, with the Y/M/D of now, as
  // interpreted in local time. This avoids timezone issues by only comparing
  // timestamps with the same time and timezone component.
  const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  const sixtyDays = 60 * 24 * 60 * 60 * 1000;
  const sixtyDaysFromNow = utcNow + sixtyDays;

  return (
    earliestPossibleInstant > utcNow &&
    sixtyDaysFromNow > earliestPossibleInstant
  );
}

export function getYear(apiDate: string): number {
  return parseInt(apiDate.slice(0, 4));
}
