import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, startOfWeek, endOfWeek } from 'date-fns';

interface LogEntry {
  scheduled_time: string;
  status: string;
}

interface Props {
  logs: LogEntry[];
}

export default function CalendarView({ logs }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const dayStatuses = useMemo(() => {
    const map: Record<string, { taken: number; missed: number }> = {};
    logs.forEach((log) => {
      const key = format(new Date(log.scheduled_time), 'yyyy-MM-dd');
      if (!map[key]) map[key] = { taken: 0, missed: 0 };
      if (log.status === 'taken') map[key].taken++;
      if (log.status === 'missed') map[key].missed++;
    });
    return map;
  }, [logs]);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} className="text-center text-xs text-muted-foreground font-medium py-2">{d}</div>
          ))}
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const status = dayStatuses[key];
            const inMonth = isSameMonth(day, currentMonth);
            const today = isToday(day);

            return (
              <div
                key={key}
                className={`relative flex flex-col items-center justify-center p-1.5 rounded-lg text-sm transition-colors
                  ${!inMonth ? 'opacity-30' : ''}
                  ${today ? 'ring-2 ring-primary ring-offset-1' : ''}
                `}
              >
                <span className={`${today ? 'font-bold text-primary' : 'text-foreground'}`}>
                  {format(day, 'd')}
                </span>
                {status && (
                  <div className="flex gap-0.5 mt-0.5">
                    {status.taken > 0 && <div className="w-1.5 h-1.5 rounded-full bg-success" />}
                    {status.missed > 0 && <div className="w-1.5 h-1.5 rounded-full bg-destructive" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-success" /> Taken</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-destructive" /> Missed</div>
        </div>
      </CardContent>
    </Card>
  );
}
