import { useRef } from "react";
import { cn } from "@/lib/utils";
import { TICKET_TEMPLATES } from "./TicketTemplateGallery";
import { getCustomPreview } from "./CustomTicketPreview";
import { LayoutTemplate } from "lucide-react";

export interface TicketLivePreviewProps {
  design: any;
  eventTitle?: string;
  eventDate?: string;
  eventLocation?: string;
  className?: string;
  selectedObjectId?: string;
  onSelectObject?: (objectId: string) => void;
  onMoveLayer?: (layerId: string, position: { x: number; y: number }) => void;
  onMoveTicket?: (position: { x: number; y: number; width: number }) => void;
}

export const DEFAULT_TICKET_POSITION = { x: 7, y: 7, width: 86 };

type DragState = {
  type: "ticket" | "layer";
  id: string;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
  startWidth?: number;
};

function formatDate(raw: string): string {
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  } catch { return raw; }
}

/** SVG-based CSS background-image pattern overlays */
function getPatternStyle(pattern: string): React.CSSProperties {
  const c = encodeURIComponent("rgba(255,255,255,0.18)");
  switch (pattern) {
    case "dots":
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='2' fill='${c}'/%3E%3C/svg%3E")`,
        backgroundSize: "20px 20px",
      };
    case "geometric":
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='20,2 38,38 2,38' fill='none' stroke='${c}' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: "40px 40px",
      };
    case "waves":
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,10 C15,0 30,20 45,10 S60,0 60,10' fill='none' stroke='${c}' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: "60px 20px",
      };
    case "hexagon":
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='26,2 50,15 50,45 26,58 2,45 2,15' fill='none' stroke='${c}' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: "52px 60px",
      };
    case "circuit":
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='20' x2='40' y2='20' stroke='${c}' stroke-width='0.8'/%3E%3Cline x1='20' y1='0' x2='20' y2='40' stroke='${c}' stroke-width='0.8'/%3E%3Ccircle cx='20' cy='20' r='3' fill='${c}'/%3E%3C/svg%3E")`,
        backgroundSize: "40px 40px",
      };
    case "marble":
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
        backgroundSize: "100px 100px",
      };
    default:
      return {};
  }
}

/**
 * Single source-of-truth ticket preview.
 * Renders either:
 *   - A template's unique shape (when design.templateId is set), or
 *   - A custom layout (when design.customLayout is set), or
 *   - A placeholder prompt.
 *
 * Applies background photo, pattern overlay, and holographic/metallic
 * effects on top of whichever base is rendered.
 */
