import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Calendar,
  Target,
  TrendingUp,
  ArrowRight,
  LayoutGrid,
  GripVertical,
  ListChecks,
  Repeat,
  BarChart3,
  Shield,
} from "lucide-react";

const About = () => {
  const howItWorks = [
    {
      step: "1",
      icon: LayoutGrid,
      title: "Plan Your Week",
      description:
        "Use the visual weekly grid to assign tasks to specific days and time slots. See your entire week at a glance.",
    },
    {
      step: "2",
      icon: GripVertical,
      title: "Stay Flexible",
      description:
        "Drag and drop tasks to reschedule instantly. Mark tasks as weekly to repeat them across every day.",
    },
    {
      step: "3",
      icon: ListChecks,
      title: "Break It Down",
      description:
        "Add subtasks to any task to manage complex work. Track progress as you check items off.",
    },
    {
      step: "4",
      icon: BarChart3,
      title: "Track Progress",
      description:
        "Monitor your goals with progress sliders and watch habits build over time with streak tracking.",
    },
  ];

  const capabilities = [
    {
      icon: Calendar,
      title: "Weekly Task Manager",
      points: [
        "Hour-by-hour scheduling grid",
        "Drag-and-drop rescheduling",
        "Weekly recurring tasks",
        "Priority levels & subtasks",
      ],
    },
    {
      icon: Target,
      title: "Goal Tracking",
      points: [
        "Set personal & professional goals",
        "Visual progress indicators",
        "Auto-complete at 100%",
        "Category organization",
      ],
    },
    {
      icon: TrendingUp,
      title: "Habit Building",
      points: [
        "Daily habit check-ins",
        "Streak tracking",
        "Color-coded habits",
        "Historical completion data",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-5xl space-y-20">
        {/* Hero */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            How Daily Dojo Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A productivity system that combines task planning, goal tracking, and habit building into one streamlined workflow.
          </p>
        </section>

        {/* How It Works */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-foreground text-center">Getting Started</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item) => (
              <Card key={item.step} className="p-6 relative overflow-hidden group hover:shadow-lg transition-all">
                <span className="absolute -top-2 -right-2 text-7xl font-black text-primary/5 select-none">
                  {item.step}
                </span>
                <div className="p-2.5 bg-primary/10 rounded-lg w-fit mb-4">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-foreground text-center">What You Can Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {capabilities.map((cap) => (
              <Card key={cap.title} className="p-6 hover:shadow-lg transition-all">
                <div className="p-2.5 bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-lg w-fit mb-4">
                  <cap.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-4">{cap.title}</h3>
                <ul className="space-y-2.5">
                  {cap.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Repeat className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* Privacy note */}
        <section className="flex items-center gap-4 bg-muted/50 border border-border rounded-xl p-6">
          <Shield className="h-8 w-8 text-primary shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground">Your Data, Your Control</h3>
            <p className="text-sm text-muted-foreground">
              All your tasks, goals, and habits are stored securely. Sign in to sync across devices.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Ready to start?</h2>
          <Link to="/tasks">
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-lg">
              Open Task Manager
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default About;
