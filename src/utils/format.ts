export const formatCapacityBucket = (count: number): string => {
  // Taxminiy diapazonlar ko'rsatish
  if (count >= 100) return '100+';
  if (count >= 80) return '80+';
  if (count >= 60) return '60+';
  if (count >= 50) return '50+';
  if (count >= 40) return '40+';
  if (count >= 30) return '30+';
  if (count >= 20) return '20+';
  if (count >= 15) return '15+';
  if (count >= 10) return '10+';
  if (count >= 5) return '5+';
  if (count > 0) return '<5';
  return '0';
};

export const formatCapacityBucketRange = (count: number): string => {
  // Eski diapazon ko'rsatish funksiyasi
  if (count >= 50) return '50+';
  if (count >= 15) return '15+';
  if (count >= 10) return '10+';
  return '<10';
};

export const formatCapacity = (count: number): string => {
  return `${count} kishi`;
};

export const formatAvailableCapacity = (totalCapacity: number, availableCapacity: number): string => {
  const emptySpots = totalCapacity - availableCapacity;
  
  if (emptySpots >= 50) return '50+ ta bo\'sh joy';
  if (emptySpots >= 15) return '15+ ta bo\'sh joy';
  if (emptySpots >= 10) return '10+ ta bo\'sh joy';
  if (emptySpots > 0) return `${emptySpots} ta bo\'sh joy`;
  return 'Bo\'sh joy yo\'q';
};

// Format a phone number for display: +998 XX XXX XX XX (spaces)
export const formatPhoneNumber = (input: string): string => {
  const digits = input.replace(/\D/g, '');
  const rest = digits.startsWith('998') ? digits.slice(3) : digits.startsWith('+998') ? digits.slice(4) : digits.startsWith('8') && digits.length === 9 ? digits : digits;
  const padded = rest.slice(0, 9);
  const parts = [] as string[];
  if (padded.length > 0) {
    parts.push(padded.slice(0, 2));
  }
  if (padded.length > 2) {
    parts.push(padded.slice(2, 5));
  }
  if (padded.length > 5) {
    parts.push(padded.slice(5, 7));
  }
  if (padded.length > 7) {
    parts.push(padded.slice(7, 9));
  }
  return `+998${parts.length ? ' ' + parts.join(' ') : ''}`.trim();
};

// Live input mask: keeps +998 prefix and groups while typing
export const formatPhoneInput = (value: string): string => {
  // Ensure +998 prefix
  const digits = value.replace(/\D/g, '');
  let rest = digits;
  if (rest.startsWith('998')) {
    rest = rest.slice(3);
  } else if (rest.startsWith('8') && rest.length <= 9) {
    // e.g., 90... typed without 998
  }
  const masked = formatPhoneNumber(`+998${rest}`);
  return masked;
};

// Normalize to API format: +998XXXXXXXXX (no spaces)
export const normalizePhoneForApi = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  let body = digits;
  if (digits.startsWith('998')) {
    body = digits.slice(3);
  } else if (digits.startsWith('+998')) {
    body = digits.slice(4);
  }
  const nine = body.slice(0, 9);
  return `+998${nine}`;
};

// Comprehensive date formatting functions
export const formatDate = (iso?: string): string => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return '';
  }
};

export const formatDateTime = (iso?: string): string => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return '';
  }
};

export const formatTime = (iso?: string): string => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffInHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return d.toLocaleTimeString('uz-UZ', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return d.toLocaleDateString('uz-UZ', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  } catch {
    return '';
  }
};

export const formatRelativeTime = (iso?: string): string => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffInMs = now.getTime() - d.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Hozir';
    if (diffInMinutes < 60) return `${diffInMinutes} daqiqa oldin`;
    if (diffInHours < 24) return `${diffInHours} soat oldin`;
    if (diffInDays < 7) return `${diffInDays} kun oldin`;
    
    return formatDate(iso);
  } catch {
    return '';
  }
};

// Legacy function for backward compatibility
export const formatUiDate = formatDate;



