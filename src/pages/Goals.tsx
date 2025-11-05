import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import GoalCard from "@/components/GoalCard";
import AddGoalDialog from "@/components/AddGoalDialog";
import { Target, TrendingUp, Award, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  category: "personal" | "professional";
  status: "in_progress" | "completed" | "abandoned";
  progress: number;
  target_date: string | null;
  created_at: string;
}

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchGoals = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setGoals(data as Goal[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const personalGoals = goals.filter(g => g.category === "personal");
  const professionalGoals = goals.filter(g => g.category === "professional");
  const inProgressGoals = goals.filter(g => g.status === "in_progress");
  const completedGoals = goals.filter(g => g.status === "completed");

  const averageProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
        <header className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-primary to-primary-glow rounded-xl shadow-lg">
              <Target className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Goals
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your personal and professional goals
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border-2 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total Goals</span>
            </div>
            <p className="text-3xl font-bold">{goals.length}</p>
          </div>
          <div className="bg-card border-2 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-muted-foreground">In Progress</span>
            </div>
            <p className="text-3xl font-bold">{inProgressGoals.length}</p>
          </div>
          <div className="bg-card border-2 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">Completed</span>
            </div>
            <p className="text-3xl font-bold">{completedGoals.length}</p>
          </div>
          <div className="bg-card border-2 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Avg Progress</span>
            </div>
            <p className="text-3xl font-bold">{averageProgress}%</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Goals</h2>
          <AddGoalDialog onGoalAdded={fetchGoals} />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading goals...</p>
            ) : goals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No goals yet. Create your first goal to get started!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} onUpdate={fetchGoals} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="personal" className="space-y-4">
            {personalGoals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No personal goals yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} onUpdate={fetchGoals} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="professional" className="space-y-4">
            {professionalGoals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No professional goals yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {professionalGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} onUpdate={fetchGoals} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {completedGoals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No completed goals yet. Keep working towards your goals!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} onUpdate={fetchGoals} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Goals;
