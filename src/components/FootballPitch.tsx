import { useState } from "react";
import { Plus, User, RefreshCw, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface Player {
  id: string;
  name: string;
  isTemporary?: boolean;
}

interface PitchPlayer {
  id: string;
  positionIndex: number;
}

interface FootballPitchProps {
  homeTeamName: string;
  awayTeamName: string;
  homePlayers: PitchPlayer[];
  awayPlayers: PitchPlayer[];
  allPlayers: Player[];
  onAddPlayer: (team: "home" | "away", positionIndex: number) => void;
  onRemovePlayer: (team: "home" | "away", playerId: string) => void;
  onChangePlayer: (team: "home" | "away", positionIndex: number, currentPlayerId: string) => void;
}

// 6-a-side formation (1 GK + 2 DEF + 2 MID + 1 FWD) for each team
// Positions are defined as percentages of the pitch - spread further apart
const HOME_POSITIONS = [
  // Goalkeeper - moved slightly toward center for visibility
  { x: 50, y: 90, label: "GK" },
  // Defenders (spread wider)
  { x: 20, y: 80, label: "DEF" },
  { x: 80, y: 80, label: "DEF" },
  // Midfielders (spread wider)
  { x: 20, y: 68, label: "MID" },
  { x: 80, y: 68, label: "MID" },
  // Forward - moved down to avoid overlap
  { x: 50, y: 56, label: "FWD" },
];

const AWAY_POSITIONS = [
  // Goalkeeper - moved slightly toward center for visibility
  { x: 50, y: 10, label: "GK" },
  // Defenders (spread wider)
  { x: 20, y: 20, label: "DEF" },
  { x: 80, y: 20, label: "DEF" },
  // Midfielders (spread wider)
  { x: 20, y: 32, label: "MID" },
  { x: 80, y: 32, label: "MID" },
  // Forward - moved up to avoid overlap
  { x: 50, y: 44, label: "FWD" },
];

// Substitute positions on the sides
const HOME_SUBS = [
  { x: 8, y: 75, label: "SUB" },
  { x: 8, y: 85, label: "SUB" },
];

const AWAY_SUBS = [
  { x: 92, y: 15, label: "SUB" },
  { x: 92, y: 25, label: "SUB" },
];

const FootballPitch = ({
  homeTeamName,
  awayTeamName,
  homePlayers,
  awayPlayers,
  allPlayers,
  onAddPlayer,
  onRemovePlayer,
  onChangePlayer,
}: FootballPitchProps) => {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const getPlayerName = (playerId: string) => {
    const player = allPlayers.find((p) => p.id === playerId);
    return player?.name || "Player";
  };

  const getPlayerAtPosition = (team: "home" | "away", positionIndex: number) => {
    const players = team === "home" ? homePlayers : awayPlayers;
    return players.find((p) => p.positionIndex === positionIndex);
  };

  const renderPosition = (
    team: "home" | "away",
    position: { x: number; y: number; label: string },
    positionIndex: number
  ) => {
    const player = getPlayerAtPosition(team, positionIndex);
    const isHome = team === "home";
    const isGoalkeeper = positionIndex === 0; // GK is always position 0
    
    // Different colors for GK vs field players
    const bgColor = isGoalkeeper 
      ? (isHome ? "bg-team-home-gk" : "bg-team-away-gk")
      : (isHome ? "bg-team-home" : "bg-team-away");
    
    const textColor = isGoalkeeper 
      ? "text-white" 
      : (isHome ? "text-purple-600" : "text-white");
    
    const popoverId = `${team}-${positionIndex}`;

    return (
      <div
        key={popoverId}
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
      >
        {player ? (
          <Popover open={openPopover === popoverId} onOpenChange={(open) => setOpenPopover(open ? popoverId : null)}>
            <PopoverTrigger asChild>
              <button className="flex flex-col items-center group">
                <div
                  className={`w-9 h-9 rounded-full ${bgColor} flex items-center justify-center shadow-lg border-2 group-hover:border-white/80 transition-colors`}
                >
                  <User className={`w-5 h-5 ${textColor}`} />
                </div>
                <span className="text-[10px] text-white font-medium mt-0.5 bg-black/40 px-1.5 py-0.5 rounded max-w-[60px] truncate">
                  {getPlayerName(player.id)}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" side="top" align="center">
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start gap-2"
                  onClick={() => {
                    setOpenPopover(null);
                    onChangePlayer(team, positionIndex, player.id);
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Change
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start gap-2 text-destructive hover:text-destructive"
                  onClick={() => {
                    setOpenPopover(null);
                    onRemovePlayer(team, player.id);
                  }}
                >
                  <X className="w-4 h-4" />
                  Remove
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <button
            onClick={() => onAddPlayer(team, positionIndex)}
            className="flex flex-col items-center group"
          >
            <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-dashed border-white/50 flex items-center justify-center hover:bg-white/30 transition-colors">
              <Plus className="w-4 h-4 text-white/70" />
            </div>
            <span className="text-[9px] text-white/60 mt-0.5">{position.label}</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full aspect-[3/4] max-h-[400px] rounded-lg overflow-visible my-8">
      {/* Pitch background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(142,60%,45%)] to-[hsl(142,55%,35%)]">
        {/* Pitch markings */}
        <svg
          viewBox="0 0 100 130"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Field outline */}
          <rect
            x="5"
            y="5"
            width="90"
            height="120"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />
          {/* Center line */}
          <line
            x1="5"
            y1="65"
            x2="95"
            y2="65"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />
          {/* Center circle */}
          <circle
            cx="50"
            cy="65"
            r="12"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />
          <circle cx="50" cy="65" r="1" fill="rgba(255,255,255,0.4)" />
          {/* Top penalty box */}
          <rect
            x="25"
            y="5"
            width="50"
            height="20"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />
          <rect
            x="35"
            y="5"
            width="30"
            height="8"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />
          {/* Bottom penalty box */}
          <rect
            x="25"
            y="105"
            width="50"
            height="20"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />
          <rect
            x="35"
            y="117"
            width="30"
            height="8"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Team labels - outside the pitch */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
        <span className="text-xs font-semibold text-foreground bg-card px-3 py-1 rounded-lg shadow-sm border border-border">
          {awayTeamName}
        </span>
      </div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-10">
        <span className="text-xs font-semibold text-foreground bg-card px-3 py-1 rounded-lg shadow-sm border border-border">
          {homeTeamName}
        </span>
      </div>

      {/* Players on pitch */}
      <div className="absolute inset-0">
        {/* Home team positions (bottom half) */}
        {HOME_POSITIONS.map((pos, index) => renderPosition("home", pos, index))}
        
        {/* Away team positions (top half) */}
        {AWAY_POSITIONS.map((pos, index) => renderPosition("away", pos, index))}
        
        {/* Home substitutes (left side) */}
        {HOME_SUBS.map((pos, index) => renderPosition("home", pos, index + 6))}
        
        {/* Away substitutes (right side) */}
        {AWAY_SUBS.map((pos, index) => renderPosition("away", pos, index + 6))}
      </div>
    </div>
  );
};

export default FootballPitch;
