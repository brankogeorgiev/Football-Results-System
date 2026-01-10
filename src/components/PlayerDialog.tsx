import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Team {
  id: string;
  name: string;
}

interface PlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, defaultTeamId: string | null) => void;
  editPlayer?: { id: string; name: string; default_team_id: string | null } | null;
  teams: Team[];
}

const PlayerDialog = ({
  open,
  onOpenChange,
  onSave,
  editPlayer,
  teams,
}: PlayerDialogProps) => {
  const [name, setName] = useState("");
  const [defaultTeamId, setDefaultTeamId] = useState<string>("none");

  useEffect(() => {
    if (editPlayer) {
      setName(editPlayer.name);
      setDefaultTeamId(editPlayer.default_team_id || "none");
    } else {
      setName("");
      setDefaultTeamId("none");
    }
  }, [editPlayer, open]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), defaultTeamId === "none" ? null : defaultTeamId);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editPlayer ? "Edit Player" : "Add Player"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="player-name">Player Name</Label>
            <Input
              id="player-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter player name"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Default Team (optional)</Label>
            <Select value={defaultTeamId} onValueChange={setDefaultTeamId}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No default team</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSave}
            className="w-full"
            size="lg"
            disabled={!name.trim()}
          >
            {editPlayer ? "Save Changes" : "Add Player"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDialog;
