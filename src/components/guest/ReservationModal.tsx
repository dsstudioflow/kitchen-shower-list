import { useState } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  const [isCouple, setIsCouple] = useState(false);
  const { toast } = useToast();
  const reserveGift = useReserveGift();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      is_couple: false,
    },
  });

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Confirmar Presente
          </DialogTitle>
          <DialogDescription>
            {gift && `Você está prestes a reservar: ${gift.name}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guest_name">Seu nome</Label>
            <Input
              id="guest_name"
              placeholder="Digite seu nome completo"
              {...register('guest_name')}
            />
            {errors.guest_name && (
              <p className="text-sm text-destructive">{errors.guest_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest_email">Seu e-mail</Label>
            <Input
              id="guest_email"
              type="email"
              placeholder="seu@email.com"
              {...register('guest_email')}
            />
            {errors.guest_email && (
              <p className="text-sm text-destructive">{errors.guest_email.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Como você vai presentear?</Label>
            <RadioGroup
              defaultValue="individual"
              onValueChange={(value) => setIsCouple(value === 'couple')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="individual"
                  id="individual"
                  {...register('is_couple', {
                    setValueAs: () => false,
                  })}
                />
                <Label htmlFor="individual" className="flex items-center gap-1 cursor-pointer">
                  <User className="h-4 w-4" />
                  Individual
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="couple"
                  id="couple"
                  {...register('is_couple', {
                    setValueAs: () => true,
                  })}
                />
                <Label htmlFor="couple" className="flex items-center gap-1 cursor-pointer">
                  <Users className="h-4 w-4" />
                  Em casal
                </Label>
              </div>
            </RadioGroup>
          </div>

          {isCouple && (
            <div className="space-y-2">
              <Label htmlFor="spouse_name">Nome do cônjuge</Label>
              <Input
                id="spouse_name"
                placeholder="Digite o nome do seu cônjuge"
                {...register('spouse_name')}
              />
              {errors.spouse_name && (
                <p className="text-sm text-destructive">{errors.spouse_name.message}</p>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
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
