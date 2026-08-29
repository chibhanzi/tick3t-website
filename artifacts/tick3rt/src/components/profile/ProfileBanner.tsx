import { useRef, useState, type ChangeEvent, type CSSProperties, type ReactNode } from "react";
import { ImagePlus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROFILE_BANNER_MAX_BYTES } from "@/lib/profileBanners";

interface ProfileBannerProps {
  bannerUrl: string;
  editable?: boolean;
  onBannerChange: (bannerUrl: string) => void | boolean;
  fallback: ReactNode;
  className?: string;
  style?: CSSProperties;
  inputId: string;
  controlPosition?: "left" | "right";
  children?: ReactNode;
}

const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const ProfileBanner = ({
  bannerUrl,
  editable = false,
  onBannerChange,
  fallback,
  className = "",
  style,
  inputId,
  controlPosition = "right",
  children,
}: ProfileBannerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const openPicker = () => inputRef.current?.click();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file to use as your banner.");
      return;
    }

    if (file.size > PROFILE_BANNER_MAX_BYTES) {
      setError(`That image is too large. Choose an image under ${formatSize(PROFILE_BANNER_MAX_BYTES)}.`);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => setError("We couldn't read that image. Please try another file.");
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setError("We couldn't read that image. Please try another file.");
        return;
      }

      const saved = onBannerChange(reader.result);
      if (saved === false) {
        setError("We couldn't save that banner on this device. Try a smaller image.");
        return;
      }
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const removeBanner = () => {
    const saved = onBannerChange("");
    if (saved === false) {
      setError("We couldn't remove the banner. Please try again.");
      return;
    }
    setError("");
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {bannerUrl ? (
        <>
          <img
            src={bannerUrl}
            alt="Profile banner"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-black/20" />
        </>
      ) : (
        fallback
      )}

      {children}

      {editable && (
        <>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
          <div
            className={`absolute top-3 flex items-center gap-2 ${
              controlPosition === "left" ? "left-3" : "right-3"
            }`}
          >
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={openPicker}
              className="h-8 gap-1.5 border border-white/30 bg-white/90 px-2.5 text-xs text-slate-900 shadow-sm hover:bg-white"
            >
              {bannerUrl ? <Pencil className="h-3.5 w-3.5" /> : <ImagePlus className="h-3.5 w-3.5" />}
              <span>{bannerUrl ? "Change banner" : "Add banner"}</span>
            </Button>
            {bannerUrl && (
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={removeBanner}
                aria-label="Remove profile banner"
                className="h-8 w-8 border border-white/30 bg-black/35 text-white shadow-sm hover:bg-black/50 hover:text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          {error && (
            <p
              role="alert"
              className="absolute bottom-3 left-3 right-3 rounded-md bg-destructive/95 px-3 py-1.5 text-xs font-medium text-destructive-foreground shadow-sm"
            >
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileBanner;