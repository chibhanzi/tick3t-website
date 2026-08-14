import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Code2,
  KeyRound,
  Radio,
  Instagram,
  Twitter,
  Twitch,
  Youtube,
  ShieldCheck,
  Webhook,
  Terminal,
  Copy,
  BookOpen,
  Sparkles,
  Lock,
  Zap,
  Globe,
} from "lucide-react";

const CodeBlock = ({ code, lang = "bash" }: { code: string; lang?: string }) => {
  const copy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard");
  };
  return (
    <div className="relative group">
      <div className="absolute right-3 top-3 z-10">
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={copy}>
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-2 text-xs font-mono text-muted-foreground rounded-t-lg">
        <Terminal className="h-3 w-3" />
        {lang}
      </div>
      <pre className="overflow-x-auto rounded-b-lg border border-t-0 border-border/60 bg-muted/20 p-4 text-xs leading-relaxed">
        <code className="font-mono text-foreground/90">{code}</code>
      </pre>
    </div>
  );
};

const platforms = [
  { name: "Instagram Live", icon: Instagram, desc: "Gate IG Lives to ticket holders via webhook + join links.", color: "from-pink-500 to-purple-600" },
  { name: "X (Twitter) Spaces", icon: Twitter, desc: "Restrict Spaces access to verified NFT ticket holders.", color: "from-sky-500 to-blue-600" },
  { name: "Twitch Events", icon: Twitch, desc: "Subscriber-only streams gated by on-chain ticket ownership.", color: "from-purple-500 to-indigo-600" },
  { name: "YouTube Live", icon: Youtube, desc: "Unlisted premieres unlocked with a valid Tick3t token.", color: "from-red-500 to-rose-600" },
  { name: "Zoom / Meet", icon: Radio, desc: "Auto-issue meeting links to holders 15 mins before start.", color: "from-cyan-500 to-teal-600" },
  { name: "Custom / Web", icon: Globe, desc: "Drop-in JS SDK to gate any web experience.", color: "from-emerald-500 to-green-600" },
];

const DeveloperPortal = () => {
  const [apiKey] = useState("tk3_live_sk_••••••••••••••••••••7f2a");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--primary)/0.15),transparent_70%)]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-72 w-[80%] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 gap-1.5 border-primary/30 bg-primary/5 text-primary">
              <Sparkles className="h-3 w-3" /> Developer Portal · Beta
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              The identity & access layer for
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                the live experience economy
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Gate Instagram Lives, X Spaces, Twitch streams and beyond to verified ticket & token holders.
              One SDK. Any platform. Powered by Tick3t.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="gap-2">
                <KeyRound className="h-4 w-4" /> Get API Keys
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" /> Read the Docs
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> On-chain verification</span>
              <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" /> &lt;100ms token checks</span>
              <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-primary" /> Zero-PII gating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms grid */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Build for every platform</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Turn any social surface into a ticketed, token-gated venue.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((p) => (
            <Card key={p.name} className="group relative overflow-hidden border-border/60 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${p.color}`} />
              <CardHeader>
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${p.color} text-white shadow-md`}>
                  <p.icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-3 text-lg">{p.name}</CardTitle>
                <CardDescription>{p.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Quickstart */}
      <section className="border-y border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <Badge variant="outline" className="mb-3">Quickstart</Badge>
              <h2 className="text-2xl font-bold sm:text-3xl">Gate a livestream in 3 steps</h2>
            </div>

            <Tabs defaultValue="node" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="node"><Code2 className="mr-2 h-3.5 w-3.5" />Node.js</TabsTrigger>
                <TabsTrigger value="js"><Code2 className="mr-2 h-3.5 w-3.5" />Browser JS</TabsTrigger>
                <TabsTrigger value="curl"><Terminal className="mr-2 h-3.5 w-3.5" />REST</TabsTrigger>
              </TabsList>

              <TabsContent value="node" className="mt-4 space-y-4">
                <CodeBlock lang="bash" code={`npm install @tick3t/sdk`} />
                <CodeBlock lang="typescript" code={`import { Tick3t } from '@tick3t/sdk';

const tick3rt = new Tick3t({ apiKey: process.env.TICK3T_API_KEY });

// Verify a fan holds a valid ticket before granting stream access
const access = await tick3rt.gates.verify({
  eventId: 'evt_9k2n',
  wallet: '0xAbc...',           // or userId / email
  platform: 'instagram_live',
});

if (access.granted) {
  return { streamUrl: access.joinUrl, expiresAt: access.expiresAt };
}`} />
              </TabsContent>

              <TabsContent value="js" className="mt-4 space-y-4">
                <CodeBlock lang="html" code={`<script src="https://cdn.tick3t.com/v1/gate.js"></script>
<div data-tick3t-gate="evt_9k2n" data-platform="x_spaces"></div>`} />
              </TabsContent>

              <TabsContent value="curl" className="mt-4 space-y-4">
                <CodeBlock lang="bash" code={`curl -X POST https://api.tick3t.com/v1/gates/verify \\
  -H "Authorization: Bearer $TICK3T_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "eventId": "evt_9k2n",
    "wallet": "0xAbc...",
    "platform": "twitch"
  }'`} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* API Keys + Webhooks */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/60">
            <CardHeader>
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                <CardTitle>API Keys</CardTitle>
              </div>
              <CardDescription>Test and live keys for your integrations. Keep them secret.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px]">LIVE</Badge>
                  <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs" onClick={() => { navigator.clipboard.writeText(apiKey); toast.success("API key copied"); }}>
                    <Copy className="h-3 w-3" /> Copy
                  </Button>
                </div>
                <code className="font-mono text-xs text-foreground/80">{apiKey}</code>
              </div>
              <Button variant="outline" className="w-full">Generate new key</Button>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Webhook className="h-5 w-5 text-primary" />
                <CardTitle>Webhooks</CardTitle>
              </div>
              <CardDescription>Receive real-time events when tickets mint, transfer or are redeemed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="https://your-app.com/webhooks/tick3t" />
              <div className="flex flex-wrap gap-1.5">
                {["ticket.minted", "ticket.transferred", "gate.access_granted", "gate.access_denied"].map((e) => (
                  <Badge key={e} variant="secondary" className="text-[10px] font-mono">{e}</Badge>
                ))}
              </div>
              <Button variant="outline" className="w-full">Save endpoint</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use cases / positioning */}
      <section className="border-t border-border/40 bg-muted/10">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">More than a marketplace</h2>
            <p className="mt-3 text-muted-foreground">
              Tick3t is becoming the industry-standard identity & access layer for
              creators, communities and platforms. Sell once, gate everywhere.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Verifiable ownership", desc: "Every ticket is a signed, on-chain credential — impossible to fake." },
              { icon: Zap, title: "Universal SDK", desc: "One integration unlocks IG, X, Twitch, YouTube, Zoom and custom apps." },
              { icon: Lock, title: "Zero-PII by default", desc: "Gate access without ever handling personal data." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-border/60 bg-background/60 p-5 backdrop-blur">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-4 w-4" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background p-8 text-center">
            <h3 className="text-xl font-bold">Ready to build?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Join the Tick3t developer program and get early access to platform partnerships.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <Button className="gap-2"><KeyRound className="h-4 w-4" /> Request API access</Button>
              <Button variant="outline" className="gap-2"><BookOpen className="h-4 w-4" /> Full documentation</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DeveloperPortal;
