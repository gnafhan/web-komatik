import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function EnumSelectWithAdd({
  label,
  options,
  value,
  onChange,
  onAdd
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  onAdd: (v: string) => Promise<void>;
}) {
  const [newValue, setNewValue] = useState('');
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState(false);

  const handleAdd = async () => {
    if (!newValue || options.includes(newValue)) return;
    setAdding(true);
    await onAdd(newValue);
    setAdding(false);
    setNewValue('');
    setOpen(false);
  };

  return (
    <div className='bg-background rounded-[var(--radius)] border p-2'>
      <label className='mb-1 block font-medium'>{label}</label>
      <Select
        value={value}
        onValueChange={onChange}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectTrigger className='w-full rounded-[var(--radius-sm)]'>
          <SelectValue placeholder={`Select or add ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className='rounded-[var(--radius-sm)]'>
          {options.length === 0 && (
            <div className='text-muted-foreground p-2'>No options found</div>
          )}
          {options.map((o) => (
            <SelectItem
              key={o}
              value={o}
              className='rounded-[var(--radius-sm)]'
            >
              {o}
            </SelectItem>
          ))}
          <div className='mt-2 flex items-center gap-2 border-t p-2'>
            <Input
              placeholder={`Add new ${label.toLowerCase()}`}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className='rounded-[var(--radius-sm)]'
            />
            <Button
              type='button'
              onClick={handleAdd}
              disabled={adding}
              variant='outline'
              className='rounded-[var(--radius-sm)]'
            >
              {adding ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
