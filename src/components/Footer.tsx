
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <span className="font-bold text-xl text-white">
                Tick3rt
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              🎉 Your party passport to epic events! Design custom NFT tickets, 
              party with confidence, and create memories that last forever. 
              Powered by blockchain magic! ✨
            </p>
            <div className="text-sm text-gray-500">
              © 2024 Tick3rt. All rights reserved. Made with 💜 for party people.
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">🎪 Platform</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/events" className="hover:text-white transition-colors">🎫 Events</Link></li>
              <li><Link to="/create-event" className="hover:text-white transition-colors">🎨 Create Event</Link></li>
              <li><Link to="/my-tickets" className="hover:text-white transition-colors">📱 My Tickets</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">🛒 Marketplace</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">🤝 Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">💬 Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">📧 Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">🔒 Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">📜 Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
