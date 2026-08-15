import { cn } from "@/lib/utils";
import { TICKET_TEMPLATES } from "./TicketTemplateGallery";
import { LayoutTemplate } from "lucide-react";

export interface TicketLivePreviewProps {
  design: any;
  eventTitle?: string;
  eventDate?: string;
  eventLocation?: string;
  className?: string;
}

function formatDate(raw: string): string {
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}

/**
 * Single source-of-truth ticket preview.
 * Renders the selected template's unique shape with event data,
 * and blends the background image on top when one is set.
 */
const TicketLivePreview = ({
  design,
  eventTitle,
  eventDate,
  eventLocation,
  className,
}: TicketLivePreviewProps) => {
  const template = design?.templateId
    ? TICKET_TEMPLATES.find((t) => t.id === design.templateId) ?? null
    : null;

  const backgroundImage: string = design?.backgroundImage ?? "";

  const previewProps = {
    title: eventTitle || "Event Title",
    date: formatDate(eventDate ?? "") || "Event Date",
    location: eventLocation || "Venue",
  };

  return (
    <div className={cn("relative overflow-hidden rounded-xl shadow-lg", className)}>
      {template ? (
        <template.Preview {...previewProps} />
      ) : (
        /* No template selected yet */
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-xl text-center px-6"
          style={{
            aspectRatio: "7/3",
            background: `linear-gradient(135deg, ${design?.primaryColor || "#6366f1"}, ${design?.secondaryColor || "#4338ca"})`,
            color: design?.textColor || "#fff",
          }}
        >
          <LayoutTemplate className="h-6 w-6 opacity-60" />
          <p className="text-sm opacity-70 max-w-[180px] leading-snug">
            Choose a template above to preview your ticket
          </p>
        </div>
      )}

      {/* Background photo overlay — blends with the template design */}
      {backgroundImage && (
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "overlay",
            opacity: 0.45,
          }}
        />
      )}
    </div>
  );
};

export default TicketLivePreview;
