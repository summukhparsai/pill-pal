import { useState } from 'react';
import { useMedicines } from '@/hooks/useMedicines';
import MedicineCard from '@/components/MedicineCard';
import AddMedicineDialog from '@/components/AddMedicineDialog';
import { Button } from '@/components/ui/button';
import { Plus, Pill } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Medicine = Tables<'medicines'>;

export default function MedicinesPage() {
  const { medicines, isLoading, deleteMedicine } = useMedicines();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMedicine, setEditMedicine] = useState<Medicine | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (m: Medicine) => {
    setEditMedicine(m);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditMedicine(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMedicine.mutate(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medicines</h1>
          <p className="text-muted-foreground text-sm">Manage your medications</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Medicine
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Pill className="h-6 w-6 text-primary animate-pulse-soft" />
        </div>
      ) : medicines.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Pill className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No medicines yet</p>
          <p className="text-sm mt-1">Add your first medicine to get started.</p>
          <Button className="mt-4" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Medicine
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {medicines.map((m) => (
            <MedicineCard key={m.id} medicine={m} onEdit={handleEdit} onDelete={setDeleteId} />
          ))}
        </div>
      )}

      <AddMedicineDialog open={dialogOpen} onOpenChange={handleDialogClose} editMedicine={editMedicine} />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medicine</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this medicine and all its reminder history.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
