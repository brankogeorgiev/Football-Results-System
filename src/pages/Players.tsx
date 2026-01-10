import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PlayerCard from "@/components/PlayerCard";
import PlayerDialog from "@/components/PlayerDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePlayers,
  useCreatePlayer,
  useUpdatePlayer,
  useDeletePlayer,
  type Player,
} from "@/hooks/usePlayers";
import { useTeams } from "@/hooks/useMatches";

const Players = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [deletePlayerId, setDeletePlayerId] = useState<string | null>(null);

  const { data: players, isLoading: playersLoading } = usePlayers();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const createPlayer = useCreatePlayer();
  const updatePlayer = useUpdatePlayer();
  const deletePlayer = useDeletePlayer();

  const handleAddPlayer = () => {
    setEditPlayer(null);
    setDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    const player = players?.find((p) => p.id === id);
    if (player) {
      setEditPlayer(player);
      setDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setDeletePlayerId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletePlayerId) {
      deletePlayer.mutate(deletePlayerId);
      setDeletePlayerId(null);
    }
  };

  const handleSave = (name: string, defaultTeamId: string | null) => {
    if (editPlayer) {
      updatePlayer.mutate({ id: editPlayer.id, name, defaultTeamId });
    } else {
      createPlayer.mutate({ name, defaultTeamId });
    }
  };

  const isLoading = playersLoading || teamsLoading;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container max-w-lg mx-auto px-4 py-6">
        {/* Page title with add button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-foreground">
            Players
          </h2>
          <Button onClick={handleAddPlayer} size="sm" className="gap-1">
            <Plus className="w-4 h-4" />
            Add player
          </Button>
        </div>

        {/* Players list */}
        <div className="space-y-3">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="result-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))
          ) : players && players.length > 0 ? (
            players.map((player) => (
              <PlayerCard
                key={player.id}
                id={player.id}
                name={player.name}
                defaultTeamName={player.default_team?.name}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No players added yet</p>
              <Button onClick={handleAddPlayer} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add your first player
              </Button>
            </div>
          )}
        </div>
      </main>

      <BottomNav />

      {/* Dialogs */}
      {teams && (
        <PlayerDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSave}
          editPlayer={editPlayer}
          teams={teams}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Player"
        description="Are you sure you want to delete this player? This will also remove them from any match records."
      />
    </div>
  );
};

export default Players;
