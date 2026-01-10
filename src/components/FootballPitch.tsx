import { Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Player {
  id: string;
  name: string;
  default_team_id: string | null;
}

interface FootballPitchProps {
  teamId: string;
  teamName: string;
  selectedPlayers: string[];
  allPlayers: Player[];
  onAddPlayer: () => void;
  onRemovePlayer: (playerId: string) => void;
}

// Formation positions (4-3-3)
const POSITIONS = [
  // Goalkeeper
  { x: 50, y: 90 },
  // Defenders
  { x: 15, y: 72 },
  { x: 38, y: 75 },
  { x: 62, y: 75 },
  { x: 85, y: 72 },
  // Midfielders
  { x: 25, y: 50 },
  { x: 50, y: 55 },
  { x: 75, y: 50 },
  // Forwards
  { x: 20, y: 25 },
  { x: 50, y: 20 },
  { x: 80, y: 25 },
];

const FootballPitch = ({
  teamId,
  teamName,
  selectedPlayers,
  allPlayers,
  onAddPlayer,
  onRemovePlayer,
}: FootballPitchProps) => {
  const getPlayerName = (playerId: string) => {
    const player = allPlayers.find((p) => p.id === playerId);
    return player?.name?.split(" ")[0] || "Player";
  };

  return (
    <div className="relative w-full aspect-[3/4] max-h-[350px] rounded-lg overflow-hidden">
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

      {/* Add goalscorer button - top */}
      <Button
        variant="secondary"
        size="sm"
        className="absolute top-2 right-2 z-10 text-xs bg-primary/90 text-primary-foreground hover:bg-primary"
        onClick={onAddPlayer}
      >
        Add goalscorer
      </Button>

      {/* Players on pitch */}
      <div className="absolute inset-0">
        {selectedPlayers.slice(0, 11).map((playerId, index) => {
          const pos = POSITIONS[index];
          return (
            <button
              key={playerId}
              onClick={() => onRemovePlayer(playerId)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
            >
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-team-home flex items-center justify-center shadow-lg border-2 border-white/30 group-hover:border-destructive transition-colors">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-white font-medium mt-0.5 bg-black/30 px-1.5 py-0.5 rounded max-w-[60px] truncate">
                  {getPlayerName(playerId)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Add goalscorer button - bottom */}
      <Button
        variant="secondary"
        size="sm"
        className="absolute bottom-2 left-2 z-10 text-xs bg-primary/90 text-primary-foreground hover:bg-primary"
        onClick={onAddPlayer}
      >
        Add goalscorer
      </Button>
    </div>
  );
};

export default FootballPitch;
