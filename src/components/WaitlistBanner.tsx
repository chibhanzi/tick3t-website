
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
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 text-center">
      <div className="container mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Bell className="h-5 w-5" />
          <span className="font-semibold">Concert Series 2024 - Almost Sold Out!</span>
        </div>
        <div className="flex items-center justify-center space-x-3 max-w-md mx-auto">
          <div className="flex items-center space-x-1 text-sm">
            <Users className="h-4 w-4" />
            <span>1,247 waiting</span>
          </div>
          {!joined ? (
            <>
              <Input
                type="email"
                placeholder="Enter email for updates"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-black text-sm h-8"
              />
              <Button 
                onClick={handleJoinWaitlist}
                size="sm" 
                className="bg-white text-orange-600 hover:bg-gray-100 h-8"
              >
                Join Waitlist
              </Button>
            </>
          ) : (
            <div className="text-sm font-medium">✅ You're on the waitlist!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitlistBanner;
