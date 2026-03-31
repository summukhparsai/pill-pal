import { Tables } from '@/integrations/supabase/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, Clock, Edit, Trash2, UtensilsCrossed } from 'lucide-react';

type Medicine = Tables<'medicines'>;

const INSTRUCTION_LABELS: Record<string, string> = {
  before_food: 'Before food',
  after_food: 'After food',
  with_food: 'With food',
  any: 'Any time',
};

const FREQUENCY_LABELS: Record<string, string> = {
  once: 'Once daily',
  twice: 'Twice daily',
  thrice: '3× daily',
  custom: 'Custom',
};

interface Props {
  medicine: Medicine;
  onEdit: (m: Medicine) => void;
  onDelete: (id: string) => void;
}

export default function MedicineCard({ medicine, onEdit, onDelete }: Props) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-primary/10 shrink-0">
              <Pill className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">{medicine.name}</h3>
              <p className="text-sm text-muted-foreground">{medicine.dosage}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {FREQUENCY_LABELS[medicine.frequency] || medicine.frequency}
                </Badge>
                {medicine.instructions && (
                  <Badge variant="outline" className="text-xs">
                    <UtensilsCrossed className="h-3 w-3 mr-1" />
                    {INSTRUCTION_LABELS[medicine.instructions] || medicine.instructions}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {medicine.times.map((t) => (
                  <span key={t} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(medicine)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(medicine.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
