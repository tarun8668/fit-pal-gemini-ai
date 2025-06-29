
-- Create weight tracking table
CREATE TABLE public.weight_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create strength tracking table
CREATE TABLE public.strength_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_name TEXT NOT NULL,
  weight DECIMAL(6,2) NOT NULL,
  reps INTEGER NOT NULL,
  sets INTEGER NOT NULL,
  one_rep_max DECIMAL(6,2) NOT NULL,
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) for weight tracking
ALTER TABLE public.weight_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own weight entries" 
  ON public.weight_tracking 
  FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own weight entries" 
  ON public.weight_tracking 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own weight entries" 
  ON public.weight_tracking 
  FOR UPDATE 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own weight entries" 
  ON public.weight_tracking 
  FOR DELETE 
  USING (auth.uid()::text = user_id::text);

-- Add Row Level Security (RLS) for strength tracking
ALTER TABLE public.strength_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own strength entries" 
  ON public.strength_tracking 
  FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own strength entries" 
  ON public.strength_tracking 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own strength entries" 
  ON public.strength_tracking 
  FOR UPDATE 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own strength entries" 
  ON public.strength_tracking 
  FOR DELETE 
  USING (auth.uid()::text = user_id::text);

-- Create indexes for better performance
CREATE INDEX idx_weight_tracking_user_date ON public.weight_tracking(user_id, recorded_date DESC);
CREATE INDEX idx_strength_tracking_user_exercise_date ON public.strength_tracking(user_id, exercise_name, recorded_date DESC);

-- Add triggers for updating the updated_at column
CREATE TRIGGER update_weight_tracking_updated_at
  BEFORE UPDATE ON public.weight_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_strength_tracking_updated_at
  BEFORE UPDATE ON public.strength_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
