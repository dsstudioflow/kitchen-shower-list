import { Link } from 'react-router-dom';
import { Gift, Share2, Users, Sparkles, ArrowRight, CheckCircle2, Star, Zap, Shield } from 'lucide-react';
import logo from '@/assets/logo.png';
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

const steps = [
  {
    number: '01',
    icon: Zap,
    title: 'Crie sua conta',
    description: 'Cadastre-se em segundos com seu e-mail. Sem burocracia.',
  },
  {
    number: '02',
    icon: Gift,
    title: 'Monte sua lista',
    description: 'Adicione os presentes que deseja com fotos, preços e links de compra.',
  },
  {
    number: '03',
    icon: Share2,
    title: 'Compartilhe o link',
    description: 'Envie o link único para seus convidados via WhatsApp, e-mail ou redes sociais.',
  },
  {
    number: '04',
    icon: Star,
    title: 'Acompanhe tudo',
    description: 'Veja em tempo real quem reservou cada presente. Sem surpresas!',
  },
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
        <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Lista de Presentes" className="h-8 w-8 object-contain" />
            <span className="font-display text-lg font-bold md:text-xl">Lista de Presentes</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button size="sm" asChild className="text-xs md:text-sm">
              <Link to="/auth">
                <span className="hidden sm:inline">Criar minha lista</span>
                <span className="sm:hidden">Criar lista</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 py-12 text-center sm:py-16 md:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary md:mb-8 md:px-4 md:py-2 md:text-sm">
            <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span>Crie sua lista em minutos</span>
          </div>

          <h1 className="mb-4 font-display text-3xl font-bold tracking-tight sm:text-4xl md:mb-6 md:text-6xl lg:text-7xl">
            <span className="text-gradient">A forma mais fácil</span>
            <br />
            de organizar seu chá
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base md:mb-10 md:text-xl">
            Crie sua lista de presentes personalizada, compartilhe com seus convidados 
            e acompanhe as reservas em tempo real. Simples, elegante e gratuito.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button size="lg" className="h-11 w-full px-6 text-sm sm:h-12 sm:w-auto sm:px-8 sm:text-base" asChild>
              <Link to="/auth">
                Começar agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-11 w-full px-6 text-sm sm:h-12 sm:w-auto sm:px-8 sm:text-base" asChild>
              <Link to="/lista/demo">Ver exemplo</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-10 max-w-sm sm:mt-16 sm:max-w-2xl">
            <div className="glass rounded-2xl p-5 sm:p-8">
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground sm:text-4xl">100%</div>
                  <div className="mt-1 text-xs text-muted-foreground sm:text-sm">Gratuito</div>
                </div>
                <div className="h-8 w-px bg-border sm:h-12" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary sm:text-4xl">∞</div>
                  <div className="mt-1 text-xs text-muted-foreground sm:text-sm">Presentes</div>
                </div>
                <div className="h-8 w-px bg-border sm:h-12" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground sm:text-4xl">1</div>
                  <div className="mt-1 text-xs text-muted-foreground sm:text-sm">Link único</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative border-t border-border/30 py-12 sm:py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center md:mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary sm:text-sm">
              <Zap className="h-3.5 w-3.5" />
              <span>Simples e rápido</span>
            </div>
            <h2 className="mb-3 font-display text-2xl font-bold sm:text-3xl md:mb-4 md:text-4xl">
              Como funciona?
            </h2>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
              Em apenas 4 passos você terá sua lista de presentes pronta para compartilhar.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="group relative">
                <div className="glass rounded-2xl p-6 transition-all hover:border-primary/30 sm:p-8">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-3xl font-black text-primary/20 sm:text-4xl">{step.number}</span>
                    <div className="rounded-xl bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-base font-semibold sm:text-lg">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative border-t border-border/30 py-12 sm:py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center md:mb-16">
            <h2 className="mb-3 font-display text-2xl font-bold sm:text-3xl md:mb-4 md:text-4xl">
              Tudo que você precisa
            </h2>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
              Uma plataforma completa para organizar sua lista de presentes de casamento, 
              chá de cozinha ou qualquer celebração especial.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="glass group rounded-2xl p-6 transition-all hover:border-primary/30 sm:p-8"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:mb-6">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold sm:mb-3 sm:text-xl">{feature.title}</h3>
                <p className="text-sm text-muted-foreground sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="relative border-t border-border/30 py-12 sm:py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary sm:text-sm">
                <Shield className="h-3.5 w-3.5" />
                <span>Garantia de qualidade</span>
              </div>
              <h2 className="mb-3 font-display text-2xl font-bold sm:text-3xl md:mb-4 md:text-4xl">
                Por que escolher nossa plataforma?
              </h2>
              <p className="mb-6 text-sm text-muted-foreground sm:text-base md:mb-8 md:text-lg">
                Desenvolvemos uma solução pensada em cada detalhe para tornar 
                sua experiência simples e agradável.
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary sm:h-5 sm:w-5" />
                    <span className="text-sm text-foreground sm:text-base">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 sm:mt-8">
                <Button variant="outline" size="lg" className="h-11 w-full text-sm sm:h-12 sm:w-auto sm:px-8 sm:text-base" asChild>
                  <Link to="/lista/demo">
                    Ver exemplo ao vivo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="glass rounded-3xl p-5 sm:p-8">
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { name: 'Jogo de Panelas', price: 'R$ 389,90', status: 'available' },
                    { name: 'Jogo de Cama King', price: 'R$ 459,90', status: 'reserved' },
                    { name: 'Cafeteira Automática', price: 'R$ 699,00', status: 'available' },
                    { name: 'Sofá Retrátil', price: 'R$ 2.499,00', status: 'reserved' },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 sm:gap-4 sm:p-4">
                      <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-primary/20 sm:h-12 sm:w-12" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-sm font-medium text-foreground">{item.name}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">{item.price}</div>
                      </div>
                      <div className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium sm:px-3 sm:text-xs ${
                        item.status === 'available'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {item.status === 'available' ? 'Disponível' : 'Reservado'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-t border-border/30 py-12 sm:py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-3 font-display text-2xl font-bold sm:text-3xl md:mb-4 md:text-4xl">
              Pronto para começar?
            </h2>
            <p className="mb-6 text-sm text-muted-foreground sm:text-base md:mb-8 md:text-lg">
              Crie sua lista de presentes agora mesmo e compartilhe com seus convidados. 
              É rápido, fácil e gratuito!
            </p>
            <Button size="lg" className="h-11 w-full px-6 text-sm sm:h-12 sm:w-auto sm:px-8 sm:text-base" asChild>
              <Link to="/auth">
                Criar minha lista
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/30 py-6 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <img src={logo} alt="Lista de Presentes" className="mx-auto mb-2 h-6 w-6 object-contain opacity-60" />
          <p className="text-xs text-muted-foreground sm:text-sm">
            Feito com amor para casais apaixonados
          </p>
        </div>
      </footer>
    </div>
  );
}
