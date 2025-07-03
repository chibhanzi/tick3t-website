
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Bell, CheckCircle } from "lucide-react";

interface WaitlistComponentProps {
  eventTitle: string;
  eventDate: string;
  waitlistPosition?: number;
  totalWaitlist?: number;
}

const WaitlistComponent = ({ 
  eventTitle, 
  eventDate, 
  waitlistPosition = 0, 
  totalWaitlist = 0 
}: WaitlistComponentProps) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isJoined, setIsJoined] = useState(waitlistPosition > 0);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });

  const handleJoinWaitlist = () => {
    if (email) {
      setIsJoined(true);
      // In real app, this would make an API call
      console.log("Joining waitlist with:", { email, phone, notifications });
    }
  };

  if (isJoined) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <CheckCircle className="h-5 w-5" />
            You're on the Waitlist!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Your Position</p>
                <p className="text-2xl font-bold text-green-600">#{waitlistPosition || 23}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Total Waitlist</p>
                <p className="text-2xl font-bold text-muted-foreground">{totalWaitlist || 156}</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-blue-500" />
                <span className="font-medium">We'll notify you when:</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Tickets become available</li>
                <li>• You move up in the waitlist</li>
                <li>• 24 hours before the event</li>
              </ul>
            </div>

            <Button variant="outline" className="w-full">
              Share with Friends to Move Up
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Event Sold Out - Join Waitlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <Users className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="font-medium">Don't miss out!</p>
              <p className="text-sm text-muted-foreground">
                {totalWaitlist || 156} people are already waiting. Join now for the best chance.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="waitlist-email">Email Address *</Label>
              <Input
                id="waitlist-email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="waitlist-phone">Phone Number (Optional)</Label>
              <Input
                id="waitlist-phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Notification Preferences</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge 
                  variant={notifications.email ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setNotifications({...notifications, email: !notifications.email})}
                >
                  📧 Email
                </Badge>
                <Badge 
                  variant={notifications.sms ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                >
                  📱 SMS
                </Badge>
                <Badge 
                  variant={notifications.push ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setNotifications({...notifications, push: !notifications.push})}
                >
                  🔔 Push
                </Badge>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleJoinWaitlist} 
            disabled={!email}
            className="w-full"
          >
            Join Waitlist
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            We'll notify you immediately if tickets become available
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaitlistComponent;
