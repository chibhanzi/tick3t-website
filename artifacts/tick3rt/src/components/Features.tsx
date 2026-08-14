
import { QrCode, Shield, Users, Repeat, Palette, BarChart3, Globe, Smartphone } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Every ticket is an NFT stored on the blockchain, ensuring authenticity and preventing counterfeiting."
    },
    {
      icon: Palette,
      title: "Custom Ticket Design",
      description: "Design unique, branded tickets with our advanced editor. Make every event memorable."
    },
    {
      icon: QrCode,
      title: "Instant Verification",
      description: "QR code scanning with real-time blockchain verification for seamless venue entry."
    },
    {
      icon: Repeat,
      title: "Smart Resale",
      description: "Built-in marketplace with automatic royalties and fraud protection for secondary sales."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights on sales, attendance, and audience demographics for organizers."
    },
    {
      icon: Globe,
      title: "Multi-Chain Support",
      description: "Support for TON, Polygon, Base, and other major blockchains for maximum accessibility."
    },
    {
      icon: Smartphone,
      title: "Mobile-First",
      description: "Optimized for mobile with offline ticket storage and push notifications."
    },
    {
      icon: Users,
      title: "Community Features",
      description: "Connect attendees, share experiences, and build lasting communities around events."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Why Choose Tick3rt?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The most advanced ticketing platform with cutting-edge features that set the industry standard.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
