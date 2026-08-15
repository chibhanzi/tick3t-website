import { Bell, BellOff, UserPlus, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useFollow } from "@/contexts/FollowContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MOCK_ORGANIZERS, getRealFollowerCount } from "@/data/mockOrganizers";

interface FollowButtonProps {
  organizerId: string;
  /** Display variant: "button" (default) or "pill" (compact) */
  variant?: "button" | "pill";
  className?: string;
}

const FollowButton = ({ organizerId, variant = "button", className }: FollowButtonProps) => {
  const { user } = useAuth();
  const { isFollowing, follow, unfollow } = useFollow();
  const navigate = useNavigate();
  const { toast } = useToast();

  const organizer = MOCK_ORGANIZERS[organizerId];
  if (!organizer) return null;

  const following = isFollowing(organizerId);
  const realCount = getRealFollowerCount(organizerId);
  const displayCount = organizer.followerSeed + realCount;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Sign in to follow organisers",
        description: "Create a free account to get notified when they post new events.",
      });
      navigate("/auth");
      return;
    }

    if (following) {
      unfollow(organizerId);
      toast({
        title: `Unfollowed ${organizer.name}`,
        description: "You won't get notifications for their new events.",
      });
    } else {
      follow(organizerId);
      toast({
        title: `Following ${organizer.name}! 🔔`,
        description: "We'll let you know when they post a new event.",
      });
    }
  };

  const formattedCount = displayCount >= 1000
    ? `${(displayCount / 1000).toFixed(1)}k`
    : displayCount.toString();

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
          following
            ? "bg-primary text-primary-foreground border-primary shadow-sm"
            : "bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm",
          className,
        )}
      >
        {following ? (
          <><UserCheck className="h-3 w-3" />Following · {formattedCount}</>
        ) : (
          <><UserPlus className="h-3 w-3" />Follow · {formattedCount}</>
        )}
      </button>
    );
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={following ? "default" : "outline"}
      onClick={handleClick}
      className={cn(
        "gap-1.5 transition-all duration-200",
        following
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "hover:border-primary/60 hover:text-primary",
        className,
      )}
    >
      {following ? (
        <><UserCheck className="h-3.5 w-3.5" />Following</>
      ) : (
        <><UserPlus className="h-3.5 w-3.5" />Follow</>
      )}
      <span className="ml-0.5 text-xs opacity-70">{formattedCount}</span>
    </Button>
  );
};

export default FollowButton;
