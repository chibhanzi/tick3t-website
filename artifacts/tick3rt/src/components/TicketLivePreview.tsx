import { useEffect, useRef } from "react";
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
  onMoveContent?: (contentId: ContentId, position: { x: number; y: number }) => void;
  onMoveTemplateObject?: (objectId: TemplateObjectId, position: { x: number; y: number }) => void;
}

export const DEFAULT_TICKET_POSITION = { x: 7, y: 7, width: 86 };
type ContentId = "title" | "date" | "location";
export type TemplateObjectId = "category" | "overlay";

type DragState = {
  type: "layer" | "content" | "template";
  id: string;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  target?: HTMLElement;
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
  onMoveContent,
  onMoveTemplateObject,
}: TicketLivePreviewProps) => {
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
  const contentPositions: Record<ContentId, { x: number; y: number }> = {
    title: { x: 0, y: 0, ...(design?.contentPositions?.title ?? {}) },
    date: { x: 0, y: 0, ...(design?.contentPositions?.date ?? {}) },
    location: { x: 0, y: 0, ...(design?.contentPositions?.location ?? {}) },
  };
  const savedTemplateObjects = template
    ? design?.templateObjectsByTemplate?.[template.id] ?? {}
    : {};
  const templateObjects = {
    category: {
      content: template?.category ?? "Event",
      position: { x: 0, y: 0 },
      scale: 1,
      color: "",
      opacity: 1,
      ...(savedTemplateObjects.category ?? {}),
    },
    overlay: {
      position: { x: 0, y: 0 },
      scaleX: 1,
      scaleY: 1,
      color: "",
      opacity: 1,
      borderRadius: undefined as number | undefined,
      ...(savedTemplateObjects.overlay ?? {}),
    },
  };
  const contentStyles: Record<ContentId, { scale: number; color?: string; opacity: number }> = {
    title: { scale: 1, opacity: 1, ...(design?.contentStyles?.title ?? {}) },
    date: { scale: 1, opacity: 1, ...(design?.contentStyles?.date ?? {}) },
    location: { scale: 1, opacity: 1, ...(design?.contentStyles?.location ?? {}) },
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

  const contentValues: Record<ContentId, string> = {
    title: previewProps.title,
    date: previewProps.date,
    location: previewProps.location,
  };

  const findContentTarget = (
    target: EventTarget | null,
    clientX: number,
    clientY: number,
  ): { id: ContentId; element: HTMLElement } | null => {
    if (!(target instanceof HTMLElement) || !ticketRef.current?.contains(target)) return null;
    let element: HTMLElement | null = target;
    while (element && element !== ticketRef.current) {
      const text = element.textContent?.trim() ?? "";
      for (const id of Object.keys(contentValues) as ContentId[]) {
        const value = contentValues[id];
        if (!value) continue;
        const isExactMatch = text === value;
        const isCombinedLocation =
          id === "location" &&
          text.includes(value) &&
          text.includes(previewProps.date) &&
          text.length <= value.length + previewProps.date.length + 10;
        if (isExactMatch || isCombinedLocation) {
          const textRange = document.createRange();
          textRange.selectNodeContents(element);
          const textRect = textRange.getBoundingClientRect();
          const hitPadding = 6;
          const hitText =
            clientX >= textRect.left - hitPadding &&
            clientX <= textRect.right + hitPadding &&
            clientY >= textRect.top - hitPadding &&
            clientY <= textRect.bottom + hitPadding;
          if (hitText) return { id, element };
        }
      }
      element = element.parentElement;
    }
    return null;
  };

  const applyContentStyles = () => {
    const root = ticketRef.current;
    if (!root) return;
    const seen = new Set<HTMLElement>();
    const elements = Array.from(root.querySelectorAll<HTMLElement>("*"));
    (Object.keys(contentValues) as ContentId[]).forEach((id) => {
      const value = contentValues[id];
      if (!value) return;
      const matches = elements
        .filter((element) => {
          const text = element.textContent?.trim() ?? "";
          return text === value || (id === "location" && text.includes(value) && text.length <= value.length + 40);
        })
        .sort((a, b) => (a.textContent?.length ?? 0) - (b.textContent?.length ?? 0));
      const element = matches[0];
      if (!element || seen.has(element)) return;
      seen.add(element);
      element.dataset.testid = `ticket-preview-content-${id}`;
      element.style.position = "relative";
      element.style.left = `${contentPositions[id].x}%`;
      element.style.top = `${contentPositions[id].y}%`;
      element.style.width = "fit-content";
      element.style.maxWidth = "100%";
      element.style.height = "fit-content";
      element.style.transform = `scale(${contentStyles[id].scale})`;
      element.style.transformOrigin = "top left";
      element.style.color = contentStyles[id].color || element.style.color;
      element.style.opacity = String(contentStyles[id].opacity);
      element.style.cursor = "grab";
      element.style.touchAction = "none";
      element.style.outline = selectedObjectId === `content:${id}` ? "2px solid rgba(255,255,255,0.95)" : "";
      element.style.outlineOffset = selectedObjectId === `content:${id}` ? "2px" : "";
    });

    if (template) {
      const existingCategory = root.querySelector<HTMLElement>('[data-testid="ticket-preview-template-category"]');
      const categoryElement = existingCategory ?? Array.from(root.querySelectorAll<HTMLElement>("*"))
        .find((element) => {
          const text = element.textContent?.trim() ?? "";
          return text === template.category || text.startsWith(`${template.category} ·`);
        });
      if (categoryElement) {
        categoryElement.dataset.testid = "ticket-preview-template-category";
        categoryElement.textContent = templateObjects.category.content;
        categoryElement.style.transform = `translate(${root.clientWidth * templateObjects.category.position.x / 100}px, ${root.clientHeight * templateObjects.category.position.y / 100}px) scale(${templateObjects.category.scale})`;
        categoryElement.style.transformOrigin = "top left";
        categoryElement.style.color = templateObjects.category.color || categoryElement.style.color;
        categoryElement.style.opacity = String(templateObjects.category.opacity);
        categoryElement.style.cursor = "grab";
        categoryElement.style.touchAction = "none";
        categoryElement.style.outline = selectedObjectId === "template:category" ? "2px solid rgba(255,255,255,0.95)" : "";
        categoryElement.style.outlineOffset = selectedObjectId === "template:category" ? "2px" : "";
      }

      const overlayElement = root.querySelector<HTMLElement>('[data-ticket-template-object="overlay"]');
      if (overlayElement) {
        overlayElement.dataset.testid = "ticket-preview-template-overlay";
        overlayElement.style.transform = `translate(${root.clientWidth * templateObjects.overlay.position.x / 100}px, ${root.clientHeight * templateObjects.overlay.position.y / 100}px) scale(${templateObjects.overlay.scaleX}, ${templateObjects.overlay.scaleY})`;
        overlayElement.style.transformOrigin = "center";
        if (templateObjects.overlay.color) overlayElement.style.background = templateObjects.overlay.color;
        overlayElement.style.opacity = String(templateObjects.overlay.opacity);
        if (templateObjects.overlay.borderRadius !== undefined) {
          overlayElement.style.borderRadius = `${templateObjects.overlay.borderRadius}px`;
        }
        overlayElement.style.cursor = "grab";
        overlayElement.style.touchAction = "none";
        overlayElement.style.outline = selectedObjectId === "template:overlay" ? "2px solid rgba(255,255,255,0.95)" : "";
        overlayElement.style.outlineOffset = selectedObjectId === "template:overlay" ? "2px" : "";
      }
    }
  };

  useEffect(() => {
    applyContentStyles();
  }, [design, selectedObjectId, eventTitle, eventDate, eventLocation]);

  const beginDrag = (
    type: "layer",
    id: string,
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const position = design?.layers?.find((layer: any) => layer.id === id)?.position ?? { x: 0, y: 0 };

    dragRef.current = {
      type,
      id,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: position.x ?? 0,
      startY: position.y ?? 0,
      target: event.currentTarget,
    };
    onSelectObject?.(id);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const beginContentDrag = (
    contentId: ContentId,
    target: HTMLElement,
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const ticketRect = ticketRef.current?.getBoundingClientRect();
    const contentRect = target.getBoundingClientRect();
    if (!ticketRect || ticketRect.width === 0 || ticketRect.height === 0) return;
    const position = contentPositions[contentId];
    const minX = position.x + ((ticketRect.left - contentRect.left) / ticketRect.width) * 100;
    const maxX = position.x + ((ticketRect.right - contentRect.right) / ticketRect.width) * 100;
    const minY = position.y + ((ticketRect.top - contentRect.top) / ticketRect.height) * 100;
    const maxY = position.y + ((ticketRect.bottom - contentRect.bottom) / ticketRect.height) * 100;

    event.preventDefault();
    event.stopPropagation();
    dragRef.current = {
      type: "content",
      id: `content:${contentId}`,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: position.x,
      startY: position.y,
      minX: Math.min(minX, maxX),
      maxX: Math.max(minX, maxX),
      minY: Math.min(minY, maxY),
      maxY: Math.max(minY, maxY),
      target,
    };
    onSelectObject?.(`content:${contentId}`);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const beginTemplateDrag = (
    objectId: TemplateObjectId,
    target: HTMLElement,
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const position = templateObjects[objectId].position;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = {
      type: "template",
      id: objectId,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: position.x,
      startY: position.y,
      target,
    };
    onSelectObject?.(`template:${objectId}`);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleTicketPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const contentTarget = findContentTarget(event.target, event.clientX, event.clientY);
    if (contentTarget) {
      beginContentDrag(contentTarget.id, contentTarget.element, event);
      return;
    }
    if (event.target instanceof HTMLElement) {
      const category = event.target.closest<HTMLElement>('[data-testid="ticket-preview-template-category"]');
      if (category) {
        beginTemplateDrag("category", category, event);
        return;
      }
      const overlay = event.target.closest<HTMLElement>('[data-ticket-template-object="overlay"]');
      if (overlay) beginTemplateDrag("overlay", overlay, event);
    }
  };

  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = ticketRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;

    const deltaX = ((event.clientX - drag.startClientX) / rect.width) * 100;
    const deltaY = ((event.clientY - drag.startClientY) / rect.height) * 100;
    if (drag.type === "content") {
      const contentId = drag.id.replace("content:", "") as ContentId;
      onMoveContent?.(contentId, {
        x: clamp(drag.startX + deltaX, drag.minX ?? -100, drag.maxX ?? 100),
        y: clamp(drag.startY + deltaY, drag.minY ?? -100, drag.maxY ?? 100),
      });
    } else if (drag.type === "template") {
      onMoveTemplateObject?.(drag.id as TemplateObjectId, {
        x: clamp(drag.startX + deltaX, -100, 100),
        y: clamp(drag.startY + deltaY, -100, 100),
      });
    } else {
      const layer = design?.layers?.find((item: any) => item.id === drag.id);
      const layerRect = drag.target?.getBoundingClientRect();
      const width = layerRect ? (layerRect.width / rect.width) * 100 : (layer?.size?.width ?? 50);
      const height = layerRect ? (layerRect.height / rect.height) * 100 : (layer?.size?.height ?? 20);
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
      data-testid="ticket-live-preview-canvas"
      className={cn("relative overflow-hidden rounded-xl border-2 border-dashed border-border/70 bg-muted/20 shadow-inner", animClass, className)}
      style={{ aspectRatio: "7/3", touchAction: "pan-y" }}
    >
      <div
        ref={ticketRef}
        data-testid="ticket-preview-object"
        className={cn(
          "absolute select-none",
        )}
        style={{
          left: `${ticketPosition.x}%`,
          top: `${ticketPosition.y}%`,
          width: `${ticketPosition.width}%`,
          aspectRatio: "7/3",
          touchAction: "pan-y",
          cursor: "default",
        }}
        onPointerDown={handleTicketPointerDown}
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
                      width: "fit-content",
                      maxWidth: "100%",
                      height: "fit-content",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
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
                      width: `${layer.size?.width ?? 50}%`,
                      height: `${layer.size?.height ?? 20}%`,
                      backgroundColor: layer.style?.color || "rgba(255,255,255,0.2)",
                      borderRadius: layer.style?.borderRadius ?? 4,
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
        Drag an event detail or layer to position it
      </div>
    </div>
  );
};

export default TicketLivePreview;
