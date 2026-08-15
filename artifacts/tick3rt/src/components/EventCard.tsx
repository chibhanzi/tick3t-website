
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Ticket, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { waitlistSeed } from "@/contexts/WaitlistContext";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  price: string;
  image: string;
  attendees: number;
  category: string;
  available: number;
  total: number;
}

const EventCard = ({ 
  id, title, date, location, price, image, 
  attendees, category, available, total 
}: EventCardProps) => {
  const soldOut = available === 0;
  const isTrending = attendees > 1000;
  const isAlmostGone = available > 0 && available < 100;

  // Countdown to event
  const countdown = useMemo(() => {
    const clean = date.replace(/•.*$/, '').trim();
    const eventDate = new Date(clean);
    if (isNaN(eventDate.getTime())) return null;
    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 30) return null;
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days left`;
  }, [date]);
  
  const formatPrice = (priceStr: string) => {
    const cleanPrice = priceStr.replace(/[^\d.,]/g, '');
    if (!isNaN(parseFloat(cleanPrice))) {
      return `$${parseFloat(cleanPrice).toFixed(2)}`;
    }
    if (priceStr.startsWith('$')) return priceStr;
    return `$${priceStr}`;
  };
  
  return (
    <Card className="overflow-hidden group bg-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
      <div className="relative h-32 lg:h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <Badge variant="secondary" className="bg-background/90 text-xs">
            {category}
          </Badge>
          {isTrending && (
            <Badge className="bg-orange-500/90 text-white border-0 text-[10px] gap-0.5">
              <TrendingUp className="h-3 w-3" />
              Trending
            </Badge>
          )}
        </div>
        {countdown && !soldOut && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary/90 text-primary-foreground border-0 text-[10px] gap-0.5">
              <Clock className="h-3 w-3" />
              {countdown}
            </Badge>
          </div>
        )}
        {soldOut && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1.5">
            <Badge variant="destructive" className="text-sm px-3 py-1">
              Sold Out
            </Badge>
            <Badge className="bg-amber-500/90 text-white border-0 text-[10px] gap-1">
              🕐 {waitlistSeed(id)} waiting
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-3 lg:p-6 flex-1 flex flex-col">
        <h3 className="font-bold text-sm lg:text-xl mb-2 lg:mb-3 text-foreground line-clamp-2 flex-shrink-0">
          {title}
        </h3>
        
        <div className="space-y-1 lg:space-y-2 mb-3 lg:mb-4 flex-1">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 flex-shrink-0" />
            <span className="text-xs lg:text-sm truncate">{date}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 flex-shrink-0" />
            <span className="text-xs lg:text-sm truncate">{location}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 flex-shrink-0" />
            <span className="text-xs lg:text-sm">{attendees.toLocaleString()} going</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3 lg:mb-4 flex-shrink-0">
          <div className="flex items-center">
            <Ticket className="h-3 w-3 lg:h-4 lg:w-4 mr-1 text-primary flex-shrink-0" />
            <span className="text-xs lg:text-sm text-muted-foreground">
              {available}/{total}
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg lg:text-2xl font-bold text-primary">
              {formatPrice(price)}
            </div>
          </div>
        </div>
        
        <Link to={`/event/${id}`} className="flex-shrink-0">
          <Button
            className={`w-full text-xs lg:text-sm h-8 lg:h-10 ${soldOut ? "bg-amber-500 hover:bg-amber-600 text-white border-0" : ""}`}
            variant={soldOut ? "default" : "default"}
          >
            {soldOut ? "Join Waitlist" : "Get Ticket"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default EventCard;
