import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Coins,
  Link2,
  Mail,
  PenTool,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Zap,
  Lock,
  Unlock,
  ChevronDown,
  Check,
  HelpCircle,
  TrendingUp,
  BookmarkCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHelmet from "@/components/SEOHelmet";

const regulations = [
  {
    title: "Editorial control",
    summary: "We may edit headlines, formatting, images, and copy for clarity, SEO, and consistency.",
    tone: "neutral",
  },
  {
    title: "One-time publication fee",
    summary: "It is 100% free to write and submit. Accepted submissions carry a flat one-time $10 publication fee.",
    tone: "accent",
  },
  {
    title: "Promote your startup",
    summary: "You are welcome to advertise, list your startup, promote your own business, and showcase your products.",
    tone: "accent",
  },
  {
    title: "Get backlinks",
    summary: "You can include backlinks to your own business, startup, or website to drive traffic and boost SEO.",
    tone: "neutral",
  },
  {
    title: "Content quality",
    summary: "We do not accept duplicate content, AI-generated spam, adult content, gambling, or deceptive claims.",
    tone: "danger",
  },
  {
    title: "Ownership",
    summary: "By submitting, you confirm you have the right to publish the content and any assets included.",
    tone: "neutral",
  },
];

const submissionSteps = [
  {
    title: "Send your draft",
    description: "Email the article idea or finished draft, showcasing your startup or business and including backlink details. Submission is 100% free.",
    icon: Mail,
  },
  {
    title: "Editorial review",
    description: "We check for originality, structure, clarity, and promotional alignment before moving it forward.",
    icon: BadgeCheck,
  },
  {
    title: "Publish and promote",
    description: "After approval and the one-time $10 fee processing, the article is published with your backlink.",
    icon: Zap,
  },
];

const faqs = [
  {
    question: "How long should my guest post be?",
    answer: "Aim for at least 800 words. Longer posts are welcome if they stay useful, specific, and well structured.",
  },
  {
    question: "Can I promote my own business or startup?",
    answer: "Yes, you can advertise and list your own startup or business in the form of an article, which acts as a valuable backlink. You can promote your business, product, or anything you want.",
  },
  {
    question: "Is there a fee to write or submit?",
    answer: "Writing and submitting articles is completely free. We only charge a flat one-time $10 fee for review and publication processing after your article is accepted.",
  },
  {
    question: "How do I submit my article?",
    answer: "Email your draft, headline idea, and any supporting details to manishmandal9734@gmail.com.",
  },
];

const howTo = {
  name: "Submit a guest post to DailyTools247",
  description: "A simple editorial process for sending an original guest article. Submitting is free, with a flat one-time $10 fee upon publication.",
  steps: [
    {
      name: "Prepare your draft",
      text: "Write an original article of at least 800 words, showcasing your startup or business and including your backlink.",
    },
    {
      name: "Email the submission",
      text: "Send the draft, headline idea, and any supporting details to manishmandal9734@gmail.com.",
    },
    {
      name: "Complete review and publish",
      text: "We review the article for quality. Once accepted, we publish it for a one-time $10 fee.",
    },
  ],
};

const checklistRequirements = [
  { id: 1, text: "Original & unpublished article (at least 800 words)" },
  { id: 2, text: "Topic focused on tech, tools, SEO, productivity, or business guides" },
  { id: 3, text: "Includes a mention, bio, or links to your startup/business" },
  { id: 4, text: "Easy-to-scan structure with clear descriptive headings and short paragraphs" },
  { id: 5, text: "Acknowledged the flat, one-time $10 publication fee upon acceptance" }
];

