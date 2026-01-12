-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow all operations on goals" ON public.goals;
DROP POLICY IF EXISTS "Allow all operations on match_players" ON public.match_players;
DROP POLICY IF EXISTS "Allow all operations on matches" ON public.matches;
DROP POLICY IF EXISTS "Allow all operations on players" ON public.players;
DROP POLICY IF EXISTS "Allow all operations on teams" ON public.teams;

-- Goals: Public read, authenticated write
CREATE POLICY "Anyone can view goals" ON public.goals
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert goals" ON public.goals
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update goals" ON public.goals
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete goals" ON public.goals
FOR DELETE TO authenticated USING (true);

-- Match Players: Public read, authenticated write
CREATE POLICY "Anyone can view match_players" ON public.match_players
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert match_players" ON public.match_players
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update match_players" ON public.match_players
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete match_players" ON public.match_players
FOR DELETE TO authenticated USING (true);

-- Matches: Public read, authenticated write
CREATE POLICY "Anyone can view matches" ON public.matches
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert matches" ON public.matches
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update matches" ON public.matches
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete matches" ON public.matches
FOR DELETE TO authenticated USING (true);

-- Players: Public read, authenticated write
CREATE POLICY "Anyone can view players" ON public.players
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert players" ON public.players
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update players" ON public.players
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete players" ON public.players
FOR DELETE TO authenticated USING (true);

-- Teams: Public read, authenticated write
CREATE POLICY "Anyone can view teams" ON public.teams
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert teams" ON public.teams
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update teams" ON public.teams
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete teams" ON public.teams
FOR DELETE TO authenticated USING (true);