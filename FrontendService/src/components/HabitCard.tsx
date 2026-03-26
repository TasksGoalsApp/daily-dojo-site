import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Flame, Trophy, Trash2, TrendingUp } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';

interface Habit {
  id: string;
  name: string;
  description: string | null;
  color: string;
  best_streak: number;
}

interface HabitCompletion {
  habit_id: string;
  completed_date: string;
}

interface HabitCardProps {
  habit: Habit;
  completions: HabitCompletion[];
  onToggleCompletion: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
  calculateCurrentStreak: (habitId: string, completions: HabitCompletion[]) => number;
}

const HabitCard = ({ 
  habit, 
  completions, 
  onToggleCompletion, 
  onDelete,
  calculateCurrentStreak 
}: HabitCardProps) => {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = completions.some(c => c.completed_date === today);
  const currentStreak = calculateCurrentStreak(habit.id, completions);

  // Get last 7 days for the mini calendar
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();
  const completedDays = last7Days.filter(day => 
    completions.some(c => c.completed_date === day)
  ).length;
  const completionRate = (completedDays / 7) * 100;

  // Get last 30 days completion data for the graph
  const getLast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const isCompleted = completions.some(c => c.completed_date === dateStr);
      days.push({ date: dateStr, completed: isCompleted });
    }
    return days;
  };

  const last30Days = getLast30Days();

  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-lg">
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: habit.color }}
      />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{habit.name}</CardTitle>
            {habit.description && (
              <p className="text-sm text-muted-foreground">{habit.description}</p>
            )}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Habit</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this habit? This will also delete all completion history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(habit.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Streak Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
            <Flame className="h-5 w-5" style={{ color: habit.color }} />
            <div>
              <p className="text-xs text-muted-foreground">Current Streak</p>
              <p className="text-lg font-bold">{currentStreak} days</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
            <Trophy className="h-5 w-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Best Streak</p>
              <p className="text-lg font-bold">{habit.best_streak} days</p>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">This Week</span>
            <span className="text-sm font-medium">{completedDays}/7 days</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Last 30 Days Mini Graph */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last 30 Days</span>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {last30Days.map((day, index) => (
              <div
                key={index}
                className="aspect-square rounded-sm transition-colors"
                style={{
                  backgroundColor: day.completed 
                    ? habit.color 
                    : 'hsl(var(--muted))',
                  opacity: day.completed ? 1 : 0.3
                }}
                title={day.date}
              />
            ))}
          </div>
        </div>

        {/* Complete Today Button */}
        <Button
          onClick={() => onToggleCompletion(habit.id, today)}
          className="w-full"
          variant={isCompletedToday ? "secondary" : "default"}
        >
          <Check className="h-4 w-4 mr-2" />
          {isCompletedToday ? 'Completed Today' : 'Mark as Complete'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HabitCard;
