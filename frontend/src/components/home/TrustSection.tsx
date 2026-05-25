import { ShieldCheck, Zap, Lock, Globe, Smartphone, Cloud } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Secure",
    description: "All processing happens locally in your browser. Your files never leave your device.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "No server uploads or queues. Get instant results with client-side execution.",
  },
  {
    icon: Lock,
    title: "No Sign-up Required",
    description: "Start using any tool immediately. No registration, credentials, or limits.",
  },
  {
    icon: Globe,
    title: "Works Offline",
    description: "Once loaded, the core functions of most tools work without internet.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Fully responsive, adaptive design runs perfectly on any viewport size.",
  },
  {
    icon: Cloud,
    title: "Always Free",
    description: "No hidden charges, subscriptions, or paywalled premium options.",
  },
];

const TrustSection = () => {
  return (
    <section className="py-16 sm:py-24 border-b border-border bg-background">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Privacy & Performance
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Why Choose DailyTools247?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Built with privacy, reliability, and local processing in mind.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex flex-col justify-between rounded-lg border border-border bg-card p-5 shadow-sm hover:border-slate-300 transition-colors"
              >
                <div>
                  {/* Icon */}
                  <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-muted/40 text-muted-foreground select-none">
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="mt-4 font-bold text-foreground text-base">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
