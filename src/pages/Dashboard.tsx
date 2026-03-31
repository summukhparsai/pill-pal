import { useMemo } from 'react';
import { useMedicines } from '@/hooks/useMedicines';
import { useReminderLogs } from '@/hooks/useReminderLogs';
import DashboardStats from '@/components/DashboardStats';
import AdherenceChart from '@/components/AdherenceChart';
import ReminderCard from '@/components/ReminderCard';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';
import { Pill } from 'lucide-react';

export default function Dashboard() {
  const { medicines } = useMedicines();
  const today = new Date();
  const weekAgo = subDays(today, 7);
  const { logs, isLoading } = useReminderLogs({ start: weekAgo, end: today });

  const todayLogs = useMemo(() => {
    const start = startOfDay(today).toISOString();
    const end = endOfDay(today).toISOString();
    return logs.filter((l: any) => l.scheduled_time >= start && l.scheduled_time <= end);
  }, [logs, today]);

  const takenToday = todayLogs.filter((l: any) => l.status === 'taken').length;
  const missedToday = todayLogs.filter((l: any) => l.status === 'missed').length;
  const totalToday = todayLogs.length;
  const adherenceRate = totalToday > 0 ? Math.round((takenToday / totalToday) * 100) : 100;

  const chartData = useMemo(() => {
    const days: { date: string; taken: number; missed: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const key = format(d, 'yyyy-MM-dd');
      const dayLogs = logs.filter((l: any) => format(new Date(l.scheduled_time), 'yyyy-MM-dd') === key);
      days.push({
        date: format(d, 'EEE'),
        taken: dayLogs.filter((l: any) => l.status === 'taken').length,
        missed: dayLogs.filter((l: any) => l.status === 'missed').length,
      });
    }
    return days;
  }, [logs, today]);

  const activeMedicines = medicines.filter((m) => m.is_active);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Track your medication adherence</p>
      </div>

      <DashboardStats
        totalMedicines={activeMedicines.length}
        takenCount={takenToday}
        missedCount={missedToday}
        adherenceRate={adherenceRate}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <AdherenceChart data={chartData} />
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Today's Reminders</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Pill className="h-6 w-6 text-primary animate-pulse-soft" />
            </div>
          ) : todayLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Pill className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p>No reminders for today.</p>
              <p className="text-xs mt-1">Add medicines to start getting reminders.</p>
            </div>
          ) : (
            todayLogs.map((log: any) => <ReminderCard key={log.id} log={log} />)
          )}
        </div>
      </div>
    </div>
  );
}
