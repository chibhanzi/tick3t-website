
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

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
  id,
  title, 
  date, 
  location, 
  price, 
  image, 
  attendees, 
  category, 
  available, 
  total 
}: EventCardProps) => {
  const soldOut = available === 0;
  
  return (
    <Card className="overflow-hidden group bg-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
      <div className="relative h-32 lg:h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-background/90 text-xs">
            {category}
          </Badge>
        </div>
        {soldOut && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm px-3 py-1">
              Sold Out
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
          <div className="hidden lg:flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm">{attendees} attending</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3 lg:mb-4 flex-shrink-0">
          <div className="flex items-center">
            <Ticket className="h-3 w-3 lg:h-4 lg:w-4 mr-1 text-blue-600 flex-shrink-0" />
            <span className="text-xs lg:text-sm text-muted-foreground">
              {available}/{total}
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{price}</div>
          </div>
        </div>
        
        <Link to={`/event/${id}`} className="flex-shrink-0">
          <Button 
            className={`w-full text-xs lg:text-sm h-8 lg:h-10 ${soldOut 
              ? 'bg-muted cursor-not-allowed text-muted-foreground' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
            }`}
            disabled={soldOut}
          >
            {soldOut ? 'Sold Out' : 'Get Ticket'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default EventCard;
