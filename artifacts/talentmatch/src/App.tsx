import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import {
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Filter,
  Gauge,
  Layers3,
  Menu,
  MoreHorizontal,
  PanelRight,
  Plus,
  Search,
  Settings2,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Star,
  Target,
  UsersRound,
  X,
} from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

// TalentMatch is a local-first recruiting review workspace.
// Candidate data below is intentionally realistic demo data so the complete
// product flow works immediately without requiring a backend service.
type Candidate = {
  id: number;
  name: string;
  initials: string;
  role: string;
  location: string;
  score: number;
  status: string;
  available: string;
  summary: string;
  match: string;
  skills: string[];
  experience: string;
  evidence: { label: string; detail: string; tone: 'strong' | 'watch' | 'neutral' }[];
  color: string;
};

type NavKey = 'overview' | 'candidates' | 'shortlist' | 'settings';

const candidates: Candidate[] = [
  {
    id: 1,
    name: 'Ayesha Rahman',
    initials: 'AR',
    role: 'Staff Product Designer',
    location: 'San Francisco, CA',
    score: 94,
    status: 'Strong match',
    available: 'Available now',
    summary: 'Systems thinker who turns fuzzy product questions into clear, shipped experiences.',
    match: 'Maya has led design systems and zero-to-one product work across two high-growth teams.',
    skills: ['Product strategy', 'Design systems', 'Figma', 'User research'],
    experience: '10 years',
    evidence: [
      { label: 'Design systems', detail: 'Built and scaled a shared system used across 4 product surfaces at Lattice.', tone: 'strong' },
      { label: 'Product strategy', detail: 'Partnered with founders to define the first 3 releases of an analytics product.', tone: 'strong' },
      { label: 'Leadership scope', detail: 'Managed 3 designers while remaining hands-on in critical product work.', tone: 'strong' },
      { label: 'Domain context', detail: 'No direct fintech experience found in the resume.', tone: 'watch' },
    ],
    color: '#e4a853',
  },
  {
    id: 2,
    name: 'Arjun Mehta',
    initials: 'AM',
    role: 'Product Designer',
    location: 'New York, NY',
    score: 89,
    status: 'Strong match',
    available: '2 weeks notice',
    summary: 'Research-led product designer with a sharp eye for workflows and practical detail.',
    match: 'Jon’s portfolio shows unusually strong workflow simplification and close engineering partnership.',
    skills: ['Interaction design', 'Prototyping', 'Research', 'B2B SaaS'],
    experience: '8 years',
    evidence: [
      { label: 'Workflow design', detail: 'Reduced a complex claims workflow from 14 steps to 6 at Northstar.', tone: 'strong' },
      { label: 'Cross-functional', detail: 'Embedded with engineering pods and shipped weekly iteration cycles.', tone: 'strong' },
      { label: 'Research practice', detail: 'Runs moderated discovery studies and synthesizes findings for product teams.', tone: 'strong' },
      { label: 'Leadership scope', detail: 'No formal people management experience found in the resume.', tone: 'watch' },
    ],
    color: '#6aa99c',
  },
  {
    id: 3,
    name: 'Fatima Khan',
    initials: 'FK',
    role: 'Senior Product Designer',
    location: 'Austin, TX',
    score: 84,
    status: 'Good match',
    available: 'Available in 1 month',
    summary: 'Visual storyteller with strong product instincts and a track record of making complex tools feel human.',
    match: 'Amina brings the right blend of craft and product thinking, with room to grow into the staff scope.',
    skills: ['Visual design', 'Prototyping', 'Design systems', 'Storytelling'],
    experience: '7 years',
    evidence: [
      { label: 'Visual craft', detail: 'Led a brand-to-product refresh that increased activation by 18%.', tone: 'strong' },
      { label: 'Systems thinking', detail: 'Maintains a component library across marketing and product surfaces.', tone: 'strong' },
      { label: 'Communication', detail: 'Presents product narratives to executive and customer audiences.', tone: 'strong' },
      { label: 'Scope', detail: 'Experience is strongest in growth and activation, lighter in core platform work.', tone: 'watch' },
    ],
    color: '#c77a70',
  },
  {
    id: 4,
    name: 'Rohan Iyer',
    initials: 'RI',
    role: 'Lead Product Designer',
    location: 'Toronto, ON',
    score: 79,
    status: 'Promising',
    available: 'Available now',
    summary: 'Calm, methodical designer who excels at bringing structure to complex internal products.',
    match: 'Theo’s enterprise experience is compelling, though his zero-to-one work is less evidenced.',
    skills: ['Enterprise UX', 'Design ops', 'Figma', 'Accessibility'],
    experience: '9 years',
    evidence: [
      { label: 'Enterprise UX', detail: 'Owned the redesign of an operations suite used by 12,000 employees.', tone: 'strong' },
      { label: 'Accessibility', detail: 'Introduced accessibility reviews into the team’s definition of done.', tone: 'strong' },
      { label: 'Design operations', detail: 'Created rituals for critique, intake, and prioritization across three pods.', tone: 'neutral' },
      { label: 'Zero-to-one', detail: 'Resume gives limited detail on early-stage product creation.', tone: 'watch' },
    ],
    color: '#8795be',
  },
  {
    id: 5,
    name: 'Sana Qureshi',
    initials: 'SQ',
    role: 'Product Designer',
    location: 'London, UK',
    score: 73,
    status: 'Worth a look',
    available: '3 weeks notice',
    summary: 'Thoughtful generalist with a strong qualitative toolkit and growing systems experience.',
    match: 'Priya is a high-potential match for the team’s research-heavy product bets.',
    skills: ['User research', 'Service design', 'Figma', 'Workshops'],
    experience: '6 years',
    evidence: [
      { label: 'User research', detail: 'Established a continuous discovery program across two customer segments.', tone: 'strong' },
      { label: 'Service design', detail: 'Mapped end-to-end journeys with operations and customer success teams.', tone: 'neutral' },
      { label: 'Product ownership', detail: 'Shows strong collaboration, with fewer examples of owning shipped outcomes.', tone: 'watch' },
    ],
    color: '#aa8eb9',
  },
];

