import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { CalendarIcon, XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

export function PrestasiDateFilter({
  type,
  title
}: {
  type: 'createdAt' | 'updatedAt';
  title: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get(`${type}From`);
  const to = searchParams.get(`${type}To`);
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<DateRange>({
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined
  });

  React.useEffect(() => {
    setRange({
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined
    });
  }, [from, to]);

  const handleChange = (selected: DateRange | undefined) => {
    setRange(selected ?? { from: undefined, to: undefined });
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (selected?.from) params.set(`${type}From`, selected.from.toISOString());
    else params.delete(`${type}From`);
    if (selected?.to) params.set(`${type}To`, selected.to.toISOString());
    else params.delete(`${type}To`);
    router.replace('?' + params.toString());
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRange({ from: undefined, to: undefined });
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete(`${type}From`);
    params.delete(`${type}To`);
    router.replace('?' + params.toString());
  };

  const hasValue = !!range.from || !!range.to;
  const label = (
    <span className='flex items-center gap-2'>
      <span>{title}</span>
      {hasValue && (
        <>
          <Separator
            orientation='vertical'
            className='mx-0.5 data-[orientation=vertical]:h-4'
          />
          <span>
            {range.from ? range.from.toLocaleDateString() : ''}
            {range.from && range.to ? ' - ' : ''}
            {range.to ? range.to.toLocaleDateString() : ''}
          </span>
        </>
      )}
    </span>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='border-dashed'>
          {hasValue ? (
            <div
              role='button'
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              onClick={handleReset}
              className='focus-visible:ring-ring rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-1 focus-visible:outline-none'
            >
              <XCircle />
            </div>
          ) : (
            <CalendarIcon />
          )}
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          initialFocus
          mode='range'
          selected={range}
          onSelect={handleChange}
        />
      </PopoverContent>
    </Popover>
  );
}
