
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { User, Bell, Shield, Instagram, Twitter, CheckCircle2 } from "lucide-react";
import {
  getOrganiserProfile,
  updateOrganiserProfile,
} from "@workspace/api-client-react";
import PaymentMethodsCard from "./PaymentMethodsCard";

export interface OrganizerProfile {
  bio: string;
  instagram: string;
  twitter: string;
}

const PROFILE_KEY = (userId: string) => `tick3t.org-profile.${userId}`;
const EMPTY_PROFILE: OrganizerProfile = { bio: "", instagram: "", twitter: "" };

const normalizeOrganizerProfile = (value: unknown): OrganizerProfile => {
  if (!value || typeof value !== "object") return EMPTY_PROFILE;
  const profile = value as Partial<OrganizerProfile>;
  return {
    bio: typeof profile.bio === "string" ? profile.bio : "",
    instagram: typeof profile.instagram === "string" ? profile.instagram : "",
    twitter: typeof profile.twitter === "string" ? profile.twitter : "",
  };
};

export const loadOrganizerProfile = (userId: string): OrganizerProfile => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY(userId));
    if (raw) return normalizeOrganizerProfile(JSON.parse(raw));
  } catch { /* ignore */ }
  return EMPTY_PROFILE;
};

export const ORG_PROFILE_UPDATED_EVENT = "tick3t:org-profile-updated";

export const saveOrganizerProfile = (userId: string, profile: OrganizerProfile) => {
  const normalizedProfile = normalizeOrganizerProfile(profile);
  localStorage.setItem(PROFILE_KEY(userId), JSON.stringify(normalizedProfile));
  // Dispatch a same-window event so mounted components update immediately.
  // (The native `storage` event is only dispatched to *other* windows/tabs.)
  window.dispatchEvent(
    new CustomEvent(ORG_PROFILE_UPDATED_EVENT, {
      detail: { userId, profile: normalizedProfile },
    })
  );
};

export const fetchOrganizerProfile = async (userId: string): Promise<OrganizerProfile> =>
  normalizeOrganizerProfile(await getOrganiserProfile());

const OrganizerSettings = () => {
  const { user } = useAuth();
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "offline">("idle");

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    const profile = loadOrganizerProfile(user.id);
    setBio(profile.bio);
    setInstagram(profile.instagram);
    setTwitter(profile.twitter);

    fetchOrganizerProfile(user.id)
      .then((remoteProfile) => {
        if (cancelled) return;
        setBio(remoteProfile.bio);
        setInstagram(remoteProfile.instagram);
        setTwitter(remoteProfile.twitter);
        saveOrganizerProfile(user.id, remoteProfile);
      })
      .catch(() => {
        // The cached values remain available when the API is offline.
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;
    const nextProfile = { bio, instagram, twitter };
    // Update the local cache immediately so the card stays responsive offline.
    saveOrganizerProfile(user.id, nextProfile);
    setSaveState("saving");

    try {
      const persistedProfile = await updateOrganiserProfile(
        nextProfile,
      );
      saveOrganizerProfile(user.id, persistedProfile);
      setSaveState("saved");
    } catch {
      setSaveState("offline");
    }

    setTimeout(() => setSaveState("idle"), 2500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio / Tagline</Label>
            <Textarea
              id="bio"
              placeholder="Tell attendees what you're about…"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Shown on your profile card and public organiser page.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-medium flex items-center gap-1.5">
              Social Links
            </p>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-1.5">
                <Instagram className="h-3.5 w-3.5" />
                Instagram handle
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground select-none">@</span>
                <Input
                  id="instagram"
                  placeholder="yourhandle"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value.replace(/^@/, ""))}
                  className="max-w-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="flex items-center gap-1.5">
                <Twitter className="h-3.5 w-3.5" />
                Twitter / X handle
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground select-none">@</span>
                <Input
                  id="twitter"
                  placeholder="yourhandle"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value.replace(/^@/, ""))}
                  className="max-w-xs"
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saveState === "saving"} className="gap-2">
            {saveState === "saving" ? (
              "Saving…"
            ) : saveState === "saved" ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Saved!
              </>
            ) : (
              saveState === "offline" ? "Saved locally" : "Save Changes"
            )}
          </Button>
          {saveState === "offline" && (
            <p className="text-xs text-muted-foreground">
              We’ll keep your changes on this device until the API is available.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Event Reminders</p>
              <p className="text-sm text-muted-foreground">Get reminded about upcoming events</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Updates</p>
              <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button variant="outline">Update Password</Button>
        </CardContent>
      </Card>

      <PaymentMethodsCard />
    </div>
  );
};

export default OrganizerSettings;
