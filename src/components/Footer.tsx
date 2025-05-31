
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/lovable-uploads/dace9951-9667-4cb7-8c3f-4160753e1a11.png" 
                alt="Tick3rt" 
                className="h-12 w-auto transition-transform duration-300 hover:scale-110"
              />
            </div>
            <p className="text-slate-300 mb-6 max-w-md text-lg leading-relaxed">
              The future of event ticketing. Secure, transparent, and revolutionary 
              blockchain-powered tickets for every type of event. Join thousands of organizers 
              and attendees who trust Tick3rt.
            </p>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-400 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
                🔐 Blockchain Secured
              </div>
              <div className="text-sm text-slate-400 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
                ⚡ Lightning Fast
              </div>
            </div>
            <div className="text-sm text-slate-500 mt-8">
              © 2024 Tick3rt. All rights reserved. Built with care for event creators worldwide.
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="font-bold text-xl mb-6 text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/events" className="text-slate-300 hover:text-white transition-all duration-200 flex items-center space-x-2 group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:bg-blue-400 transition-colors"></span>
                  <span>Browse Events</span>
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-slate-300 hover:text-white transition-all duration-200 flex items-center space-x-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:bg-purple-400 transition-colors"></span>
                  <span>Marketplace</span>
                </Link>
              </li>
              <li>
                <Link to="/create-event" className="text-slate-300 hover:text-white transition-all duration-200 flex items-center space-x-2 group">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full group-hover:bg-green-400 transition-colors"></span>
                  <span>Create Event</span>
                </Link>
              </li>
              <li>
                <Link to="/my-tickets" className="text-slate-300 hover:text-white transition-all duration-200 flex items-center space-x-2 group">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full group-hover:bg-yellow-400 transition-colors"></span>
                  <span>My Tickets</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h3 className="font-bold text-xl mb-6 text-white bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-all duration-200 flex items-center space-x-2 group">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full group-hover:bg-green-400 transition-colors"></span>
                  <span>Help Center</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-all duration-200 flex items-center space-x-2 group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:bg-blue-400 transition-colors"></span>
                  <span>Contact Us</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-all duration-200 flex items-center space-x-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:bg-purple-400 transition-colors"></span>
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-all duration-200 flex items-center space-x-2 group">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full group-hover:bg-red-400 transition-colors"></span>
                  <span>Terms of Service</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <span className="text-slate-400 text-sm">Powered by Blockchain Technology</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">System Operational</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <span>🌍 Global Platform</span>
              <span>•</span>
              <span>🔒 End-to-End Encrypted</span>
              <span>•</span>
              <span>⚡ Real-time Validation</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
