import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, ArrowLeft, Apple, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);
const nameSchema = z.string().trim().min(2, "Name must be at least 2 characters").max(80);
const businessSchema = z.string().trim().min(2, "Business name is required").max(120);

type Mode = "signin" | "signup" | "forgot";

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isOrganizer, signIn, signUp, signInWithOAuth, requestPasswordReset } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<Mode>("signin");
  const [accountType, setAccountType] = useState<"attendee" | "organizer">("attendee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isOrganizer ? "/organizer-dashboard" : "/events", { replace: true });
    }
  }, [isAuthenticated, isOrganizer, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailParsed = emailSchema.safeParse(email);
    if (!emailParsed.success) return toast({ title: "Invalid email", description: emailParsed.error.errors[0].message, variant: "destructive" });
    if (!password) return toast({ title: "Password required", variant: "destructive" });

    setLoading(true);
    const { error } = await signIn(emailParsed.data, password, accountType === "organizer" ? "organizer" : "user");
    setLoading(false);
    if (error) {
      const friendly = /invalid login|invalid credentials/i.test(error)
        ? "Email or password is incorrect."
        : /email not confirmed/i.test(error)
          ? "Please confirm your email before signing in."
          : error;
      return toast({ title: "Sign in failed", description: friendly, variant: "destructive" });
    }
    toast({ title: `Welcome back!`, description: accountType === "organizer" ? "Signed in as Organizer." : "Signed in as Attendee." });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameParsed = nameSchema.safeParse(name);
    const emailParsed = emailSchema.safeParse(email);
    const passParsed = passwordSchema.safeParse(password);
    const isOrg = accountType === "organizer";
    const bizParsed = isOrg ? businessSchema.safeParse(businessName) : { success: true as const, data: undefined };

    const firstErr = [nameParsed, emailParsed, passParsed, bizParsed].find((r) => !r.success);
    if (firstErr && !firstErr.success) {
      return toast({ title: "Check your details", description: firstErr.error.errors[0].message, variant: "destructive" });
    }

    setLoading(true);
    const { error, needsConfirmation } = await signUp({
      email: emailParsed.success ? emailParsed.data : email,
      password,
      displayName: nameParsed.success ? nameParsed.data : name,
      role: isOrg ? "organizer" : "user",
      businessName: isOrg && bizParsed.success ? (bizParsed.data as string) : undefined,
    });
    setLoading(false);

    if (error) {
      const friendly = /already registered|already exists/i.test(error)
        ? "An account with this email already exists. Try signing in instead."
        : error;
      return toast({ title: "Sign up failed", description: friendly, variant: "destructive" });
    }
    if (needsConfirmation) {
      setConfirmationSent(true);
      return;
    }
    toast({ title: "Account created", description: "Welcome to Tick3t!" });
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setOauthLoading(provider);
    const { error } = await signInWithOAuth(provider);
    setOauthLoading(null);
    if (error) toast({ title: "Sign-in failed", description: error, variant: "destructive" });
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return toast({ title: "Invalid email", variant: "destructive" });
    setLoading(true);
    const { error } = await requestPasswordReset(parsed.data);
    setLoading(false);
    if (error) return toast({ title: "Could not send reset email", description: error, variant: "destructive" });
    setResetSent(true);
  };

  const isOrg = accountType === "organizer";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </div>

          {confirmationSent ? (
            <ConfirmationNotice email={email} onBack={() => { setConfirmationSent(false); setMode("signin"); }} />
          ) : mode === "forgot" ? (
            <Card className="border-border/60 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
                <CardDescription>
                  {resetSent
                    ? "Check your inbox for a password reset link."
                    : "Enter the email tied to your account and we'll send you a reset link."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resetSent ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                      <p className="text-sm">We sent a reset link to <span className="font-medium">{email}</span>.</p>
                    </div>
                    <Button className="w-full" onClick={() => { setResetSent(false); setMode("signin"); }}>Back to sign in</Button>
                  </div>
                ) : (
                  <form onSubmit={handleReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <Input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <Button type="submit" className="h-11 w-full" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
                    </Button>
                    <Button type="button" variant="ghost" className="w-full" onClick={() => setMode("signin")}>Back to sign in</Button>
                  </form>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/60 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  {mode === "signin" ? "Welcome back" : isOrg ? "Create organizer account" : "Create your account"}
                </CardTitle>
                <CardDescription>
                  {mode === "signin"
                    ? "Sign in to buy tickets, resell safely, or run events."
                    : isOrg
                      ? "Run events, sell tickets, get verified, and withdraw via Paynow."
                      : "Buy tickets, manage resales, and never miss a drop."}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
                  {(["google", "apple"] as const).map((p) => (
                    <Button
                      key={p}
                      type="button"
                      variant="outline"
                      className="h-11 bg-background"
                      onClick={() => handleOAuth(p)}
                      disabled={!!oauthLoading || loading}
                    >
                      {oauthLoading === p ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : p === "google" ? (
                        <GoogleIcon />
                      ) : (
                        <Apple className="h-4 w-4" />
                      )}
                      <span className="ml-2">{p === "google" ? "Google" : "Apple"}</span>
                    </Button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs uppercase text-muted-foreground">or with email</span>
                  <Separator className="flex-1" />
                </div>

                <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="mt-6">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Sign in as</Label>
                        <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
                          <button
                            type="button"
                            onClick={() => setAccountType("attendee")}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${accountType === "attendee" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                          >
                            Attendee
                          </button>
                          <button
                            type="button"
                            onClick={() => setAccountType("organizer")}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${accountType === "organizer" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                          >
                            Organizer
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <Input id="signin-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                      </div>
                      <PasswordField id="signin-pass" value={password} onChange={setPassword} show={showPassword} toggle={() => setShowPassword(!showPassword)} autoComplete="current-password" />
                      <div className="flex justify-end">
                        <button type="button" className="text-xs text-muted-foreground hover:text-foreground" onClick={() => { setResetSent(false); setMode("forgot"); }}>
                          Forgot password?
                        </button>
                      </div>
                      <Button type="submit" className="h-11 w-full" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : accountType === "organizer" ? "Sign in as Organizer" : "Sign in as Attendee"}
                      </Button>
                    </form>
                  </TabsContent>


                  <TabsContent value="signup" className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
                      <button
                        type="button"
                        onClick={() => setAccountType("attendee")}
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${accountType === "attendee" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        I'm an Attendee
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType("organizer")}
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${accountType === "organizer" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        I'm an Organizer
                      </button>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Display name</Label>
                        <Input id="signup-name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
                      </div>
                      {isOrg && (
                        <div className="space-y-2">
                          <Label htmlFor="signup-biz">Business / event brand name</Label>
                          <Input id="signup-biz" placeholder="e.g. Shoko Festival" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required maxLength={120} />
                          <p className="text-xs text-muted-foreground">You'll get a Verified Organizer badge after we review your business.</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                      </div>
                      <PasswordField id="signup-pass" value={password} onChange={setPassword} show={showPassword} toggle={() => setShowPassword(!showPassword)} placeholder="At least 8 characters" autoComplete="new-password" />
                      <Button type="submit" className="h-11 w-full" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isOrg ? "Create organizer account" : "Create account"}
                      </Button>
                      <p className="text-center text-xs text-muted-foreground">
                        By continuing you agree to the Terms and Privacy Policy.
                      </p>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const ConfirmationNotice = ({ email, onBack }: { email: string; onBack: () => void }) => (
  <Card className="border-border/60 shadow-xl">
    <CardHeader className="text-center">
      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-6 w-6 text-primary" />
      </div>
      <CardTitle>Confirm your email</CardTitle>
      <CardDescription>
        We sent a confirmation link to <span className="font-medium">{email}</span>. Click the link to activate your account.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Button className="w-full" onClick={onBack}>Back to sign in</Button>
    </CardContent>
  </Card>
);

const PasswordField = ({ id, value, onChange, show, toggle, placeholder = "Enter your password", autoComplete }: {
  id: string; value: string; onChange: (v: string) => void; show: boolean; toggle: () => void; placeholder?: string; autoComplete?: string;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>Password</Label>
    <div className="relative">
      <Input id={id} type={show ? "text" : "password"} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required autoComplete={autoComplete} />
      <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={toggle}>
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  </div>
);

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.26 1.06-3.71 1.06-2.85 0-5.27-1.92-6.13-4.51H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.87 14.14c-.22-.66-.35-1.36-.35-2.14s.13-1.48.35-2.14V7.02H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.98l3.69-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.02l3.69 2.84C6.73 7.3 9.15 5.38 12 5.38z" />
  </svg>
);

export default Auth;
