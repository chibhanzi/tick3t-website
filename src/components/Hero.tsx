
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const featuredEvents = [
  {
    id: "1",
    title: "Tech Innovation Summit 2024",
    description: "The biggest tech gathering of the year — keynotes, demos, and networking with industry leaders.",
    date: "MAR 15, 2024",
    time: "9:00 AM",
    venue: "San Francisco Convention Center",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop",
  },
  {
    id: "4",
    title: "Music Festival Summer",
    description: "Three stages, 40+ artists, one unforgettable weekend in the heart of New York City.",
    date: "MAY 20, 2024",
    time: "3:00 PM",
    venue: "Central Park, NYC",
    category: "Music",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1200&h=800&fit=crop",
  },
  {
    id: "9",
    title: "Fashion Week Showcase",
    description: "Runway shows, designer meet-and-greets, and exclusive after-parties in Milan.",
    date: "SEP 18, 2024",
    time: "8:00 PM",
    venue: "Milan Fashion District",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1489533119213-66a5cd877091?w=1200&h=800&fit=crop",
  },
];

const cities = [
  { value: "all", label: "All Cities" },
  { value: "harare", label: "Harare" },
  { value: "bulawayo", label: "Bulawayo" },
  { value: "mutare", label: "Mutare" },
  { value: "gweru", label: "Gweru" },
  { value: "masvingo", label: "Masvingo" },
  { value: "victoria-falls", label: "Victoria Falls" },
];

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const event = featuredEvents[currentSlide];

  const goNext = () => setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  const goPrev = () => setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);

  const searchUrl = `/events${searchQuery || selectedCity !== "all" ? `?${searchQuery ? `search=${searchQuery}` : ""}${selectedCity !== "all" ? `${searchQuery ? "&" : ""}city=${selectedCity}` : ""}` : ""}`;

  return (
    <section className="relative w-full min-h-[85vh] md:min-h-[90vh] flex flex-col">
      {/* Background Image */}
      {featuredEvents.map((ev, i) => (
        <div
          key={ev.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === currentSlide ? "opacity-100" : "opacity-0"}`}
        >
          <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        </div>
      ))}

      {/* Search Bar + City Selector */}
      <div className="relative z-20 pt-6 px-4">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 px-4 py-2">
            <Search className="h-5 w-5 text-white/70 mr-3 flex-shrink-0" />
            <Input
              type="text"
              placeholder="Search events, artists, or venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent text-white placeholder-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            />
            <Link to={searchUrl}>
              <Button size="sm" className="rounded-full bg-white text-black hover:bg-white/90 text-xs px-5">
                Search
              </Button>
            </Link>
          </div>
          {/* City selector */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 px-3 py-1.5">
              <MapPin className="h-4 w-4 text-white/70" />
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="border-0 bg-transparent text-white text-sm h-auto p-0 focus:ring-0 w-auto gap-1 [&>svg]:text-white/70">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Event Content */}
      <div className="relative z-10 mt-auto px-4 pb-8 md:pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-green-500/90 text-white border-0 text-xs">
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Featured Event
            </Badge>
            <Badge variant="outline" className="border-white/30 text-white/80 text-xs uppercase tracking-wider">
              {event.category}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight">
            {event.title}
          </h1>

          <p className="text-white/70 text-sm md:text-base max-w-2xl mb-5 leading-relaxed">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/80 text-sm mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.venue}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to={`/event/${event.id}`}>
              <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8 font-semibold">
                Get Tickets
              </Button>
            </Link>
            <Link to="/events">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8">
                Browse Events
              </Button>
            </Link>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="max-w-4xl mx-auto flex items-center justify-between mt-8">
          <div className="flex items-center gap-3">
            <button onClick={goPrev} className="p-2 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={goNext} className="p-2 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {featuredEvents.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all duration-300 rounded-full ${i === currentSlide ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/60"}`}
              />
            ))}
            <span className="text-white/50 text-sm ml-3 font-mono">
              {String(currentSlide + 1).padStart(2, "0")} / {String(featuredEvents.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
