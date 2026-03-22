import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Target, TrendingUp, ArrowRight, CheckCircle2, Clock, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";

const Home = () => {
  const features = [
    {
      icon: Calendar,
      title: "Weekly Task Planning",
      description: "Organize your tasks in a visual weekly grid with hourly time slots",
      link: "/tasks",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set and track your personal and professional goals",
      link: "/goals",
      comingSoon: true,
    },
    {
      icon: TrendingUp,
      title: "Habit Building",
      description: "Build lasting habits with daily tracking and streaks",
      link: "/habits",
      comingSoon: true,
    },
  ];

  const stats = [
    { icon: CheckCircle2, value: "100+", label: "Tasks Completed" },
    { icon: Clock, value: "50hrs", label: "Time Tracked" },
    { icon: Zap, value: "15", label: "Day Streak" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <section className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium text-secondary-foreground mb-4 animate-fade-in">
            <Zap className="h-4 w-4 text-primary" />
            Boost Your Productivity
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent leading-tight animate-fade-in">
            Master Your Time,
            <br />
            Achieve Your Goals
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            A personal productivity system designed to help you manage tasks, track habits, and reach your goals—all in one beautiful interface.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 animate-fade-in">
            <Link to="/tasks">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-lg group"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="shadow-md">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16 animate-fade-in">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="p-6 text-center hover:shadow-lg transition-shadow bg-card"
            >
              <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </section>

        {/* Features Section */}
        <section className="space-y-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Stay Organized
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive suite of tools to help you plan, track, and accomplish more every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-card relative overflow-hidden group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {feature.comingSoon && (
                  <div className="absolute top-4 right-4">
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-medium">
                      Coming Soon
                    </span>
                  </div>
                )}

                <div className="mb-4 p-3 bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-xl w-fit">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>

                <Link to={feature.link}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between group-hover:bg-secondary"
                    disabled={feature.comingSoon}
                  >
                    {feature.comingSoon ? "Coming Soon" : "Explore"}
                    {!feature.comingSoon && (
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    )}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center p-12 bg-gradient-to-br from-primary/10 via-primary-glow/10 to-accent/10 rounded-2xl border border-border animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Get Organized?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Start planning your week, tracking your progress, and achieving your goals today.
          </p>
          <Link to="/tasks">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-lg"
            >
              Start Planning Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Home;
