-- Add default_team_id to players table
ALTER TABLE public.players 
ADD COLUMN default_team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL;