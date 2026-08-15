import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Twitter, Facebook, Linkedin, MessageCircle, Instagram,
  Music2, Camera, Copy, Check, X, Share2, Sparkles, Ticket,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AttendeeShareModalProps {
  open: boolean;
  onClose: () => void;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventImage?: string;
  tierName?: string;
  quantity?: number;
  totalPrice?: number;
  eventUrl?: string;
}

const AttendeeShareModal = ({
  open,
  onClose,
  eventTitle,
  eventDate,
  eventLocation,
  eventImage,
  tierName,
  quantity = 1,
  totalPrice,
  eventUrl = typeof window !== "undefined" ? window.location.href : "",
}: AttendeeShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const [sharedPlatform, setSharedPlatform] = useState<string | null>(null);
  const { toast } = useToast();

  const qtyLine = quantity > 1 ? ` (×${quantity})` : "";
  const tierLine = tierName ? ` — ${tierName}${qtyLine}` : "";

  const shareCaption = [
    `🎉 I just got tickets to ${eventTitle}${tierLine}!`,
    `📅 ${eventDate}`,
    `📍 ${eventLocation}`,
    ``,
    `Who's coming with me? 👇`,
    `#Tick3t #LiveEvents`,
  ].join("\n");

  const encodedCaption = encodeURIComponent(shareCaption);
  const encodedUrl = encodeURIComponent(eventUrl);
  const fullText = `${shareCaption}\n${eventUrl}`;

  const markShared = (platform: string) => {
    setSharedPlatform(platform);
    toast({
      title: `Shared on ${platform}! 🎉`,
      description: "Your friends will see you're going.",
    });
  };

  const tryNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `I'm going to ${eventTitle}!`, text: shareCaption, url: eventUrl });
        markShared("native");
        return true;
      } catch { /* cancelled */ }
    }
    return false;
  };

  const copyAndOpenApp = async (platform: string, appUrl?: string) => {
    try {
      await navigator.clipboard.writeText(fullText);
      toast({
        title: `Caption copied for ${platform}`,
        description: "Paste it into your story or post.",
      });
      if (appUrl) {
        setTimeout(() => { window.location.href = appUrl; }, 300);
      }
      markShared(platform);
    } catch {
      toast({ title: "Couldn't copy", description: "Try the copy button below." });
    }
  };

  const platforms = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: MessageCircle,
      gradient: "from-green-500 to-green-600",
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(fullText)}`, "_blank");
        markShared("WhatsApp");
      },
    },
    {
      id: "whatsapp-status",
      name: "WA Status",
      icon: Camera,
      gradient: "from-green-600 to-teal-600",
      action: async () => {
        if (!(await tryNativeShare())) {
          await copyAndOpenApp("WhatsApp Status", `whatsapp://send?text=${encodeURIComponent(fullText)}`);
        }
      },
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      gradient: "from-pink-500 via-fuchsia-500 to-orange-500",
      action: async () => {
        await copyAndOpenApp("Instagram", "instagram://story-camera");
      },
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: Music2,
      gradient: "from-zinc-800 to-black",
      action: async () => {
        await copyAndOpenApp("TikTok", "snssdk1233://");
      },
    },
    {
      id: "twitter",
      name: "X / Twitter",
      icon: Twitter,
      gradient: "from-sky-500 to-blue-600",
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedCaption}&url=${encodedUrl}`,
          "_blank"
        );
        markShared("X / Twitter");
      },
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      gradient: "from-blue-600 to-blue-700",
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedCaption}`,
          "_blank"
        );
        markShared("Facebook");
      },
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      gradient: "from-blue-700 to-blue-800",
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedCaption}`,
          "_blank"
        );
        markShared("LinkedIn");
      },
    },
  ];

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Copy failed", description: "Please copy manually." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0">
        {/* Hero banner */}
        <div className="relative">
          {eventImage ? (
            <div
              className="h-32 bg-cover bg-center"
              style={{ backgroundImage: `url(${eventImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-br from-primary via-violet-500 to-fuchsia-500" />
          )}

          {/* Celebration pill */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-4 py-1.5 shadow-lg">
              <Ticket className="h-4 w-4 text-primary" />
              <span className="font-bold text-sm">You're going! 🎉</span>
            </div>
            {sharedPlatform && (
              <div className="flex items-center gap-1.5 rounded-full bg-green-500/90 text-white px-3 py-1 text-xs font-medium">
                <Check className="h-3 w-3" />
                Shared on {sharedPlatform}
              </div>
            )}
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-lg leading-tight">{eventTitle}</DialogTitle>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-xs">{eventDate}</Badge>
              <Badge variant="secondary" className="text-xs">{eventLocation}</Badge>
              {tierName && <Badge variant="outline" className="text-xs">{tierName}{qtyLine}</Badge>}
              {totalPrice !== undefined && (
                <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                  ${totalPrice.toFixed(2)}
                </Badge>
              )}
            </div>
          </DialogHeader>

          {/* Caption preview */}
          <div className="rounded-xl bg-muted/60 border p-3 space-y-1">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Your share caption
              </span>
            </div>
            <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans text-foreground/90">
              {shareCaption}
            </pre>
          </div>

          {/* Platform grid */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
              Let your friends know you're going
            </p>
            <div className="grid grid-cols-4 gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={p.action}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl py-2.5 px-1 text-white transition-all",
                    "hover:scale-105 active:scale-95 shadow-sm",
                    `bg-gradient-to-br ${p.gradient}`
                  )}
                >
                  <p.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium leading-none text-center">{p.name}</span>
                </button>
              ))}

              {/* Native share — if supported */}
              <button
                type="button"
                onClick={tryNativeShare}
                className="flex flex-col items-center gap-1.5 rounded-xl py-2.5 px-1 text-white transition-all hover:scale-105 active:scale-95 shadow-sm bg-gradient-to-br from-slate-500 to-slate-700"
              >
                <Share2 className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-none text-center">More</span>
              </button>
            </div>
          </div>

          {/* Copy + skip row */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-9"
              onClick={copyAll}
            >
              {copied ? (
                <><Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />Copied!</>
              ) : (
                <><Copy className="h-3.5 w-3.5 mr-1.5" />Copy caption + link</>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-9 text-muted-foreground"
              onClick={onClose}
            >
              Skip for now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendeeShareModal;
