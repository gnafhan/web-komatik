import { Member } from '@/types';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useState, useRef } from 'react';
import { Popover } from '@/components/ui/popover';

export default function MemberMultiSelect({
  members,
  value,
  onChange
}: {
  members: Member[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Defensive: always use an array
  const safeValue = Array.isArray(value) ? value : value ? [String(value)] : [];
  console.log('MemberMultiSelect value:', safeValue);
  console.log(
    'MemberMultiSelect members:',
    members.map((m) => m.id)
  );
  const selectedMembers = members.filter((m) => safeValue.includes(m.id));
  console.log(
    'MemberMultiSelect selectedMembers:',
    selectedMembers.map((m) => m.id)
  );
  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.student_id.toLowerCase().includes(search.toLowerCase())
  );

  // Defensive: always pass an array to onChange
  const handleChange = (ids: unknown) => {
    if (Array.isArray(ids)) {
      onChange(ids);
    } else if (typeof ids === 'string') {
      onChange([ids]);
    } else {
      onChange([]);
    }
  };

  return (
    <div className='bg-background rounded-[var(--radius)] border p-2'>
      <div className='mb-2 flex flex-wrap gap-1'>
        {selectedMembers.map((m) => (
          <Badge
            key={m.id}
            className='flex items-center gap-1 rounded-[var(--radius-sm)]'
          >
            {m.name} ({m.student_id})
            <button
              type='button'
              onClick={() =>
                handleChange((value as string[]).filter((id) => id !== m.id))
              }
              className='text-destructive hover:text-destructive-foreground ml-1'
              aria-label='Remove member'
            >
              <X className='h-3 w-3' />
            </button>
          </Badge>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <div
          tabIndex={0}
          className='bg-background w-full cursor-pointer rounded-[var(--radius-sm)] border px-2 py-1'
          onClick={() => setOpen(true)}
          onFocus={() => setOpen(true)}
        >
          <Command>
            <CommandInput
              ref={inputRef}
              placeholder='Search members...'
              value={search}
              onValueChange={setSearch}
              className='rounded-[var(--radius-sm)]'
              onFocus={() => setOpen(true)}
            />
            {open && (
              <CommandList className='rounded-[var(--radius-sm)]'>
                {filtered.length === 0 && (
                  <div className='text-muted-foreground p-2'>
                    No members found
                  </div>
                )}
                {filtered.map((m) => (
                  <CommandItem
                    key={m.id}
                    onSelect={() => {
                      if (!Array.isArray(value) || !value.includes(m.id))
                        handleChange([
                          ...(Array.isArray(value) ? value : []),
                          m.id
                        ]);
                      setOpen(false);
                    }}
                    className='cursor-pointer rounded-[var(--radius-sm)]'
                  >
                    {m.name} ({m.student_id})
                    {Array.isArray(value) && value.includes(m.id) && (
                      <span className='text-primary ml-auto'>&#10003;</span>
                    )}
                  </CommandItem>
                ))}
              </CommandList>
            )}
          </Command>
        </div>
      </Popover>
    </div>
  );
}
