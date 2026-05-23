import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, CheckCircle2, Coins, FileText, Link2, Mail, PenTool, ShieldCheck, Sparkles, TimerReset, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHelmet from "@/components/SEOHelmet";

const guidelines = [
  "Articles should be 800 words or more and stay focused on one clear topic.",
  "Include only one contextual link in the body of the article.",
  "All submissions must be original, unpublished, and written for readers first.",
  "Avoid keyword stuffing, affiliate links, spun content, and promotional fluff.",
  "Use short paragraphs, descriptive headings, and a practical, easy-to-scan structure.",
  "Add examples, data points, or steps where they genuinely improve the article.",
];

const regulations = [
  {
    title: "Editorial control",
    summary: "We may edit headlines, formatting, images, and copy for clarity, SEO, and consistency.",
    tone: "neutral",
  },
  {
    title: "Processing fee",
    summary: "Accepted submissions carry a one-time $10 review and publication fee.",
    tone: "accent",
  },
  {
    title: "One-link policy",
    summary: "Only one contextual link is allowed in the article body, and it must be relevant to the topic.",
    tone: "warning",
  },
  {
    title: "Content quality",
    summary: "We do not accept duplicate content, AI-generated spam, adult content, gambling, or deceptive claims.",
    tone: "danger",
  },
  {
    title: "Promotions",
    summary: "Sponsored placements, affiliate-heavy posts, and link exchanges are not permitted.",
    tone: "warning",
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
    description: "Email the article idea or finished draft, along with your target keyword and author note.",
    icon: Mail,
  },
  {
    title: "Editorial review",
    description: "We check for originality, structure, clarity, and fit before moving it forward.",
    icon: BadgeCheck,
  },
  {
    title: "Publish and promote",
    description: "After approval and fee processing, the article is prepared for publication.",
    icon: Zap,
  },
];

const faqs = [
  {
    question: "How long should my guest post be?",
    answer: "Aim for at least 800 words. Longer posts are welcome if they stay useful, specific, and well structured.",
  },
  {
    question: "How many links can I include?",
    answer: "You may include one relevant contextual link in the article body. Extra promotional or affiliate links will be removed.",
  },
  {
    question: "What is the fee?",
    answer: "There is a one-time $10 fee for review and publication processing after the submission is accepted.",
  },
  {
    question: "How do I submit my article?",
    answer: "Email your draft, headline idea, and any supporting details to manishmandal9734@gmail.com.",
  },
];

const howTo = {
  name: "Submit a guest post to Creately",
  description: "A simple editorial process for sending an original guest article with one contextual link and a one-time $10 fee.",
  steps: [
    {
      name: "Prepare your draft",
      text: "Write an original article of at least 800 words with one relevant contextual link.",
    },
    {
      name: "Email the submission",
      text: "Send the draft, headline idea, and any supporting details to manishmandal9734@gmail.com.",
    },
    {
      name: "Complete review and publish",
      text: "We review the article for quality and fit, then confirm the one-time $10 fee before publication.",
    },
  ],
};

