import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Player {
  id: string;
  name: string;
  default_team_id: string | null;
  created_at: string;
  default_team?: { id: string; name: string } | null;
}

export const usePlayers = () => {
  return useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select(`
          *,
          default_team:teams(id, name)
        `)
        .order("name");
      if (error) throw error;
      return data as Player[];
    },
  });
};

export const useCreatePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, defaultTeamId }: { name: string; defaultTeamId: string | null }) => {
      const { error } = await supabase.from("players").insert({ 
        name,
        default_team_id: defaultTeamId 
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Player added successfully!");
    },
    onError: (error) => {
      toast.error("Failed to add player: " + error.message);
    },
  });
};

export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, defaultTeamId }: { id: string; name: string; defaultTeamId: string | null }) => {
      const { error } = await supabase
        .from("players")
        .update({ name, default_team_id: defaultTeamId })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Player updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update player: " + error.message);
    },
  });
};

export const useDeletePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("players").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Player deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete player: " + error.message);
    },
  });
};
