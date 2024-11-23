export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  description?: string;
  notificationTime?: string;
}

export type FilterStatus = 'all' | 'paid' | 'unpaid';
