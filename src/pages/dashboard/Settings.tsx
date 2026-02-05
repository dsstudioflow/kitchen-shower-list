import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, User, Heart, Calendar, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ShareLinkCard } from '@/components/dashboard/ShareLinkCard';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUpdateProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

export default function DashboardSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading, profileLoading } = useAuthContext();
  const updateProfile = useUpdateProfile();

  const [partnerName1, setPartnerName1] = useState('');
  const [partnerName2, setPartnerName2] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setPartnerName1(profile.partner_name_1 || '');
      setPartnerName2(profile.partner_name_2 || '');
      setEventName(profile.event_name || '');
      setEventDate(profile.event_date || '');
    }
  }, [profile]);

  if (loading || profileLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!user || !profile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!partnerName1.trim()) {
      toast({ title: 'Erro', description: 'Informe pelo menos um nome', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile.mutateAsync({
        id: user.id,
        partner_name_1: partnerName1.trim(),
        partner_name_2: partnerName2.trim() || null,
        event_name: eventName.trim() || 'Chá de Cozinha',
        event_date: eventDate || null,
      });
      toast({ title: 'Configurações salvas!' });
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    }
    setIsSubmitting(false);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Personalize as informações do seu evento
          </p>
        </div>

        {/* Share Link */}
        <ShareLinkCard slug={profile.share_slug} />

        {/* Profile Form */}
        <Card className="border-border/50 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Informações do Casal</CardTitle>
            <CardDescription>
              Estas informações serão exibidas na sua lista de presentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="partnerName1">Seu nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="partnerName1"
                      value={partnerName1}
                      onChange={(e) => setPartnerName1(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partnerName2">
                    Nome do(a) parceiro(a) <span className="text-muted-foreground">(opcional)</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="partnerName2"
                      value={partnerName2}
                      onChange={(e) => setPartnerName2(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventName">Nome do evento</Label>
                <div className="relative">
                  <Heart className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Chá de Cozinha"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventDate">
                  Data do evento <span className="text-muted-foreground">(opcional)</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar alterações
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="border-border/50 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>
              Informações da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email || ''} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">
                O email não pode ser alterado
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
