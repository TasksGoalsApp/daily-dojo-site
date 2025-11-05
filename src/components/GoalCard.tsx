import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

interface GoalCardProps {
  goal: Goal;
  onUpdate: () => void;
}

const GoalCard = ({ goal, onUpdate }: GoalCardProps) => {
  const handleDelete = async () => {
    const { error } = await supabase
      .from("goals")
      .delete()
      .eq("id", goal.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Goal deleted successfully",
      });
      onUpdate();
    }
  };

  const handleStatusChange = async (newStatus: "in_progress" | "completed" | "abandoned") => {
    const { error } = await supabase
      .from("goals")
      .update({ 
        status: newStatus,
        progress: newStatus === "completed" ? 100 : goal.progress
      })
      .eq("id", goal.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update goal status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Goal status updated",
      });
      onUpdate();
    }
  };

  const getCategoryColor = () => {
    return goal.category === "personal" 
      ? "bg-primary/10 text-primary border-primary/20" 
      : "bg-accent/10 text-accent border-accent/20";
  };

  const getStatusColor = () => {
    switch (goal.status) {
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "abandoned":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-br from-primary to-primary-glow rounded-lg">
              <Target className="h-4 w-4 text-primary-foreground" />
            </div>
            <Badge className={getCategoryColor()}>
              {goal.category}
            </Badge>
            <Badge className={getStatusColor()}>
              {goal.status.replace("_", " ")}
            </Badge>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {goal.status === "in_progress" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStatusChange("completed")}
                title="Mark as completed"
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
              </Button>
            )}
            {goal.status === "in_progress" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStatusChange("abandoned")}
                title="Mark as abandoned"
              >
                <XCircle className="h-4 w-4 text-destructive" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-xl">{goal.title}</CardTitle>
        {goal.description && (
          <CardDescription className="text-sm">
            {goal.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
        
        {goal.target_date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Target: {format(new Date(goal.target_date), "MMM dd, yyyy")}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalCard;
