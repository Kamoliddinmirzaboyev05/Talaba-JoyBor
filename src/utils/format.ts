export const formatCapacityBucket = (count: number): string => {
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

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it starts with 998, format as +998 XX XXX XX XX
  if (digits.startsWith('998') && digits.length === 12) {
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
  }
  
  // If it starts with 88, format as +998 XX XXX XX XX
  if (digits.startsWith('88') && digits.length === 9) {
    return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
  }
  
  // If it's already formatted, return as is
  if (phone.startsWith('+998')) {
    return phone;
  }
  
  // Default fallback
  return phone;
};



