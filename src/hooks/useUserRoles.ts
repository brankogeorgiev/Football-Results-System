import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserWithRole {
  id: string;
  email: string;
  role: "admin" | "user" | null;
  roleId: string | null;
}

export const useUsersWithRoles = () => {
  return useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      // Get all users from auth
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        // Fallback: get users from user_roles table only
        const { data: roles, error: rolesError } = await supabase
          .from("user_roles")
          .select("*");
        
        if (rolesError) throw rolesError;
        
        return roles.map((role) => ({
          id: role.user_id,
          email: "Unknown",
          role: role.role as "admin" | "user",
          roleId: role.id,
        })) as UserWithRole[];
      }

      // Get all roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");
      
      if (rolesError) throw rolesError;

      // Merge users with roles
      return users.map((user) => {
        const userRole = roles?.find((r) => r.user_id === user.id);
        return {
          id: user.id,
          email: user.email || "Unknown",
          role: userRole?.role as "admin" | "user" | null,
          roleId: userRole?.id || null,
        };
      }) as UserWithRole[];
    },
  });
};

export const useAllUserRoles = () => {
  return useQuery({
    queryKey: ["all-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });
};

export const useAddAdminRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      queryClient.invalidateQueries({ queryKey: ["all-user-roles"] });
      toast.success("Admin role added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add admin role: " + error.message);
    },
  });
};

export const useRemoveAdminRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", roleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      queryClient.invalidateQueries({ queryKey: ["all-user-roles"] });
      toast.success("Admin role removed successfully");
    },
    onError: (error) => {
      toast.error("Failed to remove admin role: " + error.message);
    },
  });
};
