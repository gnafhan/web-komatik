export type Member = {
  id: number;
  uid: string;
  name: string;
  email: string;
  phone: string;
  student_id: string;
  photo_url: string;
  bio: string;
  created_at: string | null;
  updated_at: string | null;
};

export type NavItem = {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  shortcut?: string[];
  items?: NavItem[];
};
