// complaintStatus — shikoyat/taklif holati uchun label va rang xaritasi.
// MessagesPage va DashboardPage ikkalasi ham shu yerdan foydalanadi, ikkalasi
// bir xil ranglarda ko'rsatishi uchun.

export type ComplaintStatusTone = 'pending' | 'in_progress' | 'resolved' | 'rejected';

const LABEL: Record<ComplaintStatusTone, string> = {
  pending: 'Kutilmoqda',
  in_progress: 'Jarayonda',
  resolved: 'Hal qilindi',
  rejected: 'Rad etildi',
};

const CLASS_NAME: Record<ComplaintStatusTone, string> = {
  pending: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
  in_progress: 'bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-300',
  resolved: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
  rejected: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300',
};

export function complaintStatusLabel(status?: string | null): string {
  return LABEL[(status as ComplaintStatusTone)] ?? status ?? "Noma'lum";
}

export function complaintStatusClassName(status?: string | null): string {
  return CLASS_NAME[(status as ComplaintStatusTone)] ?? 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300';
}
