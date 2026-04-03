
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Calendar, MapPin, Download, Shield, Clock, Star } from "lucide-react";
import { useState } from "react";
import QRCodeLib from "qrcode";

const MyTickets = () => {
  const [showQR, setShowQR] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const tickets = [
    {
      id: "1",
      eventTitle: "🎵 Bass Drop Festival 2024",
      eventDate: "March 15, 2024 • 9:00 PM",
      eventLocation: "🌴 Miami Beach Arena",
      ticketNumber: "NFT #00142",
      price: "$89.00",
      status: "valid",
      qrCode: "QR_CODE_DATA_HERE",
      backgroundColor: "#7c3aed",
      textColor: "#ffffff",
      borderColor: "#ec4899",
      features: {
        hasQrCode: true,
        hasTransferProtection: true,
        hasLocationVerification: true,
        hasRoyalties: true,
        royaltyPercentage: 2.5
      },
      mintedFrom: "EQ1234...5678",
      network: "TON"
    },
    {
      id: "2",
      eventTitle: "🎨 Digital Art Rave",
      eventDate: "March 22, 2024 • 10:00 PM",
      eventLocation: "🏙️ Brooklyn Warehouse, NYC",
      ticketNumber: "NFT #00089",
      price: "$125.00",
      status: "used",
      qrCode: "QR_CODE_DATA_HERE",
      backgroundColor: "#0ea5e9",
      textColor: "#ffffff",
      borderColor: "#22c55e",
      features: {
        hasQrCode: true,
        hasTransferProtection: false,
        hasLocationVerification: false,
        hasEarlyAccess: true,
        earlyAccessHours: 2
      },
      mintedFrom: "0x9876...4321",
      network: "Ethereum"
    }
  ];

  const generateQRCode = async (ticketId: string) => {
    try {
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) return;

      const qrData = JSON.stringify({
        ticketId: ticket.id,
        ticketNumber: ticket.ticketNumber,
        eventTitle: ticket.eventTitle,
        eventDate: ticket.eventDate,
        verificationHash: `VERIFY_${ticket.id}_${Date.now()}`,
        timestamp: new Date().toISOString()
      });

      const qrDataUrl = await QRCodeLib.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      setQrDataUrl(qrDataUrl);
      setShowQR(ticketId);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "valid") {
      return <Badge className="bg-green-500 text-white">✅ Valid</Badge>;
    } else if (status === "used") {
      return <Badge variant="secondary">🎟️ Used</Badge>;
    }
    return <Badge variant="destructive">❌ Expired</Badge>;
  };

  const getFeatureBadges = (features: any) => {
    const badges = [];
    if (features.hasQrCode) badges.push(<Badge key="qr" variant="outline" className="text-xs">🔍 QR</Badge>);
    if (features.hasTransferProtection) badges.push(<Badge key="protection" variant="outline" className="text-xs">🛡️ Protected</Badge>);
    if (features.hasLocationVerification) badges.push(<Badge key="location" variant="outline" className="text-xs">📍 Location</Badge>);
    if (features.hasRoyalties) badges.push(<Badge key="royalty" variant="outline" className="text-xs">💰 {features.royaltyPercentage}%</Badge>);
    if (features.hasEarlyAccess) badges.push(<Badge key="early" variant="outline" className="text-xs">⚡ Early</Badge>);
    return badges;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎫 My Party Passport
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your collection of epic memories and upcoming adventures! 🌟
          </p>
        </div>

        {showQR && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowQR(null)}>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4 text-center">Ticket QR Code</h3>
              <div className="flex justify-center mb-4">
                <img src={qrDataUrl} alt="Ticket QR Code" className="border rounded" />
              </div>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Show this QR code at the event entrance
              </p>
              <Button onClick={() => setShowQR(null)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎪</div>
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">No tickets yet!</h2>
            <p className="text-muted-foreground mb-8">Ready to start your party journey?</p>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              🎉 Explore Events
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="border-purple-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Enhanced Ticket Design Preview */}
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
                      <div className="flex items-center text-sm opacity-90 mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        {ticket.eventLocation}
                      </div>
                      
                      {/* Feature badges */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {getFeatureBadges(ticket.features)}
                      </div>
                    </div>
                    <div className="text-right">
                      {ticket.features.hasQrCode && (
                        <QrCode className="h-12 w-12 opacity-80 mb-1" />
                      )}
                      <p className="text-xs opacity-70">{ticket.ticketNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Tick3rt</span>
                      <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                        {ticket.network}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-300 mb-1">{ticket.price}</div>
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>

                  {/* Blockchain verification info */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center justify-between text-xs opacity-70">
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        <span>Minted: {ticket.mintedFrom}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>Verified</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Ticket Actions */}
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {ticket.features.hasQrCode && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-purple-200 hover:bg-purple-50 dark:border-slate-600 dark:hover:bg-slate-700"
                        onClick={() => generateQRCode(ticket.id)}
                      >
                        <QrCode className="h-4 w-4 mr-1" />
                        Show QR
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-purple-200 hover:bg-purple-50 dark:border-slate-600 dark:hover:bg-slate-700"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>

                  {/* Enhanced feature display */}
                  <div className="space-y-2 mb-3">
                    {ticket.features.hasTransferProtection && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3 text-green-500" />
                        Transfer protection enabled
                      </div>
                    )}
                    {ticket.features.hasLocationVerification && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-purple-500" />
                        Location verification required
                      </div>
                    )}
                    {ticket.features.hasEarlyAccess && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3 text-blue-500" />
                        Early access: {ticket.features.earlyAccessHours}h before
                      </div>
                    )}
                  </div>
                  
                  {ticket.status === "valid" && (
                    <Button 
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      size="sm"
                    >
                      🎉 Ready for Event!
                    </Button>
                  )}

                  {ticket.status === "used" && (
                    <Button 
                      variant="outline"
                      className="w-full border-gray-300 dark:border-slate-600"
                      size="sm"
                      disabled
                    >
                      ✅ Event Attended
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
