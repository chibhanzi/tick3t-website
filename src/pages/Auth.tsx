import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "user" as "user" | "organizer"
  });

  const { login, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive"
          });
          return;
        }
        success = await register(formData.email, formData.password, formData.name, formData.role);
      }

      if (success) {
        toast({
          title: "Success!",
          description: isLogin ? "Welcome back!" : "Account created successfully!"
        });
        
        // Navigate based on role
        if (formData.role === "organizer" || formData.email.includes("organizer")) {
          navigate("/organizer-dashboard");
        } else {
          navigate(from);
        }
      } else {
        toast({
          title: "Error",
          description: "Authentication failed. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-purple-200 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isLogin ? "🎉 Welcome Back!" : "🚀 Join the Party!"}
              </CardTitle>
              <p className="text-gray-600">
                {isLogin ? "Ready to discover amazing events?" : "Create your account and start exploring!"}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="border-purple-200 focus:border-purple-400"
                      required
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-purple-200 focus:border-purple-400"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="border-purple-200 focus:border-purple-400"
                    required
                  />
                </div>

                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="border-purple-200 focus:border-purple-400"
                        required
                      />
                    </div>

                    <div>
                      <Label>Account Type</Label>
                      <RadioGroup 
                        value={formData.role} 
                        onValueChange={(value: "user" | "organizer") => handleInputChange("role", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="user" id="user" />
                          <Label htmlFor="user">🎫 Event Attendee</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="organizer" id="organizer" />
                          <Label htmlFor="organizer">🎯 Event Organizer</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : isLogin ? "🎊 Sign In" : "🚀 Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-600 hover:text-purple-700"
                >
                  {isLogin ? "Need an account? Sign up!" : "Already have an account? Sign in!"}
                </Button>
              </div>

              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full border-purple-200 hover:bg-purple-50"
                >
                  🦊 Connect with MetaMask
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
