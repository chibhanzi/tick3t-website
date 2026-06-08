
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Share2, Facebook, Twitter, Linkedin, Copy, Check, MessageCircle,
  Instagram, Music2, Camera, Ticket
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventUrl?: string;
  ticketsLeft?: number;
  price?: string | number;
}

const SocialShareButton = ({
  eventTitle,
  eventDate,
  eventLocation,
  eventUrl = window.location.href,
  ticketsLeft,
  price,
}: SocialShareProps) => {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const priceLine = price !== undefined ? `💸 From ${typeof price === "number" ? `$${price}` : price}` : "";
  const leftLine = ticketsLeft !== undefined ? `🎟️ Only ${ticketsLeft} tickets left` : "";

  const shareText = [
    `🎉 I'm going to ${eventTitle}!`,
    `📅 ${eventDate}`,
    `📍 ${eventLocation}`,
    priceLine,
    leftLine,
    `Grab yours 👇`,
    `#Tick3rt`,
  ].filter(Boolean).join("\n");

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(eventUrl);
  const whatsappText = encodeURIComponent(`${shareText}\n\n${eventUrl}`);

  const copyForStory = async (platform: string, deepLink?: string) => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${eventUrl}`);
      toast({
        title: `Ready for ${platform}`,
        description: `Caption copied. ${platform} is opening — paste it into your story.`,
      });
      if (deepLink) {
        // Try native app; fallback to web after a beat
        window.location.href = deepLink;
      }
    } catch {
      toast({ title: "Couldn't copy caption", description: "Try the manual share instead." });
    }
  };

  const tryNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: eventTitle, text: shareText, url: eventUrl });
        return true;
      } catch { /* user cancelled */ }
    }
    return false;
  };

  const socialLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      onClick: () => window.open(`https://wa.me/?text=${whatsappText}`, "_blank"),
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      name: "WhatsApp Status",
      icon: Camera,
      onClick: async () => {
        if (!(await tryNativeShare())) {
          await copyForStory("WhatsApp Status", `whatsapp://send?text=${whatsappText}`);
        }
      },
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      name: "Instagram Story",
      icon: Instagram,
      onClick: async () => {
        await copyForStory("Instagram", "instagram://story-camera");
      },
      color: "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-500 hover:opacity-90",
    },
    {
      name: "TikTok",
      icon: Music2,
      onClick: async () => {
        await copyForStory("TikTok", "snssdk1233://");
      },
      color: "bg-black hover:bg-zinc-800",
    },
    {
      name: "Twitter",
      icon: Twitter,
      onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, "_blank"),
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      name: "Facebook",
      icon: Facebook,
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`, "_blank"),
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`, "_blank"),
      color: "bg-blue-700 hover:bg-blue-800",
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${eventUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowShare(!showShare)}
        className="flex items-center gap-2 w-full"
      >
        <Share2 className="h-4 w-4" />
        Share Event
      </Button>

      {showShare && (
        <Card className="absolute top-12 right-0 z-50 w-80 shadow-xl border">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-1">Share to your story</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Caption auto-copied with price{ticketsLeft !== undefined ? " & tickets left" : ""}.
            </p>

            {(ticketsLeft !== undefined || price !== undefined) && (
              <div className="flex items-center gap-2 mb-3 p-2 rounded-md bg-muted/60 text-xs">
                <Ticket className="h-3.5 w-3.5 text-primary" />
                {ticketsLeft !== undefined && (
                  <span className="font-medium">{ticketsLeft} left</span>
                )}
                {price !== undefined && (
                  <span className="text-muted-foreground">
                    · from {typeof price === "number" ? `$${price}` : price}
                  </span>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  size="sm"
                  className={`justify-start text-white border-none ${social.color}`}
                  onClick={social.onClick}
                >
                  <social.icon className="h-4 w-4 mr-2" />
                  <span className="truncate">{social.name}</span>
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start mt-3"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Copy caption + link"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SocialShareButton;
