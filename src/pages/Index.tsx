import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import ResultCard from "@/components/ResultCard";
import AddResultDialog from "@/components/AddResultDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMatches,
  useTeams,
  useCreateMatch,
  useUpdateMatch,
  useDeleteMatch,
  type Match,
} from "@/hooks/useMatches";

const Index = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMatch, setEditMatch] = useState<Match | null>(null);
  const [deleteMatchId, setDeleteMatchId] = useState<string | null>(null);

  const { data: matches, isLoading: matchesLoading } = useMatches();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const createMatch = useCreateMatch();
  const updateMatch = useUpdateMatch();
  const deleteMatch = useDeleteMatch();

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

  const handleSave = (data: {
    homeTeamId: string;
    awayTeamId: string;
    homeScore: number;
    awayScore: number;
    matchDate: string;
  }) => {
    if (editMatch) {
      updateMatch.mutate({ id: editMatch.id, data });
    } else {
      createMatch.mutate(data);
    }
  };

  const isLoading = matchesLoading || teamsLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-lg mx-auto px-4 py-6">
        {/* Page title with add button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-foreground">
            Past Results
          </h2>
          <Button onClick={handleAddResult} size="sm" className="gap-1">
            <Plus className="w-4 h-4" />
            Add result
          </Button>
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
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No matches recorded yet
              </p>
              <Button onClick={handleAddResult} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add your first result
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Dialogs */}
      {teams && (
        <AddResultDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          teams={teams}
          onSave={handleSave}
          editMatch={editMatch}
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
