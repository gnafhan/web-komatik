import { Timestamp } from 'firebase/firestore';
import { Icons } from '@/components/icons';
import { Timestamp } from 'firebase/firestore';

export type Period = {
  id: number;
  name: string;
  is_active: boolean;
  start_date: Date;
  end_date: Date;
  created_at?: Timestamp;
  updated_at?: Timestamp;
};

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

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