const TicketLivePreview = ({
  design,
  eventTitle,
  eventDate,
  eventLocation,
  className,
  selectedObjectId,
  onSelectObject,
  onMoveLayer,
  onMoveTicket,
}: TicketLivePreviewProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const template = design?.templateId
    ? TICKET_TEMPLATES.find((t) => t.id === design.templateId) ?? null
    : null;

  const customLayoutId: string | undefined = design?.customLayout;
  const CustomPreview = customLayoutId ? getCustomPreview(customLayoutId) : null;

  const backgroundImage: string = design?.backgroundImage ?? "";
  const backgroundPattern: string = design?.backgroundPattern ?? "none";
  const holographic: boolean = !!design?.holographicEffect;
  const metallic: boolean = !!design?.metallic;
  const animationEffect: string = design?.animationEffect ?? "none";
  const ticketPosition = {
    ...DEFAULT_TICKET_POSITION,
    ...(design?.ticketPosition ?? {}),
  };

  const previewProps = {
    design,
    title:    eventTitle    || "Event Title",
    date:     formatDate(eventDate ?? "") || "Event Date",
    location: eventLocation || "Venue",
  };

  // Animation class on wrapper
  const animClass =
    animationEffect === "pulse"  ? "animate-pulse"  :
    animationEffect === "bounce" ? "animate-bounce" : "";

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  const beginDrag = (
    type: DragState["type"],
    id: string,
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const position = type === "ticket"
      ? ticketPosition
      : design?.layers?.find((layer: any) => layer.id === id)?.position ?? { x: 0, y: 0 };

    dragRef.current = {
      type,
      id,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: position.x ?? 0,
      startY: position.y ?? 0,
      startWidth: type === "ticket" ? ticketPosition.width : undefined,
    };
    onSelectObject?.(id);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = drag.type === "ticket"
      ? canvasRef.current?.getBoundingClientRect()
      : ticketRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;

    const deltaX = ((event.clientX - drag.startClientX) / rect.width) * 100;
    const deltaY = ((event.clientY - drag.startClientY) / rect.height) * 100;
    if (drag.type === "ticket") {
      const width = drag.startWidth ?? DEFAULT_TICKET_POSITION.width;
      onMoveTicket?.({
        x: clamp(drag.startX + deltaX, 0, 100 - width),
        y: clamp(drag.startY + deltaY, 0, 100 - width),
        width,
      });
    } else {
      const layer = design?.layers?.find((item: any) => item.id === drag.id);
      const width = layer?.size?.width ?? 50;
      const height = layer?.size?.height ?? 20;
      onMoveLayer?.(drag.id, {
        x: clamp(drag.startX + deltaX, 0, 100 - width),
        y: clamp(drag.startY + deltaY, 0, 100 - height),
      });
    }
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      event.stopPropagation();
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      dragRef.current = null;
    }
  };

  return (
    <div
      ref={canvasRef}
      data-testid="ticket-live-preview-canvas"
      className={cn("relative overflow-hidden rounded-xl border-2 border-dashed border-border/70 bg-muted/20 shadow-inner", animClass, className)}
      style={{ aspectRatio: "7/3", touchAction: "pan-y" }}
    >
      <div
        ref={ticketRef}
        data-testid="ticket-preview-object"
        className={cn(
          "absolute select-none",
          selectedObjectId === "ticket" && "rounded-xl ring-2 ring-primary ring-offset-2 ring-offset-background",
        )}
        style={{
          left: `${ticketPosition.x}%`,
          top: `${ticketPosition.y}%`,
          width: `${ticketPosition.width}%`,
          aspectRatio: "7/3",
          touchAction: "none",
          cursor: "grab",
        }}
        onPointerDown={(event) => beginDrag("ticket", "ticket", event)}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* ── Base ticket ── */}
        {template ? (
          <template.Preview
            title={previewProps.title}
            date={previewProps.date}
            location={previewProps.location}
          />
        ) : CustomPreview ? (
          <CustomPreview {...previewProps} />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl text-center px-6"
            style={{
              background: `linear-gradient(135deg, ${design?.primaryColor || "#6366f1"}, ${design?.secondaryColor || "#4338ca"})`,
              color: design?.textColor || "#fff",
            }}
          >
            <LayoutTemplate className="h-6 w-6 opacity-60" />
            <p className="text-sm opacity-70 max-w-[200px] leading-snug">
              Choose a template or build a custom ticket above
            </p>
          </div>
        )}

        {/* ── Effect overlays (stacked, all pointer-events-none) ── */}

        {/* Background pattern */}
        {backgroundPattern && backgroundPattern !== "none" && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={getPatternStyle(backgroundPattern)}
          />
        )}

        {/* Holographic shimmer */}
        {holographic && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl opacity-25 animate-pulse"
            style={{
              background:
                "linear-gradient(120deg, #ff0080 0%, #ff8c00 20%, #ffff00 40%, #40e0d0 60%, #ee82ee 80%, #9acd32 100%)",
              mixBlendMode: "overlay",
            }}
          />
        )}

        {/* Metallic sheen */}
        {metallic && !holographic && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl opacity-20"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 40%, rgba(255,255,255,0.3) 60%, transparent 100%)",
            }}
          />
        )}

        {/* Glow animation (box-shadow can't be layered, so fake it) */}
        {animationEffect === "glow" && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl animate-pulse opacity-30"
            style={{
              boxShadow: `0 0 30px 10px ${design?.primaryColor || "#6366f1"}`,
              border: `2px solid ${design?.primaryColor || "#6366f1"}`,
            }}
          />
        )}

        {/* Background photo — blended over the template */}
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

        {/* User-defined layers from the Layer Editor */}
        {Array.isArray(design?.layers) &&
          [...design.layers]
            .sort((a: any, b: any) => a.zIndex - b.zIndex)
            // Skip the first background layer — it's the base design, handled above
            .filter((layer: any) => layer.type !== "background")
            .map((layer: any) => {
              const isSelected = selectedObjectId === layer.id;
              const baseStyle: React.CSSProperties = {
                position: "absolute",
                left:    `${layer.position?.x ?? 0}%`,
                top:     `${layer.position?.y ?? 0}%`,
                width:   `${layer.size?.width ?? 50}%`,
                opacity: layer.style?.opacity ?? 1,
                transform: `rotate(${layer.style?.rotation ?? 0}deg)`,
                zIndex: (layer.zIndex ?? 1) + 20,
                pointerEvents: "auto",
                cursor: "grab",
                touchAction: "none",
                outline: isSelected ? "2px solid rgba(255,255,255,0.95)" : undefined,
                outlineOffset: isSelected ? "2px" : undefined,
              };

              if (layer.type === "text") {
                return (
                  <div
                    key={layer.id}
                    data-testid={`ticket-preview-layer-${layer.id}`}
                    style={{
                      ...baseStyle,
                      color: layer.style?.color || "#ffffff",
                      fontSize: `${layer.style?.fontSize ?? 14}px`,
                      fontWeight: layer.style?.fontWeight || "normal",
                      whiteSpace: "pre-wrap",
                      textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                    }}
                    onPointerDown={(event) => beginDrag("layer", layer.id, event)}
                    onPointerMove={moveDrag}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                  >
                    {layer.content}
                  </div>
                );
              }

              if (layer.type === "shape" || layer.type === "pattern") {
                return (
                  <div
                    key={layer.id}
                    data-testid={`ticket-preview-layer-${layer.id}`}
                    style={{
                      ...baseStyle,
                      height: `${layer.size?.height ?? 20}%`,
                      backgroundColor: layer.style?.color || "rgba(255,255,255,0.2)",
                      borderRadius: 4,
                    }}
                    onPointerDown={(event) => beginDrag("layer", layer.id, event)}
                    onPointerMove={moveDrag}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                  />
                );
              }

              return null;
            })}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-[10px] font-medium text-muted-foreground">
        Drag the ticket or a layer to position it
      </div>
    </div>
  );
};

export default TicketLivePreview;
