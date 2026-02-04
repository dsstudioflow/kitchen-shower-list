-- Add price column to gifts table
ALTER TABLE public.gifts 
ADD COLUMN price numeric(10,2) DEFAULT NULL;