export const formatCapacityBucket = (count: number): string => {
  if (count >= 50) return '50+';
  if (count >= 15) return '15+';
  if (count >= 10) return '10+';
  return '<10';
};



