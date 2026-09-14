/**
 * Format a number as Indian Currency (INR)
 */
export const formatCurrency = (value: number, decimals: number = 2) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a number as Percentage
 */
export const formatPercentage = (value: number, decimals: number = 2) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

/**
 * Format large numbers to readable Indian format (Cr, L, K)
 */
export const formatLargeNumber = (value: number) => {
  if (value >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(2)} L`;
  if (value >= 1000) return `${(value / 1000).toFixed(2)} K`;
  return value.toString();
};