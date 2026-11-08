export const ORDER_STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  REVISION: 'bg-orange-100 text-orange-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-red-100 text-red-800',
  DISPUTED: 'bg-rose-100 text-rose-800',
};

export const orderStatusStyle = (status?: string) =>
  (status && ORDER_STATUS_STYLES[status]) || 'bg-gray-100 text-gray-800';

export const orderStatusLabel = (status = '') =>
  status ? status.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) : 'Unknown';