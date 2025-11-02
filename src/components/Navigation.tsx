import { NavLink } from "react-router-dom";
import { Home, Calendar, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const navItems = [
    { title: "Home", path: "/", icon: Home },
    { title: "Tasks", path: "/tasks", icon: Calendar },
    { title: "Goals", path: "/goals", icon: Target },
    { title: "Habits", path: "/habits", icon: TrendingUp },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-primary to-primary-glow rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TaskFlow
            </span>
          </NavLink>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