const navItems: { key: NavKey; label: string; icon: typeof Layers3; count?: string }[] = [
  { key: 'overview', label: 'Overview', icon: Gauge },
  { key: 'candidates', label: 'Candidates', icon: UsersRound, count: '24' },
  { key: 'shortlist', label: 'Shortlist', icon: ClipboardCheck, count: '3' },
];

function AppShell({ children, active = 'overview' }: { children: ReactNode; active?: NavKey }) {
  return (
    <div className="flex min-h-[100dvh] bg-background text-foreground">
      <aside className="hidden min-h-[100dvh] w-[248px] shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex items-center gap-3 px-7 py-7">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Target size={19} strokeWidth={2.5} />
          </div>
          <span className="font-display text-[26px] leading-none tracking-[-0.03em]">TalentMatch</span>
        </div>
        <div className="px-4">
          <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/45">Workspace</div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <ShellNavItem key={item.key} item={item} active={active === item.key} />
            ))}
          </nav>
          <div className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/45">Manage</div>
          <ShellNavItem item={{ key: 'settings', label: 'Settings', icon: Settings2 }} active={active === 'settings'} />
        </div>
        <div className="mt-auto px-4 pb-5">
          <div className="mb-4 rounded-2xl border border-sidebar-border bg-sidebar-accent/60 p-4">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-sidebar-foreground/70">
              <Sparkles size={13} className="text-sidebar-primary" />
              Fairness check
            </div>
            <p className="text-xs leading-5 text-sidebar-foreground/55">Scores are grounded in resume evidence, not proxies.</p>
            <button data-testid="button-learn-fairness" onClick={() => window.dispatchEvent(new CustomEvent('talentmatch:navigate', { detail: 'settings' }))} className="mt-3 text-xs font-semibold text-sidebar-primary transition-opacity hover:opacity-75">How scoring works <ArrowUpRight className="ml-1 inline" size={12} /></button>
          </div>
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b7d3c6] text-xs font-bold text-[#23443c]">AM</div>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold">Alex Morgan</div>
              <div className="truncate text-[11px] text-sidebar-foreground/50">Hiring team</div>
            </div>
            <ChevronDown className="ml-auto text-sidebar-foreground/45" size={15} />
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function ShellNavItem({ item, active }: { item: { key: NavKey; label: string; icon: typeof Layers3; count?: string }; active: boolean }) {
  const Icon = item.icon;
  return (
    <button
      data-testid={`nav-${item.key}`}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-colors ${active ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/62 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}
      onClick={() => window.dispatchEvent(new CustomEvent('talentmatch:navigate', { detail: item.key }))}
    >
      <Icon size={17} strokeWidth={active ? 2.4 : 1.9} />
      <span>{item.label}</span>
      {item.count && <span className={`ml-auto font-mono-ui text-[10px] ${active ? 'opacity-70' : 'text-sidebar-foreground/35'}`}>{item.count}</span>}
    </button>
  );
}

function ScorePill({ score, compact = false }: { score: number; compact?: boolean }) {
  const tone = score >= 88 ? 'text-[#237064] bg-[#dceee8]' : score >= 78 ? 'text-[#9a6b24] bg-[#f8e9c8]' : 'text-[#9c514a] bg-[#f3dfdb]';
  return <span data-testid={`score-${score}`} className={`inline-flex items-center gap-1 rounded-full font-mono-ui font-medium ${compact ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs'} ${tone}`}><span className="font-bold">{score}</span><span className="opacity-55">/100</span></span>;
}

function StatCard({ label, value, detail, icon: Icon, accent }: { label: string; value: string; detail: string; icon: typeof Gauge; accent: string }) {
  return (
    <div className="animate-rise-in rounded-2xl border border-card-border bg-card p-5 shadow-xs">
      <div className="mb-5 flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${accent}20`, color: accent }}><Icon size={16} /></span>
      </div>
      <div className="flex items-end gap-3">
        <span data-testid={`stat-${label.toLowerCase().replaceAll(' ', '-')}`} className="font-display text-[34px] leading-none tracking-[-0.03em]">{value}</span>
        <span className="mb-0.5 text-xs font-medium text-muted-foreground">{detail}</span>
      </div>
    </div>
  );
}

function SkeletonDashboard() {
  return (
    <div data-testid="loading-dashboard" className="space-y-7 p-5 md:p-9">
      <div className="skeleton h-8 w-56 rounded-lg" />
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]"><div className="skeleton h-44 rounded-2xl" /><div className="skeleton h-44 rounded-2xl" /></div>
      <div className="grid gap-4 sm:grid-cols-3"><div className="skeleton h-32 rounded-2xl" /><div className="skeleton h-32 rounded-2xl" /><div className="skeleton h-32 rounded-2xl" /></div>
      <div className="skeleton h-[420px] rounded-2xl" />
    </div>
  );
}

