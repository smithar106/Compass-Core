-- complete_assessment_auth_refactor
-- Corrective migration: 20260722014323 was deployed empty, so the remote
-- database still has the old anonymous_token schema with policies referencing
-- current_setting('request.jwt.claims') and FK to profiles(id).
-- This file applies the intended refactor against the live remote schema.

begin;

-- ============================================================================
-- STEP 1: Drop OLD RLS policies that still reference anonymous_token
-- ============================================================================
drop policy if exists "Users can view own sessions" on public.assessment_sessions;
drop policy if exists "Anyone can create sessions" on public.assessment_sessions;
drop policy if exists "Users can update own sessions" on public.assessment_sessions;
drop policy if exists "Org members can view org sessions" on public.assessment_sessions;
drop policy if exists "Service role can manage all sessions" on public.assessment_sessions;

drop policy if exists "Users can view own answers" on public.assessment_answers;
drop policy if exists "Anyone can add answers to sessions" on public.assessment_answers;
drop policy if exists "Service role can manage all answers" on public.assessment_answers;

-- ============================================================================
-- STEP 2: Remove legacy columns
-- ============================================================================
alter table public.assessment_sessions
  drop column if exists anonymous_token;

-- ============================================================================
-- STEP 3: Retarget FK from profiles(id) -> auth.users(id)
-- ============================================================================
alter table public.assessment_sessions
  drop constraint if exists assessment_sessions_user_id_fkey;

alter table public.assessment_sessions
  add constraint assessment_sessions_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

-- ============================================================================
-- STEP 4: Make user_id NOT NULL (no data — 0 rows confirmed)
-- ============================================================================
alter table public.assessment_sessions
  alter column user_id set not null;

-- ============================================================================
-- STEP 5: Update status constraint and default
-- ============================================================================
alter table public.assessment_sessions
  drop constraint if exists assessment_sessions_status_check;

update public.assessment_sessions
  set status = 'in_progress'
  where status = 'not_started';

update public.assessment_sessions
  set status = 'abandoned'
  where status = 'expired';

alter table public.assessment_sessions
  add constraint assessment_sessions_status_check
  check (status in ('in_progress', 'completed', 'abandoned'));

alter table public.assessment_sessions
  alter column status set default 'in_progress';

-- ============================================================================
-- STEP 6: Add assessment_version column
-- ============================================================================
alter table public.assessment_sessions
  add column if not exists assessment_version text not null default '1.0.0';

-- ============================================================================
-- STEP 7: Make metadata NOT NULL
-- ============================================================================
update public.assessment_sessions
  set metadata = '{}'::jsonb
  where metadata is null;

alter table public.assessment_sessions
  alter column metadata set not null;

alter table public.assessment_sessions
  alter column metadata set default '{}'::jsonb;

-- ============================================================================
-- STEP 8: Drop obsolete index
-- ============================================================================
drop index if exists idx_assessment_sessions_token;

-- ============================================================================
-- STEP 9: Create NEW RLS policies for assessment_sessions
-- ============================================================================
alter table public.assessment_sessions enable row level security;

create policy "Users create own assessment sessions"
  on public.assessment_sessions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users read own assessment sessions"
  on public.assessment_sessions for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users update own assessment sessions"
  on public.assessment_sessions for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users delete own assessment sessions"
  on public.assessment_sessions for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Service role can manage all sessions"
  on public.assessment_sessions for all
  to authenticated
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- STEP 10: Create NEW RLS policies for assessment_answers
-- ============================================================================
alter table public.assessment_answers enable row level security;

create policy "Users read answers for own sessions"
  on public.assessment_answers for select
  to authenticated
  using (
    exists (
      select 1 from public.assessment_sessions s
      where s.id = session_id and s.user_id = (select auth.uid())
    )
  );

create policy "Users insert answers for own sessions"
  on public.assessment_answers for insert
  to authenticated
  with check (
    exists (
      select 1 from public.assessment_sessions s
      where s.id = session_id and s.user_id = (select auth.uid())
    )
  );

create policy "Users update answers for own sessions"
  on public.assessment_answers for update
  to authenticated
  using (
    exists (
      select 1 from public.assessment_sessions s
      where s.id = session_id and s.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.assessment_sessions s
      where s.id = session_id and s.user_id = (select auth.uid())
    )
  );

create policy "Users delete answers for own sessions"
  on public.assessment_answers for delete
  to authenticated
  using (
    exists (
      select 1 from public.assessment_sessions s
      where s.id = session_id and s.user_id = (select auth.uid())
    )
  );

create policy "Service role can manage all answers"
  on public.assessment_answers for all
  to authenticated
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- STEP 11: Update comments
-- ============================================================================
comment on table public.assessment_sessions is 'Assessment sessions owned by a Supabase auth user (anonymous or permanent).';
comment on column public.assessment_sessions.user_id is 'Supabase auth user ID (anonymous or permanent). FK -> auth.users(id) with cascade.';
comment on column public.assessment_sessions.metadata is 'Session metadata: adaptiveVersion, userAgent, researchSnapshotId.';
comment on column public.assessment_sessions.assessment_version is 'Schema version of the assessment presented.';

commit;
