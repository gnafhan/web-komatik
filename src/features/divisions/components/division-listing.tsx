'use client';

import { useEffect, useState } from 'react';
import { Division } from '../utils/division-schema';
import {
  getDivisions,
  addDivision,
  deleteDivision
} from '../utils/division-service';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconPlus
} from '@tabler/icons-react';

export default function DivisionListing() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDivision, setEditDivision] = useState<Division | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Division>>({});
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  // Edit Modal
  function EditDivisionForm({
    division,
    onCancel,
    onSuccess
  }: {
    division: Division;
    onCancel: () => void;
    onSuccess: () => void;
  }) {
    const [form, setForm] = useState<Partial<Division>>({
      ...division,
      slug: division.name
        ? division.name.toLowerCase().replace(/\s+/g, '-')
        : division.slug
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      if (name === 'name') {
        setForm({
          ...form,
          name: value,
          slug: value.toLowerCase().replace(/\s+/g, '-')
        });
      } else {
        setForm({ ...form, [name]: value });
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        await import('../utils/division-service').then((mod) =>
          mod.updateDivision(division._docId, form)
        );
        setSuccess('Division updated successfully!');
        onSuccess();
      } catch (err: any) {
        setError(err.message || 'Error');
      }
      setLoading(false);
    };

    return (
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          name='name'
          type='text'
          placeholder='Name'
          value={form.name || ''}
          onChange={handleChange}
          maxLength={100}
          required
        />
        <Textarea
          name='description'
          placeholder='Description'
          value={form.description || ''}
          onChange={handleChange}
        />
        <Input
          name='order_index'
          type='number'
          placeholder='Order Index'
          value={form.order_index || ''}
          onChange={handleChange}
          required
        />
        <DialogFooter>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit' disabled={loading} variant='default'>
            {loading ? 'Saving...' : 'Update Division'}
          </Button>
        </DialogFooter>
        {error && <div className='text-sm text-red-500'>{error}</div>}
        {success && <div className='text-sm text-green-600'>{success}</div>}
      </form>
    );
  }

  useEffect(() => {
    async function fetchDivisions() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDivisions();
        setDivisions(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Error');
        setLoading(false);
      }
    }
    fetchDivisions();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteDivision(deleteId);
    setDivisions(divisions.filter((d) => d._docId !== deleteId));
    setDeleteId(null);
  };

  const handleAddChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setAddForm({
        ...addForm,
        name: value,
        slug: value.toLowerCase().replace(/\s+/g, '-')
      });
    } else {
      setAddForm({ ...addForm, [name]: value });
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    setAddSuccess(null);
    try {
      const maxId =
        divisions.length > 0 ? Math.max(...divisions.map((d) => d.id)) : 0;
      const newDivision = {
        ...addForm,
        id: maxId + 2
      };
      const docId = await addDivision(newDivision);
      setAddSuccess('Division added successfully!');
      setShowAddModal(false);
      setAddForm({});
      // Refresh list
      const data = await getDivisions();
      setDivisions(data);
    } catch (err: any) {
      setAddError(err.message || 'Error');
    }
    setAddLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className='text-red-500'>{error}</div>;

  return (
    <div className='mt-6'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Divisions</h2>
        <Button variant='default' onClick={() => setShowAddModal(true)}>
          <IconPlus className='mr-2 h-4 w-4' /> Add Division
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Order Index</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {divisions.map((d) => (
            <TableRow key={d.id}>
              <TableCell>{d.id}</TableCell>
              <TableCell>{d.name}</TableCell>
              <TableCell>{d.slug}</TableCell>
              <TableCell>{d.description}</TableCell>
              <TableCell>{d.order_index}</TableCell>
              <TableCell>
                {d.createdAt?.toDate?.().toLocaleString?.() || '-'}
              </TableCell>
              <TableCell>
                {d.updatedAt?.toDate?.().toLocaleString?.() || '-'}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                      <span className='sr-only'>Open menu</span>
                      <IconDotsVertical className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => setEditDivision(d)}>
                      <IconEdit className='mr-2 h-4 w-4' /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteId(d._docId ?? null)}
                      className='text-red-600'
                    >
                      <IconTrash className='mr-2 h-4 w-4' /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal Add Division */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Division</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className='space-y-4'>
            {/* ID tidak perlu ditampilkan, sudah otomatis */}
            <Input
              name='name'
              type='text'
              placeholder='Name'
              value={addForm.name || ''}
              onChange={handleAddChange}
              maxLength={100}
              required
            />
            {/* Slug otomatis dari name, tidak perlu input */}
            <Textarea
              name='description'
              placeholder='Description'
              value={addForm.description || ''}
              onChange={handleAddChange}
            />
            <Input
              name='order_index'
              type='number'
              placeholder='Order Index'
              value={addForm.order_index || ''}
              onChange={handleAddChange}
              required
            />
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={addLoading} variant='default'>
                {addLoading ? 'Saving...' : 'Add Division'}
              </Button>
            </DialogFooter>
            {addError && <div className='text-sm text-red-500'>{addError}</div>}
            {addSuccess && (
              <div className='text-sm text-green-600'>{addSuccess}</div>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Delete Confirmation */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Division</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this division?</div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Division */}
      <Dialog
        open={!!editDivision}
        onOpenChange={(open) => !open && setEditDivision(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Division</DialogTitle>
          </DialogHeader>
          {editDivision && (
            <EditDivisionForm
              division={editDivision}
              onCancel={() => setEditDivision(null)}
              onSuccess={async () => {
                setEditDivision(null);
                const data = await getDivisions();
                setDivisions(data);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
