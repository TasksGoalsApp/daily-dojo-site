import Navigation from "@/components/Navigation";
import { Target } from "lucide-react";

const Goals = () => {
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
            Track your personal and professional goals. Coming soon!
          </p>
        </header>
      </div>
    </div>
  );
};

export default Goals;
