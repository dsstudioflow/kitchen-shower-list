import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Link } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateGift, useUpdateGift } from '@/hooks/useGifts';
import { supabase } from '@/integrations/supabase/client';
import { GIFT_CATEGORIES, type Gift, type GiftCategory } from '@/types/gift';

const giftSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  purchase_link: z.string().url('URL inválida').optional().or(z.literal('')),
  category: z.string(),
});

type GiftFormData = z.infer<typeof giftSchema>;

interface GiftFormModalProps {
  gift?: Gift | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GiftFormModal({ gift, open, onOpenChange }: GiftFormModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(gift?.image_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const createGift = useCreateGift();
  const updateGift = useUpdateGift();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GiftFormData>({
    resolver: zodResolver(giftSchema),
    defaultValues: {
      name: gift?.name || '',
      description: gift?.description || '',
      purchase_link: gift?.purchase_link || '',
      category: gift?.category || 'Outros',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('gift-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('gift-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const onSubmit = async (data: GiftFormData) => {
    try {
      setIsUploading(true);

      let imageUrl = gift?.image_url || null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      } else if (!imagePreview && gift?.image_url) {
        imageUrl = null;
      }

      const giftData = {
        name: data.name,
        description: data.description || null,
        purchase_link: data.purchase_link || null,
        category: data.category as GiftCategory,
        image_url: imageUrl,
      };

      if (gift) {
        await updateGift.mutateAsync({ id: gift.id, ...giftData });
        toast({ title: 'Presente atualizado com sucesso!' });
      } else {
        await createGift.mutateAsync(giftData);
        toast({ title: 'Presente adicionado com sucesso!' });
      }

      reset();
      setImageFile(null);
      setImagePreview(null);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro ao salvar presente',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {gift ? 'Editar Presente' : 'Adicionar Presente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Imagem</Label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-1 top-1 rounded-full bg-background/80 p-1 hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">Upload</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              placeholder="Ex: Jogo de Panelas"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição opcional do item"
              rows={3}
              {...register('description')}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              defaultValue={gift?.category || 'Outros'}
              onValueChange={(value) => setValue('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {GIFT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Purchase Link */}
          <div className="space-y-2">
            <Label htmlFor="purchase_link">Link de Compra</Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="purchase_link"
                placeholder="https://www.exemplo.com/produto"
                className="pl-10"
                {...register('purchase_link')}
              />
            </div>
            {errors.purchase_link && (
              <p className="text-sm text-destructive">{errors.purchase_link.message}</p>
            )}
          </div>

          {/* Actions */}
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
              disabled={isUploading || createGift.isPending || updateGift.isPending}
            >
              {isUploading ? 'Enviando...' : gift ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
