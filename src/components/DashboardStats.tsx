import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Pill, TrendingUp } from 'lucide-react';

interface Props {
  totalMedicines: number;
  takenCount: number;
  missedCount: number;
  adherenceRate: number;
}

export default function DashboardStats({ totalMedicines, takenCount, missedCount, adherenceRate }: Props) {
  const stats = [
    { label: 'Active Medicines', value: totalMedicines, icon: Pill, color: 'text-primary bg-primary/10' },
    { label: 'Taken Today', value: takenCount, icon: CheckCircle, color: 'text-success bg-success/10' },
    { label: 'Missed Today', value: missedCount, icon: XCircle, color: 'text-destructive bg-destructive/10' },
    { label: 'Adherence', value: `${adherenceRate}%`, icon: TrendingUp, color: 'text-info bg-info/10' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <Card key={label} className="animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
