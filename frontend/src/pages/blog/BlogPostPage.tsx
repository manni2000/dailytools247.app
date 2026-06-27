import { Fragment, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock3, ChevronRight, ChevronDown, BookOpen, Share2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SEOHelmet from "../../components/SEOHelmet";
import NotFound from "../../pages/NotFound";
import { blogPosts, getBlogPostBySlug, type BlogPost } from "../../data/blogPosts";
import { blogEnhancements } from "../../data/blogEnhancements";
import { api } from "../../lib/api-client";
import { toast } from "sonner";

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setReadingProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        // Always prefer local data first (it has full sections/faqs structure)
        const localPost = getBlogPostBySlug(slug);
        if (localPost) {
          setPost(localPost);
          const allOtherPosts = blogPosts.filter((item) => item.slug !== slug);
          const sameCategoryPosts = allOtherPosts.filter((item) => item.category === localPost.category);
          const otherCategoryPosts = allOtherPosts.filter((item) => item.category !== localPost.category);
          setRelatedPosts([...sameCategoryPosts, ...otherCategoryPosts]);
        } else {
          const response = await api.getBlogPost(slug);
          if (response.success && response.result.post) {
            const apiPost = response.result.post;
            setPost({
              ...apiPost,
              sections: apiPost.sections || [],
              faqs: apiPost.faqs || [],
              description: apiPost.description || apiPost.excerpt || '',
              keywords: apiPost.keywords || apiPost.tags || [],
              publishedDate: apiPost.publishedDate || apiPost.date || '',
              readTime: apiPost.readTime || '5 min',
              image: apiPost.image || '/dailytools247.webp',
            });
            const allOtherPosts = blogPosts.filter((item) => item.slug !== slug);
            setRelatedPosts(allOtherPosts);
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (!slug) {
    return <Navigate to="/blogs" replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm font-light">Loading guide...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return <NotFound />;
  }

  const enhancement = blogEnhancements[post.slug];
  const combinedFaqs = enhancement ? [...(post.faqs || []), ...(enhancement.additionalFaqs || [])] : (post.faqs || []);
  const faqs = Array.from(new Map(combinedFaqs.map(faq => [faq.question, faq])).values());

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedDate,
    dateModified: post.publishedDate,
    image: [`https://www.dailytools247.app${post.image}`],
    mainEntityOfPage: `https://www.dailytools247.app/blogs/${post.slug}`,
    author: {
      "@type": "Organization",
      name: "Dailytools247",
    },
    publisher: {
      "@type": "Organization",
      name: "Dailytools247",
      logo: {
        "@type": "ImageObject",
        url: "https://www.dailytools247.app/dailytools247.webp",
      },
    },
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Article link copied to clipboard!");
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SEOHelmet
        title={post.title}
        description={post.description}
        keywords={[post.keywords]}
        canonical={`https://www.dailytools247.app/blogs/${post.slug}`}
        image={post.image}
        ogType="article"
        faqs={faqs}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>
      
      {/* Reading Progress Indicator */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left transition-all duration-75"
        style={{ width: `${readingProgress}%` }}
      />

      <Header />
      <main className="flex-1">
        {/* Premium Post Header Section */}
        <section className="border-b border-border bg-gradient-to-b from-primary/10 via-background to-background py-10 sm:py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          </div>
          <div className="container relative px-4">
            <Link
              to="/blogs"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary sm:mb-8 hover:-translate-x-1 transition-transform"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all blogs
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:items-center"
            >
              <div className="min-w-0">
                <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  {post.category}
                </span>
                <h1 className="mt-5 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl md:text-5xl">{post.title}</h1>
                <p className="mt-5 text-base sm:text-lg text-muted-foreground font-light leading-relaxed">{post.description}</p>
                
                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-muted-foreground border-t border-border/40 pt-6">
                  <span className="inline-flex items-center gap-2 font-medium">
                    <CalendarDays className="h-4.5 w-4.5 text-primary" />
                    Published: {post.publishedDate}
                  </span>
                  <span className="inline-flex items-center gap-2 font-medium">
                    <Clock3 className="h-4.5 w-4.5 text-primary" />
                    Read Time: {post.readTime}
                  </span>
                  <button
                    onClick={copyShareLink}
                    className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary/80 transition-colors ml-auto sm:ml-0"
                  >
                    <Share2 className="h-4.5 w-4.5" />
                    Share Guide
                  </button>
                </div>
              </div>
              <div className="overflow-hidden rounded-3xl border border-border shadow-xl bg-card">
                <img
                  src={post.image}
                  alt={post.title}
                  className="aspect-[16/10] w-full object-cover xl:h-full hover:scale-[1.01] transition-transform duration-350"
                  loading="lazy"
                  onError={(event) => {
                    const target = event.currentTarget;
                    target.src = "/dailytools247.webp";
                  }}
                />
              </div>
            </motion.div>
          </div>
        </section>

        <article className="py-12 md:py-16 bg-background/50">
          <div className="container px-4 grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 space-y-8">
              {(post.sections || []).map((section, sectionIndex) => {
                const headingId = section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                return (
                  <Fragment key={section.heading}>
                    <motion.section
                      id={headingId}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(sectionIndex * 0.05, 0.2) }}
                      className="rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden"
                    >
                      <h2 className="text-2xl sm:text-3xl font-bold text-foreground border-b border-border/40 pb-4">{section.heading}</h2>
                      <div className="mt-6 space-y-4 text-muted-foreground font-light leading-relaxed text-sm sm:text-base">
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                      {section.links && section.links.length > 0 && (
                        <div className="mt-8 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-background p-5 sm:p-6">
                          <p className="mb-4 text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Recommended Tools
                          </p>
                          <div className="flex flex-wrap gap-2.5">
                            {section.links.map((link) => (
                              <Link
                                key={link.path}
                                to={link.path}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-xs sm:text-sm font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:shadow-sm"
                              >
                                {link.label}
                                <ChevronRight className="h-4 w-4" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.section>
                  </Fragment>
                );
              })}

              {enhancement && (
                <>
                  <section id="deep-dive" className="rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-sm">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground border-b border-border/40 pb-4">{enhancement.deepDiveHeading}</h2>
                    <div className="mt-6 space-y-4 text-muted-foreground font-light leading-relaxed text-sm sm:text-base">
                      {enhancement.deepDiveParagraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    <div className="mt-8 rounded-2xl border border-border bg-background/50 p-5 sm:p-6">
                      <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground mb-2">Primary Keyword</p>
                      <p className="text-sm text-primary font-mono bg-muted px-3 py-2 rounded-xl border border-border/60 w-fit">{enhancement.mainKeyword}</p>
                      <p className="mt-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground mb-3">Long-tail Keywords Covered</p>
                      <div className="flex flex-wrap gap-2">
                        {enhancement.longTailKeywords.map((item) => (
                          <span key={item} className="rounded-full bg-secondary border border-border px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section id="how-to" className="rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-sm">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground border-b border-border/40 pb-4">{enhancement.howToHeading}</h2>
                    <ol className="mt-6 space-y-4 text-muted-foreground font-light leading-relaxed text-sm sm:text-base">
                      {enhancement.howToSteps.map((step, index) => (
                        <li key={step} className="flex gap-4">
                          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-primary/10">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section id="use-cases" className="rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-sm">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground border-b border-border/40 pb-4">{enhancement.useCasesHeading}</h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {enhancement.useCases.map((item) => (
                        <div key={item} className="rounded-2xl border border-border bg-background p-5 text-sm text-muted-foreground font-light leading-relaxed">
                          {item}
                        </div>
                      ))}
                    </div>
                  </section>

                  <section id="comparison" className="rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-sm">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground border-b border-border/40 pb-4">{enhancement.comparisonHeading}</h2>
                    <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-background/50">
                      <table className="w-full min-w-[560px] border-collapse text-sm text-left">
                        <thead>
                          <tr className="border-b border-border bg-muted/30 text-foreground text-xs uppercase tracking-wider font-semibold">
                            <th className="py-3 px-4">Tool</th>
                            <th className="py-3 px-4">Best For</th>
                            <th className="py-3 px-4">Free Plan</th>
                            <th className="py-3 px-4 text-right">Speed</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground font-light">
                          {enhancement.comparisonRows.map((row) => (
                            <tr key={row.tool} className="border-b border-border/50 last:border-0 odd:bg-card/45 hover:bg-muted/15 transition-colors">
                              <td className="py-3.5 px-4 font-semibold text-foreground">{row.tool}</td>
                              <td className="py-3.5 px-4 text-xs sm:text-sm">{row.bestFor}</td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold ${
                                  row.free.toLowerCase().includes("yes") || row.free.toLowerCase().includes("free")
                                    ? "bg-green-500/10 text-green-500"
                                    : "bg-amber-500/10 text-amber-500"
                                }`}>
                                  {row.free}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
                                  row.speed.toLowerCase().includes("fast") || row.speed.toLowerCase().includes("instant")
                                    ? "bg-blue-500/10 text-blue-500"
                                    : "bg-slate-500/10 text-slate-500"
                                }`}>
                                  {row.speed}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </>
              )}

              {/* Action Callout */}
              <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-sky-500/5 p-6 sm:p-8 md:p-10 shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Take Action Now</h2>
                  <p className="mt-3 text-muted-foreground font-light leading-relaxed max-w-2xl text-sm sm:text-base">
                    Move from reading to results. Start using our free tool suite immediately and complete your task in just a few clicks.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      to={enhancement?.ctaPath || "/categories"}
                      className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/95 shadow-md shadow-primary/10 hover:translate-x-0.5"
                    >
                      {enhancement?.ctaLabel || "Try Tool Now"}
                      <ChevronRight className="h-4.5 w-4.5 ml-1" />
                    </Link>
                    <Link
                      to={enhancement?.secondaryCtaPath || "/blogs"}
                      className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      {enhancement?.secondaryCtaLabel || "Read More Guides"}
                    </Link>
                  </div>
                </div>
              </section>

              {/* FAQs Section */}
              <section id="faq" className="rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground border-b border-border/40 pb-4">Frequently Asked Questions</h2>
                <div className="mt-6 divide-y divide-border/60">
                  {faqs.map((faq) => (
                    <details key={faq.question} className="group py-4 border-b border-border/60 last:border-0">
                      <summary className="flex items-center justify-between cursor-pointer list-none text-sm sm:text-base font-semibold text-foreground select-none">
                        <span>{faq.question}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0" />
                      </summary>
                      <p className="mt-3 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed pr-6">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>

              {/* Related Articles Section - Full Width */}
              {relatedPosts.length > 0 && (
                <section id="related" className="rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/5 to-background p-6 sm:p-8 md:p-10 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Related Articles</h2>
                    <p className="mt-2 text-sm text-muted-foreground font-light">
                      Continue exploring our practical tech guides and tutorials
                    </p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {relatedPosts.slice(0, 3).map((article) => (
                      <motion.div
                        key={article.slug}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group flex flex-col h-full"
                      >
                        <Link
                          to={`/blogs/${article.slug}`}
                          className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                        >
                          <div className="relative overflow-hidden bg-muted aspect-[16/9]">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                              onError={(event) => {
                                const target = event.currentTarget;
                                target.src = "/dailytools247.webp";
                              }}
                            />
                            <div className="absolute top-3 left-3">
                              <span className="inline-flex rounded-full bg-primary/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-sm">
                                {article.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-1 flex-col p-5">
                            <h3 className="text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="mt-2.5 flex-1 text-xs text-muted-foreground font-light line-clamp-2 leading-relaxed">
                              {article.description}
                            </p>
                            <div className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground border-t border-border/40 pt-3">
                              <span className="inline-flex items-center gap-1 font-medium">
                                <CalendarDays className="h-3.5 w-3.5 text-primary" />
                                {article.publishedDate}
                              </span>
                              <span className="inline-flex items-center gap-1 font-medium">
                                <Clock3 className="h-3.5 w-3.5 text-primary" />
                                {article.readTime}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-8 text-center border-t border-border/40 pt-6">
                    <Link
                      to="/blogs"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      View all articles
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Link>
                  </div>
                </section>
              )}
            </div>

            {/* Sticky Sidebar */}
            <aside className="space-y-6 xl:sticky xl:top-28 xl:h-fit">
              {/* Dynamic Table of Contents */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/40 pb-3 mb-3">Table of Contents</h3>
                <nav className="flex flex-col gap-2 text-sm font-light text-muted-foreground">
                  {(post.sections || []).map((section) => {
                    const headingId = section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    return (
                      <a
                        key={section.heading}
                        href={`#${headingId}`}
                        className="hover:text-primary hover:pl-1 transition-all duration-200 block leading-snug truncate"
                      >
                        {section.heading}
                      </a>
                    );
                  })}
                  {enhancement && (
                    <>
                      <a href="#deep-dive" className="hover:text-primary hover:pl-1 transition-all duration-200 block leading-snug truncate">
                        Deep Dive
                      </a>
                      <a href="#how-to" className="hover:text-primary hover:pl-1 transition-all duration-200 block leading-snug truncate">
                        How-to Guide
                      </a>
                      <a href="#use-cases" className="hover:text-primary hover:pl-1 transition-all duration-200 block leading-snug truncate">
                        Use Cases
                      </a>
                      <a href="#comparison" className="hover:text-primary hover:pl-1 transition-all duration-200 block leading-snug truncate">
                        Comparison Table
                      </a>
                    </>
                  )}
                  {faqs.length > 0 && (
                    <a href="#faq" className="hover:text-primary hover:pl-1 transition-all duration-200 block leading-snug truncate">
                      FAQ
                    </a>
                  )}
                  {relatedPosts.length > 0 && (
                    <a href="#related" className="hover:text-primary hover:pl-1 transition-all duration-200 block leading-snug truncate">
                      Related Articles
                    </a>
                  )}
                </nav>
              </div>

              {/* Dynamic Sticky CTA */}
              <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 to-primary/5 p-5 shadow-sm">
                <h3 className="text-base font-bold text-foreground">Launch Utility</h3>
                <p className="mt-2 text-xs text-muted-foreground font-light leading-relaxed">
                  Use our free {enhancement?.mainKeyword || post.category} tool directly in your browser.
                </p>
                <Link
                  to={enhancement?.ctaPath || "/categories"}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/95 shadow-md shadow-primary/10 hover:translate-y-0.5"
                >
                  {enhancement?.ctaLabel || "Try Tool Now"}
                </Link>
              </div>

              {/* Quick info about Categories */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="text-sm font-bold text-foreground">Explore All Utilities</h3>
                <p className="mt-2 text-xs text-muted-foreground font-light leading-relaxed">
                  Browse over 100+ high-quality online utilities across PDF, Image, Business, and Security workflows.
                </p>
                <Link
                  to="/categories"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Open Categories
                </Link>
              </div>
            </aside>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
