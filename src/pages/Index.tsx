import WeeklyTaskTable from "@/components/WeeklyTaskTable";
import { Calendar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="container mx-auto px-4 py-8 max-w-[1600px]">
        {/* Header */}
        <header className="mb-8 text-center space-y-4">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-primary to-primary-glow rounded-xl shadow-lg">
              <Calendar className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Weekly Task Manager
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plan your week hour by hour. Drag tasks between time slots, add subtasks, and stay organized.
          </p>
        </header>

        {/* Weekly Task Table */}
        <main>
          <WeeklyTaskTable />
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Hover over time slots to add tasks • Drag tasks to reschedule</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
