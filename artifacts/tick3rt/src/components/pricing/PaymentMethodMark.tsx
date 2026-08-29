import { Landmark, WalletCards } from "lucide-react";
import { SiMastercard, SiTon, SiVisa } from "react-icons/si";

interface PaymentMethodMarkProps {
  methodId: string;
  className?: string;
  compact?: boolean;
}

const brandMarkStyles: Record<string, string> = {
  Paynow: "bg-[#1f2937] text-white",
  EcoCash: "bg-[#1f8a4c] text-white",
  OneMoney: "bg-[#f28c28] text-white",
};

const PaymentMethodMark = ({ methodId, className = "h-5 w-5", compact = false }: PaymentMethodMarkProps) => {
  const shellSize = compact ? "h-4 w-4" : "h-7 w-7";
  const cardShellSize = compact ? "h-4 w-6" : "h-7 w-9";
  const initialsSize = compact ? "text-[6px]" : "text-[10px]";
  const testId = `payment-method-mark-${methodId.toLowerCase().replace(/\s+/g, "-")}`;

  if (methodId === "Paynow" || methodId === "EcoCash" || methodId === "OneMoney") {
    const initials = methodId === "Paynow" ? "PN" : methodId === "EcoCash" ? "EC" : "OM";

    return (
      <span
        aria-hidden="true"
        data-testid={testId}
        className={`inline-flex ${shellSize} shrink-0 items-center justify-center rounded-md ${initialsSize} font-extrabold tracking-tight shadow-sm ${brandMarkStyles[methodId]}`}
      >
        {initials}
      </span>
    );
  }

  if (methodId === "Credit Card") {
    return (
      <span aria-hidden="true" data-testid={testId} className={`inline-flex ${cardShellSize} shrink-0 items-center justify-center gap-0.5 rounded-md border bg-white px-1 shadow-sm dark:bg-slate-950`}>
        <SiVisa className={compact ? "h-2 w-auto" : "h-3.5 w-auto"} title="Visa" />
        <SiMastercard className={compact ? "h-2 w-auto" : "h-3.5 w-auto"} title="Mastercard" />
      </span>
    );
  }

  if (methodId === "TON") {
    return (
      <span aria-hidden="true" data-testid={testId} className={`inline-flex ${shellSize} shrink-0 items-center justify-center rounded-md bg-[#0098ea]/10 text-[#0098ea]`}>
        <SiTon className={className} title="TON" />
      </span>
    );
  }

  if (methodId === "Bank Transfer") {
    return (
      <span aria-hidden="true" data-testid={testId} className={`inline-flex ${shellSize} shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300`}>
        <Landmark className={className} />
      </span>
    );
  }

  return (
    <span aria-hidden="true" data-testid={testId} className={`inline-flex ${shellSize} shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300`}>
      <WalletCards className={className} />
    </span>
  );
};

export default PaymentMethodMark;