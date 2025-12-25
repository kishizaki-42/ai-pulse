export type DateFormat = 'short' | 'long' | 'full';

export function formatDate(isoString: string, format: DateFormat = 'short'): string {
  if (!isoString) return '';

  const date = new Date(isoString);

  switch (format) {
    case 'short':
      return date.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
      });

    case 'long':
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

    case 'full':
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

    default:
      return date.toLocaleDateString('ja-JP');
  }
}
