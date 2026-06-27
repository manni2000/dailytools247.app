import { motion } from "framer-motion";
import { CalendarDays, Clock3, ArrowRight, Sparkles, Mail, PenTool, CheckCircle2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHelmet from "@/components/SEOHelmet";
import { blogPosts } from "@/data/blogPosts";
import { api } from "@/lib/api-client";

const categoryOrder = [
  "PDF Tools",
  "Image Tools",
  "Productivity",
  "SEO Tools",
  "Developer Tools",
  "Security Tools",
  "Text Tools",
  "Savings",
];

const sortBlogPosts = (posts: typeof blogPosts) => {
  return [...posts].sort((left, right) => {
    const leftCategoryIndex = categoryOrder.indexOf(left.category);
    const rightCategoryIndex = categoryOrder.indexOf(right.category);

    const normalizedLeftCategoryIndex = leftCategoryIndex === -1 ? categoryOrder.length : leftCategoryIndex;
    const normalizedRightCategoryIndex = rightCategoryIndex === -1 ? categoryOrder.length : rightCategoryIndex;

    if (normalizedLeftCategoryIndex !== normalizedRightCategoryIndex) {
      return normalizedLeftCategoryIndex - normalizedRightCategoryIndex;
    }

    return new Date(right.publishedDate).getTime() - new Date(left.publishedDate).getTime();
  });
};

const BlogListPage = () => {
  const [posts, setPosts] = useState(() => sortBlogPosts(blogPosts));
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Guides");

  const mergeBlogPosts = (apiPosts: typeof blogPosts) => {
    const merged = new Map(blogPosts.map((post) => [post.slug, post] as const));

    apiPosts.forEach((post) => {
      merged.set(post.slug, post);
    });

    return sortBlogPosts(Array.from(merged.values()));
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.getBlogPosts(1, 100);
        if (response.success && response.result.posts) {
          setPosts(mergeBlogPosts(response.result.posts));
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const categories = useMemo(() => ["All Guides", ...categoryOrder], []);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All Guides") return posts;
    return posts.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.filter((p) => p.slug !== featuredPost?.slug);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SEOHelmet
        title="Blog Free Online Tools, Guides, and Tutorials"
        description="Read practical blog guides on free online tools, converters, developer utilities, and productivity workflows for 2026."
        keywords={["free online tools blog", "best tools 2026", "online converter free", "no signup required tools"]}
        canonical="https://www.dailytools247.app/blogs"
      />
      <Header />
      <main className="flex-1">
        {/* Premium Hero Section */}
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-primary/15 via-background to-sky-500/5 py-16 sm:py-20 md:py-28">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute inset-0 h-full w-full stroke-primary/[0.04] [mask-image:radial-gradient(100%_100%_at_top,white,transparent)]" aria-hidden="true">
              <defs>
                <pattern id="grid-pattern-blog-list" width="24" height="24" patternUnits="userSpaceOnUse" x="-1" y="-1">
                  <path d="M.5 24V.5H24" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern-blog-list)" />
            </svg>
            <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl opacity-60" />
            <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl opacity-50" />
          </div>
          <div className="container relative px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs sm:text-sm font-medium text-primary backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                Expert Guides for Faster Workflows
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-6xl text-foreground">
                Dailytools247 <span className="gradient-text">Blog</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                Actionable tutorials, high-intent SEO guides, and curated tool stacks to help you save time every day.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Listings Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-background/50">
          <div className="container px-4 space-y-12">
            {/* Category Filter Pills */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center flex-wrap gap-2 pb-4 overflow-x-auto"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 border ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/15 scale-[1.02]"
                      : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 sm:py-20 bg-card rounded-3xl border border-border p-8"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted border border-border/60">
                  <BookOpen className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">No guides found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto font-light text-sm mb-6">
                  We are writing tutorials for {selectedCategory} right now. Stay tuned!
                </p>
                <button
                  onClick={() => setSelectedCategory("All Guides")}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
                >
                  View All Guides
                </button>
              </motion.div>
            )}

            {/* Featured Post Card */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-card to-primary/3 p-5 shadow-xl sm:p-6 md:p-8 hover:shadow-2xl transition-all duration-300"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Featured Article</p>
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
                  <div className="order-2 lg:order-1 min-w-0">
                    <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl leading-tight text-foreground hover:text-primary transition-colors">
                      <Link to={`/blogs/${featuredPost.slug}`}>{featuredPost.title}</Link>
                    </h2>
                    <p className="mt-4 text-muted-foreground font-light text-sm sm:text-base leading-relaxed line-clamp-4">
                      {featuredPost.description}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground border-t border-border/40 pt-4">
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        {featuredPost.publishedDate}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <Clock3 className="h-4 w-4 text-primary" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <Link
                      to={`/blogs/${featuredPost.slug}`}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/95 shadow-md shadow-primary/10 hover:translate-x-1"
                    >
                      Read Featured Guide
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="order-1 lg:order-2 overflow-hidden rounded-2xl border border-border bg-muted shadow-inner group-hover:scale-[1.02] transition-transform duration-300">
                    <Link to={`/blogs/${featuredPost.slug}`}>
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="aspect-[16/10] w-full object-cover md:h-full transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                        onError={(event) => {
                          const target = event.currentTarget;
                          target.src = "/dailytools247.webp";
                        }}
                      />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other Posts Grid */}
            {otherPosts.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {otherPosts.map((post, index) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/20 flex flex-col h-full"
                  >
                    <Link to={`/blogs/${post.slug}`} className="block relative overflow-hidden bg-muted aspect-[16/10]">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(event) => {
                          const target = event.currentTarget;
                          target.src = "/dailytools247.webp";
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex rounded-full bg-primary/95 text-primary-foreground backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    </Link>
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          <Link to={`/blogs/${post.slug}`}>{post.title}</Link>
                        </h2>
                        <p className="mt-3 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed line-clamp-3">
                          {post.description}
                        </p>
                      </div>
                      <div className="mt-6">
                        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-4 mb-4">
                          <span>{post.publishedDate}</span>
                          <span>{post.readTime}</span>
                        </div>
                        <Link 
                          to={`/blogs/${post.slug}`} 
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary"
                        >
                          Read article
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            {/* Premium Write for Us Banner */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-border/80 bg-gradient-to-br from-primary/10 via-card to-sky-500/10 p-6 shadow-xl md:p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center relative z-10">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs sm:text-sm font-medium text-primary backdrop-blur-sm">
                    <PenTool className="h-4 w-4" />
                    Write for Us
                  </div>
                  <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl tracking-tight text-foreground leading-tight">Become a Guest Author at Dailytools247</h2>
                  <p className="mt-4 max-w-2xl text-muted-foreground font-light text-sm sm:text-base leading-relaxed">
                    Share your practical tutorials, high-intent guides, or developer workflows with a highly targeted technology audience. If your work is valuable and original, we would love to publish it.
                  </p>
                  <div className="mt-6 grid gap-3 text-xs sm:text-sm text-muted-foreground sm:grid-cols-2">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                      <span>800 words or more</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                      <span>Only one contextual link allowed</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                      <span>One-time $10 review fee</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                      <span>Original, unpublished content only</span>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      to="/write-for-us"
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/95 shadow-md shadow-primary/10"
                    >
                      View Guidelines
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                      href="mailto:manishmandal9734@gmail.com?subject=Guest%20Post%20Submission%20for%20Dailytools247"
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      Email Submission
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-background/60 backdrop-blur-md p-5 sm:p-6 shadow-md">
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-primary border-b border-border/40 pb-3 mb-4">Quick Submission Rules</p>
                  <div className="space-y-3.5 text-xs sm:text-sm text-muted-foreground font-light">
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Only one link in the article body.
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Focus on practical value and clear writing.
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      All submissions must be original.
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Fee: one-time $10 after acceptance.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogListPage;

