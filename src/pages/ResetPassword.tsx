import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Loader2 } from "lucide-react";

const passwordSchema = z.string().min(8, "At least 8 characters").max(72);

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [canReset, setCanReset] = useState(false);

  useEffect(() => {
    // Supabase puts a recovery session in the hash. The auth listener will pick it up.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setCanReset(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) setCanReset(true); });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) return toast({ title: "Weak password", description: parsed.error.errors[0].message, variant: "destructive" });
    if (password !== confirm) return toast({ title: "Passwords do not match", variant: "destructive" });

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data });
    setLoading(false);
    if (error) return toast({ title: "Could not update password", description: error.message, variant: "destructive" });
    toast({ title: "Password updated", description: "You're signed in with your new password." });
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="mb-6">
            <Link to="/auth" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to sign in
            </Link>
          </div>
          <Card className="border-border/60 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Set new password</CardTitle>
              <CardDescription>
                {canReset ? "Choose a strong password (at least 8 characters)." : "Open this page from the reset link in your email."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-pass">New password</Label>
                  <Input id="new-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={!canReset} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-pass">Confirm password</Label>
                  <Input id="confirm-pass" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required disabled={!canReset} />
                </div>
                <Button type="submit" className="h-11 w-full" disabled={loading || !canReset}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
