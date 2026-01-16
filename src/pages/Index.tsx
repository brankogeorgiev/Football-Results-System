import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import ResultCard from "@/components/ResultCard";
import AddResultDialog from "@/components/AddResultDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import {
  useMatches,
  useTeams,
  useCreateMatch,
  useUpdateMatch,
  useDeleteMatch,
  type Match,
} from "@/hooks/useMatches";
import { usePlayers } from "@/hooks/usePlayers";
import { useMatchGoals, useSaveMatchGoals } from "@/hooks/useGoals";
import { useMatchPlayers, useSaveMatchPlayers } from "@/hooks/useMatchPlayers";

const Index = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMatch, setEditMatch] = useState<Match | null>(null);
  const [deleteMatchId, setDeleteMatchId] = useState<string | null>(null);
  const { user } = useAuth();

  const { data: matches, isLoading: matchesLoading } = useMatches();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: players, isLoading: playersLoading } = usePlayers();
  const { data: existingGoals, isLoading: goalsLoading } = useMatchGoals(editMatch?.id || null);
  const { data: existingMatchPlayers, isLoading: matchPlayersLoading } = useMatchPlayers(editMatch?.id || null);
  const createMatch = useCreateMatch();
  const updateMatch = useUpdateMatch();
  const deleteMatch = useDeleteMatch();
  const saveGoals = useSaveMatchGoals();
  const saveMatchPlayers = useSaveMatchPlayers();

  const handleAddResult = () => {
    setEditMatch(null);
    setDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    const match = matches?.find((m) => m.id === id);
    if (match) {
      setEditMatch(match);
      setDialogOpen(true);
    }
  };

  const handleView = (id: string) => {
    navigate(`/match/${id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteMatchId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteMatchId) {
      deleteMatch.mutate(deleteMatchId);
      setDeleteMatchId(null);
    }
  };

  const handleSave = async (data: {
    homeTeamId: string;
    awayTeamId: string;
    homeScore: number;
    awayScore: number;
    matchDate: string;
    homeGoals: string[];
    awayGoals: string[];
    homePitchPlayers: { id: string; positionIndex: number }[];
    awayPitchPlayers: { id: string; positionIndex: number }[];
    tempPlayersToCreate: { tempId: string; name: string }[];
  }) => {
    // First, create any temporary players and get their real IDs
    const tempIdToRealId = new Map<string, string>();
    
    for (const tempPlayer of data.tempPlayersToCreate) {
      const { data: newPlayer, error } = await supabase
        .from("players")
        .insert({ name: tempPlayer.name })
        .select("id")
        .single();
      
      if (!error && newPlayer) {
        tempIdToRealId.set(tempPlayer.tempId, newPlayer.id);
      }
    }
    
    // Helper to resolve player ID (temp or real)
    const resolvePlayerId = (id: string) => tempIdToRealId.get(id) || id;
    
    const matchData = {
      homeTeamId: data.homeTeamId,
      awayTeamId: data.awayTeamId,
      homeScore: data.homeScore,
      awayScore: data.awayScore,
      matchDate: data.matchDate,
    };

    const goals = [
      ...data.homeGoals.map((playerId) => ({
        playerId: resolvePlayerId(playerId),
        teamId: data.homeTeamId,
      })),
      ...data.awayGoals.map((playerId) => ({
        playerId: resolvePlayerId(playerId),
        teamId: data.awayTeamId,
      })),
    ];

    const matchPlayers = [
      ...data.homePitchPlayers.map((pp) => ({
        playerId: resolvePlayerId(pp.id),
        teamId: data.homeTeamId,
        positionIndex: pp.positionIndex,
      })),
      ...data.awayPitchPlayers.map((pp) => ({
        playerId: resolvePlayerId(pp.id),
        teamId: data.awayTeamId,
        positionIndex: pp.positionIndex,
      })),
    ];

    if (editMatch) {
      await updateMatch.mutateAsync({ id: editMatch.id, data: matchData });
      await saveGoals.mutateAsync({ matchId: editMatch.id, goals });
      await saveMatchPlayers.mutateAsync({ matchId: editMatch.id, players: matchPlayers });
    } else {
      const newMatch = await createMatch.mutateAsync(matchData);
      if (newMatch) {
        if (goals.length > 0) {
          await saveGoals.mutateAsync({ matchId: newMatch.id, goals });
        }
        if (matchPlayers.length > 0) {
          await saveMatchPlayers.mutateAsync({ matchId: newMatch.id, players: matchPlayers });
        }
      }
    }
    
    // Invalidate players query to show newly created players
    if (data.tempPlayersToCreate.length > 0) {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    }
  };

  const isLoading = matchesLoading || teamsLoading || playersLoading;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container max-w-lg mx-auto px-4 py-6">
        {/* Page title with add button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-foreground">
            Past Results
          </h2>
          {user && (
            <Button onClick={handleAddResult} size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              Add result
            </Button>
          )}
        </div>

        {/* Results list */}
        <div className="space-y-3">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="result-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-4 w-2" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))
          ) : matches && matches.length > 0 ? (
            matches.map((match) => (
              <ResultCard
                key={match.id}
                id={match.id}
                homeTeam={match.home_team?.name || "Unknown"}
                awayTeam={match.away_team?.name || "Unknown"}
                homeScore={match.home_score}
                awayScore={match.away_score}
                matchDate={match.match_date}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                showActions={!!user}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No matches recorded yet
              </p>
              {user && (
                <Button onClick={handleAddResult} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add your first result
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <BottomNav />

      {/* Dialogs */}
      {teams && players && (
        <AddResultDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          teams={teams}
          players={players}
          onSave={handleSave}
          editMatch={editMatch}
          existingGoals={existingGoals}
          existingMatchPlayers={existingMatchPlayers}
          isLoadingEditData={editMatch ? (goalsLoading || matchPlayersLoading) : false}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Index;
