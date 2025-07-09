'use client';

import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react';

export const CATEGORY_OPTIONS = [
  {
    label: 'Active',
    value: 'active',
    icon: CheckCircle2
  },
  {
    label: 'Inactive',
    value: 'inactive',
    icon: XCircle
  },
  {
    label: 'Pending',
    value: 'pending',
    icon: HelpCircle
  }
];
