import { Plus, User } from "lucide-react";
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
}

// 6-a-side formation (1 GK + 5 outfield) for each team
// Positions are defined as percentages of the pitch
const HOME_POSITIONS = [
  // Goalkeeper
  { x: 50, y: 88, label: "GK" },
  // Defenders
  { x: 25, y: 72, label: "DEF" },
  { x: 75, y: 72, label: "DEF" },
  // Midfielders
  { x: 20, y: 55, label: "MID" },
  { x: 50, y: 52, label: "MID" },
  { x: 80, y: 55, label: "MID" },
];

const AWAY_POSITIONS = [
  // Goalkeeper
  { x: 50, y: 12, label: "GK" },
  // Defenders
  { x: 25, y: 28, label: "DEF" },
  { x: 75, y: 28, label: "DEF" },
  // Midfielders
  { x: 20, y: 45, label: "MID" },
  { x: 50, y: 48, label: "MID" },
  { x: 80, y: 45, label: "MID" },
];

const FootballPitch = ({
  homeTeamName,
  awayTeamName,
  homePlayers,
  awayPlayers,
  allPlayers,
  onAddPlayer,
  onRemovePlayer,
}: FootballPitchProps) => {
  const getPlayerName = (playerId: string) => {
    const player = allPlayers.find((p) => p.id === playerId);
    if (!player) return "Player";
    const names = player.name.split(" ");
    return names[0].substring(0, 8);
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
    const bgColor = isHome ? "bg-team-home" : "bg-team-away";

    return (
      <div
        key={`${team}-${positionIndex}`}
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
      >
        {player ? (
          <button
            onClick={() => onRemovePlayer(team, player.id)}
            className="flex flex-col items-center group"
          >
            <div
              className={`w-9 h-9 rounded-full ${bgColor} flex items-center justify-center shadow-lg border-2 border-white/40 group-hover:border-destructive transition-colors`}
            >
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] text-white font-medium mt-0.5 bg-black/40 px-1.5 py-0.5 rounded max-w-[60px] truncate">
              {getPlayerName(player.id)}
            </span>
          </button>
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
    <div className="relative w-full aspect-[3/4] max-h-[400px] rounded-lg overflow-hidden">
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

      {/* Team labels */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 z-10">
        <span className="text-[10px] font-medium text-white/80 bg-black/30 px-2 py-0.5 rounded">
          {awayTeamName}
        </span>
      </div>
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-10">
        <span className="text-[10px] font-medium text-white/80 bg-black/30 px-2 py-0.5 rounded">
          {homeTeamName}
        </span>
      </div>

      {/* Players on pitch */}
      <div className="absolute inset-0">
        {/* Home team positions (bottom half) */}
        {HOME_POSITIONS.map((pos, index) => renderPosition("home", pos, index))}
        
        {/* Away team positions (top half) */}
        {AWAY_POSITIONS.map((pos, index) => renderPosition("away", pos, index))}
      </div>
    </div>
  );
};

export default FootballPitch;
