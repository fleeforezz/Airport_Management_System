/**
 * Formatting utilities for Currency, DateTime, Duration and Swiss Modernist numbering
 */

/**
 * Format currency (Default USD or VND)
 * Example: 250 -> "$250" or VND format
 */
export function formatCurrency(
  amount: number,
  currency: 'USD' | 'VND' = 'USD'
): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return currency === 'USD' ? '$0' : '0 ₫';
  }

  if (currency === 'VND') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format Date to standard Swiss international format: "20 Nov 2026"
 */
export function formatDate(dateString: string | Date): string {
  if (!dateString) return '--/--/----';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return String(dateString);

  return d.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format Time to HH:mm (24h)
 * Example: "14:30"
 */
export function formatTime(dateString: string | Date): string {
  if (!dateString) return '--:--';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '--:--';

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format full DateTime
 * Example: "14:30 - Nov 20, 2026"
 */
export function formatDateTime(dateString: string | Date): string {
  if (!dateString) return '--/--/---- --:--';
  return `${formatTime(dateString)} - ${formatDate(dateString)}`;
}

/**
 * Format duration (days and nights)
 * Example: (4, 3) -> "4 Days / 3 Nights"
 */
export function formatDurationDays(days: number, nights: number): string {
  const dayStr = days === 1 ? '1 Day' : `${days} Days`;
  const nightStr = nights === 1 ? '1 Night' : `${nights} Nights`;
  return `${dayStr} / ${nightStr}`;
}

/**
 * Format duration in minutes to hours and minutes
 * Example: 135 -> "2h 15m"
 */
export function formatDurationMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes}m`;
  return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim();
}

/**
 * Format Swiss-style index string
 * Example: 1 -> "[ 01 ]"
 */
export function formatSwissIndex(num: number): string {
  return `[ ${String(num).padStart(2, '0')} ]`;
}
