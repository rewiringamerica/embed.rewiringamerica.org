import { describe, expect, test } from '@jest/globals';
import { isInFuture } from '../../src/api/dates';

/** Turn an ISO 8601 date string into a Date in the local timezone. */
function localDate(dateStr: string): Date {
  // If you just pass a date to the Date constructor, it will get a time of
  // midnight UTC, but isInFuture looks at it in local time. So construct a
  // Date of the current instant and replace its year/month/day components, so
  // that isInFuture will see the same year/month/day we see here.
  const date = new Date();
  const [year, month, day] = dateStr.split('-');
  // Temporarily set day of month to 1, to avoid end-of-month problems. If the
  // current day of month is 31, and you setMonth to a month with < 31 days,
  // `date` will get set to the 1st of the *next* month.
  date.setDate(1);
  date.setFullYear(parseInt(year));
  date.setMonth(parseInt(month) - 1); // Date's months are 0-based
  date.setDate(parseInt(day));
  return date;
}

describe('quarters', () => {
  test.each([
    { date: '2024Q4', now: '2024-09-30' },
    { date: '2025Q1', now: '2024-12-31' },
  ])('$date should be in future on $now', ({ date, now }) => {
    expect(isInFuture(date, localDate(now))).toBe(true);
  });
  test.each([
    { date: '2023Q4', now: '2024-01-01' },
    { date: '2024Q4', now: '2024-10-01' },
    { date: '2024Q1', now: '2024-10-01' },
  ])('$date should not be in future on $now', ({ date, now }) => {
    expect(isInFuture(date, localDate(now))).toBe(false);
  });
});

describe('halves', () => {
  test.each([
    { date: '2024H2', now: '2024-01-30' },
    { date: '2024H2', now: '2024-06-30' },
    { date: '2025H1', now: '2024-06-30' },
  ])('$date should be in future on $now', ({ date, now }) => {
    expect(isInFuture(date, localDate(now))).toBe(true);
  });
  test.each([
    { date: '2024H2', now: '2024-07-01' },
    { date: '2024H2', now: '2024-12-31' },
    { date: '2024H1', now: '2024-06-30' },
  ])('$date should not be in future on $now', ({ date, now }) => {
    expect(isInFuture(date, localDate(now))).toBe(false);
  });
});

describe('years', () => {
  test.each([
    { date: '2025', now: '2024-01-01' },
    { date: '2025', now: '2024-12-31' },
  ])('$date should be in future on $now', ({ date, now }) => {
    expect(isInFuture(date, localDate(now))).toBe(true);
  });
  test.each([
    { date: '2023', now: '2024-01-01' },
    { date: '2024', now: '2024-01-01' },
    { date: '2024', now: '2024-12-31' },
  ])('$date should not be in future on $now', ({ date, now }) => {
    expect(isInFuture(date, localDate(now))).toBe(false);
  });
});

describe('year-months', () => {
  test.each([
    { date: '2024-12', now: '2024-06-30' },
    { date: '2024-12', now: '2024-11-30' },
    { date: '2025-01', now: '2024-12-31' },
  ])('$date should be in future on $now', ({ date, now }) => {
    expect(isInFuture(date, localDate(now))).toBe(true);
  });
  test.each([
    { date: '2023-12', now: '2024-01-01' },
    { date: '2024-01', now: '2024-01-01' },
    { date: '2024-01', now: '2024-12-31' },
  ])('$date should not be in future on $now', ({ date, now }) => {
    expect(isInFuture(date, localDate(now))).toBe(false);
  });
});

describe('year-month-days', () => {
  test.each([
    { date: '2025-01-01', now: '2024-12-31' },
    { date: '2024-01-02', now: '2024-01-01' },
    { date: '2024-02-02', now: '2024-01-02' },
  ])('$date should be in future on $now', ({ date, now }) => {
    expect(isInFuture(date, localDate(now))).toBe(true);
  });
  test.each([
    { date: '2023-12-31', now: '2024-01-01' },
    { date: '2024-01-02', now: '2024-01-02' },
    { date: '2024-01-01', now: '2024-02-02' },
  ])('$date should not be in future on $now', ({ date, now }) => {
    expect(isInFuture(date, localDate(now))).toBe(false);
  });
});
