import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronRight, Ticket, Cpu, Shield, CreditCard, Gift,
  HelpCircle, LogOut, Copy, Check, Pencil, Wallet, CheckCircle, Bell,
} from "lucide-react";

function genReferral(name: string) {
  const slug = name.replace(/\s/g, "").toUpperCase().slice(0, 4) || "USER";
  const hash = Math.abs(name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 9000) + 1000;
  return `TICK3T-${slug}-${hash}`;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SettingsDialog({ open, onClose }: Props) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Notifications
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifResale, setNotifResale] = useState(true);
  const [notifTransfers, setNotifTransfers] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);

  // Security
  const [twoFA, setTwoFA] = useState(false);
  const [biometric, setBiometric] = useState(true);

  // Paynow
  const [paynowPhone, setPaynowPhone] = useState("");
  const [paynowName, setPaynowName] = useState("");
  const [paynowEmail, setPaynowEmail] = useState("");
  const [paynowSaved, setPaynowSaved] = useState(false);

  // Wallet
  const [walletAddress, setWalletAddress] = useState("");
  const [walletSaved, setWalletSaved] = useState(false);

  // Referral copy
  const [copied, setCopied] = useState(false);

  // Expanded rows
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const toggleRow = (key: string) => setExpandedRow(prev => prev === key ? null : key);

  const displayName = user?.name ?? "Guest";
  const referralCode = genReferral(displayName);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Referral code copied to clipboard." });
  };

  const handleSavePaynow = () => {
    if (!paynowPhone.trim()) {
      toast({ title: "Required", description: "Enter your Paynow phone number.", variant: "destructive" });
      return;
    }
    setPaynowSaved(true);
    setTimeout(() => { setPaynowSaved(false); setExpandedRow(null); }, 1500);
    toast({ title: "Paynow saved" });
  };

  const handleSaveWallet = () => {
    if (!walletAddress.trim().startsWith("EQ") && !walletAddress.trim().startsWith("UQ")) {
      toast({ title: "Invalid address", description: "TON addresses start with EQ… or UQ…", variant: "destructive" });
      return;
    }
    setWalletSaved(true);
    setTimeout(() => { setWalletSaved(false); setExpandedRow(null); }, 1500);
    toast({ title: "Wallet connected" });
  };

  const handleSignOut = () => {
    onClose();
    logout();
    navigate("/");
    toast({ title: "Signed out" });
  };

  // ── Menu row ──────────────────────────────────────────────────────────────
  const MenuRow = ({
    icon: Icon,
    label,
    value,
    rowKey,
    danger,
    onClick,
    iconColor = "text-foreground",
    iconBg = "bg-muted",
  }: {
    icon: React.ElementType;
    label: string;
    value?: string;
    rowKey?: string;
    danger?: boolean;
    onClick?: () => void;
    iconColor?: string;
    iconBg?: string;
  }) => {
    const isExpanded = rowKey ? expandedRow === rowKey : false;
    const handleClick = onClick ?? (rowKey ? () => toggleRow(rowKey) : undefined);
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors ${
          danger ? "hover:bg-destructive/5" : "hover:bg-muted/60"
        }`}
      >
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-4 w-4 ${danger ? "text-destructive" : iconColor}`} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className={`text-sm font-medium ${danger ? "text-destructive" : ""}`}>{label}</p>
          {value && <p className="text-xs text-muted-foreground truncate">{value}</p>}
        </div>
        {!danger && (
          <ChevronRight
            className={`h-4 w-4 text-muted-foreground/50 transition-transform ${isExpanded ? "rotate-90" : ""}`}
          />
        )}
      </button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md w-full p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="px-5 pt-5 pb-4 border-b shrink-0">
          <DialogTitle className="text-lg font-black tracking-tight">Settings</DialogTitle>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">

          {/* Referral card */}
          <div className="px-4 pt-4 pb-2">
            <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-violet-500/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Gift className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">Refer Friends</p>
                  <p className="text-[11px] text-muted-foreground">Share your code and earn rewards</p>
                  <div className="mt-2 flex items-center gap-2">
                    <code className="flex-1 rounded-md bg-background/80 border border-border/60 px-2 py-1 text-[11px] font-mono font-bold tracking-wider truncate">
                      {referralCode}
                    </code>
                    <button
                      onClick={handleCopyReferral}
                      className="shrink-0 flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-2.5 py-1 text-[11px] font-semibold transition-all hover:opacity-90 active:scale-95"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="divide-y divide-border/60 mt-2">

            {/* My Tickets */}
            <MenuRow
              icon={Ticket}
              label="My Tickets"
              value="Visit Vault to see your collection"
              iconColor="text-primary"
              iconBg="bg-primary/10"
              onClick={() => { onClose(); navigate("/vault"); }}
            />

            {/* NFT Wallet */}
            <MenuRow
              icon={Cpu}
              label="NFT Wallet"
              value={walletAddress ? walletAddress.slice(0, 10) + "…" : "TON Blockchain · not linked"}
              rowKey="wallet"
              iconColor="text-violet-500"
              iconBg="bg-violet-500/10"
            />
            {expandedRow === "wallet" && (
              <div className="px-4 pb-4 pt-3 bg-muted/30 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Connect your TON wallet to receive NFT tickets. Addresses start with EQ… or UQ…
                </p>
                <div className="space-y-1.5">
                  <Label className="text-xs">Wallet Address</Label>
                  <Input
                    placeholder="EQx…"
                    value={walletAddress}
                    onChange={e => setWalletAddress(e.target.value)}
                    className="h-8 text-sm font-mono"
                  />
                </div>
                <div className="flex gap-2">
                  {walletSaved
                    ? <div className="flex items-center gap-1.5 text-sm text-emerald-500 font-semibold"><CheckCircle className="h-4 w-4" /> Connected!</div>
                    : <Button size="sm" onClick={handleSaveWallet} className="h-8">Connect Wallet</Button>
                  }
                  <Button size="sm" variant="ghost" onClick={() => setExpandedRow(null)} className="h-8">Cancel</Button>
                </div>
              </div>
            )}

            {/* Notifications */}
            <MenuRow
              icon={Bell}
              label="Notifications"
              value={`${[notifEvents, notifResale, notifTransfers, notifMarketing].filter(Boolean).length} active`}
              rowKey="notif"
              iconColor="text-amber-500"
              iconBg="bg-amber-500/10"
            />
            {expandedRow === "notif" && (
              <div className="px-4 pb-4 pt-3 bg-muted/30 space-y-3">
                {[
                  { label: "New events from followed organisers", value: notifEvents, set: setNotifEvents },
                  { label: "Resale & price drop alerts", value: notifResale, set: setNotifResale },
                  { label: "Ticket transfers", value: notifTransfers, set: setNotifTransfers },
                  { label: "Marketing & promos", value: notifMarketing, set: setNotifMarketing },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between gap-3">
                    <Label className="text-xs font-normal cursor-pointer">{item.label}</Label>
                    <Switch checked={item.value} onCheckedChange={item.set} />
                  </div>
                ))}
              </div>
            )}

            {/* Security */}
            <MenuRow
              icon={Shield}
              label="Security"
              value={`2FA: ${twoFA ? "On" : "Off"} · Biometric: ${biometric ? "On" : "Off"}`}
              rowKey="security"
              iconColor="text-emerald-500"
              iconBg="bg-emerald-500/10"
            />
            {expandedRow === "security" && (
              <div className="px-4 pb-4 pt-3 bg-muted/30 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-xs font-normal cursor-pointer">Two-factor authentication (2FA)</Label>
                  <Switch checked={twoFA} onCheckedChange={setTwoFA} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-xs font-normal cursor-pointer">Biometric login</Label>
                  <Switch checked={biometric} onCheckedChange={setBiometric} />
                </div>
              </div>
            )}

            {/* Paynow */}
            <MenuRow
              icon={CreditCard}
              label="Paynow"
              value={paynowPhone || "Not linked"}
              rowKey="paynow"
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
            />
            {expandedRow === "paynow" && (
              <div className="px-4 pb-4 pt-3 bg-muted/30 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Add your Paynow details for faster purchases and resale withdrawals.
                </p>
                <div className="space-y-1.5">
                  <Label className="text-xs">Phone Number</Label>
                  <Input placeholder="e.g. 0771234567" value={paynowPhone} onChange={e => setPaynowPhone(e.target.value)} className="h-8 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Account Holder Name</Label>
                  <Input placeholder="Your full name" value={paynowName} onChange={e => setPaynowName(e.target.value)} className="h-8 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Email (optional)</Label>
                  <Input type="email" placeholder="email@example.com" value={paynowEmail} onChange={e => setPaynowEmail(e.target.value)} className="h-8 text-sm" />
                </div>
                <div className="flex gap-2">
                  {paynowSaved
                    ? <div className="flex items-center gap-1.5 text-sm text-emerald-500 font-semibold"><CheckCircle className="h-4 w-4" /> Saved!</div>
                    : <Button size="sm" onClick={handleSavePaynow} className="h-8">Save Details</Button>
                  }
                  <Button size="sm" variant="ghost" onClick={() => setExpandedRow(null)} className="h-8">Cancel</Button>
                </div>
              </div>
            )}

            {/* Account Details */}
            <MenuRow
              icon={Pencil}
              label="Account Details"
              value={user?.name ?? ""}
              rowKey="account"
              iconBg="bg-muted"
              iconColor="text-foreground"
            />
            {expandedRow === "account" && (
              <div className="px-4 pb-4 pt-3 bg-muted/30 space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Full Name</Label>
                  <Input defaultValue={user?.name} className="h-8 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Email</Label>
                  <Input defaultValue={user?.email} disabled className="h-8 text-sm opacity-60" />
                </div>
                <Button size="sm" className="h-8">Save Changes</Button>
              </div>
            )}

            {/* Help */}
            <MenuRow
              icon={HelpCircle}
              label="Help & Support"
              value="FAQs, contact us"
              rowKey="help"
              iconBg="bg-muted"
              iconColor="text-foreground"
            />
            {expandedRow === "help" && (
              <div className="px-4 pb-4 pt-3 bg-muted/30 space-y-1.5 text-sm text-muted-foreground">
                <p>📧 support@tick3t.app</p>
                <p>💬 Live chat Mon–Fri, 9am–6pm CAT</p>
              </div>
            )}

            {/* Wallet notice */}
            <div className="px-4 py-3 flex items-start gap-2">
              <Wallet className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground">
                Payment details are encrypted and only used for ticket purchases and resale payouts.
              </p>
            </div>

            {/* Sign out */}
            <MenuRow
              icon={LogOut}
              label="Sign Out"
              danger
              onClick={handleSignOut}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
