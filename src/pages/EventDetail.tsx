
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, Clock, Share2, Heart } from "lucide-react";

const EventDetail = () => {
  const { id } = useParams();

  // Mock event data - in a real app, this would be fetched based on ID
  const event = {
    id: "1",
    title: "🎵 Bass Drop Festival 2024",
    date: "March 15, 2024",
    time: "9:00 PM",
    location: "🌴 Miami Beach Arena",
    fullAddress: "1901 Biscayne Blvd, Miami, FL 33132",
    price: "0.05 ETH",
    description: "Get ready for the ultimate electronic music experience! Bass Drop Festival brings together the hottest DJs and producers for a night of non-stop dancing under the Miami stars. 🌟\n\nFeaturing: \n🎧 Skrillex\n🎧 Diplo\n🎧 Marshmello\n🎧 And many more!\n\nThis isn't just a concert - it's a full sensory experience with cutting-edge visuals, interactive art installations, and the best sound system on the East Coast!",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop",
    attendees: 2500,
    category: "🎶 Music Festival",
    available: 150,
    total: 500,
    organizer: "Bass Events Miami",
    tags: ["Electronic", "Dance", "Festival", "Miami", "Outdoor"],
    amenities: ["🍕 Food Trucks", "🍹 Premium Bar", "🚗 Valet Parking", "📱 WiFi", "🛡️ Security"]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-8 h-96">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-white/20 text-white border-white/30">
                {event.category}
              </Badge>
              <Badge className={`${event.available > 0 ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                {event.available > 0 ? `${event.available} left` : 'Sold Out'}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
            <p className="text-white/90 text-lg">by {event.organizer}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info */}
            <Card className="border-purple-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-600">📅 Event Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">{event.date}</p>
                      <p className="text-sm text-gray-600">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">{event.location}</p>
                      <p className="text-sm text-gray-600">{event.fullAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">{event.attendees} attending</p>
                      <p className="text-sm text-gray-600">Join the party!</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Duration: 6 hours</p>
                      <p className="text-sm text-gray-600">All night long!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border-purple-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-600">🎉 About This Event</h2>
                <div className="prose prose-gray max-w-none">
                  {event.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="font-bold mb-3 text-purple-600">🏷️ Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-purple-200 text-purple-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-bold mb-3 text-purple-600">✨ What's Included</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {event.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center text-sm text-gray-600">
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="border-purple-200 sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {event.price}
                  </div>
                  <p className="text-gray-600">per NFT ticket</p>
                </div>

                <div className="space-y-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3"
                    disabled={event.available === 0}
                  >
                    {event.available === 0 ? '😭 Sold Out' : '🎫 Buy Ticket Now!'}
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 border-purple-200 hover:bg-purple-50">
                      <Heart className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" className="flex-1 border-purple-200 hover:bg-purple-50">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    🔒 Secure blockchain transaction
                    <br />
                    💎 Your NFT ticket, your ownership
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="border-purple-200">
              <CardContent className="p-6">
                <h3 className="font-bold mb-3 text-purple-600">🎟️ Ticket Availability</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Tickets</span>
                    <span className="font-medium">{event.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sold</span>
                    <span className="font-medium">{event.total - event.available}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available</span>
                    <span className="font-medium text-green-600">{event.available}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                      style={{ width: `${((event.total - event.available) / event.total) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