const WriteForUs = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SEOHelmet
        title="Write for Us | Guest Post Submission at Creately"
        description="Write for us at Creately and submit original guest posts for a highly targeted tech audience. Review the rules, one-link policy, 800-word minimum, and one-time $10 fee."
        keywords={[
          "write for us",
          "guest post guidelines",
          "guest post submission",
          "guest author submission",
          "write for us guest post",
          "guest post article",
          "Creately blog write for us",
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
          name: 'Write for Us | Guest Post Submission at Creately',
          description: 'Guest post guidelines, one-link rule, and submission fee for Creately blog contributors.',
          url: 'https://www.dailytools247.app/write-for-us',
          inLanguage: 'en',
          isPartOf: {
            '@type': 'WebSite',
            name: 'Dailytools247',
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
          mainEntity: {
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
        }}
        howTo={howTo}
        faqs={faqs}
      />
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.02),rgba(45,212,191,0.08),rgba(59,130,246,0.04))] py-16 sm:py-20 md:py-28">
          <div className="absolute inset-0">
            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
          </div>
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-5xl"
            >
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur">
                  <Sparkles className="h-4 w-4" />
                  Guest Posting Open
                </div>
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-balance md:text-6xl">
                  Write for Us and Become a Guest Author at Creately
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                  Share a practical, original article with a highly targeted audience. Creately welcomes contributors who
                  can teach something useful, keep the writing sharp, and deliver value without unnecessary noise.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="mailto:manishmandal9734@gmail.com?subject=Guest%20Post%20Submission%20for%20Creately"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90"
                  >
                    <Mail className="h-4 w-4" />
                    Send Submission
                  </a>
                  <Link
                    to="/blogs"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:bg-muted"
                  >
                    Read Our Blog
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm backdrop-blur">
                  <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <TimerReset className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold">800+ words</p>
                  <p className="mt-1 text-sm text-muted-foreground">Submissions should stay focused and practical.</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm backdrop-blur">
                  <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold">One link only</p>
                  <p className="mt-1 text-sm text-muted-foreground">Only one contextual link in the article body.</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm backdrop-blur">
                  <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Coins className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold">$10 review fee</p>
                  <p className="mt-1 text-sm text-muted-foreground">A one-time fee applies after acceptance.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
            >
              <div className="flex items-center gap-3">
                <PenTool className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Why Contribute</h2>
              </div>
              <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Guest authors get access to a focused tech audience that already cares about tools, productivity,
                  SEO, and practical digital workflows. That means your article is not floating in a generic content
                  pool; it is being shown to readers who are actively looking for useful answers.
                </p>
                <p>
                  A strong guest post can also strengthen your personal brand, earn high-quality visibility, and create
                  a lasting reference point for your work. We prioritize articles that are genuinely helpful, well
                  structured, and grounded in real experience.
                </p>
                <p>
                  If you can write something clear, specific, and useful, we want to hear from you.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-sky-500/5 p-6 shadow-sm md:p-8"
            >
              <div className="flex items-center gap-3">
                <Coins className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Submission Fee</h2>
              </div>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                There is a one-time $10 fee for review and publication processing. This keeps the submission process
                organized and helps us maintain editorial quality across the blog.
              </p>
              <div className="mt-6 rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">Quick summary</p>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />One-time $10 fee</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />One contextual link only</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />800 words or more</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-border bg-gradient-to-b from-muted/40 to-background py-16 md:py-20">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8 lg:sticky lg:top-6"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <ShieldCheck className="h-4 w-4" />
                  Rules and Regulations
                </div>
                <h2 className="mt-5 text-3xl font-bold tracking-tight">Submission standards that keep the editorial bar high.</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  The rules below are designed to keep the content useful, original, and clean for readers. If you meet
                  these standards, your article is much more likely to move forward quickly.
                </p>
                <div className="mt-6 rounded-2xl border border-primary/10 bg-primary/5 p-4">
                  <p className="text-sm font-semibold text-foreground">Quick checklist</p>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p>Original content only</p>
                    <p>One link in the body</p>
                    <p>Minimum 800 words</p>
                    <p>One-time $10 fee after acceptance</p>
                  </div>
                </div>
              </motion.div>

              <div className="grid gap-4 md:grid-cols-2">
                {regulations.map((rule, index) => {
                  const toneStyles = {
                    neutral: "border-border bg-card text-foreground",
                    accent: "border-primary/20 bg-primary/5 text-foreground",
                    warning: "border-amber-500/20 bg-amber-500/5 text-foreground",
                    danger: "border-rose-500/20 bg-rose-500/5 text-foreground",
                  } as const;

                  const tone = toneStyles[rule.tone as keyof typeof toneStyles];

                  return (
                    <motion.div
                      key={rule.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className={`rounded-2xl border p-5 shadow-sm ${tone}`}
                    >
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-background/80 text-sm font-semibold text-primary shadow-sm">
                          {index + 1}
                        </div>
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {rule.tone}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold">{rule.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{rule.summary}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">What We Prefer</h2>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                <li>How-to guides with clear steps and a practical takeaway</li>
                <li>SEO, productivity, and tech articles backed by useful examples</li>
                <li>Posts that educate readers instead of selling to them</li>
                <li>Clean formatting with headings, lists, and short paragraphs</li>
                <li>Original opinions or experience that add real value</li>
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">
                If your article helps readers solve a real problem, it is a strong fit.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-card to-sky-500/5 p-6 shadow-sm md:p-8"
            >
              <div className="flex items-center gap-3">
                <Link2 className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">How to Submit</h2>
              </div>
              <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Email your guest post idea or completed draft to manishmandal9734@gmail.com with a clear subject line.
                  If possible, include your proposed headline, a short author bio, and the link you want to include.
                </p>
                <p>
                  We review each submission manually. If the content fits our audience and follows the guidelines, we
                  will reply with the next steps, including fee details and any editorial notes.
                </p>
                <p>
                  Keep the tone practical, avoid unnecessary filler, and make sure the article teaches something the
                  reader can use immediately.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-border bg-muted/30 py-16 md:py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-4xl"
            >
              <div className="flex flex-col gap-4 text-center">
                <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Zap className="h-4 w-4" />
                  Submission Flow
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">A simple review process with clear expectations.</h2>
                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  We keep the process straightforward so contributors know what happens next and can prepare a strong
                  draft from the start.
                </p>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {submissionSteps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <div key={step.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Step {index + 1}</p>
                          <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/30 py-16 md:py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
            >
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
              <div className="mt-6 space-y-5">
                {faqs.map((faq) => (
                  <div key={faq.question} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <h3 className="text-base font-semibold">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="mailto:manishmandal9734@gmail.com?subject=Guest%20Post%20Submission%20for%20Creately"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Mail className="h-4 w-4" />
                  Contact manishmandal9734@gmail.com
                </a>
                <Link
                  to="/blogs"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Explore Articles
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WriteForUs;