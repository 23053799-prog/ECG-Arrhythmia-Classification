import type { Warning } from '@/api/types';

type WarningListProps = {
  warnings: Warning[];
};

export function WarningList({ warnings }: WarningListProps) {
  if (warnings.length === 0) return null;

  return (
    <ul className="space-y-2" aria-label="Record warnings">
      {warnings.map((warning, index) => (
        <li
          key={`${warning.code}-${index}`}
          className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-950"
        >
          <span className="font-semibold">{warning.severity.toUpperCase()}:</span>{' '}
          {warning.message}
        </li>
      ))}
    </ul>
  );
}
