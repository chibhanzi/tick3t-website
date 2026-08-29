import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HistoryIcon, ArrowRight, X } from "lucide-react";

const DRAFT_KEY = "tick3t_create_event_draft";
const LEGACY_DRAFT_KEY = "tick3rt_create_event_draft";
const DISMISSED_KEY = "tick3t_draft_banner_dismissed";
const LEGACY_DISMISSED_KEY = "tick3rt_draft_banner_dismissed";

function getDraftRaw(): string | null {
  return localStorage.getItem(DRAFT_KEY) ?? localStorage.getItem(LEGACY_DRAFT_KEY);
}

function hasMeaningfulDraft(): boolean {
  try {
    const raw = getDraftRaw();
    if (!raw) return false;
    const draft = JSON.parse(raw);
    if (!draft) return false;
    const step = draft.currentStep ?? 1;
    const eventData = draft.eventData ?? {};
    return step > 1 || Object.values(eventData).some((v) => v !== "");
  } catch {
    return false;
  }
}

function getDraftEventTitle(): string | null {
  try {
    const raw = getDraftRaw();
    if (!raw) return null;
    const draft = JSON.parse(raw);
    return draft?.eventData?.title || null;
  } catch {
    return null;
  }
}

export default function DraftEventBanner() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [draftTitle, setDraftTitle] = useState<string | null>(null);

  useEffect(() => {
    // Re-evaluate every time the component mounts (e.g. navigation back)
    const dismissed =
      sessionStorage.getItem(DISMISSED_KEY) === "true"
      || sessionStorage.getItem(LEGACY_DISMISSED_KEY) === "true";
    if (!dismissed && hasMeaningfulDraft()) {
      setVisible(true);
      setDraftTitle(getDraftEventTitle());
    }
  }, []);

  if (!visible) return null;

  const handleDismiss = () => {
    // Only hide the banner for this session; do NOT clear the draft
    sessionStorage.setItem(DISMISSED_KEY, "true");
    sessionStorage.removeItem(LEGACY_DISMISSED_KEY);
    setVisible(false);
  };

  const handleContinue = () => {
    navigate("/create-event");
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 dark:border-blue-800 shadow-sm">
      <CardContent className="flex items-center gap-3 py-4 px-5">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
          <HistoryIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            Continue your draft event
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 truncate">
            {draftTitle
              ? `"${draftTitle}" — your progress is saved`
              : "You have an unsaved event draft — your progress is saved"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3"
          >
            Continue
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 transition-colors p-1 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
