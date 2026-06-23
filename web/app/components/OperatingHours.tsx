'use client';

import styles from './OperatingHours.module.css';

type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

interface DayHours {
  open: string | null;
  close: string | null;
}

interface Props {
  operatingHours: Partial<Record<DayOfWeek, DayHours>>;
}

const DAYS: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

/** Convert JS Date.getDay() (0 = Sunday) to our DayOfWeek key. */
function getTodayKey(): DayOfWeek {
  const jsDay = new Date().getDay();
  // JS: 0=Sun, 1=Mon, …, 6=Sat
  const map: DayOfWeek[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  return map[jsDay] ?? 'monday';
}

function formatTime(time: string | null): string {
  if (!time) return '—';
  // time is 'HH:MM' in 24h; convert to 12h display
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr ?? '0', 10);
  const minute = minuteStr ?? '00';
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${period}`;
}

/**
 * OperatingHours — renders a week's schedule with today's row highlighted.
 * Uses client-side rendering to determine the current day accurately.
 */
export default function OperatingHours({ operatingHours }: Props) {
  const today = getTodayKey();

  return (
    <table className={styles.table}>
      <tbody>
        {DAYS.map((day) => {
          const hours = operatingHours[day];
          const isToday = day === today;
          const isClosed = !hours || hours.open === null;

          return (
            <tr key={day} className={isToday ? styles.today : undefined}>
              <th className={styles.dayCell}>
                {DAY_LABELS[day]}
                {isToday && <span className={styles.todayBadge}>Today</span>}
              </th>
              <td className={styles.hoursCell}>
                {isClosed ? (
                  <span className={styles.closed}>Closed</span>
                ) : (
                  <span className={styles.open}>
                    {formatTime(hours.open)} – {formatTime(hours.close)}
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
