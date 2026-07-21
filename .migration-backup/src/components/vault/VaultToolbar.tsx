import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Search, SlidersHorizontal, LayoutGrid, Rows3, X, Sparkles, Music, BadgeCheck,
  GraduationCap, Gift, Award, AtSign, ArrowUpDown, ChevronDown
} from "lucide-react";

export type VaultCategoryValue = "concert" | "membership" | "course" | "giftcard" | "badge" | "username";
export type VaultCategoryFilter = "all" | VaultCategoryValue;
export type VaultStatusFilter = "all" | "valid" | "used";
export type VaultSort = "date-desc" | "date-asc" | "price-desc" | "price-asc" | "name";
export type VaultLayout = "grid" | "list";

const CAT_ICONS: Record<VaultCategoryValue, { label: string; icon: any }> = {
  concert:    { label: "Tickets",     icon: Music },
  membership: { label: "Memberships", icon: BadgeCheck },
  course:     { label: "Credentials", icon: GraduationCap },
  giftcard:   { label: "Gift Cards",  icon: Gift },
  badge:      { label: "Badges",      icon: Award },
  username:   { label: "Usernames",   icon: AtSign },
};

const SORT_LABELS: Record<VaultSort, string> = {
  "date-desc": "Newest first",
  "date-asc": "Oldest first",
  "price-desc": "Price: High → Low",
  "price-asc": "Price: Low → High",
  "name": "Name (A → Z)",
};

interface VaultToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: VaultCategoryFilter;
  onCategoryChange: (v: VaultCategoryFilter) => void;
  status: VaultStatusFilter;
  onStatusChange: (v: VaultStatusFilter) => void;
  sort: VaultSort;
  onSortChange: (v: VaultSort) => void;
  layout: VaultLayout;
  onLayoutChange: (v: VaultLayout) => void;
  tickets: Array<{ status: string; category: VaultCategoryValue }>;
}

export const VaultToolbar = ({
  search, onSearchChange,
  category, onCategoryChange,
  status, onStatusChange,
  sort, onSortChange,
  layout, onLayoutChange,
  tickets,
}: VaultToolbarProps) => {
  const [open, setOpen] = useState(false);

  const categoryCount = (v: VaultCategoryFilter) =>
    v === "all" ? tickets.length : tickets.filter((t) => t.category === v).length;
  const statusCount = (v: VaultStatusFilter) =>
    v === "all" ? tickets.length : tickets.filter((t) => t.status === v).length;

  const activeCount =
    (category !== "all" ? 1 : 0) +
    (status !== "all" ? 1 : 0) +
    (sort !== "date-desc" ? 1 : 0);

  const resetAll = () => {
    onCategoryChange("all");
    onStatusChange("all");
    onSortChange("date-desc");
  };

  const activeChips: Array<{ key: string; label: string; onClear: () => void }> = [];
  if (category !== "all") {
    activeChips.push({
      key: "cat",
      label: CAT_ICONS[category].label,
      onClear: () => onCategoryChange("all"),
    });
  }
  if (status !== "all") {
    activeChips.push({
      key: "status",
      label: status === "valid" ? "Valid" : "Used",
      onClear: () => onStatusChange("all"),
    });
  }
  if (sort !== "date-desc") {
    activeChips.push({
      key: "sort",
      label: SORT_LABELS[sort],
      onClear: () => onSortChange("date-desc"),
    });
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-3 space-y-3">
      {/* Row 1: Search + Filters + Layout */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your vault..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 bg-background/50 border-border/60"
          />
        </div>
        <Button
          type="button"
          variant={open || activeCount > 0 ? "default" : "outline"}
          size="sm"
          onClick={() => setOpen((v) => !v)}
          className="h-10 shrink-0 gap-1.5 px-3"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-background/25 text-[10px] font-semibold">
              {activeCount}
            </span>
          )}
          <ChevronDown className={`h-3.5 w-3.5 opacity-70 transition-transform ${open ? "rotate-180" : ""}`} />
        </Button>
        <div className="inline-flex h-10 items-center rounded-md border border-border/60 bg-background/50 p-0.5 shrink-0">
          <button
            type="button"
            onClick={() => onLayoutChange("grid")}
            aria-label="Grid view"
            aria-pressed={layout === "grid"}
            className={`flex h-9 w-9 items-center justify-center rounded-sm transition-colors ${layout === "grid" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onLayoutChange("list")}
            aria-label="List view"
            aria-pressed={layout === "list"}
            className={`flex h-9 w-9 items-center justify-center rounded-sm transition-colors ${layout === "list" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Rows3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Active chips (visible when filters applied and panel is closed) */}
      {activeChips.length > 0 && !open && (
        <div className="flex flex-wrap items-center gap-1.5">
          {activeChips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={c.onClear}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 h-7 text-xs font-medium hover:bg-primary/15"
            >
              {c.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            type="button"
            onClick={resetAll}
            className="text-xs text-muted-foreground hover:text-foreground ml-1 underline underline-offset-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Collapsible filter panel */}
      {open && (
        <div className="rounded-xl border border-border/60 bg-background/40 p-3 space-y-4">
          {/* Category */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Category</p>
            <div className="flex flex-wrap gap-1.5">
              {([
                { v: "all" as const, label: "All", icon: Sparkles },
                ...(Object.entries(CAT_ICONS).map(([v, m]) => ({ v: v as VaultCategoryValue, label: m.label, icon: m.icon }))),
              ]).map((c) => {
                const active = category === c.v;
                const Icon = c.icon;
                return (
                  <button
                    key={c.v}
                    type="button"
                    onClick={() => onCategoryChange(c.v)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-xs font-medium transition-colors border ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background/60 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {c.label}
                    <span className={`text-[10px] px-1.5 rounded-full ${active ? "bg-primary-foreground/20" : "bg-muted"}`}>
                      {categoryCount(c.v)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status + Sort row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Status</p>
              <div className="flex flex-wrap gap-1.5">
                {([
                  { v: "all" as const, label: "All" },
                  { v: "valid" as const, label: "Valid" },
                  { v: "used" as const, label: "Used" },
                ]).map((s) => {
                  const active = status === s.v;
                  return (
                    <button
                      key={s.v}
                      type="button"
                      onClick={() => onStatusChange(s.v)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-xs font-medium transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {s.label}
                      <span className={`text-[10px] px-1.5 rounded-full ${active ? "bg-primary-foreground/20" : "bg-background/60"}`}>
                        {statusCount(s.v)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Sort by</p>
              <Select value={sort} onValueChange={(v) => onSortChange(v as VaultSort)}>
                <SelectTrigger className="h-9 w-full bg-background/60 border-border/60 text-xs">
                  <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SORT_LABELS).map(([v, label]) => (
                    <SelectItem key={v} value={v}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeCount > 0 && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={resetAll}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
