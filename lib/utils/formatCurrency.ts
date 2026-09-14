export function formatCurrency(amount: number, showSign: boolean = false): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Format into Indian numbering system (Lakhs / Crores)
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(absAmount);

  if (showSign) {
    if (amount > 0) return `+₹${formatted}`;
    if (amount < 0) return `-₹${formatted}`;
    return `₹${formatted}`;
  }

  return isNegative ? `-₹${formatted}` : `₹${formatted}`;
}

export function formatCompactNumber(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  if (abs >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return `₹${amount}`;
}
