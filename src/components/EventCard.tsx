
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Ticket } from "lucide-react";

interface EventCardProps {
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
    <Card className="ticket-card overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-700">
            {category}
          </Badge>
        </div>
        {soldOut && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              Sold Out
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2">
          {title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm">{attendees} attending</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Ticket className="h-4 w-4 mr-1 text-neon-600" />
            <span className="text-sm text-gray-600">
              {available}/{total} available
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{price}</div>
            <div className="text-xs text-gray-500">per ticket</div>
          </div>
        </div>
        
        <Button 
          className={`w-full ${soldOut 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-neon-gradient hover:opacity-90'
          } text-white`}
          disabled={soldOut}
        >
          {soldOut ? 'Sold Out' : 'Buy Ticket'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
