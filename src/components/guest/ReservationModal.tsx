import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, Users, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReserveGift } from '@/hooks/useGifts';
import { useToast } from '@/hooks/use-toast';
import type { GiftWithReservation } from '@/types/gift';

const reservationSchema = z.object({
  guest_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  guest_email: z.string().email('E-mail inválido'),
  is_couple: z.boolean(),
  spouse_name: z.string().optional(),
}).refine((data) => {
  if (data.is_couple && (!data.spouse_name || data.spouse_name.length < 2)) {
    return false;
  }
  return true;
}, {
  message: 'Nome do cônjuge deve ter pelo menos 2 caracteres',
  path: ['spouse_name'],
});

type ReservationFormData = z.infer<typeof reservationSchema>;

interface ReservationModalProps {
  gift: GiftWithReservation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReservationModal({ gift, open, onOpenChange }: ReservationModalProps) {
  const { toast } = useToast();
  const reserveGift = useReserveGift();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      is_couple: false,
      guest_name: '',
      guest_email: '',
      spouse_name: '',
    },
  });

  const isCouple = watch('is_couple');

  const onSubmit = async (data: ReservationFormData) => {
    if (!gift) return;

    try {
      await reserveGift.mutateAsync({
        gift_id: gift.id,
        guest_name: data.guest_name,
        guest_email: data.guest_email,
        is_couple: data.is_couple,
        spouse_name: data.is_couple ? data.spouse_name || null : null,
      });

      toast({
        title: '🎉 Presente reservado!',
        description: `Obrigado por escolher "${gift.name}"! O casal ficará muito feliz.`,
      });

      reset();
      setIsCouple(false);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro ao reservar',
        description: 'Não foi possível reservar o presente. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 font-display text-xl">
            <div className="rounded-xl bg-primary/20 p-2">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            Confirmar Presente
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {gift && (
              <>Você está prestes a reservar: <span className="font-medium text-foreground">{gift.name}</span></>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="guest_name" className="text-sm font-medium">Seu nome</Label>
            <Input
              id="guest_name"
              placeholder="Digite seu nome completo"
              className="h-12 rounded-xl border-border/50 bg-muted/50 transition-all focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20"
              {...register('guest_name')}
            />
            {errors.guest_name && (
              <p className="text-sm text-destructive">{errors.guest_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest_email" className="text-sm font-medium">Seu e-mail</Label>
            <Input
              id="guest_email"
              type="email"
              placeholder="seu@email.com"
              className="h-12 rounded-xl border-border/50 bg-muted/50 transition-all focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20"
              {...register('guest_email')}
            />
            {errors.guest_email && (
              <p className="text-sm text-destructive">{errors.guest_email.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Como você vai presentear?</Label>
            <RadioGroup
              defaultValue="individual"
              onValueChange={(value) => setIsCouple(value === 'couple')}
              className="flex gap-3"
            >
              <div 
                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border p-4 transition-all ${
                  !isCouple 
                    ? 'border-primary/50 bg-primary/10 text-primary' 
                    : 'border-border/50 bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/50'
                }`}
                onClick={() => setIsCouple(false)}
              >
                <RadioGroupItem
                  value="individual"
                  id="individual"
                  className="sr-only"
                  {...register('is_couple', { setValueAs: () => false })}
                />
                <User className="h-5 w-5" />
                <span className="font-medium">Individual</span>
              </div>
              <div 
                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border p-4 transition-all ${
                  isCouple 
                    ? 'border-primary/50 bg-primary/10 text-primary' 
                    : 'border-border/50 bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/50'
                }`}
                onClick={() => setIsCouple(true)}
              >
                <RadioGroupItem
                  value="couple"
                  id="couple"
                  className="sr-only"
                  {...register('is_couple', { setValueAs: () => true })}
                />
                <Users className="h-5 w-5" />
                <span className="font-medium">Em casal</span>
              </div>
            </RadioGroup>
          </div>

          {isCouple && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="spouse_name" className="text-sm font-medium">Nome do cônjuge</Label>
              <Input
                id="spouse_name"
                placeholder="Digite o nome do seu cônjuge"
                className="h-12 rounded-xl border-border/50 bg-muted/50 transition-all focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20"
                {...register('spouse_name')}
              />
              {errors.spouse_name && (
                <p className="text-sm text-destructive">{errors.spouse_name.message}</p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-xl border-border/50 bg-transparent hover:bg-muted"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
              disabled={reserveGift.isPending}
            >
              {reserveGift.isPending ? 'Reservando...' : 'Confirmar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
