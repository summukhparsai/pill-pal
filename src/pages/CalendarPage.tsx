import { useState, useMemo } from 'react';
import { useReminderLogs } from '@/hooks/useReminderLogs';
import CalendarView from '@/components/CalendarView';
import ReminderCard from '@/components/ReminderCard';
import { startOfMonth, endOfMonth, format, isSameDay } from 'date-fns';
import { Pill } from 'lucide-react';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const { logs, isLoading } = useReminderLogs({ start: monthStart, end: monthEnd });

  const selectedDayLogs = useMemo(() => {
    return logs.filter((l: any) => isSameDay(new Date(l.scheduled_time), selectedDate));
  }, [logs, selectedDate]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
        <p className="text-muted-foreground text-sm">View your medication history</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <CalendarView logs={logs} />
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            {format(selectedDate, 'MMMM d, yyyy')}
          </h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Pill className="h-6 w-6 text-primary animate-pulse-soft" />
            </div>
          ) : selectedDayLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No entries for this day.</p>
          ) : (
            selectedDayLogs.map((log: any) => <ReminderCard key={log.id} log={log} />)
          )}
        </div>
      </div>
    </div>
  );
}
