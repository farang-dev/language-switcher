import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Globe, Code, BarChart3, Settings } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Script
        src="https://language-switcher-two.vercel.app/api/widget/6653cbc4e8c95f700927e879fd008da1.js"
        strategy="afterInteractive"
      />
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            <span className="font-bold text-lg">Language Switcher Web</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-3xl text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tight">
            Language Switcher
          </h1>
          <p className="text-xl text-muted-foreground">
            Add multi-language support to your website with a single line of code.
            Let your visitors browse in their native language.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50 py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Code className="h-8 w-8" />}
              title="Easy Setup"
              description="Just paste a script tag. No programming knowledge required."
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8" />}
              title="Multi-Language"
              description="Supports 100+ languages with high-quality Google Translate."
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8" />}
              title="Analytics"
              description="Track translations by language in real time."
            />
            <FeatureCard
              icon={<Settings className="h-8 w-8" />}
              title="Customizable"
              description="Configure widget position, theme, and size to match your site."
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8" />}
              title="Client-Side Translation"
              description="Translation runs in the visitor's browser. Zero server costs."
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8" />}
              title="Free to Use"
              description="Core features are completely free. Go multilingual at no cost."
            />
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            Getting Started is Easy
          </h2>
          <div className="bg-muted rounded-lg p-6 font-mono text-sm">
            <p className="text-muted-foreground mb-2">
              {"<!-- Add this one line to your site -->"}
            </p>
            <p className="text-foreground">
              &lt;script src=&quot;https://your-domain.com/api/widget/your-api-key.js&quot; async&gt;&lt;/script&gt;
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Language Switcher</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card rounded-lg p-6 border shadow-sm">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
