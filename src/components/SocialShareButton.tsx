
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Facebook, Twitter, Instagram, Linkedin, Copy, Check } from "lucide-react";
import { useState } from "react";

interface SocialShareProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventUrl?: string;
}

const SocialShareButton = ({ eventTitle, eventDate, eventLocation, eventUrl = window.location.href }: SocialShareProps) => {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `🎉 I'm attending ${eventTitle} on ${eventDate} at ${eventLocation}! Join me! #Tick3rt`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(eventUrl);

  const socialLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`,
      color: "bg-blue-700 hover:bg-blue-800"
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${eventUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowShare(!showShare)}
        className="flex items-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share Event
      </Button>

      {showShare && (
        <Card className="absolute top-12 right-0 z-50 w-72 shadow-lg border">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Share this event</h4>
            <div className="space-y-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="outline"
                  size="sm"
                  className={`w-full justify-start ${social.color} text-white border-none`}
                  onClick={() => window.open(social.url, '_blank')}
                >
                  <social.icon className="h-4 w-4 mr-2" />
                  Share on {social.name}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SocialShareButton;
