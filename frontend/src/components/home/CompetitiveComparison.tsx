import { Check, X, ShieldAlert, Zap, FileCheck, Trophy } from "lucide-react";

export const CompetitiveComparison = () => {
  const stats = [
    { value: "200+", label: "Free Tools Available" },
    { value: "< 1.2s", label: "Average Local Latency" },
    { value: "5M+", label: "Secure Files Processed" },
    { value: "10K+", label: "Active Daily Users" },
  ];

  const benefits = [
    {
      icon: ShieldAlert,
      title: "Local Privacy-First Model",
      desc: "All calculations, conversions, and rendering operations happen inside your browser memory. We never transfer your sensitive files, documents, or keys to any remote servers.",
    },
    {
      icon: Zap,
      title: "Edge Engine Speed",
      desc: "By utilizing local browser engines and multithreaded JavaScript algorithms, our utility suite processes images, PDFs, and developers variables in fractions of a second.",
    },
    {
      icon: FileCheck,
      title: "Zero Watermarks & Limits",
      desc: "We don't limit file dimensions, lock batch actions behind high paywalls, or stamp ugly watermarks on output images or PDFs. Get high-definition files instantly.",
    },
    {
      icon: Trophy,
      title: "No Signups, No Paywalls",
      desc: "Skip account registration, premium logins, and credit card requests. DailyTools247 delivers a clean, modern user experience without annoying pop-ups or distractions.",
    },
  ];

  const comparisonRows = [
    {
      feature: "Cost & Fees",
      dailyTools: "100% Free Forever",
      competitors: "Heavy paywalls ($9–$19/mo)",
      isSuccess: true,
    },
    {
      feature: "Data Safety",
      dailyTools: "Local Sandbox (Zero Uploads)",
      competitors: "Files uploaded to cloud storage",
      isSuccess: true,
    },
    {
      feature: "Watermarks & Limits",
      dailyTools: "None / Unlimited",
      competitors: "Restricted sizes & branded stamps",
      isSuccess: true,
    },
    {
      feature: "User Registration",
      dailyTools: "None / Anonymous access",
      competitors: "Signups needed for premium features",
      isSuccess: true,
    },
    {
      feature: "Ad Intrusion",
      dailyTools: "Clean, minimal workspace",
      competitors: "Intrusive banners & cookie tracking",
      isSuccess: true,
    },
  ];

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-background border-b border-border/50">
      <div className="container relative z-10 mx-auto px-4">
        {/* Pitching block */}
        <div className="grid gap-12 lg:grid-cols-12 items-center mb-20 max-w-6xl mx-auto">
          {/* Pitch Left */}
          <div className="lg:col-span-5 text-left">
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
              <span>Next-Gen Architecture</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Why Choose DailyTools247?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
              We rebuilt the traditional web utility catalog. Rather than processing file streams in slow, queue-locked server clusters, we compile optimized compute code directly inside your local web browser interface.
            </p>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
              Enjoy server-grade performance, absolute security protocols, and unlimited free conversions on any device, anywhere.
            </p>
          </div>

          {/* Benefits Grid Right */}
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 border border-border/70 bg-card/70 backdrop-blur-sm hover:border-primary/40 hover:shadow-lg transition-all duration-300 rounded-2xl text-left dark:border-white/10 dark:bg-[#0D1017]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 mb-3.5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-foreground text-sm sm:text-base">{b.title}</h4>
                    <p className="text-xs text-muted-foreground font-light mt-1.5 leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Competitor comparison table */}
        <div className="max-w-4xl mx-auto mb-20 text-center">
          <div className="mb-10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Compare Against Typical Cloud Converters
            </h3>
            <p className="text-muted-foreground mt-2 text-xs sm:text-sm font-light">
              We value engineering integrity. See how client-side execution compares against legacy cloud utilities.
            </p>
          </div>

          {/* Table layout for Tablets & Desktops */}
          <div className="border border-border/70 bg-card/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm dark:border-white/10 dark:bg-[#0D1017]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/30 font-semibold text-xs sm:text-sm text-foreground">
                    <th className="p-4 sm:p-5">Feature Check</th>
                    <th className="p-4 sm:p-5 text-primary font-bold bg-primary/5">DailyTools247</th>
                    <th className="p-4 sm:p-5 text-muted-foreground font-medium">Standard Cloud Converters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-xs sm:text-sm">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 sm:p-5 font-semibold text-foreground">{row.feature}</td>
                      <td className="p-4 sm:p-5 bg-primary/5 text-primary font-semibold">
                        <span className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          {row.dailyTools}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-muted-foreground font-light">
                        <span className="flex items-center gap-2">
                          <X className="h-4 w-4 text-destructive flex-shrink-0" />
                          {row.competitors}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 text-center border border-border/70 bg-card/70 backdrop-blur-md rounded-2xl hover:border-primary/40 transition-all duration-300 dark:border-white/10 dark:bg-[#0D1017]"
              >
                <p className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground font-light mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
