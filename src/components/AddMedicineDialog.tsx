import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { useMedicines } from '@/hooks/useMedicines';
import { Tables } from '@/integrations/supabase/types';

type Medicine = Tables<'medicines'>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editMedicine?: Medicine | null;
}

const FREQUENCY_TIMES: Record<string, string[]> = {
  once: ['08:00'],
  twice: ['08:00', '20:00'],
  thrice: ['08:00', '14:00', '20:00'],
};

export default function AddMedicineDialog({ open, onOpenChange, editMedicine }: Props) {
  const { addMedicine, updateMedicine } = useMedicines();
  const isEditing = !!editMedicine;

  const [name, setName] = useState(editMedicine?.name ?? '');
  const [dosage, setDosage] = useState(editMedicine?.dosage ?? '');
  const [frequency, setFrequency] = useState(editMedicine?.frequency ?? 'once');
  const [times, setTimes] = useState<string[]>(editMedicine?.times ?? ['08:00']);
  const [startDate, setStartDate] = useState(editMedicine?.start_date ?? new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(editMedicine?.end_date ?? '');
  const [instructions, setInstructions] = useState(editMedicine?.instructions ?? 'any');

  const handleFrequencyChange = (val: string) => {
    setFrequency(val);
    if (val !== 'custom') {
      setTimes(FREQUENCY_TIMES[val] || ['08:00']);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name, dosage, frequency, times,
      start_date: startDate,
      end_date: endDate || null,
      instructions,
    };

    if (isEditing) {
      await updateMedicine.mutateAsync({ id: editMedicine.id, ...data });
    } else {
      await addMedicine.mutateAsync(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Medicine' : 'Add Medicine'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Medicine Name</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Aspirin" />
          </div>
          <div className="space-y-2">
            <Label>Dosage</Label>
            <Input required value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="500mg" />
          </div>
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select value={frequency} onValueChange={handleFrequencyChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="once">Once daily</SelectItem>
                <SelectItem value="twice">Twice daily</SelectItem>
                <SelectItem value="thrice">Three times daily</SelectItem>
                <SelectItem value="custom">Custom times</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Times</Label>
            <div className="flex flex-wrap gap-2">
              {times.map((t, i) => (
                <div key={i} className="flex items-center gap-1">
                  <Input
                    type="time"
                    value={t}
                    onChange={(e) => {
                      const updated = [...times];
                      updated[i] = e.target.value;
                      setTimes(updated);
                    }}
                    className="w-32"
                  />
                  {frequency === 'custom' && times.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => setTimes(times.filter((_, j) => j !== i))}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {frequency === 'custom' && (
                <Button type="button" variant="outline" size="sm" onClick={() => setTimes([...times, '12:00'])}>
                  <Plus className="h-4 w-4 mr-1" /> Add time
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Date (optional)</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Instructions</Label>
            <Select value={instructions} onValueChange={setInstructions}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="before_food">Before food</SelectItem>
                <SelectItem value="after_food">After food</SelectItem>
                <SelectItem value="with_food">With food</SelectItem>
                <SelectItem value="any">Any time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={addMedicine.isPending || updateMedicine.isPending}>
            {isEditing ? 'Update Medicine' : 'Add Medicine'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
