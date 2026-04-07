import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState<"attendee" | "organizer">("attendee");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const { toast } = useToast();

  const isOrganizer = accountType === "organizer";

  const buildAuthEmail = (rawEmail: string) => {
    if (!isOrganizer) return rawEmail;
    return /(organizer|admin|event|host|creator)/i.test(rawEmail) ? rawEmail : `organizer+${rawEmail}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authEmail = buildAuthEmail(email);
      const success = isLogin
        ? await login(authEmail, password)
        : await register(authEmail, password, name);

      if (success) {
        toast({
          title: isLogin ? "Welcome back!" : "Account created!",
          description: isLogin
            ? isOrganizer
              ? "You are now entering the organizer dashboard."
              : "You have successfully logged in."
            : isOrganizer
              ? "Your organizer account is ready."
              : "Your account has been created.",
        });
      } else {
        toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

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

          <Card className="border-border/60 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {isLogin ? (isOrganizer ? "Organizer Sign In" : "Welcome Back") : (isOrganizer ? "Create Organizer Account" : "Create Account")}
              </CardTitle>
              <CardDescription>
                {isLogin
                  ? isOrganizer
                    ? "Access events, payouts, ticket tools, and attendee management."
                    : "Sign in to browse, buy, resell, and manage tickets."
                  : isOrganizer
                    ? "Set up your event operations and start selling tickets."
                    : "Create an account for buying tickets and resale activity."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="mb-6 space-y-3">
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => setAccountType("attendee")}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${accountType === "attendee" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Ticket Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType("organizer")}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${accountType === "organizer" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Event Organizer
                  </button>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
                  {isOrganizer
                    ? "Organizer mode takes you straight to the organizer dashboard and tools after sign in."
                    : "Buyer mode keeps things focused on finding events, purchasing tickets, and resale management."}
                </div>
              </div>

              <Tabs value={isLogin ? "login" : "register"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" onClick={() => setIsLogin(true)}>Sign In</TabsTrigger>
                  <TabsTrigger value="register" onClick={() => setIsLogin(false)}>Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-6 space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <PasswordField id="login-pass" value={password} onChange={setPassword} show={showPassword} toggle={() => setShowPassword(!showPassword)} />
                    <Button type="submit" className="h-11 w-full" disabled={isLoading}>
                      {isLoading ? "Signing In…" : isOrganizer ? "Continue to Organizer Dashboard" : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="mt-6 space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input id="reg-name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input id="reg-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <PasswordField id="reg-pass" value={password} onChange={setPassword} show={showPassword} toggle={() => setShowPassword(!showPassword)} placeholder="Create a password" />
                    <Button type="submit" className="h-11 w-full" disabled={isLoading}>
                      {isLoading ? "Creating Account…" : isOrganizer ? "Create Organizer Account" : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const PasswordField = ({ id, value, onChange, show, toggle, placeholder = "Enter your password" }: {
  id: string; value: string; onChange: (v: string) => void; show: boolean; toggle: () => void; placeholder?: string;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>Password</Label>
    <div className="relative">
      <Input id={id} type={show ? "text" : "password"} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required />
      <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={toggle}>
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  </div>
);

export default Auth;