function Dashboard() {
  const [active, setActive] = useState<NavKey>('overview');
  const [selectedId, setSelectedId] = useState(1);
  const [shortlisted, setShortlisted] = useState<number[]>([1, 2, 3]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All candidates');
  const [sort, setSort] = useState('Best fit');
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [toast, setToast] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [autoScore, setAutoScore] = useState(true);
  const [fairness, setFairness] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 120);
    const navigate = (event: Event) => setActive((event as CustomEvent<NavKey>).detail);
    window.addEventListener('talentmatch:navigate', navigate);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('talentmatch:navigate', navigate);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const notify = (event: Event) => setToast((event as CustomEvent<string>).detail);
    window.addEventListener('talentmatch:toast', notify);
    return () => window.removeEventListener('talentmatch:toast', notify);
  }, []);

  const visibleCandidates = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const filtered = candidates.filter((candidate) => {
      const matchSearch = !normalized || [candidate.name, candidate.role, candidate.location, ...candidate.skills].join(' ').toLowerCase().includes(normalized);
      const matchFilter = filter === 'All candidates' || (filter === 'Shortlisted' ? shortlisted.includes(candidate.id) : filter === 'Strong matches' ? candidate.score >= 88 : candidate.available === 'Available now');
      return matchSearch && matchFilter;
    });
    return [...filtered].sort((a, b) => sort === 'Best fit' ? b.score - a.score : a.name.localeCompare(b.name));
  }, [filter, search, shortlisted, sort]);

  const selected = candidates.find((candidate) => candidate.id === selectedId) ?? candidates[0];
  const toggleShortlist = (id: number) => {
    setShortlisted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setToast(shortlisted.includes(id) ? 'Removed from shortlist' : 'Added to shortlist');
  };

  const nav = (key: NavKey) => {
    setActive(key);
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <AppShell active={active}><SkeletonDashboard /></AppShell>;

  return (
    <AppShell active={active}>
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="flex h-[72px] items-center justify-between px-5 md:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button data-testid="button-mobile-menu" className="rounded-lg p-2 hover:bg-muted md:hidden" onClick={() => setMobileNav((value) => !value)} aria-label="Open navigation"><Menu size={20} /></button>
            <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span>Workspace</span><ChevronRight size={13} /><span className="font-semibold text-foreground">{active === 'overview' ? 'Overview' : active[0].toUpperCase() + active.slice(1)}</span></div>
            <div className="flex items-center gap-2 sm:hidden"><Target size={17} className="text-accent" /><span className="font-display text-xl">TalentMatch</span></div>
          </div>
          <div className="flex items-center gap-2">
            <button data-testid="button-help" onClick={() => window.dispatchEvent(new CustomEvent('talentmatch:toast', { detail: 'Help center opened' }))} className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:block" aria-label="Help"><CircleHelp size={18} /></button>
            <button data-testid="button-notifications" onClick={() => window.dispatchEvent(new CustomEvent('talentmatch:toast', { detail: 'You are all caught up' }))} className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Notifications"><Bell size={18} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#c77a70]" /></button>
            <div className="ml-1 hidden h-8 w-8 items-center justify-center rounded-full bg-[#b7d3c6] text-[10px] font-bold text-[#23443c] sm:flex">AM</div>
          </div>
        </div>
        {mobileNav && <div className="border-t border-border bg-card px-4 py-3 md:hidden"><div className="grid grid-cols-4 gap-1">{navItems.map((item) => <button key={item.key} data-testid={`mobile-nav-${item.key}`} onClick={() => nav(item.key)} className={`flex flex-col items-center gap-1 rounded-lg p-2 text-[10px] font-semibold ${active === item.key ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'}`}><item.icon size={17} /><span>{item.label}</span></button>)}</div><button data-testid="mobile-nav-settings" onClick={() => nav('settings')} className={`mt-1 flex w-full items-center justify-center gap-2 rounded-lg p-2 text-[10px] font-semibold ${active === 'settings' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'}`}><Settings2 size={15} />Settings</button></div>}
      </header>

      {active === 'settings' ? <SettingsView autoScore={autoScore} setAutoScore={setAutoScore} fairness={fairness} setFairness={setFairness} toast={setToast} /> : active === 'shortlist' ? <ShortlistView shortlisted={shortlisted} onSelect={(id) => { setSelectedId(id); setActive('candidates'); }} onToggle={toggleShortlist} /> : (
        <main className="mx-auto max-w-[1500px] p-5 md:p-9">
          <section className="animate-rise-in mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-accent"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Hiring workspace <span className="font-mono-ui text-[10px] text-muted-foreground">/ updated 9m ago</span></div>
              <h1 className="font-display text-[39px] leading-[0.95] tracking-[-0.045em] md:text-[48px]">Find the signal<br /><em className="text-accent">in the noise.</em></h1>
              <p className="mt-4 max-w-[510px] text-sm leading-6 text-muted-foreground">A clear, evidence-led view of your pipeline for Product Designer, Staff level.</p>
            </div>
            <button data-testid="button-new-role" onClick={() => setShowRoleModal(true)} className="group inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 lg:self-end"><Plus size={17} /> Add a role <span className="ml-1 border-l border-primary-foreground/20 pl-2 text-xs opacity-60">⌘ N</span></button>
          </section>

          <section className="mb-5 grid gap-4 lg:grid-cols-[1.22fr_.78fr]">
            <div className="animate-rise-in delay-1 relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-md md:p-7">
              <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[34px] border-secondary/20" /><div className="absolute -right-2 -top-10 h-40 w-40 rounded-full border border-secondary/25" />
              <div className="relative">
                <div className="mb-8 flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-semibold text-primary-foreground/60"><BriefcaseBusiness size={14} /> Active role</div><button data-testid="button-role-menu" onClick={() => setToast('Role actions opened')} className="rounded-lg p-1.5 text-primary-foreground/60 hover:bg-primary-foreground/10" aria-label="Role options"><MoreHorizontal size={18} /></button></div>
                <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><h2 className="font-display text-[30px] tracking-[-0.03em]">Staff Product Designer</h2><p className="mt-2 text-xs text-primary-foreground/58">Product · San Francisco / Remote · Full-time</p></div><div className="flex items-center gap-3"><div className="rounded-lg bg-primary-foreground/10 px-3 py-2"><div className="font-mono-ui text-lg text-secondary">24</div><div className="text-[10px] text-primary-foreground/55">candidates</div></div><div className="rounded-lg bg-primary-foreground/10 px-3 py-2"><div className="font-mono-ui text-lg text-secondary">18d</div><div className="text-[10px] text-primary-foreground/55">open</div></div></div></div>
              </div>
            </div>
            <div className="animate-rise-in delay-2 rounded-2xl border border-card-border bg-card p-6 shadow-xs md:p-7">
              <div className="mb-6 flex items-center justify-between"><div><div className="text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground">Hiring velocity</div><div className="mt-1 text-xs text-muted-foreground">Last 30 days</div></div><div className="flex items-center gap-1.5 rounded-full bg-[#dceee8] px-2.5 py-1 text-[11px] font-semibold text-[#237064]"><ArrowUpRight size={13} /> 12.4%</div></div>
              <div className="flex items-end gap-1.5"><span className="font-display text-[38px] leading-none">4.8</span><span className="mb-1 text-xs text-muted-foreground">days to shortlist</span></div>
              <div className="mt-6 flex h-9 items-end gap-1.5">{[24, 33, 28, 42, 38, 55, 48, 64, 58, 74, 68, 82].map((height, index) => <div key={height + index} className={`flex-1 rounded-sm ${index === 11 ? 'bg-accent' : 'bg-muted-foreground/20'}`} style={{ height: `${height}%` }} />)}</div>
              <div className="mt-2 flex justify-between font-mono-ui text-[9px] text-muted-foreground"><span>APR 01</span><span>APR 30</span></div>
            </div>
          </section>

          <section className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Strong matches" value="08" detail="of 24 candidates" icon={Target} accent="#2d8274" />
            <StatCard label="Shortlisted" value={String(shortlisted.length).padStart(2, '0')} detail="ready for review" icon={ClipboardCheck} accent="#b57d2d" />
            <StatCard label="Score confidence" value="91%" detail="evidence coverage" icon={Sparkles} accent="#7665a5" />
          </section>

          <section className="animate-rise-in delay-3">
            <div className="mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div><h2 className="font-display text-[27px] tracking-[-0.025em]">Candidate review</h2><p className="mt-1 text-xs text-muted-foreground">Ranked by fit to the role brief, with the reasoning in view.</p></div>
              <div className="flex items-center gap-2"><button data-testid="button-filter-toggle" onClick={() => setToast('Filters are ready below search')} className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold hover:bg-muted"><SlidersHorizontal size={14} /> Filter</button><button data-testid="button-share" className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold hover:bg-muted" onClick={() => setToast('Review link copied to clipboard')}><Share2 size={14} /> Share review</button></div>
            </div>
            <div className="grid min-w-0 overflow-hidden rounded-2xl border border-card-border bg-card shadow-xs lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,.92fr)]">
              <div className="min-w-0 border-b border-card-border lg:border-b-0 lg:border-r">
                <div className="border-b border-card-border p-4">
                  <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><input data-testid="input-candidate-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search names, skills, or location" className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none" /></div>
                  <div className="mt-3 flex flex-wrap items-center gap-2"><div className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><Filter size={13} /> Show</div><select data-testid="select-candidate-filter" value={filter} onChange={(event) => setFilter(event.target.value)} className="h-8 rounded-md border border-border bg-background px-2 text-xs font-semibold"><option>All candidates</option><option>Strong matches</option><option>Shortlisted</option><option>Available now</option></select><select data-testid="select-candidate-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="ml-auto h-8 rounded-md border border-border bg-background px-2 text-xs font-semibold"><option>Best fit</option><option>Name</option></select></div>
                </div>
                <div className="max-h-[635px] overflow-y-auto">
                  {active === 'candidates' && <div className="border-b border-secondary/35 bg-secondary/20 px-4 py-3 text-xs font-semibold text-secondary-foreground">Candidate directory · {visibleCandidates.length} results</div>}
                  {visibleCandidates.length === 0 ? <EmptyCandidates query={search} onClear={() => { setSearch(''); setFilter('All candidates'); }} /> : visibleCandidates.map((candidate, index) => <CandidateRow key={candidate.id} candidate={candidate} index={index} selected={candidate.id === selectedId} isShortlisted={shortlisted.includes(candidate.id)} onSelect={() => setSelectedId(candidate.id)} onToggle={() => toggleShortlist(candidate.id)} />)}
                </div>
              </div>
              <CandidateDetail candidate={selected} isShortlisted={shortlisted.includes(selected.id)} onToggle={() => toggleShortlist(selected.id)} onToast={setToast} />
            </div>
          </section>
        </main>
      )}
      {showRoleModal && <RoleModal onClose={() => setShowRoleModal(false)} onCreate={() => { setShowRoleModal(false); setToast('New role draft created'); }} />}
      {toast && <div data-testid="status-toast" className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xl animate-rise-in"><Check size={14} className="text-secondary" />{toast}</div>}
    </AppShell>
  );
}

function CandidateRow({ candidate, index, selected, isShortlisted, onSelect, onToggle }: { candidate: Candidate; index: number; selected: boolean; isShortlisted: boolean; onSelect: () => void; onToggle: () => void }) {
  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(); } };
  return (
    <div data-testid={`candidate-row-${candidate.id}`} role="button" tabIndex={0} onKeyDown={handleKey} onClick={onSelect} className={`group relative flex cursor-pointer gap-3 border-b border-card-border px-4 py-4 text-left transition-colors last:border-0 ${selected ? 'bg-secondary/15' : 'hover:bg-muted/55'}`}>
      {selected && <div className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-accent" />}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ background: `${candidate.color}26`, color: candidate.color }}>{candidate.initials}<span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-[#5c9d85]" /></div>
      <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate text-sm font-semibold">{candidate.name}</h3>{index === 0 && <span className="hidden rounded bg-secondary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-secondary-foreground sm:inline">Top fit</span>}</div><p className="mt-0.5 truncate text-xs text-muted-foreground">{candidate.role} · {candidate.location}</p><div className="mt-2 flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${candidate.score >= 88 ? 'bg-[#5c9d85]' : candidate.score >= 78 ? 'bg-[#d9a450]' : 'bg-[#c77a70]'}`} /><span className="text-[11px] font-medium text-muted-foreground">{candidate.status}</span></div></div>
      <div className="flex shrink-0 flex-col items-end justify-between gap-2"><ScorePill score={candidate.score} compact /><button data-testid={`button-shortlist-${candidate.id}`} onClick={(event) => { event.stopPropagation(); onToggle(); }} className={`rounded-md p-1.5 transition-colors ${isShortlisted ? 'text-[#b57d2d]' : 'text-muted-foreground/45 hover:bg-muted hover:text-foreground'}`} aria-label={isShortlisted ? `Remove ${candidate.name} from shortlist` : `Add ${candidate.name} to shortlist`}>{isShortlisted ? <Star size={15} fill="currentColor" /> : <Star size={15} />}</button></div>
    </div>
  );
}

function CandidateDetail({ candidate, isShortlisted, onToggle, onToast }: { candidate: Candidate; isShortlisted: boolean; onToggle: () => void; onToast: (message: string) => void }) {
  return (
    <aside data-testid="candidate-detail" className="min-w-0 bg-[#f8f6f0]">
      <div className="border-b border-card-border px-5 py-5 md:px-7">
        <div className="mb-6 flex items-center justify-between"><span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.17em] text-muted-foreground"><PanelRight size={13} /> Candidate brief</span><button data-testid="button-detail-more" onClick={() => onToast('Candidate actions opened')} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="More candidate actions"><MoreHorizontal size={17} /></button></div>
        <div className="flex items-start gap-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-base font-bold" style={{ background: `${candidate.color}26`, color: candidate.color }}>{candidate.initials}</div><div className="min-w-0"><h2 data-testid="text-selected-candidate" className="font-display text-[28px] leading-none tracking-[-0.03em]">{candidate.name}</h2><p className="mt-2 text-xs font-medium text-muted-foreground">{candidate.role} · {candidate.location}</p><p className="mt-1 text-[11px] text-accent">{candidate.available}</p></div></div>
        <div className="mt-6 flex items-center gap-3"><div className="relative flex h-[82px] w-[82px] items-center justify-center rounded-full" style={{ background: `conic-gradient(#2d8274 ${candidate.score * 3.6}deg, #dfe5dc 0deg)` }}><div className="flex h-[66px] w-[66px] flex-col items-center justify-center rounded-full bg-[#f8f6f0]"><span className="font-mono-ui text-[21px] font-medium">{candidate.score}</span><span className="text-[9px] text-muted-foreground">FIT SCORE</span></div></div><div><div className="text-sm font-semibold">{candidate.status}</div><p className="mt-1 max-w-[210px] text-xs leading-5 text-muted-foreground">{candidate.match}</p></div></div>
        <div className="mt-6 flex gap-2"><button data-testid="button-detail-shortlist" onClick={onToggle} className={`inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg text-xs font-bold transition-colors ${isShortlisted ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>{isShortlisted ? <Check size={14} /> : <Plus size={14} />}{isShortlisted ? 'Shortlisted' : 'Add to shortlist'}</button><button data-testid="button-contact-candidate" onClick={() => onToast('Message composer opened')} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-bold hover:bg-muted"><Share2 size={14} /> Share</button></div>
      </div>
      <div className="px-5 py-5 md:px-7">
        <div className="mb-5 flex items-center justify-between"><h3 className="text-xs font-bold uppercase tracking-[0.14em]">Why this score</h3><button data-testid="button-score-method" onClick={() => onToast('Score method: weighted evidence from role criteria')} className="text-[11px] font-semibold text-accent hover:underline">View method</button></div>
        <div className="space-y-4">{candidate.evidence.map((item) => <div data-testid={`evidence-${candidate.id}-${item.label.toLowerCase().replaceAll(' ', '-')}`} key={item.label}><div className="mb-1.5 flex items-center justify-between gap-3"><span className="text-xs font-semibold">{item.label}</span><span className={`text-[10px] font-bold uppercase tracking-wider ${item.tone === 'strong' ? 'text-[#2d8274]' : item.tone === 'watch' ? 'text-[#b57d2d]' : 'text-muted-foreground'}`}>{item.tone === 'strong' ? 'Verified' : item.tone === 'watch' ? 'Review' : 'Context'}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[#e2e4dc]"><div className={`h-full rounded-full ${item.tone === 'strong' ? 'bg-[#5c9d85]' : item.tone === 'watch' ? 'bg-[#d9a450]' : 'bg-muted-foreground/45'}`} style={{ width: item.tone === 'strong' ? '91%' : item.tone === 'watch' ? '47%' : '67%' }} /></div><p className="mt-1.5 text-[11px] leading-4 text-muted-foreground">{item.detail}</p></div>)}</div>
        <div className="mt-6 border-t border-border pt-5"><div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold">Core skills</span><span className="text-[10px] text-muted-foreground">{candidate.experience} experience</span></div><div className="flex flex-wrap gap-1.5">{candidate.skills.map((skill) => <span key={skill} className="rounded-md border border-border bg-card px-2 py-1 text-[10px] font-medium text-muted-foreground">{skill}</span>)}</div></div>
      </div>
    </aside>
  );
}

function EmptyCandidates({ query, onClear }: { query: string; onClear: () => void }) {
  return <div data-testid="empty-candidates" className="flex min-h-[280px] flex-col items-center justify-center px-8 text-center"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground"><Search size={20} /></div><h3 className="font-display text-xl">{query ? 'No signal found' : 'No candidates here'}</h3><p className="mt-2 max-w-[240px] text-xs leading-5 text-muted-foreground">{query ? `Nothing matched “${query}”. Try a name, skill, or another filter.` : 'Adjust your filters to bring candidates back into view.'}</p><button data-testid="button-clear-candidates" onClick={onClear} className="mt-4 text-xs font-bold text-accent hover:underline">Clear filters</button></div>;
}

function ShortlistView({ shortlisted, onSelect, onToggle }: { shortlisted: number[]; onSelect: (id: number) => void; onToggle: (id: number) => void }) {
  const selected = candidates.filter((candidate) => shortlisted.includes(candidate.id));
  return <main className="mx-auto max-w-[1200px] p-5 md:p-9"><div className="animate-rise-in mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-3 flex items-center gap-2 text-xs font-semibold text-accent"><ClipboardCheck size={14} />Decision set</div><h1 className="font-display text-[43px] leading-none tracking-[-0.04em]">Your shortlist<span className="text-accent">.</span></h1><p className="mt-4 max-w-[500px] text-sm leading-6 text-muted-foreground">The candidates your team has agreed are worth a closer conversation.</p></div><div className="rounded-xl border border-border bg-card px-4 py-3 text-right"><div className="font-mono-ui text-2xl">{String(selected.length).padStart(2, '0')}</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">of 24 candidates</div></div></div>{selected.length === 0 ? <div data-testid="empty-shortlist" className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-8 text-center"><div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground"><ClipboardCheck size={26} /></div><h2 className="font-display text-2xl">Your shortlist is waiting</h2><p className="mt-2 max-w-[370px] text-sm leading-6 text-muted-foreground">Star the candidates who deserve a closer look. They’ll collect here for a focused review.</p></div> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{selected.map((candidate, index) => <div data-testid={`shortlist-card-${candidate.id}`} key={candidate.id} className="animate-rise-in rounded-2xl border border-card-border bg-card p-5 shadow-xs transition-transform hover:-translate-y-0.5"><div className="mb-6 flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold" style={{ background: `${candidate.color}26`, color: candidate.color }}>{candidate.initials}</div><div className="flex items-center gap-2"><ScorePill score={candidate.score} compact /><button data-testid={`button-remove-shortlist-${candidate.id}`} onClick={() => onToggle(candidate.id)} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={`Remove ${candidate.name}`}><X size={15} /></button></div></div><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">#{String(index + 1).padStart(2, '0')} shortlist</div><h2 className="mt-2 font-display text-2xl tracking-[-0.02em]">{candidate.name}</h2><p className="mt-1 text-xs text-muted-foreground">{candidate.role} · {candidate.location}</p><p className="mt-5 min-h-[40px] text-xs leading-5 text-muted-foreground">{candidate.summary}</p><button data-testid={`button-review-shortlist-${candidate.id}`} onClick={() => onSelect(candidate.id)} className="mt-5 flex w-full items-center justify-between border-t border-border pt-4 text-xs font-bold hover:text-accent">Review evidence <ArrowUpRight size={15} /></button></div>)}</div>}</main>;
}

function SettingsView({ autoScore, setAutoScore, fairness, setFairness, toast }: { autoScore: boolean; setAutoScore: (value: boolean) => void; fairness: boolean; setFairness: (value: boolean) => void; toast: (message: string) => void }) {
  return <main className="mx-auto max-w-[920px] p-5 md:p-9"><div className="animate-rise-in mb-8"><div className="mb-3 flex items-center gap-2 text-xs font-semibold text-accent"><Settings2 size={14} />Workspace preferences</div><h1 className="font-display text-[43px] leading-none tracking-[-0.04em]">Settings<span className="text-accent">.</span></h1><p className="mt-4 text-sm leading-6 text-muted-foreground">Make TalentMatch feel right for the way your team makes decisions.</p></div><div className="space-y-4"><SettingsSection title="Scoring & evidence" detail="Control how candidate signals appear to your team."><SettingToggle testId="toggle-auto-score" label="Automatic fit scoring" description="Recalculate scores when a new resume is added to a role." checked={autoScore} onChange={() => { setAutoScore(!autoScore); toast(autoScore ? 'Automatic scoring paused' : 'Automatic scoring enabled'); }} /><SettingToggle testId="toggle-fairness" label="Fairness guardrails" description="Hide demographic proxies and flag thin evidence before review." checked={fairness} onChange={() => { setFairness(!fairness); toast(fairness ? 'Fairness guardrails paused' : 'Fairness guardrails enabled'); }} /></SettingsSection><SettingsSection title="Notifications" detail="A focused inbox, not another stream of noise."><SettingToggle testId="toggle-digest" label="Weekly hiring digest" description="A Monday summary of pipeline movement and decisions waiting on you." checked={true} onChange={() => toast('Digest preference updated')} /></SettingsSection><SettingsSection title="Workspace" detail="Details visible to members of the hiring team."><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-semibold">Workspace name<input data-testid="input-workspace-name" defaultValue="Northstar Product" className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-normal outline-none focus:border-accent" /></label><label className="text-xs font-semibold">Default role family<select data-testid="select-role-family" defaultValue="Product design" className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-normal outline-none focus:border-accent"><option>Product design</option><option>Engineering</option><option>Marketing</option><option>Operations</option></select></label></div><button data-testid="button-save-settings" onClick={() => toast('Settings saved')} className="mt-5 h-9 rounded-lg bg-primary px-4 text-xs font-bold text-primary-foreground">Save changes</button></SettingsSection></div></main>;
}

function SettingsSection({ title, detail, children }: { title: string; detail: string; children: ReactNode }) {
  return <section className="animate-rise-in rounded-2xl border border-card-border bg-card p-5 shadow-xs md:p-6"><div className="mb-5 border-b border-border pb-5"><h2 className="text-sm font-bold">{title}</h2><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>{children}</section>;
}

function SettingToggle({ testId, label, description, checked, onChange }: { testId: string; label: string; description: string; checked: boolean; onChange: () => void }) {
  return <button data-testid={testId} onClick={onChange} className="flex w-full items-center justify-between gap-5 py-2 text-left"><div><div className="text-sm font-semibold">{label}</div><div className="mt-1 max-w-[560px] text-xs leading-5 text-muted-foreground">{description}</div></div><span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-muted-foreground/30'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-card shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} /></span></button>;
}

function RoleModal({ onClose, onCreate }: { onClose: () => void; onCreate: () => void }) {
  return <div data-testid="role-modal" className="fixed inset-0 z-40 flex items-center justify-center bg-primary/35 p-5 backdrop-blur-sm"><div className="w-full max-w-[500px] animate-rise-in rounded-2xl border border-card-border bg-card p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between"><div><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-accent"><Plus size={14} /> New role</div><h2 className="font-display text-3xl">Start with the brief.</h2></div><button data-testid="button-close-role-modal" onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Close"><X size={18} /></button></div><div className="space-y-4"><label className="block text-xs font-bold">Role title<input data-testid="input-role-title" autoFocus defaultValue="Staff Product Designer" className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm font-normal outline-none focus:border-accent" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-bold">Department<select data-testid="select-role-department" defaultValue="Product" className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm font-normal outline-none focus:border-accent"><option>Product</option><option>Engineering</option><option>Marketing</option></select></label><label className="block text-xs font-bold">Work model<select data-testid="select-work-model" defaultValue="Remote friendly" className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm font-normal outline-none focus:border-accent"><option>Remote friendly</option><option>Hybrid</option><option>On-site</option></select></label></div><label className="block text-xs font-bold">Paste a job description<textarea data-testid="textarea-role-description" className="mt-2 min-h-[100px] w-full resize-none rounded-lg border border-border bg-background p-3 text-sm font-normal outline-none focus:border-accent" defaultValue="We are looking for a systems-minded product designer to help shape the next generation of our product." /></label></div><div className="mt-6 flex justify-end gap-2 border-t border-border pt-5"><button data-testid="button-cancel-role" onClick={onClose} className="h-10 rounded-lg px-4 text-xs font-bold text-muted-foreground hover:bg-muted">Cancel</button><button data-testid="button-create-role" onClick={onCreate} className="h-10 rounded-lg bg-primary px-4 text-xs font-bold text-primary-foreground">Create role draft</button></div></div></div>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Dashboard} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;