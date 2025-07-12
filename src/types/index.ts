import { Timestamp } from 'firebase/firestore';

export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  student_id: string;
  photo_url: string;
  bio: string;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type NavItem = {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  shortcut?: string[];
  items?: NavItem[];
};
