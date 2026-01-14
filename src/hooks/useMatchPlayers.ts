import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MatchPlayer {
  id: string;
  match_id: string;
  player_id: string;
  team_id: string;
  position_index?: number;
  created_at: string;
}

export const useMatchPlayers = (matchId: string | null) => {
  return useQuery({
    queryKey: ["match_players", matchId],
    queryFn: async () => {
      if (!matchId) return [];
      const { data, error } = await supabase
        .from("match_players")
        .select("*")
        .eq("match_id", matchId);
      if (error) throw error;
      return data as MatchPlayer[];
    },
    enabled: !!matchId,
  });
};

export const useSaveMatchPlayers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      matchId,
      players,
    }: {
      matchId: string;
      players: { playerId: string; teamId: string; positionIndex: number }[];
    }) => {
      // Delete existing players for this match
      const { error: deleteError } = await supabase
        .from("match_players")
        .delete()
        .eq("match_id", matchId);
      
      if (deleteError) throw deleteError;

      // Insert new players
      if (players.length > 0) {
        const { error: insertError } = await supabase.from("match_players").insert(
          players.map((player) => ({
            match_id: matchId,
            player_id: player.playerId,
            team_id: player.teamId,
          }))
        );
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match_players"] });
    },
    onError: (error) => {
      toast.error("Failed to save match players: " + error.message);
    },
  });
};
