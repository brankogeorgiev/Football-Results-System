-- Drop existing INSERT/UPDATE/DELETE policies that require authentication
DROP POLICY IF EXISTS "Authenticated users can insert matches" ON public.matches;
DROP POLICY IF EXISTS "Authenticated users can update matches" ON public.matches;
DROP POLICY IF EXISTS "Authenticated users can delete matches" ON public.matches;

DROP POLICY IF EXISTS "Authenticated users can insert goals" ON public.goals;
DROP POLICY IF EXISTS "Authenticated users can update goals" ON public.goals;
DROP POLICY IF EXISTS "Authenticated users can delete goals" ON public.goals;

DROP POLICY IF EXISTS "Authenticated users can insert players" ON public.players;
DROP POLICY IF EXISTS "Authenticated users can update players" ON public.players;
DROP POLICY IF EXISTS "Authenticated users can delete players" ON public.players;

DROP POLICY IF EXISTS "Authenticated users can insert teams" ON public.teams;
DROP POLICY IF EXISTS "Authenticated users can update teams" ON public.teams;
DROP POLICY IF EXISTS "Authenticated users can delete teams" ON public.teams;

DROP POLICY IF EXISTS "Authenticated users can insert match_players" ON public.match_players;
DROP POLICY IF EXISTS "Authenticated users can update match_players" ON public.match_players;
DROP POLICY IF EXISTS "Authenticated users can delete match_players" ON public.match_players;

-- Create new policies that allow public access (anyone can insert/update/delete)
CREATE POLICY "Anyone can insert matches" ON public.matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update matches" ON public.matches FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete matches" ON public.matches FOR DELETE USING (true);

CREATE POLICY "Anyone can insert goals" ON public.goals FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update goals" ON public.goals FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete goals" ON public.goals FOR DELETE USING (true);

CREATE POLICY "Anyone can insert players" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update players" ON public.players FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete players" ON public.players FOR DELETE USING (true);

CREATE POLICY "Anyone can insert teams" ON public.teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update teams" ON public.teams FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete teams" ON public.teams FOR DELETE USING (true);

CREATE POLICY "Anyone can insert match_players" ON public.match_players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update match_players" ON public.match_players FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete match_players" ON public.match_players FOR DELETE USING (true);