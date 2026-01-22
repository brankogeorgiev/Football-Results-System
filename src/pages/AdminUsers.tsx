import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, ShieldOff, ShieldPlus, Mail } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useAddAdminRole, useRemoveAdminRole } from "@/hooks/useUserRoles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserWithRole {
  id: string;
  email: string;
  role: "admin" | "user" | null;
  roleId: string | null;
}

const useUsersWithRoles = () => {
  return useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("get-users", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;
      return response.data as UserWithRole[];
    },
  });
};

const AdminUsers = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { data: users, isLoading: usersLoading } = useUsersWithRoles();
  const addAdminRole = useAddAdminRole();
  const removeAdminRole = useRemoveAdminRole();

  const handleAddAdmin = async (userId: string) => {
    try {
      await addAdminRole.mutateAsync(userId);
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRemoveAdmin = (roleId: string, userId: string) => {
    if (userId === user?.id) {
      toast.error(t("cannotRemoveOwnAdmin"));
      return;
    }
    removeAdminRole.mutate(roleId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      },
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <main className="container max-w-lg mx-auto px-4 py-6">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-48 w-full" />
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <main className="container max-w-lg mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            {t("back")}
          </Button>
          <div className="text-center py-12">
            <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">{t("adminAccessRequired")}</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  const admins = users?.filter((u) => u.role === "admin") || [];
  const nonAdmins = users?.filter((u) => u.role !== "admin") || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("back")}
          </Button>
        </div>

        <h2 className="font-display font-bold text-xl text-foreground mb-6">
          {t("manageAdmins")}
        </h2>

        {/* Current Admins */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              {t("currentAdmins")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : admins.length > 0 ? (
              <div className="space-y-3">
                {admins.map((adminUser) => (
                  <div
                    key={adminUser.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[180px]">
                          {adminUser.email}
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          {t("admin")}
                        </Badge>
                      </div>
                    </div>
                    {adminUser.id !== user?.id && adminUser.roleId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAdmin(adminUser.roleId!, adminUser.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <ShieldOff className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                {t("noAdmins")}
              </p>
            )}
          </CardContent>
        </Card>

        {/* All Users - Add Admin */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              {t("allUsers")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : nonAdmins.length > 0 ? (
              <div className="space-y-3">
                {nonAdmins.map((nonAdmin) => (
                  <div
                    key={nonAdmin.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium truncate max-w-[180px]">
                        {nonAdmin.email}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddAdmin(nonAdmin.id)}
                      className="gap-1"
                      disabled={addAdminRole.isPending}
                    >
                      <ShieldPlus className="w-4 h-4" />
                      {t("makeAdmin")}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                {t("noOtherUsers")}
              </p>
            )}
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default AdminUsers;
