import { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import { TrendingUp, Plus } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import HabitCard from '@/components/HabitCard';
import AddHabitDialog from '@/components/AddHabitDialog';

interface Habit {
  id: string;
  name: string;
  description: string | null;
  color: string;
  best_streak: number;
  created_at: string;
}

interface HabitCompletion {
  habit_id: string;
  completed_date: string;
}

const Habits = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchHabits();
    fetchCompletions();
  }, [user, navigate]);

  const fetchHabits = async () => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHabits(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load habits',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompletions = async () => {
    try {
      const { data, error } = await supabase
        .from('habit_completions')
        .select('habit_id, completed_date');

      if (error) throw error;
      setCompletions(data || []);
    } catch (error) {
      console.error('Error fetching completions:', error);
    }
  };

  const handleToggleCompletion = async (habitId: string, date: string) => {
    const existingCompletion = completions.find(
      c => c.habit_id === habitId && c.completed_date === date
    );

    try {
      if (existingCompletion) {
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', habitId)
          .eq('completed_date', date);

        if (error) throw error;
        setCompletions(prev => prev.filter(
          c => !(c.habit_id === habitId && c.completed_date === date)
        ));
      } else {
        const { error } = await supabase
          .from('habit_completions')
          .insert({ habit_id: habitId, completed_date: date });

        if (error) throw error;
        setCompletions(prev => [...prev, { habit_id: habitId, completed_date: date }]);
        
        // Update best streak
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
          const currentStreak = calculateCurrentStreak(habitId, [...completions, { habit_id: habitId, completed_date: date }]);
          if (currentStreak > habit.best_streak) {
            await supabase
              .from('habits')
              .update({ best_streak: currentStreak })
              .eq('id', habitId);
            
            setHabits(prev => prev.map(h => 
              h.id === habitId ? { ...h, best_streak: currentStreak } : h
            ));
          }
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update habit completion',
        variant: 'destructive',
      });
    }
  };

  const calculateCurrentStreak = (habitId: string, allCompletions: HabitCompletion[]) => {
    const habitCompletions = allCompletions
      .filter(c => c.habit_id === habitId)
      .map(c => new Date(c.completed_date))
      .sort((a, b) => b.getTime() - a.getTime());

    if (habitCompletions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < habitCompletions.length; i++) {
      const completionDate = new Date(habitCompletions[i]);
      completionDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - streak);
      expectedDate.setHours(0, 0, 0, 0);

      if (completionDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;
      
      setHabits(prev => prev.filter(h => h.id !== habitId));
      setCompletions(prev => prev.filter(c => c.habit_id !== habitId));
      
      toast({
        title: 'Success',
        description: 'Habit deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete habit',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
        <header className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-primary to-primary-glow rounded-xl shadow-lg">
              <TrendingUp className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Habits Tracker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build lasting habits with daily tracking and streak monitoring
          </p>
        </header>

        <div className="flex justify-end mb-6">
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Habit
          </Button>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No habits yet. Start building your routine!</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Create Your First Habit
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                completions={completions.filter(c => c.habit_id === habit.id)}
                onToggleCompletion={handleToggleCompletion}
                onDelete={handleDeleteHabit}
                calculateCurrentStreak={calculateCurrentStreak}
              />
            ))}
          </div>
        )}
      </div>

      <AddHabitDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => {
          fetchHabits();
          setIsAddDialogOpen(false);
        }}
      />
    </div>
  );
};

export default Habits;
