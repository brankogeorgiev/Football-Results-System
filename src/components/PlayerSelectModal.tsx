import { useEffect, useState } from "react";
import { Plus, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Team {
  id: string;
  name: string;
}

interface Player {
  id: string;
  name: string;
  default_team_id: string | null;
  isTemporary?: boolean;
}

interface PlayerSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams: Team[];
  players: Player[];
  selectedTeamId: string;
  onSelectPlayer: (playerId: string) => void;
  onAddTemporaryPlayer: (name: string) => string; // Returns the temp player ID
  excludePlayerIds?: string[]; // Players to exclude from selection (already on pitch)
}

const PlayerSelectModal = ({
  open,
  onOpenChange,
  teams,
  players,
  selectedTeamId,
  onSelectPlayer,
  onAddTemporaryPlayer,
  excludePlayerIds = [],
}: PlayerSelectModalProps) => {
  const [activeTab, setActiveTab] = useState(selectedTeamId || "all");
  const [showNewPlayerInput, setShowNewPlayerInput] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");

  useEffect(() => {
    if (open) setActiveTab(selectedTeamId || "all");
  }, [open, selectedTeamId]);

  // Reset state when modal opens
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setShowNewPlayerInput(false);
      setNewPlayerName("");
    }
    onOpenChange(open);
  };

  // Get players filtered by team, excluding those already on pitch
  const getPlayersForTeam = (teamId: string) => {
    let filtered = players.filter(p => !excludePlayerIds.includes(p.id));
    if (teamId === "all") {
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    return filtered
      .filter((p) => p.default_team_id === teamId)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleSelectPlayer = (playerId: string) => {
    onSelectPlayer(playerId);
    handleOpenChange(false);
  };

  const handleAddNewPlayer = () => {
    if (newPlayerName.trim()) {
      const tempId = onAddTemporaryPlayer(newPlayerName.trim());
      handleSelectPlayer(tempId);
    }
  };

  const currentPlayers = getPlayersForTeam(activeTab);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Select Player</DialogTitle>
        </DialogHeader>

        {showNewPlayerInput ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add a player for this match only (won't be saved to database)
            </p>
            <Input
              placeholder="Player name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddNewPlayer();
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowNewPlayerInput(false)}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleAddNewPlayer}
                disabled={!newPlayerName.trim()}
              >
                Add Player
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                {teams.slice(0, 2).map((team) => (
                  <TabsTrigger key={team.id} value={team.id}>
                    {team.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                <ScrollArea className="h-[220px]">
                  <div className="space-y-1.5">
                    {currentPlayers.map((player) => (
                      <button
                        key={player.id}
                        onClick={() => handleSelectPlayer(player.id)}
                        className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="flex-1">{player.name}</span>
                        {player.isTemporary && (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            temp
                          </span>
                        )}
                      </button>
                    ))}
                    {currentPlayers.length === 0 && (
                      <p className="text-center text-muted-foreground py-4 text-sm">
                        No players found
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            <Button
              variant="outline"
              className="w-full gap-2 border-dashed"
              onClick={() => setShowNewPlayerInput(true)}
            >
              <Plus className="w-4 h-4" />
              Insert new player (this match only)
            </Button>

            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlayerSelectModal;
