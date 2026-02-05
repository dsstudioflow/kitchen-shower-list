import { Link } from 'react-router-dom';
import { Heart, Gift, Share2, Users, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Gift,
    title: 'Gerencie sua lista',
    description: 'Adicione e organize todos os presentes que você deseja receber de forma simples e intuitiva.',
  },
  {
    icon: Share2,
    title: 'Link único',
    description: 'Compartilhe um link exclusivo com seus convidados para que vejam sua lista de presentes.',
  },
  {
    icon: Users,
    title: 'Sem conflitos',
    description: 'Convidados podem reservar presentes evitando duplicidade. Você acompanha tudo em tempo real.',
  },
];

const benefits = [
  'Cadastro gratuito e rápido',
  'Sem limite de presentes',
  'Compartilhamento fácil',
  'Acompanhamento em tempo real',
  'Design elegante e moderno',
  'Funciona em qualquer dispositivo',
];

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-accent/20 blur-[100px]" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/30">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-gradient-to-br from-primary to-emerald-600 p-2">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">Lista de Presentes</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">
                Criar minha lista
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 py-20 text-center md:py-32">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Crie sua lista em minutos</span>
          </div>

          <h1 className="mb-6 font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-gradient">A forma mais fácil</span>
            <br />
            de organizar seu chá
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Crie sua lista de presentes personalizada, compartilhe com seus convidados 
            e acompanhe as reservas em tempo real. Simples, elegante e gratuito.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link to="/auth">
                Começar agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <Link to="/lista/demo">Ver exemplo</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground">100%</div>
                  <div className="mt-1 text-sm text-muted-foreground">Gratuito</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">∞</div>
                  <div className="mt-1 text-sm text-muted-foreground">Presentes</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground">1</div>
                  <div className="mt-1 text-sm text-muted-foreground">Link único</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative border-t border-border/30 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
              Tudo que você precisa
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Uma plataforma completa para organizar sua lista de presentes de casamento, 
              chá de cozinha ou qualquer celebração especial.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="glass group rounded-2xl p-8 transition-all hover:border-primary/30"
              >
                <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative border-t border-border/30 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
                Por que escolher nossa plataforma?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Desenvolvemos uma solução pensada em cada detalhe para tornar 
                sua experiência simples e agradável.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="glass rounded-3xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/20" />
                    <div className="flex-1">
                      <div className="h-4 w-24 rounded bg-foreground/20" />
                      <div className="mt-2 h-3 w-16 rounded bg-muted-foreground/30" />
                    </div>
                    <div className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
                      Disponível
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
                    <div className="h-12 w-12 rounded-lg bg-emerald-500/20" />
                    <div className="flex-1">
                      <div className="h-4 w-32 rounded bg-foreground/20" />
                      <div className="mt-2 h-3 w-20 rounded bg-muted-foreground/30" />
                    </div>
                    <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                      Reservado
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
                    <div className="h-12 w-12 rounded-lg bg-amber-500/20" />
                    <div className="flex-1">
                      <div className="h-4 w-28 rounded bg-foreground/20" />
                      <div className="mt-2 h-3 w-14 rounded bg-muted-foreground/30" />
                    </div>
                    <div className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
                      Disponível
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-t border-border/30 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
              Pronto para começar?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Crie sua lista de presentes agora mesmo e compartilhe com seus convidados. 
              É rápido, fácil e gratuito!
            </p>
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link to="/auth">
                Criar minha lista
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Feito com <Heart className="inline-block h-4 w-4 text-primary" /> para casais apaixonados
          </p>
        </div>
      </footer>
    </div>
  );
}
