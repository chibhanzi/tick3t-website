
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Info, Tag } from "lucide-react";

interface EventData {
  title: string;
  date: string;
  location: string;
  description: string;
  price: string;
  totalTickets: string;
  category: string;
}

interface EventBasicInfoProps {
  eventData: EventData;
  onEventDataChange: (data: EventData) => void;
}

const EventBasicInfo = ({ eventData, onEventDataChange }: EventBasicInfoProps) => {
  const handleChange = (field: keyof EventData, value: string) => {
    onEventDataChange({
      ...eventData,
      [field]: value
    });
  };

  const categories = [
    "Conference", "Workshop", "Concert", "Festival", "Sports", "Theater", 
    "Exhibition", "Networking", "Charity", "Education", "Technology", "Art"
  ];

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          Event Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Event Title *</Label>
            <Input
              id="title"
              placeholder="Amazing Conference 2024"
              value={eventData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="h-11"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
            <Select value={eventData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    <div className="flex items-center gap-2">
                      <Tag className="h-3 w-3" />
                      {category}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Event Date *
            </Label>
            <Input
              id="date"
              type="datetime-local"
              value={eventData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="h-11"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Location *
            </Label>
            <Input
              id="location"
              placeholder="Convention Center, City"
              value={eventData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">Event Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe your event, what attendees can expect, speakers, agenda, etc."
            value={eventData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="min-h-24"
            rows={4}
          />
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg">
          <div className="text-sm">
            <div className="mb-1 flex items-center gap-2 font-medium">
              <Info className="h-4 w-4 text-blue-500" />
              Pro Tip
            </div>
            <div className="text-muted-foreground">
              A compelling event description helps increase ticket sales. Include key speakers, agenda highlights, and unique value propositions.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventBasicInfo;
