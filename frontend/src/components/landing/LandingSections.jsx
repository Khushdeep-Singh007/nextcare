import React, { useEffect, useRef, useState } from 'react';
// Only icons already used elsewhere in this project (known to exist in the installed lucide-react).
import {
  HelpCircle as FileQuestion, Globe as MapPinOff, Calculator as Wallet, ClipboardCheck as ClipboardX,
  FileText, Building2, Calculator, ShieldAlert, HandCoins, ChevronDown, X, CheckCircle2,
  AlertCircle as AlertTriangle, HelpCircle as CircleHelp, ArrowRight as ExternalLink,
  UploadCloud as Upload, FileText as ScanText, Globe as Compass, ClipboardCheck as ListChecks,
  FileText as Quote, Building2 as Database, Calculator as Sigma, Activity as Eye, Lock,
  ShieldCheck as Scale
} from 'lucide-react';
import {
  PROBLEMS, STAGES, DEMO_POLICY, DEMO_HOSPITALS, DEMO_COST, DEMO_RISKS, DEMO_SCHEMES,
  STEPS, PRINCIPLES, FAQS
} from './landingData';

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

/* ---------- shared helpers ---------- */

/** Adds `is-visible` to children with [data-reveal] once they scroll into view. */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const items = root.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

function SectionHead({ eyebrow, title, text, light }) {
  return (
    <div className={`nc-sec-head ${light ? 'is-light' : ''}`} data-reveal>
      <span className="nc-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function SampleTag({ children = 'Sample data' }) {
  return <span className="nc-sample-tag">{children}</span>;
}

function Drawer({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="nc-drawer-backdrop" onClick={onClose}>
      <div className="nc-drawer" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="nc-drawer-head">
          <strong>{title}</strong>
          <button type="button" className="nc-icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="nc-drawer-body">{children}</div>
      </div>
    </div>
  );
}

/* ---------- 2. Problem ---------- */

const PROBLEM_ICONS = { policy: FileQuestion, hospital: MapPinOff, expense: Wallet, claim: ClipboardX };

export function ProblemSection() {
  const ref = useReveal();
  return (
    <section className="nc-section nc-light" id="problem" ref={ref}>
      <div className="nc-wrap">
        <SectionHead
          light
          eyebrow="The problem"
          title="Having insurance doesn't always mean having clarity."
          text="Policy wording is hard to read, hospital-network information is scattered, and the final bill can leave families unsure of their next step."
        />
        <div className="nc-problem-grid">
          {PROBLEMS.map((p, i) => {
            const Icon = PROBLEM_ICONS[p.id];
            return (
              <article className="nc-problem-card" key={p.id} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="nc-problem-icon"><Icon size={22} strokeWidth={1.7} /></div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. Solution stages ---------- */

const STAGE_ICONS = { policy: FileText, hospitals: Building2, costs: Calculator, risks: ShieldAlert, support: HandCoins };

export function SolutionSection() {
  const ref = useReveal();
  const [active, setActive] = useState(0);
  const stage = STAGES[active];
  return (
    <section className="nc-section nc-dark" id="solution" ref={ref}>
      <div className="nc-wrap">
        <SectionHead
          eyebrow="One connected experience"
          title="From understanding your policy to knowing your next step."
          text="NEXTCARE connects policy reading, hospital discovery, cost estimates and care guidance in one flow."
        />
        <div className="nc-stages" data-reveal>
          <ol className="nc-stage-list" role="tablist" aria-label="NEXTCARE stages">
            {STAGES.map((s, i) => {
              const Icon = STAGE_ICONS[s.id];
              const isActive = i === active;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`nc-stage ${isActive ? 'is-active' : ''} ${i < active ? 'is-done' : ''}`}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                  >
                    <span className="nc-stage-dot"><Icon size={16} /></span>
                    <span className="nc-stage-num">0{i + 1}</span>
                    <span className="nc-stage-title">{s.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="nc-stage-preview" key={stage.id}>
            <div className="nc-stage-preview-head">
              <strong>{stage.title}</strong>
              <SampleTag />
            </div>
            <p>{stage.text}</p>
            <dl className="nc-kv">
              {stage.preview.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. Interactive product demo ---------- */

const TABS = [
  { id: 'policy', label: 'Policy', Icon: FileText },
  { id: 'hospitals', label: 'Hospitals', Icon: Building2 },
  { id: 'costs', label: 'Estimated costs', Icon: Calculator },
  { id: 'risks', label: 'Claim risks', Icon: ShieldAlert, preview: true },
  { id: 'schemes', label: 'Govt schemes', Icon: HandCoins, preview: true }
];

const STATUS_ICON = { verified: CheckCircle2, listed: CircleHelp, confirm: AlertTriangle };

function PolicyTab({ onClause }) {
  return (
    <div className="nc-demo-pane">
      <div className="nc-demo-title">
        <div>
          <span className="nc-demo-sub">{DEMO_POLICY.insurer}</span>
          <h4>{DEMO_POLICY.product}</h4>
        </div>
        <button type="button" className="nc-btn-ghost" onClick={onClause}>
          <Quote size={14} /> View policy clause
        </button>
      </div>
      <div className="nc-policy-rows">
        {DEMO_POLICY.rows.map((r) => (
          <div className="nc-policy-row" key={r.label}>
            <span>{r.label}</span>
            <strong>{r.value}</strong>
            <em>{r.clause}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

function HospitalsTab() {
  return (
    <div className="nc-demo-pane">
      <div className="nc-hosp-list">
        {DEMO_HOSPITALS.map((h, i) => {
          const Icon = STATUS_ICON[h.status];
          return (
            <article className="nc-hosp" key={h.name}>
              <div className="nc-hosp-rank">#{i + 1}</div>
              <div className="nc-hosp-body">
                <h4>{h.name}</h4>
                <span className="nc-demo-sub">{h.area} · {h.specialty}</span>
                <p>{h.why}</p>
              </div>
              <span className={`nc-status nc-status-${h.status}`}>
                <Icon size={13} /> {h.statusLabel}
              </span>
            </article>
          );
        })}
      </div>
      <p className="nc-fineprint">Network status reflects the insurer list in our hospital dataset, not live insurer verification.</p>
    </div>
  );
}

function CostsTab({ onExplain }) {
  const c = DEMO_COST;
  return (
    <div className="nc-demo-pane">
      <div className="nc-cost-grid">
        <div className="nc-cost-lines">
          {c.lines.map(([k, v]) => (
            <div key={k}><span>{k}</span><strong>{inr(v)}</strong></div>
          ))}
          <div className="nc-cost-total"><span>Estimated bill</span><strong>{inr(c.total)}</strong></div>
        </div>
        <div className="nc-cost-split">
          <div className="nc-split-bar" aria-hidden="true">
            <span style={{ width: `${(c.insurer / c.total) * 100}%` }} />
          </div>
          <div className="nc-split-legend">
            <div><i className="dot-ins" /> Insurer may pay <strong>{inr(c.insurer)}</strong></div>
            <div><i className="dot-you" /> You may pay <strong>{inr(c.patient)}</strong></div>
          </div>
          <ul className="nc-cost-notes">
            <li>Sub-limit cut: {inr(c.limitCut)}</li>
            <li>Co-pay (10%): {inr(c.copay)}</li>
            <li className="is-amber">Unresolved: {c.unresolved}</li>
          </ul>
          <button type="button" className="nc-btn-ghost" onClick={onExplain}>
            <Sigma size={14} /> View calculation
          </button>
        </div>
      </div>
    </div>
  );
}

function RisksTab({ onEvidence }) {
  return (
    <div className="nc-demo-pane">
      <div className="nc-risk-list">
        {DEMO_RISKS.map((r) => (
          <div className={`nc-risk nc-risk-${r.tone}`} key={r.id}>
            {r.tone === 'green' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <div>
              <strong>{r.title}</strong>
              <p>{r.text}</p>
            </div>
            <button type="button" className="nc-link-btn" onClick={() => onEvidence(r)}>View evidence</button>
          </div>
        ))}
      </div>
      <p className="nc-fineprint">These checks point out what to watch. The insurer makes the final claim decision.</p>
    </div>
  );
}

function SchemesTab() {
  return (
    <div className="nc-demo-pane">
      <div className="nc-scheme-list">
        {DEMO_SCHEMES.map((s) => (
          <article className="nc-scheme" key={s.name}>
            <div className="nc-scheme-head">
              <h4>{s.name}</h4>
              <span className="nc-status nc-status-listed">{s.status}</span>
            </div>
            <p>{s.what}</p>
            <dl className="nc-kv nc-kv-sm">
              <div><dt>Why it may apply</dt><dd>{s.why}</dd></div>
              <div><dt>Eligibility</dt><dd>{s.needs}</dd></div>
              <div><dt>Missing info</dt><dd>{s.missing}</dd></div>
            </dl>
            {s.link && (
              <a className="nc-link-btn" href={s.link} target="_blank" rel="noopener noreferrer">
                Official source <ExternalLink size={12} />
              </a>
            )}
          </article>
        ))}
      </div>
      <p className="nc-fineprint">A possible match is not approval and does not decide compatibility with private insurance.</p>
    </div>
  );
}

export function DemoSection({ initialTab = 'policy', tabRequest }) {
  const ref = useReveal();
  const [tab, setTab] = useState(initialTab);
  const [drawer, setDrawer] = useState(null);

  useEffect(() => {
    if (tabRequest?.tab) setTab(tabRequest.tab);
  }, [tabRequest]);

  const current = TABS.find((t) => t.id === tab);

  return (
    <section className="nc-section nc-light" id="demo" ref={ref}>
      <div className="nc-wrap">
        <SectionHead
          light
          eyebrow="See NEXTCARE in action"
          title="One policy. Clearer decisions."
          text="Click through a sample case to see how a policy turns into options and next steps."
        />
        <div className="nc-app" data-reveal>
          <div className="nc-app-bar">
            <span className="nc-app-dots"><i /><i /><i /></span>
            <span className="nc-app-url">nextcare · sample case: knee replacement, Bengaluru</span>
            <SampleTag />
          </div>
          <div className="nc-app-body">
            <nav className="nc-app-side" role="tablist" aria-label="Demo sections">
              {TABS.map(({ id, label, Icon, preview }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  className={`nc-app-tab ${tab === id ? 'is-active' : ''}`}
                  onClick={() => setTab(id)}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                  {preview && <em>Preview</em>}
                </button>
              ))}
            </nav>
            <div className="nc-app-main" key={tab}>
              {current?.preview && (
                <div className="nc-preview-banner">Preview · this feature is in development. Content below is illustrative.</div>
              )}
              {tab === 'policy' && <PolicyTab onClause={() => setDrawer({ type: 'clause' })} />}
              {tab === 'hospitals' && <HospitalsTab />}
              {tab === 'costs' && <CostsTab onExplain={() => setDrawer({ type: 'calc' })} />}
              {tab === 'risks' && <RisksTab onEvidence={(r) => setDrawer({ type: 'risk', risk: r })} />}
              {tab === 'schemes' && <SchemesTab />}
            </div>
          </div>
        </div>
      </div>

      <Drawer open={drawer?.type === 'clause'} title="Policy clause (sample)" onClose={() => setDrawer(null)}>
        <p className="nc-quote">{DEMO_POLICY.clauseText}</p>
        <p className="nc-fineprint">{DEMO_POLICY.clauseRef}</p>
      </Drawer>
      <Drawer open={drawer?.type === 'calc'} title="How this estimate is calculated (sample)" onClose={() => setDrawer(null)}>
        <ol className="nc-calc-list">
          {DEMO_COST.explain.map((line) => <li key={line}>{line}</li>)}
        </ol>
        <p className="nc-fineprint">Benchmark estimate, not a hospital quote.</p>
      </Drawer>
      <Drawer open={drawer?.type === 'risk'} title={drawer?.risk?.title || 'Evidence'} onClose={() => setDrawer(null)}>
        {drawer?.risk && (
          <dl className="nc-kv nc-kv-stack">
            <div><dt>What we found</dt><dd>{drawer.risk.text}</dd></div>
            <div><dt>Evidence</dt><dd>{drawer.risk.evidence}</dd></div>
            <div><dt>Missing information</dt><dd>{drawer.risk.missing}</dd></div>
            <div><dt>Suggested next step</dt><dd>{drawer.risk.next}</dd></div>
          </dl>
        )}
      </Drawer>
    </section>
  );
}

/* ---------- 5. Evidence layer ---------- */

export function EvidenceSection() {
  const ref = useReveal();
  const [withEvidence, setWithEvidence] = useState(true);
  return (
    <section className="nc-section nc-dark" id="evidence" ref={ref}>
      <div className="nc-wrap">
        <SectionHead
          eyebrow="Built around evidence"
          title="Not just an answer. Know what supports it."
          text="NEXTCARE shows where information comes from, what has been checked, and what still needs confirmation."
        />

        <div className="nc-compare" data-reveal>
          <div className="nc-switch" role="group" aria-label="Answer type">
            <button type="button" className={!withEvidence ? 'is-active' : ''} onClick={() => setWithEvidence(false)}>Generic answer</button>
            <button type="button" className={withEvidence ? 'is-active' : ''} onClick={() => setWithEvidence(true)}>Evidence-backed</button>
          </div>
          {withEvidence ? (
            <p className="nc-compare-text">
              “At <b>Sample Multispeciality Hospital</b> you may pay about <b>₹1,42,400</b>: the
              knee-replacement sub-limit (<i>Section 5, p.2</i>) caps ₹1,20,000 and 10% co-pay applies
              (<i>Section 3</i>). Network: insurer <b>listed in dataset</b>. Implant cost is <b>unconfirmed</b>.”
            </p>
          ) : (
            <p className="nc-compare-text is-generic">
              “This hospital should be covered by your insurance and you will probably pay a small amount.”
            </p>
          )}
        </div>

        <div className="nc-evidence-grid">
          <article className="nc-evidence" data-reveal>
            <div className="nc-evidence-icon"><Quote size={18} /></div>
            <h3>Policy evidence</h3>
            <dl className="nc-kv nc-kv-sm">
              <div><dt>Term</dt><dd>Room rent ₹5,000/day</dd></div>
              <div><dt>Source</dt><dd>Section 1, page 1</dd></div>
              <div><dt>Review</dt><dd className="ok">Confirmed by user</dd></div>
            </dl>
          </article>
          <article className="nc-evidence" data-reveal style={{ transitionDelay: '80ms' }}>
            <div className="nc-evidence-icon"><Database size={18} /></div>
            <h3>Hospital evidence</h3>
            <dl className="nc-kv nc-kv-sm">
              <div><dt>Hospital</dt><dd>Sample Multispeciality, Jayanagar</dd></div>
              <div><dt>Source</dt><dd>Hospital dataset insurer list</dd></div>
              <div><dt>Status</dt><dd className="warn">Listed, not live-verified</dd></div>
            </dl>
          </article>
          <article className="nc-evidence" data-reveal style={{ transitionDelay: '160ms' }}>
            <div className="nc-evidence-icon"><Sigma size={18} /></div>
            <h3>Financial evidence</h3>
            <dl className="nc-kv nc-kv-sm">
              <div><dt>Inputs</dt><dd>Benchmark cost, 4-day stay</dd></div>
              <div><dt>Rules</dt><dd>Sub-limit, co-pay 10%</dd></div>
              <div><dt>Unknowns</dt><dd className="warn">Implant cost</dd></div>
            </dl>
          </article>
        </div>
        <p className="nc-fineprint nc-center">Sample data. Every value in the app is tagged as policy-derived, dataset, modelled estimate or assumption.</p>
      </div>
    </section>
  );
}

/* ---------- 6. How it works ---------- */

const STEP_ICONS = [Upload, ScanText, Compass, ListChecks];

export function HowSection() {
  const ref = useReveal();
  const [step, setStep] = useState(0);
  const Icon = STEP_ICONS[step];
  return (
    <section className="nc-section nc-light" id="how" ref={ref}>
      <div className="nc-wrap">
        <SectionHead light eyebrow="A clearer path forward" title="A complicated process, made easier to navigate." />
        <div className="nc-steps" data-reveal>
          <div className="nc-step-track">
            <div className="nc-step-progress" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
            {STEPS.map((s, i) => (
              <button
                type="button"
                key={s.n}
                className={`nc-step ${i <= step ? 'is-on' : ''} ${i === step ? 'is-active' : ''}`}
                onClick={() => setStep(i)}
                aria-current={i === step ? 'step' : undefined}
              >
                <span className="nc-step-n">{s.n}</span>
                <span className="nc-step-t">{s.title}</span>
              </button>
            ))}
          </div>
          <div className="nc-step-card" key={step}>
            <div className="nc-step-visual"><Icon size={34} strokeWidth={1.5} /></div>
            <div>
              <h3>Step {STEPS[step].n} · {STEPS[step].title}</h3>
              <p>{STEPS[step].text}</p>
              <div className="nc-step-nav">
                <button type="button" className="nc-btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
                <button type="button" className="nc-btn-ghost" disabled={step === STEPS.length - 1} onClick={() => setStep(step + 1)}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. Financial support ---------- */

export function SupportSection({ onExplore }) {
  const ref = useReveal();
  const [age, setAge] = useState('');
  const [state, setState] = useState('');
  const [treat, setTreat] = useState('');
  const ready = age && state && treat;
  return (
    <section className="nc-section nc-dark" id="support" ref={ref}>
      <div className="nc-wrap nc-two">
        <div data-reveal>
          <span className="nc-eyebrow">More options. Better information.</span>
          <h2 className="nc-h2">Your insurance may not be the only support worth exploring.</h2>
          <p className="nc-muted">
            NEXTCARE already understands PM-JAY and ESI cover. A broader government-scheme finder is in development.
            Real eligibility always depends on the scheme’s own criteria.
          </p>
          <ul className="nc-chip-list">
            <li>Government health cover</li>
            <li>Medical financial assistance</li>
            <li>State-level schemes</li>
            <li>Senior-citizen benefits</li>
          </ul>
          <button type="button" className="nc-btn-primary" onClick={onExplore}>Explore financial support</button>
        </div>

        <div className="nc-glass-card" data-reveal>
          <div className="nc-stage-preview-head">
            <strong>Example eligibility flow</strong>
            <SampleTag>Illustrative</SampleTag>
          </div>
          <label className="nc-select">
            <span>1 · Age group</span>
            <select value={age} onChange={(e) => setAge(e.target.value)}>
              <option value="">Select</option>
              <option>Under 40</option>
              <option>40 – 69</option>
              <option>70 and above</option>
            </select>
          </label>
          <label className="nc-select">
            <span>2 · State</span>
            <select value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">Select</option>
              <option>Karnataka</option>
              <option>Maharashtra</option>
              <option>Punjab</option>
              <option>Other</option>
            </select>
          </label>
          <label className="nc-select">
            <span>3 · Treatment category</span>
            <select value={treat} onChange={(e) => setTreat(e.target.value)}>
              <option value="">Select</option>
              <option>Orthopedics</option>
              <option>Cardiology</option>
              <option>Oncology</option>
              <option>Other</option>
            </select>
          </label>
          <div className={`nc-flow-result ${ready ? 'is-ready' : ''}`} aria-live="polite">
            {ready ? (
              <>
                <strong>Possible matches to check</strong>
                <ul>
                  <li>Ayushman Bharat PM-JAY: check the official beneficiary list.</li>
                  <li>{state === 'Other' ? 'Your state' : state} state health scheme: criteria vary.</li>
                </ul>
                <p className="nc-fineprint">Missing: household income, family ID. This is an example, not an eligibility check.</p>
              </>
            ) : (
              <span className="nc-muted">Choose all three to see example matches.</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 8. Claim risk ---------- */

export function RiskSection({ onSeeExample }) {
  const ref = useReveal();
  const items = DEMO_RISKS.slice(0, 3);
  const [sel, setSel] = useState(items[0].id);
  const r = items.find((x) => x.id === sel);
  return (
    <section className="nc-section nc-light" id="claims" ref={ref}>
      <div className="nc-wrap">
        <SectionHead
          light
          eyebrow="Prepare with more clarity"
          title="Know what to check before submitting a claim."
          text="NEXTCARE points out policy conflicts, missing information and possible deductions, so you know what needs attention. The insurer makes the final decision."
        />
        <div className="nc-risk-layout" data-reveal>
          <div className="nc-risk-pick" role="tablist" aria-label="Example findings">
            {items.map((x) => (
              <button
                type="button"
                role="tab"
                key={x.id}
                aria-selected={sel === x.id}
                className={sel === x.id ? 'is-active' : ''}
                onClick={() => setSel(x.id)}
              >
                <AlertTriangle size={16} /> {x.title}
              </button>
            ))}
          </div>
          <div className="nc-risk-detail" key={sel}>
            <div className="nc-stage-preview-head">
              <strong>{r.title}</strong>
              <SampleTag>Preview · sample</SampleTag>
            </div>
            <dl className="nc-kv nc-kv-stack">
              <div><dt>Plain explanation</dt><dd>{r.text}</dd></div>
              <div><dt>Policy evidence</dt><dd>{r.evidence}</dd></div>
              <div><dt>Missing information</dt><dd>{r.missing}</dd></div>
              <div><dt>Suggested next step</dt><dd>{r.next}</dd></div>
            </dl>
          </div>
          <aside className="nc-reject-card">
            <h3>Already received a rejection letter?</h3>
            <p>Compare the stated reason with your uploaded policy and see which questions or documents may need review.</p>
            <span className="nc-status nc-status-listed">In development</span>
            <button type="button" className="nc-btn-ghost" onClick={onSeeExample}>See an example report</button>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ---------- 9. Principles ---------- */

const PRINCIPLE_ICONS = [Quote, Eye, Lock, Scale];

export function PrinciplesSection() {
  const ref = useReveal();
  return (
    <section className="nc-section nc-paper" ref={ref}>
      <div className="nc-wrap">
        <SectionHead light eyebrow="Responsible by design" title="Clear information. Transparent limitations." />
        <div className="nc-principles">
          {PRINCIPLES.map((p, i) => {
            const Icon = PRINCIPLE_ICONS[i];
            return (
              <div className="nc-principle" key={p.title} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <Icon size={18} />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- 10. FAQ ---------- */

export function FaqSection() {
  const ref = useReveal();
  const [open, setOpen] = useState(0);
  return (
    <section className="nc-section nc-light" id="faq" ref={ref}>
      <div className="nc-wrap nc-narrow">
        <SectionHead light eyebrow="FAQ" title="Questions people ask" />
        <div className="nc-faq" data-reveal>
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            const id = `nc-faq-${i}`;
            return (
              <div className={`nc-faq-item ${isOpen ? 'is-open' : ''}`} key={f.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span>{f.q}</span>
                    <ChevronDown size={18} />
                  </button>
                </h3>
                <div id={id} role="region" className="nc-faq-a" hidden={!isOpen}>
                  <p>{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
