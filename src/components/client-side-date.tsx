'use client';

import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';

interface ClientSideDateProps {
  dateString: string | null | undefined;
}

export function ClientSideDate({ dateString }: ClientSideDateProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!dateString) {
    return <span>N/A</span>;
  }

  const dateObject = new Date(dateString);

  if (isNaN(dateObject.getTime())) {
    return <span>Invalid Date</span>;
  }

  const day = String(dateObject.getDate()).padStart(2, '0');
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const year = dateObject.getFullYear();
  const hours = String(dateObject.getHours()).padStart(2, '0');
  const minutes = String(dateObject.getMinutes()).padStart(2, '0');

  const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;

  return <span>{isClient ? formattedDate : ''}</span>;
}
