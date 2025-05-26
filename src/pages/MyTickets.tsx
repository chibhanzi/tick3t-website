
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Calendar, MapPin, Download } from "lucide-react";

const MyTickets = () => {
  const tickets = [
    {
      id: "1",
      eventTitle: "🎵 Bass Drop Festival 2024",
      eventDate: "March 15, 2024 • 9:00 PM",
      eventLocation: "🌴 Miami Beach Arena",
      ticketNumber: "NFT #00142",
      status: "valid",
      qrCode: "QR_CODE_DATA_HERE",
      backgroundColor: "#7c3aed",
      textColor: "#ffffff",
      borderColor: "#ec4899"
    },
    {
      id: "2",
      eventTitle: "🎨 Digital Art Rave",
      eventDate: "March 22, 2024 • 10:00 PM",
      eventLocation: "🏙️ Brooklyn Warehouse, NYC",
      ticketNumber: "NFT #00089",
      status: "used",
      qrCode: "QR_CODE_DATA_HERE",
      backgroundColor: "#0ea5e9",
      textColor: "#ffffff",
      borderColor: "#22c55e"
    }
  ];

  const getStatusBadge = (status: string) => {
    if (status === "valid") {
      return <Badge className="bg-green-500 text-white">✅ Valid</Badge>;
    } else if (status === "used") {
      return <Badge variant="secondary">🎟️ Used</Badge>;
    }
    return <Badge variant="destructive">❌ Expired</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎫 My Party Passport
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your collection of epic memories and upcoming adventures! 🌟
          </p>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎪</div>
            <h2 className="text-2xl font-bold text-gray-600 mb-4">No tickets yet!</h2>
            <p className="text-gray-500 mb-8">Ready to start your party journey?</p>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              🎉 Explore Events
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="border-purple-200 overflow-hidden">
                {/* Ticket Design Preview */}
                <div 
                  className="p-6 text-white relative"
                  style={{
                    background: `linear-gradient(135deg, ${ticket.backgroundColor}, ${ticket.borderColor})`,
                    color: ticket.textColor
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{ticket.eventTitle}</h3>
                      <div className="flex items-center text-sm opacity-90 mb-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {ticket.eventDate}
                      </div>
                      <div className="flex items-center text-sm opacity-90">
                        <MapPin className="h-3 w-3 mr-1" />
                        {ticket.eventLocation}
                      </div>
                    </div>
                    <div className="text-right">
                      <QrCode className="h-12 w-12 opacity-80 mb-1" />
                      <p className="text-xs opacity-70">{ticket.ticketNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Tick3rt</span>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>
                </div>

                {/* Ticket Actions */}
                <CardContent className="p-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-purple-200 hover:bg-purple-50"
                    >
                      <QrCode className="h-4 w-4 mr-1" />
                      Show QR
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-purple-200 hover:bg-purple-50"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  
                  {ticket.status === "valid" && (
                    <Button 
                      className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      size="sm"
                    >
                      🎉 Ready for Event!
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyTickets;
