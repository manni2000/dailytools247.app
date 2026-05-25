import { Search, Upload, Cpu, Download, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StepProps {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const Step = ({ number, icon: Icon, title, description }: StepProps) => (
  <div className="flex flex-col items-center text-center p-4">
    {/* Step Number Badge */}
    <div className="font-mono text-xs font-bold text-primary mb-2 select-none tracking-widest">
      STEP {number}
    </div>

    {/* Icon Container */}
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground">
      <Icon className="h-6 w-6" />
    </div>

    {/* Content */}
    <div className="space-y-1">
      <h3 className="text-base font-bold text-foreground">
        {title}
      </h3>
      <p className="max-w-xs text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Select a Tool",
      description: "Choose from our comprehensive collection of PDF, image, developer, and productivity utilities."
    },
    {
      number: "02",
      icon: Upload,
      title: "Input Data or Files",
      description: "Upload your documents or paste text. All data remains completely local inside your browser."
    },
    {
      number: "03",
      icon: Cpu,
      title: "Instant Processing",
      description: "Tasks are processed client-side with high performance. No delays or server queues."
    },
    {
      number: "04",
      icon: Download,
      title: "Get Your Result",
      description: "Download the completed files or copy formatted output with a single click."
    }
  ];

  return (
    <section className="relative bg-background py-16 sm:py-24 border-b border-border">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            How It Works
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Simple 4-Step Local Processing
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No registration, installation, or user account required. Process your work in your browser.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 border border-border rounded-lg bg-muted/10 p-6 divide-y divide-border sm:divide-y-0 sm:gap-y-8 lg:divide-x lg:divide-y-0">
          {steps.map((step) => (
            <Step
              key={step.number}
              number={step.number}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>

        {/* Bottom CTA Block */}
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-6 sm:p-8">
            <h3 className="text-lg font-bold text-foreground">
              Ready to process your files privately?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Join thousands of users converting files with absolute security. 100% free.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => navigate("/categories")}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-colors"
              >
                Browse All Tools
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
