import { Trophy } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50">
      <div className="container max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg text-foreground">Football</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Results System</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
