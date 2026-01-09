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

interface Team {
  id: string;
  name: string;
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
  onSave: (data: {
    homeTeamId: string;
    awayTeamId: string;
    homeScore: number;
    awayScore: number;
    matchDate: string;
  }) => void;
  editMatch?: Match | null;
}

const AddResultDialog = ({
  open,
  onOpenChange,
  teams,
  onSave,
  editMatch,
}: AddResultDialogProps) => {
  const [homeTeamId, setHomeTeamId] = useState<string>("");
  const [awayTeamId, setAwayTeamId] = useState<string>("");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [matchDate, setMatchDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    if (editMatch) {
      setHomeTeamId(editMatch.home_team_id);
      setAwayTeamId(editMatch.away_team_id);
      setHomeScore(editMatch.home_score);
      setAwayScore(editMatch.away_score);
      setMatchDate(editMatch.match_date);
    } else {
      // Reset form for new match
      setHomeTeamId(teams[0]?.id || "");
      setAwayTeamId(teams[1]?.id || "");
      setHomeScore(0);
      setAwayScore(0);
      setMatchDate(new Date().toISOString().split("T")[0]);
    }
  }, [editMatch, teams, open]);

  const handleSave = () => {
    if (!homeTeamId || !awayTeamId) return;
    onSave({
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      matchDate,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editMatch ? "Edit Result" : "Add a Result"}
          </DialogTitle>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
};

export default AddResultDialog;
