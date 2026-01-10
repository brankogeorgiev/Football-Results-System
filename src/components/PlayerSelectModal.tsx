import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
}

interface PlayerSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams: Team[];
  players: Player[];
  selectedTeamId: string;
  onSelectPlayer: (playerId: string) => void;
  onAddNewPlayer?: () => void;
}

const PlayerSelectModal = ({
  open,
  onOpenChange,
  teams,
  players,
  selectedTeamId,
  onSelectPlayer,
  onAddNewPlayer,
}: PlayerSelectModalProps) => {
  const [activeTab, setActiveTab] = useState(selectedTeamId);

  // Get players filtered and sorted by team
  const getPlayersForTeam = (teamId: string) => {
    return players
      .filter((p) => p.default_team_id === teamId)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleSelectPlayer = (playerId: string) => {
    onSelectPlayer(playerId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Select Player</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {teams.map((team) => (
              <TabsTrigger
                key={team.id}
                value={team.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {team.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {teams.map((team) => (
            <TabsContent key={team.id} value={team.id} className="mt-4">
              <ScrollArea className="h-[250px]">
                <div className="space-y-2">
                  {getPlayersForTeam(team.id).map((player) => (
                    <button
                      key={player.id}
                      onClick={() => handleSelectPlayer(player.id)}
                      className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      {player.name}
                    </button>
                  ))}
                  {getPlayersForTeam(team.id).length === 0 && (
                    <p className="text-center text-muted-foreground py-4 text-sm">
                      No players in this team
                    </p>
                  )}
                </div>
              </ScrollArea>

              <Button
                variant="outline"
                className="w-full mt-3 gap-2"
                onClick={() => {
                  onOpenChange(false);
                  onAddNewPlayer?.();
                }}
              >
                <Plus className="w-4 h-4" />
                Insert player
              </Button>
            </TabsContent>
          ))}
        </Tabs>

        <Button
          variant="destructive"
          className="w-full"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerSelectModal;
