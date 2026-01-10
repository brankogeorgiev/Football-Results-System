import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Goal {
  id: string;
  match_id: string;
  player_id: string;
  team_id: string;
  created_at: string;
  player?: { id: string; name: string };
}

export const useMatchGoals = (matchId: string | null) => {
  return useQuery({
    queryKey: ["goals", matchId],
    queryFn: async () => {
      if (!matchId) return [];
      const { data, error } = await supabase
        .from("goals")
        .select(`
          *,
          player:players(id, name)
        `)
        .eq("match_id", matchId);
      if (error) throw error;
      return data as Goal[];
    },
    enabled: !!matchId,
  });
};

export const useSaveMatchGoals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      matchId,
      goals,
    }: {
      matchId: string;
      goals: { playerId: string; teamId: string }[];
    }) => {
      // Delete existing goals for this match
      const { error: deleteError } = await supabase
        .from("goals")
        .delete()
        .eq("match_id", matchId);
      
      if (deleteError) throw deleteError;

      // Insert new goals
      if (goals.length > 0) {
        const { error: insertError } = await supabase.from("goals").insert(
          goals.map((goal) => ({
            match_id: matchId,
            player_id: goal.playerId,
            team_id: goal.teamId,
          }))
        );
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
    onError: (error) => {
      toast.error("Failed to save goals: " + error.message);
    },
  });
};
