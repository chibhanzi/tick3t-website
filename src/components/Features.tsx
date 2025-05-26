
import { QrCode, Shield, Users, Repeat } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Blockchain technology ensures every ticket is authentic and cannot be counterfeited or duplicated."
    },
    {
      icon: QrCode,
      title: "Easy Check-in",
      description: "Quick QR code scanning at venues with instant blockchain verification for seamless entry."
    },
    {
      icon: Repeat,
      title: "Resale Marketplace",
      description: "Trade tickets securely with built-in royalties for event organizers and fraud protection."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Connect with other attendees, create memories, and build lasting relationships in the community."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blockchain-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Why Choose TicketChain?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the next generation of event ticketing with blockchain-powered security and transparency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-16 h-16 bg-neon-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
