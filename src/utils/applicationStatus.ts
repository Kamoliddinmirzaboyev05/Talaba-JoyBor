// applicationStatus — deep module. One place that understands what a raw
// Application status string means, regardless of casing or language.
//
// Before this module the status→display mapping was copy-pasted into
// ProfilePage, ApplicationsPage, ApplicationDetailPage and DashboardPage, and
// they disagreed: DashboardPage recognised the Uzbek variants ("TASDIQLANDI")
// and normalised casing, the others matched exact-case English only — so the
// same status rendered differently from page to page. Recognition now lives
// here; pages map the resulting `tone` to their own styling.

export type StatusTone =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'interview'
  | 'completed'
  | 'unknown';

// Every spelling the backend (or a human) has been seen to send, folded to a
// single canonical tone. Keys are compared UPPER-cased and trimmed.
const TONE_BY_TOKEN: Record<string, StatusTone> = {
  PENDING: 'pending',
  KUTILMOQDA: 'pending',
  APPROVED: 'approved',
  TASDIQLANDI: 'approved',
  TASDIQLANGAN: 'approved',
  REJECTED: 'rejected',
  'RAD ETILGAN': 'rejected',
  INTERVIEW: 'interview',
  SUHBAT: 'interview',
  COMPLETED: 'completed',
  YAKUNLANGAN: 'completed',
  BAJARILGAN: 'completed',
};

export function statusTone(raw?: string | null): StatusTone {
  if (!raw) return 'unknown';
  return TONE_BY_TOKEN[raw.trim().toUpperCase()] ?? 'unknown';
}

const LABEL: Record<StatusTone, string> = {
  pending: 'Kutilmoqda',
  approved: 'Tasdiqlangan',
  rejected: 'Rad etilgan',
  interview: 'Suhbat',
  completed: 'Yakunlangan',
  unknown: "Noma'lum",
};

export const statusLabel = (raw?: string | null): string => LABEL[statusTone(raw)];

const DESCRIPTION: Record<StatusTone, string> = {
  pending: "Arizangiz ko'rib chiqilmoqda. Iltimos, sabr qiling.",
  approved: "Sizning arizangiz tasdiqlandi! Tez orada siz bilan bog'lanishadi.",
  rejected: 'Afsuski, arizangiz rad etildi. Boshqa yotoqxonalarga ariza yuborishingiz mumkin.',
  interview: 'Siz suhbatga taklif qilindingiz. Tez orada siz bilan bog\'lanishadi.',
  completed: 'Arizangiz yakunlandi.',
  unknown: '',
};

export const statusDescription = (raw?: string | null): string => DESCRIPTION[statusTone(raw)];

// Progress-bar fill (0..1) used by the application-detail and applications pages.
const STEP: Record<StatusTone, number> = {
  pending: 0.25,
  interview: 0.5,
  approved: 1,
  completed: 1,
  rejected: 0,
  unknown: 0,
};

export const statusStep = (raw?: string | null): number => STEP[statusTone(raw)];

// Convenience predicates used by dashboard counters.
export const isApproved = (raw?: string | null): boolean => statusTone(raw) === 'approved';
export const isPending = (raw?: string | null): boolean => statusTone(raw) === 'pending';
export const isRejected = (raw?: string | null): boolean => statusTone(raw) === 'rejected';

// Talaba yotoqxonaga joylashganmi — StudentDashboard javobidan aniqlaydi.
// DashboardPage va TMA-ochilish yo'naltirishi ikkalasi ham shu yerdan foydalanadi.
interface PlacementLike {
  placement_status?: string | null;
  room_info?: { id?: number | string } | null;
  floor_info?: { id?: number | string } | null;
  room?: number | null;
  floor?: number | null;
}

export function isPlacedStudent(data: PlacementLike | null | undefined): boolean {
  if (!data) return false;
  const placement = (data.placement_status || '').toLowerCase();
  if (placement.includes('joylash')) return true;
  if (data.room_info?.id && data.floor_info?.id) return true;
  if (typeof data.room === 'number' && data.room > 0 && typeof data.floor === 'number' && data.floor > 0) {
    return true;
  }
  return false;
}
