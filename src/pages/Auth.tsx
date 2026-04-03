
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let success = false;

      // If organizer toggle is on, append a flag to the email for the mock auth
      const authEmail = isOrganizer && !isLogin ? `organizer+${email}` : email;

      if (isLogin) {
        success = await login(authEmail, password);
      } else {
        success = await register(authEmail, password, name);
      }

      if (success) {
        toast({
          title: isLogin ? "Welcome back!" : "Account created!",
          description: isLogin
            ? "You have successfully logged in."
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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
            </Link>
          </div>

          <Card className="shadow-xl border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription>
                {isLogin ? "Sign in to your account" : "Get started with Tick3rt"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs value={isLogin ? "login" : "register"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" onClick={() => setIsLogin(true)}>Sign In</TabsTrigger>
                  <TabsTrigger value="register" onClick={() => setIsLogin(false)}>Sign Up</TabsTrigger>
                </TabsList>

                {/* Login */}
                <TabsContent value="login" className="space-y-4 mt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <PasswordField id="login-pass" value={password} onChange={setPassword} show={showPassword} toggle={() => setShowPassword(!showPassword)} />
                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? "Signing In…" : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Register */}
                <TabsContent value="register" className="space-y-4 mt-6">
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

                    {/* Organizer toggle */}
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium text-sm">Sign up as Organizer</p>
                        <p className="text-xs text-muted-foreground">Create and manage your own events</p>
                      </div>
                      <Switch checked={isOrganizer} onCheckedChange={setIsOrganizer} />
                    </div>

                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
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

/* Reusable password field */
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
