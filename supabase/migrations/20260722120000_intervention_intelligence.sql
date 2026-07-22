-- 20260722120000_intervention_intelligence.sql
-- Intervention intelligence: business problems, intervention options, selected
-- interventions, alternative rejections, assumptions, and engine versions.
--
-- Forward-only. Existing opportunity records are untouched; new tables are
-- additive and link back to assessment sessions and opportunity maps.
--
-- Design: deterministic string IDs from the pipeline (idempotent upserts).
-- Service-role-only writes. Authenticated users read via org membership.

-- ─── Engine versions ─────────────────────────────────────────────────────────
create table if not exists public.engine_versions (
  id text primary key,
  intervention_engine_version text not null,
  prioritization_version text not null,
  blueprint_library_version text not null,
  pipeline_version text not null,
  created_at timestamptz not null default now()
);

comment on table public.engine_versions is 'Version identifiers for every pipeline run: intervention engine, prioritization algorithm, blueprint library, pipeline.';

alter table public.engine_versions enable row level security;

create policy "Authenticated can read engine versions"
  on public.engine_versions for select
  to authenticated
  using (true);

create policy "Service role can manage engine versions"
  on public.engine_versions for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

-- ─── Business problems ───────────────────────────────────────────────────────
create table if not exists public.business_problems (
  id text primary key,
  organization_id uuid references public.organizations(id) on delete cascade,
  assessment_session_id uuid references public.assessment_sessions(id) on delete set null,
  title text not null,
  description text not null,
  department text not null check (department in ('Sales','Marketing','Customer Success','Support','Finance','Product','Engineering','People/HR','Legal','Operations')),
  workflow text not null,
  desired_outcome text not null,
  current_impact jsonb not null,
  evidence_ids jsonb not null default '[]'::jsonb,
  engine_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_business_problems_session on public.business_problems(assessment_session_id);
create index if not exists idx_business_problems_org on public.business_problems(organization_id);
create index if not exists idx_business_problems_department on public.business_problems(department);

create trigger trg_business_problems_updated_at
  before update on public.business_problems
  for each row execute function compass_set_updated_at();

comment on table public.business_problems is 'Canonical business problems detected from assessments. The unit of intervention intelligence — problems, not technologies.';
comment on column public.business_problems.current_impact is 'BusinessImpact object: cost, timePerOccurrence, userHoursPerWeek, customerImpactScore, revenueImpact, strategicImportance.';

alter table public.business_problems enable row level security;

create policy "Members can view org business problems"
  on public.business_problems for select
  to authenticated
  using (
    organization_id is not null and exists (
      select 1 from public.organization_members
      where organization_members.organization_id = business_problems.organization_id
        and organization_members.user_id = (select auth.uid())
    )
  );

create policy "Service role can manage all business problems"
  on public.business_problems for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

-- ─── Intervention options (every compared path) ──────────────────────────────
create table if not exists public.intervention_options (
  id text primary key,
  problem_id text not null references public.business_problems(id) on delete cascade,
  path text not null check (path in ('ai','deterministic_software','process_redesign','human_work','hybrid','no_action_yet')),
  summary text not null,
  expected_impact jsonb not null,
  estimated_cost jsonb not null,
  estimated_time_to_value jsonb not null,
  implementation_complexity integer not null check (implementation_complexity between 0 and 10),
  data_readiness integer not null check (data_readiness between 0 and 10),
  organizational_readiness integer not null check (organizational_readiness between 0 and 10),
  technical_risk integer not null check (technical_risk between 0 and 10),
  operational_risk integer not null check (operational_risk between 0 and 10),
  human_judgment_requirement integer not null check (human_judgment_requirement between 0 and 10),
  reversibility integer not null check (reversibility between 0 and 10),
  confidence numeric(4,3) not null check (confidence between 0 and 1),
  eligible boolean not null default false,
  disqualifiers jsonb not null default '[]'::jsonb,
  evidence_ids jsonb not null default '[]'::jsonb,
  engine_version text not null,
  created_at timestamptz not null default now(),
  unique (problem_id, path)
);

create index if not exists idx_intervention_options_problem on public.intervention_options(problem_id);
create index if not exists idx_intervention_options_path on public.intervention_options(path);
create index if not exists idx_intervention_options_eligible on public.intervention_options(problem_id, eligible);

comment on table public.intervention_options is 'Every intervention path evaluated for a business problem — eligible or not. Proves Compass compares AI against simpler alternatives.';

alter table public.intervention_options enable row level security;

create policy "Members can view org intervention options"
  on public.intervention_options for select
  to authenticated
  using (
    exists (
      select 1 from public.business_problems bp
      join public.organization_members om on om.organization_id = bp.organization_id
      where bp.id = intervention_options.problem_id
        and om.user_id = (select auth.uid())
    )
  );

create policy "Service role can manage all intervention options"
  on public.intervention_options for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

-- ─── Selected interventions ──────────────────────────────────────────────────
create table if not exists public.selected_interventions (
  id text primary key,
  problem_id text not null references public.business_problems(id) on delete cascade,
  opportunity_map_id uuid references public.opportunity_maps(id) on delete set null,
  selected_path text not null check (selected_path in ('ai','deterministic_software','process_redesign','human_work','hybrid','no_action_yet')),
  reasons_selected jsonb not null default '[]'::jsonb,
  confidence numeric(4,3) not null check (confidence between 0 and 1),
  tier integer not null check (tier between 1 and 4),
  sequence integer not null check (sequence >= 1),
  recommendation text not null check (recommendation in ('build_now','validate_next','defer','do_not_pursue')),
  ranked_score integer not null,
  pass_scores jsonb not null,
  success_metrics jsonb not null default '[]'::jsonb,
  escalation_requirements jsonb not null default '[]'::jsonb,
  reasoning_trace_id text not null,
  engine_version text not null,
  prioritization_version text not null,
  created_at timestamptz not null default now(),
  unique (problem_id)
);

create index if not exists idx_selected_interventions_map on public.selected_interventions(opportunity_map_id);
create index if not exists idx_selected_interventions_tier on public.selected_interventions(tier, sequence);
create index if not exists idx_selected_interventions_path on public.selected_interventions(selected_path);

comment on table public.selected_interventions is 'The chosen intervention per problem with full four-pass scores, selection rationale, success metrics, and escalation requirements.';
comment on column public.selected_interventions.pass_scores is 'Four-pass breakdown: eligibility, business_leverage, readiness, portfolio_priority (four_pass_v2).';

alter table public.selected_interventions enable row level security;

create policy "Members can view org selected interventions"
  on public.selected_interventions for select
  to authenticated
  using (
    exists (
      select 1 from public.business_problems bp
      join public.organization_members om on om.organization_id = bp.organization_id
      where bp.id = selected_interventions.problem_id
        and om.user_id = (select auth.uid())
    )
  );

create policy "Service role can manage all selected interventions"
  on public.selected_interventions for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

-- ─── Alternative rejections ──────────────────────────────────────────────────
create table if not exists public.alternative_rejections (
  id text primary key,
  problem_id text not null references public.business_problems(id) on delete cascade,
  path text not null check (path in ('ai','deterministic_software','process_redesign','human_work','hybrid','no_action_yet')),
  primary_reason text not null,
  secondary_reasons jsonb not null default '[]'::jsonb,
  evidence_ids jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (problem_id, path)
);

create index if not exists idx_alternative_rejections_problem on public.alternative_rejections(problem_id);

comment on table public.alternative_rejections is 'Why each non-selected intervention path was rejected. Every selected path must explain why alternatives were not selected.';

alter table public.alternative_rejections enable row level security;

create policy "Members can view org alternative rejections"
  on public.alternative_rejections for select
  to authenticated
  using (
    exists (
      select 1 from public.business_problems bp
      join public.organization_members om on om.organization_id = bp.organization_id
      where bp.id = alternative_rejections.problem_id
        and om.user_id = (select auth.uid())
    )
  );

create policy "Service role can manage all alternative rejections"
  on public.alternative_rejections for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

-- ─── Intervention assumptions ────────────────────────────────────────────────
create table if not exists public.intervention_assumptions (
  id text primary key,
  problem_id text not null references public.business_problems(id) on delete cascade,
  option_path text not null check (option_path in ('ai','deterministic_software','process_redesign','human_work','hybrid','no_action_yet')),
  statement text not null,
  confidence numeric(4,3) not null check (confidence between 0 and 1),
  evidence_ids jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_intervention_assumptions_problem on public.intervention_assumptions(problem_id);

comment on table public.intervention_assumptions is 'Explicit assumptions each intervention option depends on, with confidence and evidence links.';

alter table public.intervention_assumptions enable row level security;

create policy "Members can view org intervention assumptions"
  on public.intervention_assumptions for select
  to authenticated
  using (
    exists (
      select 1 from public.business_problems bp
      join public.organization_members om on om.organization_id = bp.organization_id
      where bp.id = intervention_assumptions.problem_id
        and om.user_id = (select auth.uid())
    )
  );

create policy "Service role can manage all intervention assumptions"
  on public.intervention_assumptions for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

-- ─── Intervention blueprint library (versioned) ──────────────────────────────
create table if not exists public.intervention_blueprints (
  id text not null,
  version text not null,
  name text not null,
  supported_paths jsonb not null,
  problem_patterns jsonb not null default '[]'::jsonb,
  required_conditions jsonb not null default '[]'::jsonb,
  disqualifiers jsonb not null default '[]'::jsonb,
  required_data jsonb not null default '[]'::jsonb,
  required_systems jsonb not null default '[]'::jsonb,
  human_roles jsonb not null default '[]'::jsonb,
  implementation_phases jsonb not null default '[]'::jsonb,
  security_considerations jsonb not null default '[]'::jsonb,
  success_metrics jsonb not null default '[]'::jsonb,
  common_failure_modes jsonb not null default '[]'::jsonb,
  escalation_requirements jsonb not null default '[]'::jsonb,
  evidence_requirements jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  primary key (id, version)
);

comment on table public.intervention_blueprints is 'Versioned intervention blueprint library. Blueprints span all paths: deterministic routing, AI classification with review, process redesign, human ownership, hybrid, vendor configuration, no-action plans.';

alter table public.intervention_blueprints enable row level security;

create policy "Authenticated can read intervention blueprints"
  on public.intervention_blueprints for select
  to authenticated
  using (true);

create policy "Service role can manage intervention blueprints"
  on public.intervention_blueprints for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');
