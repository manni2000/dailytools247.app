import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { toolCategories } from "@/data/toolCategories";
import CategoryCard from "@/components/CategoryCard";
import { staggerContainer } from "@/lib/animations";

// Priority categories to show first
const priorityCategoryIds = ["ai", "pdf", "image", "dev", "finance", "security", "audio", "video", "text", "seo", "education", "ecommerce", "date-time", "zip", "social", "email", "govt-legal", "internet"];

export const CategoryGrid = () => {
  // Ordered categories by priority
  const orderedCategories = [...toolCategories].sort((a, b) => {
    const idxA = priorityCategoryIds.indexOf(a.id);
    const idxB = priorityCategoryIds.indexOf(b.id);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 border-b border-border/50 bg-background">
      <div className="container relative mx-auto px-4 z-10">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 text-center max-w-2xl mx-auto">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span>Structured Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Explore by Category
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            Over 200 purpose-built browser utilities organized across 18 specialized technical domains.
          </p>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {orderedCategories.map((category, index) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              description={category.description}
              icon={category.icon}
              color={category.color}
              toolCount={category.tools.length}
              delay={Math.min(index * 0.03, 0.3)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryGrid;
