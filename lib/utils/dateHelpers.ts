export function getRelativeDateLabel(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  
  const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Aaj';
  if (diffDays === 1) return 'Kal';
  if (diffDays === -1) return 'Kal (Aane wala)';
  
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: d1.getFullYear() !== d2.getFullYear() ? 'numeric' : undefined
  });
}

export function formatDueDays(dateString: string): { text: string; isUrgent: boolean; isWarning: boolean } {
  const target = new Date(dateString);
  const today = new Date();
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: `Expired ${Math.abs(diffDays)} din pehle`, isUrgent: true, isWarning: false };
  if (diffDays === 0) return { text: 'Aaj due hai!', isUrgent: true, isWarning: false };
  if (diffDays <= 7) return { text: `${diffDays} din me due`, isUrgent: true, isWarning: false };
  if (diffDays <= 30) return { text: `${diffDays} din me due`, isUrgent: false, isWarning: true };
  return { text: `${diffDays} din baaki`, isUrgent: false, isWarning: false };
}
