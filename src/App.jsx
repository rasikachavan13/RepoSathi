import { useEffect, useState } from 'react';
import {
  ArrowDown, ArrowRight, Check, ChevronDown, CircleHelp, Clipboard,
  Code2, FileText, Github, Leaf, LoaderCircle, ShieldCheck, Sparkles,
  Terminal, WandSparkles, X
} from 'lucide-react';
import { analyzeInput, checkHealth } from './services/api';
import './App.css';

const sampleText = `# TinyTasks

TinyTasks is a small task-management app built with JavaScript.

## Getting started
Run npm install, then npm run dev.

## Current features
- Create and complete tasks
- Filter tasks by status
- Save tasks in local storage

## Contributing
Bug fixes, documentation improvements, and tests are welcome.
Please add tests for new behaviour.`;

const sections = [
  { key: 'summary', title: 'Project at a glance', icon: FileText },
  { key: 'contributionIdea', title: 'A good first contribution', icon: Leaf },
  { key: 'whereToLook', title: 'Where to look first', icon: Code2 },
  { key: 'steps', title: 'Your action plan', icon: Check },
  { key: 'testing', title: 'Testing checklist', icon: ShieldCheck },
  { key: 'prDraft', title: 'Pull request starter', icon: Github },
  { key: 'cautions', title: 'Things to keep in mind', icon: CircleHelp }
];

function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }
  return <button className="copy-btn" onClick={copy} type="button"><Clipboard size={14} />{copied ? 'Copied!' : label}</button>;
}

function ContentList({ value }) {
  if (Array.isArray(value)) {
    return <ul>{value.map((item, index) => <li key={`${index}-${String(item)}`}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>)}</ul>;
  }
  if (value && typeof value === 'object') {
    return <div className="object-list">{Object.entries(value).map(([key, val]) => (
      <div className="object-row" key={key}><strong>{key.replace(/([A-Z])/g, ' $1')}</strong><span>{Array.isArray(val) ? val.join(', ') : String(val)}</span></div>
    ))}</div>;
  }
  return <p>{String(value || 'No details returned for this section.')}</p>;
}

function Results({ data }) {
  return (
    <div className="results-stack">
      {sections.map(({ key, title, icon: Icon }, index) => {
        const value = data?.[key];
        if (value == null || value === '') return null;
        const text = Array.isArray(value) ? value.map((x) => `• ${typeof x === 'string' ? x : JSON.stringify(x)}`).join('\n') : typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
        return (
          <section className="result-card" key={key}>
            <div className="result-heading"><span className="result-icon"><Icon size={17} /></span><h3>{title}</h3><span className="section-number">{String(index + 1).padStart(2, '0')}</span></div>
            <div className="result-content"><ContentList value={value} /></div>
            <div className="result-actions"><CopyButton text={text} /></div>
          </section>
        );
      })}
    </div>
  );
}

