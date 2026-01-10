import { useState, useEffect } from "react";
import { Plus, Minus, ArrowLeft, ArrowRight, X, User } from "lucide-react";
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
import FootballPitch from "./FootballPitch";
import PlayerSelectModal from "./PlayerSelectModal";

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
  const [homePlayers, setHomePlayers] = useState<string[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<string[]>([]);
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [selectingForTeam, setSelectingForTeam] = useState<"home" | "away">("home");

  useEffect(() => {
    if (editMatch) {
      setHomeTeamId(editMatch.home_team_id);
      setAwayTeamId(editMatch.away_team_id);
      setHomeScore(editMatch.home_score);
      setAwayScore(editMatch.away_score);
      setMatchDate(editMatch.match_date);

      const homeGoalsList = existingGoals
        .filter((g) => g.team_id === editMatch.home_team_id)
        .map((g) => g.player_id);
      const awayGoalsList = existingGoals
        .filter((g) => g.team_id === editMatch.away_team_id)
        .map((g) => g.player_id);

      setHomeGoals(homeGoalsList);
      setAwayGoals(awayGoalsList);
      setHomePlayers(homeGoalsList);
      setAwayPlayers(awayGoalsList);
    } else {
      setHomeTeamId(teams[0]?.id || "");
      setAwayTeamId(teams[1]?.id || "");
      setHomeScore(0);
      setAwayScore(0);
      setMatchDate(new Date().toISOString().split("T")[0]);
      setHomeGoals([]);
      setAwayGoals([]);
      setHomePlayers([]);
      setAwayPlayers([]);
    }
  }, [editMatch, teams, open, existingGoals]);

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

  const handleOpenPlayerModal = (team: "home" | "away") => {
    setSelectingForTeam(team);
    setPlayerModalOpen(true);
  };

  const handlePlayerSelected = (playerId: string) => {
    if (selectingForTeam === "home") {
      setHomeGoals((prev) => [...prev, playerId]);
      setHomePlayers((prev) => 
        prev.includes(playerId) ? prev : [...prev, playerId]
      );
    } else {
      setAwayGoals((prev) => [...prev, playerId]);
      setAwayPlayers((prev) => 
        prev.includes(playerId) ? prev : [...prev, playerId]
      );
    }
  };

  const removeGoal = (team: "home" | "away", index: number) => {
    if (team === "home") {
      setHomeGoals((prev) => prev.filter((_, i) => i !== index));
    } else {
      setAwayGoals((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const getPlayerName = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
    return player?.name?.split(" ")[0] || "Player";
  };

  const homeTeam = teams.find((t) => t.id === homeTeamId);
  const awayTeam = teams.find((t) => t.id === awayTeamId);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[95vh] p-0 gap-0">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="font-display text-xl text-center">
              {editMatch ? "Edit Result" : "Add a result"}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(95vh-80px)]">
            <div className="px-4 pb-4 space-y-4">
              {/* Team selector with score */}
              <div className="flex items-center gap-3">
                <Select value={homeTeamId} onValueChange={setHomeTeamId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-1 bg-muted rounded-lg px-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-bold w-6 text-center">{homeScore}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setHomeScore(homeScore + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add team button */}
              <Button
                variant="outline"
                className="w-full gap-2 border-dashed border-primary text-primary hover:bg-primary/5"
                onClick={() => handleOpenPlayerModal("home")}
              >
                Add team
                <Plus className="w-4 h-4" />
              </Button>

              {/* Football pitch */}
              <FootballPitch
                teamId={homeTeamId}
                teamName={homeTeam?.name || "Home"}
                selectedPlayers={homePlayers}
                allPlayers={players}
                onAddPlayer={() => handleOpenPlayerModal("home")}
                onRemovePlayer={(id) => {
                  setHomePlayers((prev) => prev.filter((p) => p !== id));
                }}
              />

              {/* Score display */}
              <div className="flex items-center justify-center gap-6 py-2">
                <div className="text-center">
                  <span className="font-semibold text-lg">{homeTeam?.name || "Home"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5 text-success" />
                  <ArrowRight className="w-5 h-5 text-destructive" />
                </div>
                <div className="text-center">
                  <span className="font-semibold text-lg">{awayTeam?.name || "Away"}</span>
                </div>
              </div>

              {/* Goal scorers section */}
              <div className="grid grid-cols-2 gap-4">
                {/* Home goals */}
                <div className="space-y-2">
                  {homeGoals.map((playerId, index) => (
                    <div
                      key={`home-${playerId}-${index}`}
                      className="flex items-center gap-2 bg-muted rounded-full px-3 py-1.5"
                    >
                      <div className="w-6 h-6 rounded-full bg-team-home flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm flex-1 truncate">{getPlayerName(playerId)}</span>
                      <button
                        onClick={() => removeGoal("home", index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1 text-xs"
                    onClick={() => handleOpenPlayerModal("home")}
                  >
                    <Plus className="w-3 h-3" />
                    New player
                  </Button>
                </div>

                {/* Away goals */}
                <div className="space-y-2">
                  {awayGoals.map((playerId, index) => (
                    <div
                      key={`away-${playerId}-${index}`}
                      className="flex items-center gap-2 bg-muted rounded-full px-3 py-1.5"
                    >
                      <div className="w-6 h-6 rounded-full bg-team-away flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm flex-1 truncate">{getPlayerName(playerId)}</span>
                      <button
                        onClick={() => removeGoal("away", index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1 text-xs"
                    onClick={() => handleOpenPlayerModal("away")}
                  >
                    <Plus className="w-3 h-3" />
                    New player
                  </Button>
                </div>
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
                {editMatch ? "Save Changes" : "Save result"}
              </Button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <PlayerSelectModal
        open={playerModalOpen}
        onOpenChange={setPlayerModalOpen}
        teams={teams}
        players={players}
        selectedTeamId={selectingForTeam === "home" ? homeTeamId : awayTeamId}
        onSelectPlayer={handlePlayerSelected}
      />
    </>
  );
};

export default AddResultDialog;
