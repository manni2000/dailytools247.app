import { ShieldCheck, Zap, Lock, Globe, Smartphone, Cloud } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Client-Side Private",
    description: "All compute happens locally in your browser memory. Your files never leave your device.",
  },
  {
    icon: Zap,
    title: "Zero Queue & Latency",
    description: "No server uploads, processing queues, or waitlists. Instant results via optimized WebAssembly.",
  },
  {
    icon: Lock,
    title: "No Sign-Up or Paywalls",
    description: "Start using any tool immediately. No registration, email collection, or usage limits.",
  },
  {
    icon: Globe,
    title: "Client Offline Capability",
    description: "Once cached, core algorithms operate seamlessly even when internet connectivity drops.",
  },
  {
    icon: Smartphone,
    title: "Adaptive Mobile UX",
    description: "Purpose-built responsive interfaces engineered for seamless touch and mobile workflows.",
  },
  {
    icon: Cloud,
    title: "Forever Free & Open",
    description: "No hidden charges, trial periods, or watermarks. Pure utility for people who want to get work done.",
  },
];

const TrustSection = () => {
  return (
    <section className="py-20 sm:py-24 border-b border-border/50 bg-background relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
          <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Architecture & Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Engineered for Privacy & Speed
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            Built from the ground up as a private browser utility platform, not a data-harvesting SaaS.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-sm hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 dark:border-white/10 dark:bg-[#0D1017] dark:hover:border-primary/40"
              >
                <div>
                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-xs group-hover:scale-105 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <h3 className="mt-4 font-bold text-foreground text-base group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
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
