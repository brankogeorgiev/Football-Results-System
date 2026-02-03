import { Link, useLocation } from "react-router-dom";
import { Trophy, Users, BarChart3, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import { TranslationKey } from "@/i18n/translations";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  path: string;
  labelKey: TranslationKey;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { path: "/", labelKey: "results", icon: Trophy },
  { path: "/players", labelKey: "players", icon: Users },
  { path: "/statistics", labelKey: "stats", icon: BarChart3 },
  { path: "/exports", labelKey: "exports", icon: Download, adminOnly: true },
];

const BottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { isAdmin } = useAuth();

  const visibleItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 z-50">
      <div className="container max-w-lg mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {visibleItems.map((item) => {
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
                <span className="text-xs font-medium">{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
