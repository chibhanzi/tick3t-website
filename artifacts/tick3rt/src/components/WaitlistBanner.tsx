
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Users } from "lucide-react";
import { useState } from "react";

const WaitlistBanner = () => {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoinWaitlist = () => {
    if (email) {
      setJoined(true);
      setTimeout(() => setJoined(false), 3000);
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 dark:from-orange-600 dark:via-red-600 dark:to-purple-700 text-white p-4 text-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-400/30 via-red-400/30 to-purple-500/30 dark:from-orange-500/20 dark:via-red-500/20 dark:to-purple-600/20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 rounded-full opacity-20 dark:opacity-15 animate-bounce animation-delay-1000"></div>
        <div className="absolute bottom-0 left-8 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-400 dark:from-cyan-500 dark:to-blue-500 rounded-full opacity-20 dark:opacity-15 animate-bounce animation-delay-2000"></div>
        <div className="absolute top-4 left-1/3 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 dark:from-yellow-500 dark:to-orange-500 rounded-full opacity-15 dark:opacity-10 animate-pulse animation-delay-1500"></div>
      </div>
      
      {/* Color Flow Animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-purple-600/30 dark:via-purple-600/10 dark:to-purple-700/30 animate-pulse animation-delay-500"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Bell className="h-5 w-5 animate-pulse" />
          <span className="font-semibold">Concert Series 2024 - Almost Sold Out!</span>
        </div>
        <div className="flex items-center justify-center space-x-3 max-w-md mx-auto">
          <div className="flex items-center space-x-1 text-sm">
            <Users className="h-4 w-4 animate-pulse animation-delay-200" />
            <span>1,247 waiting</span>
          </div>
          {!joined ? (
            <>
              <Input
                type="email"
                placeholder="Enter email for updates"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-black dark:text-white text-sm h-8 border-white/30 dark:border-white/20 bg-white/90 dark:bg-white/10 focus:border-purple-300 dark:focus:border-purple-400 transition-all duration-300"
              />
              <Button 
                onClick={handleJoinWaitlist}
                size="sm" 
                className="bg-white/90 dark:bg-white/20 text-purple-600 dark:text-purple-300 hover:bg-white dark:hover:bg-white/30 hover:text-purple-700 dark:hover:text-purple-200 h-8 transition-all duration-300 hover:scale-105"
              >
                Join Waitlist
              </Button>
            </>
          ) : (
            <div className="text-sm font-medium animate-pulse">✅ You're on the waitlist!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitlistBanner;
