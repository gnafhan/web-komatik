import { Timestamp } from 'firebase/firestore';

export type Division = {
  id: number;
  name: string;
  slug: string;
  description: string;
  order_index: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  _docId?: string;
};
