import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import GoalScorerSelect from "./GoalScorerSelect";

interface Team {
  id: string;
  name: string;
}

interface Player {
  id: string;
  name: string;
  default_team_id: string | null;
}

interface Goal {
  id: string;
  player_id: string;
  team_id: string;
}

interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: number;
  away_score: number;
  match_date: string;
}

interface AddResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams: Team[];
  players: Player[];
  onSave: (data: {
    homeTeamId: string;
    awayTeamId: string;
    homeScore: number;
    awayScore: number;
    matchDate: string;
    homeGoals: string[];
    awayGoals: string[];
  }) => void;
  editMatch?: Match | null;
  existingGoals?: Goal[];
}

const AddResultDialog = ({
  open,
  onOpenChange,
  teams,
  players,
  onSave,
  editMatch,
  existingGoals = [],
}: AddResultDialogProps) => {
  const [homeTeamId, setHomeTeamId] = useState<string>("");
  const [awayTeamId, setAwayTeamId] = useState<string>("");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [matchDate, setMatchDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [homeGoals, setHomeGoals] = useState<string[]>([]);
  const [awayGoals, setAwayGoals] = useState<string[]>([]);

  useEffect(() => {
    if (editMatch) {
      setHomeTeamId(editMatch.home_team_id);
      setAwayTeamId(editMatch.away_team_id);
      setHomeScore(editMatch.home_score);
      setAwayScore(editMatch.away_score);
      setMatchDate(editMatch.match_date);
      
      // Set existing goals
      const homeGoalsList = existingGoals
        .filter((g) => g.team_id === editMatch.home_team_id)
        .map((g) => g.player_id);
      const awayGoalsList = existingGoals
        .filter((g) => g.team_id === editMatch.away_team_id)
        .map((g) => g.player_id);
      
      setHomeGoals(homeGoalsList);
      setAwayGoals(awayGoalsList);
    } else {
      // Reset form for new match
      setHomeTeamId(teams[0]?.id || "");
      setAwayTeamId(teams[1]?.id || "");
      setHomeScore(0);
      setAwayScore(0);
      setMatchDate(new Date().toISOString().split("T")[0]);
      setHomeGoals([]);
      setAwayGoals([]);
    }
  }, [editMatch, teams, open, existingGoals]);

  // Auto-update scores based on goals
  useEffect(() => {
    setHomeScore(homeGoals.length);
  }, [homeGoals]);

  useEffect(() => {
    setAwayScore(awayGoals.length);
  }, [awayGoals]);

  const handleSave = () => {
    if (!homeTeamId || !awayTeamId) return;
    onSave({
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      matchDate,
      homeGoals,
      awayGoals,
    });
    onOpenChange(false);
  };

  const ScoreControl = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (v: number) => void;
    label: string;
  }) => (
    <div className="flex flex-col items-center gap-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(Math.max(0, value - 1))}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="text-2xl font-bold w-8 text-center">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(value + 1)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const homeTeam = teams.find((t) => t.id === homeTeamId);
  const awayTeam = teams.find((t) => t.id === awayTeamId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editMatch ? "Edit Result" : "Add a Result"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Teams selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Home Team</Label>
                <Select value={homeTeamId} onValueChange={setHomeTeamId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Away Team</Label>
                <Select value={awayTeamId} onValueChange={setAwayTeamId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Score controls */}
            <div className="flex justify-center gap-8">
              <ScoreControl
                value={homeScore}
                onChange={setHomeScore}
                label="Home"
              />
              <div className="flex items-end pb-2">
                <span className="text-2xl font-bold text-muted-foreground">:</span>
              </div>
              <ScoreControl
                value={awayScore}
                onChange={setAwayScore}
                label="Away"
              />
            </div>

            {/* Goal scorers */}
            {homeTeamId && awayTeamId && players.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <GoalScorerSelect
                  label={homeTeam?.name || "Home"}
                  teamId={homeTeamId}
                  players={players}
                  selectedGoals={homeGoals}
                  onGoalsChange={setHomeGoals}
                />
                <GoalScorerSelect
                  label={awayTeam?.name || "Away"}
                  teamId={awayTeamId}
                  players={players}
                  selectedGoals={awayGoals}
                  onGoalsChange={setAwayGoals}
                />
              </div>
            )}

            {/* Date picker */}
            <div className="space-y-2">
              <Label>Match Date</Label>
              <Input
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
              />
            </div>

            {/* Save button */}
            <Button onClick={handleSave} className="w-full" size="lg">
              {editMatch ? "Save Changes" : "Save Result"}
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddResultDialog;
