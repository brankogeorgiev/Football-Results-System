import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Player {
  id: string;
  name: string;
  default_team_id: string | null;
}

interface GoalScorerSelectProps {
  label: string;
  teamId: string;
  players: Player[];
  selectedGoals: string[]; // Array of player IDs for goals scored
  onGoalsChange: (goals: string[]) => void;
}

const GoalScorerSelect = ({
  label,
  teamId,
  players,
  selectedGoals,
  onGoalsChange,
}: GoalScorerSelectProps) => {
  // Prioritize players with this team as default, then others
  const sortedPlayers = [...players].sort((a, b) => {
    const aIsDefault = a.default_team_id === teamId;
    const bIsDefault = b.default_team_id === teamId;
    if (aIsDefault && !bIsDefault) return -1;
    if (!aIsDefault && bIsDefault) return 1;
    return a.name.localeCompare(b.name);
  });

  const addGoal = (playerId: string) => {
    onGoalsChange([...selectedGoals, playerId]);
  };

  const removeGoal = (index: number) => {
    onGoalsChange(selectedGoals.filter((_, i) => i !== index));
  };

  const getPlayerName = (playerId: string) => {
    return players.find((p) => p.id === playerId)?.name || "Unknown";
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm">{label} Goals</Label>
      
      {/* List of scored goals */}
      <div className="space-y-1">
        {selectedGoals.map((playerId, index) => (
          <div
            key={`${playerId}-${index}`}
            className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-1.5 text-sm"
          >
            <span>⚽ {getPlayerName(playerId)}</span>
            <button
              type="button"
              onClick={() => removeGoal(index)}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add goal selector */}
      <div className="flex gap-2">
        <Select onValueChange={addGoal} value="">
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Add goal scorer..." />
          </SelectTrigger>
          <SelectContent>
            {sortedPlayers.map((player) => (
              <SelectItem key={player.id} value={player.id}>
                {player.name}
                {player.default_team_id === teamId && (
                  <span className="text-muted-foreground ml-1">★</span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default GoalScorerSelect;