const WriteForUs = () => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleCheck = (id: number) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  const checkedCount = checklistRequirements.filter(item => checkedItems[item.id]).length;
  const progressPercentage = (checkedCount / checklistRequirements.length) * 100;
  const isAllChecked = checkedCount === checklistRequirements.length;

  const mailtoUrl = "mailto:manishmandal9734@gmail.com?subject=Guest%20Post%20Submission%20for%20DailyTools247&body=Hi%20Manish,%0D%0A%0D%0AI%20have%20reviewed%20the%20guidelines%20and%20completed%20the%20checklist.%20Here%20is%20my%20guest%20post%20pitch/draft...%0D%0A%0D%0AStartup/Business%20Website:%20%0D%0AProposed%20Headline:%20";

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground selection:bg-primary/20">
      <SEOHelmet
        title="Write for Us - Guest Post Submission | DailyTools247"
        description="Write for us at DailyTools247. Submit original guest posts for a highly targeted tech audience. Promote your startup or business, get backlinks, and publish for a one-time $10 fee."
        keywords={[
          "write for us",
          "guest post guidelines",
          "guest post submission",
          "guest author submission",
          "write for us guest post",
          "guest post article",
          "DailyTools247 blog write for us",
          "submit guest post",
          "guest blogging opportunity",
        ]}
        image="/og-image.webp"
        url="https://www.dailytools247.app/write-for-us"
        canonical="https://www.dailytools247.app/write-for-us"
        type="website"
        ogType="article"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Write for Us | Guest Post Submission at DailyTools247',
          description: 'Guest post guidelines, startup promotion, and publication fee for DailyTools247 blog contributors.',
          url: 'https://www.dailytools247.app/write-for-us',
          inLanguage: 'en',
          isPartOf: {
            '@type': 'WebSite',
            name: 'DailyTools247',
            url: 'https://www.dailytools247.app',
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.dailytools247.app',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Write for Us',
                item: 'https://www.dailytools247.app/write-for-us',
              },
            ],
          },
        }}
        howTo={howTo}
        faqs={faqs}
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.15),transparent_40%),linear-gradient(135deg,rgba(15,23,42,0.01),rgba(45,212,191,0.05),rgba(59,130,246,0.02))] py-20 sm:py-24 md:py-32">
          {/* Decorative Grid and Blurs */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute inset-0">
            <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl opacity-75" />
            <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl opacity-75" />
          </div>

          <div className="container relative z-10">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm backdrop-blur-sm">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    Guest Posting Open
                  </div>

                  <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl leading-[1.1]">
                    Write for Us & Promote Your <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">Startup</span>
                  </h1>

                  <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                    Share a practical, original article with our targeted tech audience. Showcase your business, earn high-quality permanent backlinks, and drive direct traffic.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <a
                      href="#checklist-section"
                      className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98]"
                    >
                      Start Submission Checklist
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                    <Link
                      to="/blogs"
                      className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/55 px-6 py-3.5 text-sm font-semibold shadow-sm backdrop-blur-sm transition-all hover:bg-muted hover:border-muted-foreground/20"
                    >
                      Read Our Blog
                    </Link>
                  </div>
                </motion.div>

                {/* Stat Cards Grid */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1"
                >
                  {[
                    {
                      icon: TimerReset,
                      title: "800+ Words",
                      desc: "Actionable, well-structured, original posts that teach a specific topic.",
                      color: "from-teal-500/20 to-emerald-500/20 text-teal-600 dark:text-teal-400"
                    },
                    {
                      icon: Link2,
                      title: "Permanent Backlinks",
                      desc: "Naturally promote your startup or project inside the body of the article.",
                      color: "from-blue-500/20 to-sky-500/20 text-blue-600 dark:text-blue-400"
                    },
                    {
                      icon: Coins,
                      title: "Flat $10 Publication Fee",
                      desc: "100% free submission and editing. Only pay if your article is approved & published.",
                      color: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400"
                    }
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={i}
                        className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md lg:flex lg:items-start lg:gap-4"
                      >
                        <div className={`mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} lg:mb-0`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{stat.title}</h3>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits & Transparency Grid */}
        <section className="py-20 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-5xl">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Why Contribute Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-card to-background p-8 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md"
                >
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors" />
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                    <PenTool className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Why Write For DailyTools247?</h2>
                  <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
                    <p>
                      Our reader base is highly technical, consisting of developers, builders, marketers, and productivity enthusiasts actively searching for web tools and digital guides.
                    </p>
                    <p>
                      By contributing, you put your startup or utility directly in front of power users. Rather than floating in standard search queries, your backlinks will drive targeted traffic and build durable search engine authority.
                    </p>
                    <p>
                      We keep editorial turnarounds fast, index content quickly on search engines, and work collaboratively to polish your draft.
                    </p>
                  </div>
                </motion.div>

                {/* Submission Fee Transparency Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-card to-background p-8 shadow-sm transition-all duration-300 hover:border-sky-500/20 hover:shadow-md"
                >
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-sky-500/5 blur-2xl group-hover:bg-sky-500/10 transition-colors" />
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500 mb-6">
                    <Coins className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Fee Transparency</h2>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    Submitting drafts and undergoing initial review is always free. To cover administrative reviews, SEO editing, structure formatting, and hosting costs, we request a flat publication processing fee only after acceptance.
                  </p>
                  <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-5">
                    <div className="flex items-baseline justify-between border-b border-border/60 pb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">Flat Rate</span>
                      <span className="text-2xl font-black text-foreground">$10 <span className="text-xs font-normal text-muted-foreground">one-time</span></span>
                    </div>
                    <ul className="mt-4 space-y-3 text-xs text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>Fast-tracked editorial review (under 48h)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>Up to 2 permanent do-follow backlinks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>Full SEO markup & structured data integration</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>No recurring or hidden maintenance charges</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Rules & Regulations Grid */}
        <section className="border-y border-border bg-gradient-to-b from-muted/30 to-background/20 py-20 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-5xl">
              <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                {/* Sticky Header info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-5 lg:sticky lg:top-24"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                    <ShieldCheck className="h-4 w-4" />
                    Editorial Standards
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Publishing Guidelines & Regulations
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    We maintain a strict quality bar to make sure articles add genuine value to our readers. Read the terms below before preparing your post.
                  </p>

                  <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Topics we cover:</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Web Tools", "Software Guides", "Developer Utilities", "SEO & Marketing", "Productivity Hacks", "SaaS Showcases"].map((tag, idx) => (
                        <span key={idx} className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground border border-border/40">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Regulations Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {regulations.map((rule, index) => {
                    const toneStyles = {
                      neutral: "border-border bg-card hover:border-primary/25",
                      accent: "border-primary/20 bg-primary/5 hover:border-primary/45",
                      warning: "border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40",
                      danger: "border-rose-500/25 bg-rose-500/5 hover:border-rose-500/45",
                    } as const;

                    const toneClasses = toneStyles[rule.tone as keyof typeof toneStyles] || toneStyles.neutral;

                    return (
                      <motion.div
                        key={rule.title}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:shadow-md ${toneClasses}`}
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-background text-xs font-bold text-primary shadow-sm border border-border">
                            {index + 1}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${rule.tone === 'danger'
                            ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                            : rule.tone === 'accent'
                              ? 'bg-primary/10 text-primary border-primary/20'
                              : 'bg-muted text-muted-foreground border-border/60'
                            }`}>
                            {rule.tone}
                          </span>
                        </div>
                        <h3 className="font-bold text-foreground text-sm">{rule.title}</h3>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{rule.summary}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Stepper Section */}
        <section className="py-20 md:py-24 bg-background">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-col items-center text-center space-y-4 mb-14">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-500">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Submission Flow
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Step-by-Step Publication Process
                </h2>
                <p className="max-w-xl text-sm text-muted-foreground">
                  Our publication process is transparent, structured, and fast. Here is what happens from drafting to live publication:
                </p>
              </div>

              {/* Stepper Timeline UI */}
              <div className="relative grid gap-8 md:grid-cols-3">
                {/* Horizontal line for desktop stepper layout */}
                <div className="absolute left-[8%] right-[8%] top-[2.5rem] hidden h-0.5 bg-gradient-to-r from-primary/30 via-sky-500/30 to-muted border-t border-dashed md:block" />

                {submissionSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Step Indicator Frame */}
                      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-sky-500 text-primary-foreground shadow-md transition-transform group-hover:scale-105 duration-300">
                        <Icon className="h-6 w-6" />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background border border-border text-[10px] font-bold text-foreground shadow-sm">
                          {index + 1}
                        </span>
                      </div>

                      <h3 className="mt-5 font-bold text-lg text-foreground">{step.title}</h3>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Guideline Checklist Widget */}
        <section id="checklist-section" className="py-20 md:py-24 border-t border-border bg-gradient-to-b from-background to-muted/20">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-md md:p-10"
              >
                {/* Gradient background glow inside the card */}
                <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-sky-500/5 blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3">
                    <BookmarkCheck className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold md:text-3xl">Submission Checklist</h2>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Complete this quick interactive checklist to verify that your draft aligns with our editorial guidelines and unlock the submission trigger.
                  </p>

                  {/* Progress Indicator */}
                  <div className="mt-8 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Checklist Completion</span>
                      <span className="text-primary">{checkedCount} of {checklistRequirements.length} completed ({Math.round(progressPercentage)}%)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted border border-border/40">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-sky-500"
                      />
                    </div>
                  </div>

                  {/* Checklist items */}
                  <div className="mt-8 space-y-3.5">
                    {checklistRequirements.map((item) => {
                      const isChecked = !!checkedItems[item.id];
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleCheck(item.id)}
                          className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.99] ${isChecked
                            ? "border-primary/30 bg-primary/[0.02] shadow-sm text-foreground"
                            : "border-border bg-card/40 hover:bg-muted/40 text-muted-foreground"
                            }`}
                        >
                          <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${isChecked
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground/30 bg-background"
                            }`}>
                            {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <span className="text-sm font-medium leading-tight">{item.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Locked / Unlocked Action block */}
                  <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-border/80 pt-8 sm:flex-row">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {isAllChecked ? (
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <Unlock className="h-3.5 w-3.5" />
                            Ready to Pitch
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Lock className="h-3.5 w-3.5" />
                            Locked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {isAllChecked
                          ? "All parameters validated. Proceed to send your draft email."
                          : "Complete the guidelines checklist to trigger submission."}
                      </p>
                    </div>

                    <AnimatePresence mode="wait">
                      {isAllChecked ? (
                        <motion.a
                          key="active-btn"
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.95, opacity: 0 }}
                          href={mailtoUrl}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                        >
                          <Mail className="h-4 w-4" />
                          Send Pitch via Email
                        </motion.a>
                      ) : (
                        <button
                          key="locked-btn"
                          disabled
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/65 px-6 py-4 text-sm font-semibold text-muted-foreground/60 cursor-not-allowed"
                        >
                          <Mail className="h-4 w-4 opacity-50" />
                          Send Pitch (Locked)
                        </button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-20 md:py-24 bg-background">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-3 mb-8">
                <HelpCircle className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
              </div>

              {/* Interactive Accordion */}
              <div className="space-y-4">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className="border-b border-border pb-4 last:border-b-0"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="flex w-full items-center justify-between py-3 text-left transition-colors hover:text-primary"
                      >
                        <span className="font-semibold text-foreground text-sm sm:text-base pr-4">
                          {faq.question}
                        </span>
                        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <p className="pt-1 pb-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Footer CTAs */}
              <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-2xl border border-border/80 bg-muted/40 p-6 sm:flex-row">
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground text-sm">Still have questions?</h4>
                  <p className="text-xs text-muted-foreground">Reach out directly and we will clear things up.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:manishmandal9734@gmail.com?subject=Guest%20Post%20Query%20for%20DailyTools247"
                    className="inline-flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2.5 text-xs font-semibold hover:bg-muted"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Contact Manish
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default WriteForUs;