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

interface PlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  editPlayer?: { id: string; name: string } | null;
}

const PlayerDialog = ({
  open,
  onOpenChange,
  onSave,
  editPlayer,
}: PlayerDialogProps) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editPlayer) {
      setName(editPlayer.name);
    } else {
      setName("");
    }
  }, [editPlayer, open]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
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
