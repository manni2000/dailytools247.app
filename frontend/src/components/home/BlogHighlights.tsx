import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, BookOpen, Sparkles } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const BlogHighlights = () => {
  const highlightOrder = ["PDF Tools", "Image Tools", "Productivity"];

  const topPosts = highlightOrder
    .map((category) => blogPosts.find((post) => post.category === category))
    .filter((post): post is (typeof blogPosts)[number] => Boolean(post));

  return (
    <section className="border-y border-border/60 bg-gradient-to-b from-background via-muted/30 to-background py-16 sm:py-24 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-[30%] left-[-5%] h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 sm:mb-16 max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Latest Guides & Tutorials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Learn & Master Online Tools
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            Expert guides on document workflows, local AI processing, and browser-first productivity stacks.
          </p>
        </motion.div>

        {/* Blog Cards Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {topPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <Link to={`/blogs/${post.slug}`} className="flex h-full flex-col">
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(event) => {
                      const target = event.currentTarget;
                      target.src = "/dailytools247.webp";
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-primary shadow-md border border-border/60">
                      <Sparkles className="h-3 w-3 text-primary" />
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2.5 line-clamp-3 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                    {post.description}
                  </p>

                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-muted-foreground font-light">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" />
                      {post.publishedDate}
                    </span>
                    <span className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform">
                      Read Guide →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 hover:shadow-xl hover:scale-105 transition-all"
          >
            Explore All Guides & Articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default BlogHighlights;