export default function App() {
  const [inputType, setInputType] = useState('readme');
  const [text, setText] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    checkHealth().then(() => setBackendOnline(true)).catch(() => setBackendOnline(false));
  }, []);

  async function runAnalysis(event) {
    event.preventDefault();
    setError('');
    setAnalysis(null);
    setLoading(true);
    try {
      const result = await analyzeInput({ inputType, text: text.trim(), experienceLevel });
      setAnalysis(result);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const sample = () => { setInputType('readme'); setText(sampleText); setError(''); };
  const clear = () => { setText(''); setAnalysis(null); setError(''); };

  return (
    <div className="app-shell">
      <nav className="nav">
        <a href="#" className="brand" aria-label="RepoSathi AI home"><span className="brand-mark"><Leaf size={20} /></span><span>repo<span className="brand-light">sathi</span><sup>AI</sup></span></a>
        <div className="nav-right"><span className={`status-dot ${backendOnline ? 'online' : ''}`} /><span className="status-label">{backendOnline ? 'Local backend connected' : 'Backend not connected'}</span><a href="#how-it-works" className="nav-link">How it works <ArrowDown size={14} /></a><a className="github-link" href="https://github.com/new" target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a></div>
      </nav>

      <main>
        <section className="hero">
          <div className="eyebrow"><span className="eyebrow-spark"><Sparkles size={13} /></span> YOUR OPEN-SOURCE SIDEKICK <span className="eyebrow-line" /></div>
          <h1>Open source,<br /><em>made approachable.</em></h1>
          <p className="hero-copy">That first contribution can feel intimidating. RepoSathi helps you understand a project, find a place to start, and take your next step with confidence.</p>
          <div className="hero-points"><span><Check size={15} /> Beginner-friendly guidance</span><span><Check size={15} /> Powered by local Gemma via Ollama</span><span><Check size={15} /> You stay in control</span></div>
          <div className="hero-decoration"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-core"><Leaf size={30} /></div><span className="orbit-label label-one">learn</span><span className="orbit-label label-two">contribute</span><span className="orbit-label label-three">grow</span></div>
        </section>

        <section className="workspace" id="workspace">
          <div className="workspace-top"><div><div className="kicker">LET'S GET YOU STARTED</div><h2>Your contribution map</h2><p>Paste a README, issue, or code snippet. We'll break it down into practical next steps.</p></div><div className="step-pill"><span>01</span> Explore <ArrowRight size={13} /><span>02</span> Understand</div></div>
          <div className="work-grid">
            <form className="input-panel" onSubmit={runAnalysis}>
              <div className="panel-head"><div><span className="panel-index">01 / INPUT</span><h3>What are you exploring?</h3></div><span className="required-tag">REQUIRED</span></div>
              <div className="type-tabs" role="tablist" aria-label="Input type">
                <button type="button" className={inputType === 'readme' ? 'active' : ''} onClick={() => setInputType('readme')}><FileText size={15} /> README</button>
                <button type="button" className={inputType === 'issue' ? 'active' : ''} onClick={() => setInputType('issue')}><CircleHelp size={15} /> Issue</button>
                <button type="button" className={inputType === 'code' ? 'active' : ''} onClick={() => setInputType('code')}><Code2 size={15} /> Code</button>
              </div>
              <label className="field-label" htmlFor="project-input">{inputType === 'readme' ? 'PROJECT README / DESCRIPTION' : inputType === 'issue' ? 'ISSUE DESCRIPTION' : 'CODE SNIPPET'} <span>Paste text below</span></label>
              <div className="textarea-wrap"><textarea id="project-input" value={text} onChange={(e) => setText(e.target.value)} maxLength={20000} placeholder={inputType === 'readme' ? 'Paste the README or project overview here…' : inputType === 'issue' ? 'Paste the issue title, description, expected behaviour, and error…' : 'Paste the relevant code snippet here…'} required rows={10} /><div className="textarea-bottom"><span><Terminal size={13} /> Plain text works best</span><span>{text.length.toLocaleString()} / 20,000</span></div></div>
              <button className="sample-link" type="button" onClick={sample}><WandSparkles size={14} /> Try a sample project <ArrowRight size={13} /></button>
              <div className="field-divider" />
              <label className="field-label" htmlFor="level-select">YOUR EXPERIENCE LEVEL</label>
              <div className="select-wrap"><select id="level-select" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}><option value="beginner">🌱 &nbsp; Beginner — my first contributions</option><option value="intermediate">🌿 &nbsp; Intermediate — I've contributed before</option><option value="advanced">🌳 &nbsp; Advanced — help me move efficiently</option></select><ChevronDown size={16} /></div>
              <div className="privacy-note"><ShieldCheck size={16} /><p><strong>Your code stays yours.</strong> This app sends text to your locally running Ollama model. Don't paste secrets, API keys, or private data.</p></div>
              {error && <div className="error-box"><X size={16} /><span>{error}</span></div>}
              <div className="form-actions"><button className="primary-btn" type="submit" disabled={loading || !text.trim()}>{loading ? <><LoaderCircle className="spin" size={17} /> Analysing…</> : <><Sparkles size={16} /> Build my contribution map <ArrowRight size={16} /></>}</button><button className="clear-btn" type="button" onClick={clear} disabled={loading}>Clear</button></div>
              <p className="tiny-note">AI can make mistakes. Verify suggestions against the actual repository.</p>
            </form>

            <div className="output-panel">
              <div className="panel-head output-head"><div><span className="panel-index">02 / YOUR MAP</span><h3>From curious to contributor</h3></div><span className="ai-chip"><span /> GEMMA AI</span></div>
              {!analysis && !loading && <div className="empty-state"><div className="empty-illustration"><div className="empty-circle circle-a" /><div className="empty-circle circle-b" /><div className="empty-paper"><FileText size={25} /><span /><span /><span className="short-line" /></div><div className="empty-leaf"><Leaf size={25} /></div></div><h3>Your roadmap starts here.</h3><p>Submit a README, issue, or code snippet and your personalised contribution guide will show up here.</p><div className="empty-steps"><div><span>1</span> Understand the project</div><div><span>2</span> Pick a manageable task</div><div><span>3</span> Make a confident start</div></div></div>}
              {loading && <div className="loading-state"><div className="loader-orbit"><Leaf size={27} /></div><h3>Finding your first step…</h3><p>Gemma is reading your input and preparing a practical guide.</p><div className="loading-bar"><span /></div><small>This can take a little while on the first run.</small></div>}
              {analysis && <><div className="success-banner"><Check size={16} /><span>Your contribution map is ready</span><CopyButton text={JSON.stringify(analysis, null, 2)} label="Copy all" /></div><Results data={analysis} /><div className="results-footer"><Leaf size={15} /><span>Small, thoughtful contributions make open source stronger.</span></div></>}
            </div>
          </div>
        </section>

        <section className="how-section" id="how-it-works"><div className="section-heading"><span className="kicker">NO GATEKEEPING HERE</span><h2>Three steps. One less barrier.</h2><p>Good contributions start with understanding, not guessing.</p></div><div className="how-grid"><article className="how-card"><span className="how-number">01</span><div className="how-icon"><FileText size={21} /></div><h3>Bring the context</h3><p>Paste public project documentation, an issue, or a small code excerpt. No GitHub token needed.</p><span className="card-arrow"><ArrowRight size={16} /></span></article><article className="how-card"><span className="how-number">02</span><div className="how-icon"><Sparkles size={21} /></div><h3>Make sense of it</h3><p>Gemma turns the input into plain-language explanations, a scoped task, and a testing plan.</p><span className="card-arrow"><ArrowRight size={16} /></span></article><article className="how-card"><span className="how-number">03</span><div className="how-icon"><Leaf size={21} /></div><h3>Take the first step</h3><p>Use the roadmap as a guide, verify it against the repository, then make the contribution your own.</p><span className="card-arrow"><ArrowRight size={16} /></span></article></div></section>

        <section className="bottom-cta"><div className="cta-leaf"><Leaf size={24} /></div><div><h2>Every expert was once a beginner.</h2><p>You don't need to know everything to start helping.</p></div><a href="#workspace" className="cta-link">Find your first step <ArrowRight size={16} /></a></section>
      </main>
      <footer className="footer"><a href="#" className="brand footer-brand"><span className="brand-mark"><Leaf size={17} /></span><span>repo<span className="brand-light">sathi</span><sup>AI</sup></span></a><span>Built for the open-source curious. <span className="footer-dot">✳</span> Powered by local AI.</span><span className="footer-right">LESS SCREEN. MORE BUILDING.</span></footer>
    </div>
  );
}
