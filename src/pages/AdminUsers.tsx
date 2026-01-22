import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, ShieldOff, UserPlus, Mail } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useAllUserRoles, useAddAdminRole, useRemoveAdminRole } from "@/hooks/useUserRoles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { data: userRoles, isLoading: rolesLoading } = useAllUserRoles();
  const addAdminRole = useAddAdminRole();
  const removeAdminRole = useRemoveAdminRole();
  
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    
    setIsAdding(true);
    try {
      // Look up user by email using RPC or direct query
      const { data: users, error } = await supabase
        .from("user_roles")
        .select("user_id")
        .limit(1);
      
      // We need to find the user by email - check auth.users via edge function or different approach
      // For now, we'll use a workaround by asking for the user ID directly
      toast.error("To add an admin, the user must first sign up. Then you can add them by their user ID.");
      setNewAdminEmail("");
    } catch (error) {
      toast.error("Failed to add admin");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveAdmin = (roleId: string, userId: string) => {
    if (userId === user?.id) {
      toast.error("You cannot remove your own admin role");
      return;
    }
    removeAdminRole.mutate(roleId);
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
            {rolesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : userRoles && userRoles.length > 0 ? (
              <div className="space-y-3">
                {userRoles
                  .filter((role) => role.role === "admin")
                  .map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[180px]">
                            {role.user_id}
                          </p>
                          <Badge variant="secondary" className="mt-1">
                            {t("admin")}
                          </Badge>
                        </div>
                      </div>
                      {role.user_id !== user?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAdmin(role.id, role.user_id)}
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

        {/* Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p>{t("adminInfo")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default AdminUsers;
