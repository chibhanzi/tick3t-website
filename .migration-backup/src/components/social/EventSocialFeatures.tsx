
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Star, Users, Send, ThumbsUp } from "lucide-react";

interface EventSocialFeaturesProps {
  eventId: string;
  eventTitle: string;
}

const EventSocialFeatures = ({ eventId, eventTitle }: EventSocialFeaturesProps) => {
  const [liked, setLiked] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const attendees = [
    { id: "1", name: "Sarah Chen", avatar: "", attending: true },
    { id: "2", name: "Mike Johnson", avatar: "", attending: true },
    { id: "3", name: "Emma Davis", avatar: "", attending: false, interested: true }
  ];

  const reviews = [
    {
      id: "1",
      user: "Alex Rivera",
      rating: 5,
      comment: "Amazing event! Great networking opportunities.",
      date: "2 days ago"
    },
    {
      id: "2", 
      user: "Jordan Kim",
      rating: 4,
      comment: "Well organized and informative sessions.",
      date: "1 week ago"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Who's Going */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Who's Going ({attendees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex -space-x-2 mb-4">
            {attendees.slice(0, 5).map((attendee) => (
              <Avatar key={attendee.id} className="border-2 border-white">
                <AvatarImage src={attendee.avatar} />
                <AvatarFallback>{attendee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            ))}
            {attendees.length > 5 && (
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 border-2 border-white text-sm font-medium">
                +{attendees.length - 5}
              </div>
            )}
          </div>
          <div className="space-y-2">
            {attendees.slice(0, 3).map((attendee) => (
              <div key={attendee.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{attendee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{attendee.name}</span>
                </div>
                <Badge variant={attendee.attending ? "default" : "secondary"}>
                  {attendee.attending ? "Going" : "Interested"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Reviews & Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{review.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{review.user}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">{review.date}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Helpful
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Review */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Add Your Review</h4>
            <div className="flex items-center gap-1 mb-3">
              <span className="text-sm">Rating:</span>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`h-4 w-4 cursor-pointer ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => setRating(i + 1)}
                />
              ))}
            </div>
            <Textarea 
              placeholder="Share your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="mb-3"
            />
            <Button size="sm">
              <Send className="h-3 w-3 mr-1" />
              Post Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventSocialFeatures;
