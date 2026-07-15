import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, Code, BarChart3, Settings } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            <span className="font-bold text-lg">Language Switcher Web</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">ログイン</Button>
            </Link>
            <Link href="/signup">
              <Button>無料で始める</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-3xl text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tight">
            言語切り替えくん
          </h1>
          <p className="text-xl text-muted-foreground">
            あなたのウェブサイトに、たった1行のコードで多言語切り替え機能を追加。
            訪問者が自分の母語でサイトを閲覧できるようになります。
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                無料で始める
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50 py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">主な機能</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Code className="h-8 w-8" />}
              title="簡単導入"
              description="scriptタグを貼るだけでOK。プログラミングの知識は不要です。"
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8" />}
              title="多言語対応"
              description="100以上の言語に対応。Google翻訳を活用した高品質な翻訳。"
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8" />}
              title="インサイト"
              description="どの言語にどれだけ翻訳されたか、リアルタイムで確認できます。"
            />
            <FeatureCard
              icon={<Settings className="h-8 w-8" />}
              title="カスタマイズ"
              description="ウィジェットの位置、テーマ、サイズを自由に設定できます。"
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8" />}
              title="クライアントサイド翻訳"
              description="翻訳は訪問者のブラウザで実行。サーバー費用は一切かかりません。"
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8" />}
              title="無料で使用可能"
              description="基本機能は完全無料。コストをかけずに多言語化を実現します。"
            />
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            導入はとても簡単
          </h2>
          <div className="bg-muted rounded-lg p-6 font-mono text-sm">
            <p className="text-muted-foreground mb-2">
              {"<!-- あなたのサイトにこの1行を追加 -->"}
            </p>
            <p className="text-foreground">
              &lt;script src=&quot;https://widget.lswitcher.com/your-api-key.js&quot;&gt;&lt;/script&gt;
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Language Switcher Web / 言語切り替えくん</p>
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
