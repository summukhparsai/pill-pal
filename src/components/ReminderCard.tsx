import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { useReminderLogs } from '@/hooks/useReminderLogs';

interface ReminderLog {
  id: string;
  scheduled_time: string;
  status: string;
  medicines: { name: string; dosage: string } | null;
}

interface Props {
  log: ReminderLog;
}

const STATUS_STYLES: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
  pending: { variant: 'outline', label: 'Pending' },
  taken: { variant: 'default', label: 'Taken' },
  missed: { variant: 'destructive', label: 'Missed' },
  snoozed: { variant: 'secondary', label: 'Snoozed' },
};

export default function ReminderCard({ log }: Props) {
  const { updateLogStatus } = useReminderLogs();
  const style = STATUS_STYLES[log.status] || STATUS_STYLES.pending;
  const isPending = log.status === 'pending' || log.status === 'snoozed';

  const handleSnooze = () => {
    const snoozedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    updateLogStatus.mutate({ id: log.id, status: 'snoozed', snoozedUntil });
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${
              log.status === 'taken' ? 'bg-success/10' :
              log.status === 'missed' ? 'bg-destructive/10' :
              'bg-accent/10'
            }`}>
              <Bell className={`h-5 w-5 ${
                log.status === 'taken' ? 'text-success' :
                log.status === 'missed' ? 'text-destructive' :
                'text-accent'
              }`} />
            </div>
            <div>
              <p className="font-medium text-foreground">{log.medicines?.name || 'Unknown'}</p>
              <p className="text-sm text-muted-foreground">
                {log.medicines?.dosage} · {format(new Date(log.scheduled_time), 'h:mm a')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={style.variant}>{style.label}</Badge>
            {isPending && (
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-success hover:text-success"
                  onClick={() => updateLogStatus.mutate({ id: log.id, status: 'taken' })}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSnooze}>
                  <Clock className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => updateLogStatus.mutate({ id: log.id, status: 'missed' })}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
