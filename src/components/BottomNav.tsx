import { Link, useLocation } from "react-router-dom";
import { Trophy, Users, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Results", icon: Trophy },
  { path: "/players", label: "Players", icon: Users },
  { path: "/statistics", label: "Stats", icon: BarChart3 },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 z-50">
      <div className="container max-w-lg mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
