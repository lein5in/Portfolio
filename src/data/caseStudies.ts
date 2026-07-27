export interface CaseStudySection {
  heading: string;
  paragraphs: string[];
  diagram?: string;
}

export interface CaseStudyData {
  slug: string;
  title: string;
  subtitle: string;
  status: string;
  stack: string[];
  repoLabel: string;
  repoHref?: string;
  sections: CaseStudySection[];
}

export const CASE_STUDIES: Record<string, CaseStudyData> = {
  mara: {
    slug: 'mara',
    title: 'MARA',
    subtitle: 'Modular Adaptive Response Assistant',
    status: 'Active — running daily since early 2026',
    stack: ['Python', 'Claude Sonnet 4.6', 'Claude Haiku', 'Whisper (CUDA)', 'PyQt5', 'Selenium', 'Fernet'],
    repoLabel: 'github.com/lein5in/MARA',
    repoHref: 'https://github.com/lein5in/MARA',
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          "Most \"AI assistant\" side projects are chat wrappers with a microphone bolted on. The gap between that and something you'd actually rely on daily is latency, reliability, and depth of system access — none of which show up in a demo video.",
          'MARA was built to close that gap: a voice assistant that runs locally on a Windows machine, responds in under a second, and can actually act on the system it lives on — launch applications, control the browser, read the screen, manage its own memory of who you are and what you have told it.',
        ],
      },
      {
        heading: 'The latency problem, and how it was solved',
        paragraphs: [
          'The core engineering constraint was perceived response time. A naive pipeline — transcribe, classify intent, generate response, synthesize speech — stacks four sequential calls before the user hears anything.',
          "MARA's pipeline runs two Claude models in parallel instead of in sequence: Haiku classifies intent (~150ms) while Sonnet 4.6 has already started streaming a full response. By the time intent classification resolves, generation is already underway. Perceived latency drops to the length of the slower of the two calls rather than their sum.",
          'Speech-to-text runs entirely locally on CUDA via Whisper turbo, which removes network latency from the slowest part of a naive pipeline and keeps raw audio off any external server.',
        ],
        diagram:
          'Push-to-talk -> Whisper (local, CUDA) -> Haiku (intent)   -\n' +
          '                                                            |- parallel\n' +
          '                                     -> Sonnet 4.6 (response) -\n' +
          '                                                            v\n' +
          '                                     Fish Audio streaming TTS',
      },
      {
        heading: 'System depth',
        paragraphs: [
          'Voice input triggers more than conversation. MARA can control volume, brightness, and WiFi; launch and kill applications through a dynamically built registry; take and reason about screenshots via Claude Vision; and drive a dedicated, isolated Chrome profile through Selenium — reading pages, clicking, filling forms, with encrypted credential storage for anything that requires a login.',
          'Combining screen understanding with browser control was the more interesting design problem: vision mode captures the current screen state, and MARA turns that into a sequence of concrete browser actions without any prior instruction on what is on screen. Getting this reliable meant treating the vision-to-action translation as its own small planning step, rather than a single prompt asking the model to "do the thing."',
        ],
      },
      {
        heading: 'Memory and reliability',
        paragraphs: [
          'MARA keeps encrypted, persistent memory across sessions (Fernet), summarized automatically as conversation history grows rather than kept as an ever-expanding transcript. The UI runs on a thread-safe PyQt5 architecture — audio capture, model inference, and rendering happen on separate threads communicating through Qt signals, which was the only practical way to keep an always-on-top floating window responsive while a GPU model transcribes in the background.',
          'The system boots silently on Windows startup via Task Scheduler and has been running continuously since it was built — not a proof of concept, but the assistant actually used day to day. Total running cost sits around $3.50–6.50/month in API usage; Whisper, the UI, and system control all run at zero marginal cost locally.',
        ],
      },
      {
        heading: 'What this project demonstrates',
        paragraphs: [
          'Real-time systems work under a hard latency budget, not just "make an API call and wait." Concurrent architecture across threads, processes, and parallel model calls. Local-first design for privacy and cost, with cloud inference used only where it adds real capability. Integration depth — audio, vision, browser automation, and OS-level control working as one coherent system rather than four separate demos glued together.',
        ],
      },
    ],
  },

  seren: {
    slug: 'seren',
    title: 'Seren',
    subtitle: 'AI Study Companion — Web Platform + Chrome Extension',
    status: 'In active development — building the persistent memory layer',
    stack: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Claude API', 'Chrome MV3'],
    repoLabel: 'github.com/lein5in/Seren',
    repoHref: 'https://github.com/lein5in/Seren',
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          'The "AI extension that summarizes and quizzes you on selected text" category is no longer a differentiator — it\'s the baseline. Sider, Merlin, Monica, and half a dozen others already ship it well. What is largely missing across that category is continuity: none of them build a memory of a student\'s semester that compounds over time.',
          'Seren is built around that gap. Not an anxiety-management app, not a generic productivity PWA — a companion that lives in the browser, knows the courses and deadlines it has been told about, and is meant to get more useful the longer it is used, not just answer the question in front of it.',
        ],
      },
      {
        heading: 'Architecture',
        paragraphs: [
          'Seren runs across three coordinated layers. A Chrome MV3 extension surfaces a floating toolbar on any text selection for instant summarize/solve/quiz actions. A React + TypeScript web app provides the full dashboard experience — chat, schedule, settings. A FastAPI backend handles auth, AI routing, and data, backed by PostgreSQL with Alembic-managed migrations.',
          'Both the extension and the web app authenticate against the same backend and share a JWT session — logging in on the site is immediately reflected in the extension popup, with no separate account state to keep in sync.',
          'AI responses stream token-by-token over SSE rather than waiting for a full completion — a detail that matters for a chat interface used mid-study-session, where perceived responsiveness affects whether people keep using it.',
        ],
        diagram:
          'Extension (MV3)  -\n' +
          '                   |-> FastAPI backend -> PostgreSQL\n' +
          'Web app (React)  -         |\n' +
          '                           -> Claude API (SSE streaming)',
      },
      {
        heading: 'Engineering choices worth calling out',
        paragraphs: [
          'Authentication runs through a single centralized dependency (get_current_user_id) rather than being re-implemented per route, with ownership checks (require_self) applied consistently across every user-scoped endpoint. Passwords are hashed with bcrypt, with length validation enforced server-side as well as client-side — the client is never the only line of defense.',
          'All AI-generated content rendered as HTML — markdown from the model, in both the web chat and the extension popup — is sanitized through DOMPurify before it touches the DOM. Content coming from a PDF upload is checked against its actual file signature, not just its extension, before being parsed. Rate limiting is applied per-IP on registration and login in addition to per-account limits on the AI routes themselves, which matters directly for cost control on a metered API.',
          'The data layer runs on PostgreSQL with Alembic managing schema migrations as a single source of truth — the kind of foundation that is easy to defer on a side project and expensive to retrofit once there is real user data depending on it.',
        ],
      },
      {
        heading: 'Market context',
        paragraphs: [
          'The AI-in-education space is large (roughly $8.3B in 2025, growing 30%+ annually) and already dense with well-distributed players — Grammarly alone has 30M+ users. Competing on "chat plus text selection" alone is not a strategy at this point; it is table stakes.',
          'Seren\'s intended differentiator is persistence: an academic memory that accumulates across a semester — flashcard decks that survive past a single chat thread, a PDF library scoped to a course rather than overwritten by the next upload, conversation history that still means something three weeks later. That memory layer is the current build priority, specifically because it is the kind of feature a better-distributed competitor could bolt onto their existing user base before Seren ships it independently.',
          'Pricing is currently positioned aggressively relative to the category (Student tier at $4/month, Pro at $9/month, against $7–16/month from comparable tools) — a deliberate acquisition lever, not a placeholder number.',
        ],
      },
      {
        heading: 'Current focus',
        paragraphs: [
          'Seren is being developed locally ahead of a coordinated relaunch, with the immediate build priority being persistent conversation and flashcard memory in PostgreSQL — replacing what currently lives in local browser storage with real per-user, per-course data that the extension and web app both read from the same source. LaTeX rendering and a unified auth context follow immediately after.',
        ],
      },
      {
        heading: 'What this project demonstrates',
        paragraphs: [
          'Full-stack ownership across a browser extension, a web frontend, and a backend API sharing one auth model. Security treated as a default assumption rather than a late addition. Product thinking that goes past "does the feature work" into "does this feature still matter against the five other tools that already ship it."',
        ],
      },
    ],
  },

  aitradingagent: {
    slug: 'aitradingagent',
    title: 'AITradingAgent',
    subtitle: 'Multi-Agent Algorithmic Trading System',
    status: 'Active — trend-following strategy running in paper trading',
    stack: ['Python', 'FastAPI', 'Redis', 'PostgreSQL / TimescaleDB', 'ccxt', 'Pydantic'],
    repoLabel: 'Private repository — strategic deployment phase',
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          'Most retail trading bots optimize for one thing: a backtest that shows a profitable equity curve — also the easiest number to accidentally overfit. AITradingAgent was built around the opposite priority, stated as a founding constraint before any strategy was written: profitability is a goal, not an assumption. Every strategy has to survive backtesting and paper trading before it is allowed near real capital, and every result has to clear a fixed statistical significance bar before it counts as evidence of anything.',
        ],
      },
      {
        heading: 'Architecture',
        paragraphs: [
          'The system is event-driven and cycle-based, not a single monolithic loop. Independent Python processes — market data collection, technical analysis, regime detection, decision engine, portfolio simulation — communicate through Redis pub/sub, with every intermediate decision written to PostgreSQL/TimescaleDB as an append-only audit trail. Nothing is inferred after the fact; every signal, regime read, and risk decision is logged at the moment it is made.',
          'Pydantic validates every message crossing an agent boundary — malformed data is rejected outright rather than silently coerced into something the next stage can technically process.',
        ],
        diagram:
          'Market Data (5min) -> TA Agent (15min) -> Regime Agent (30min)\n' +
          '                                              |\n' +
          '                                    Decision Engine (15min) -> Risk Agent\n' +
          '                                              |\n' +
          '                                    Portfolio Simulator (5min)',
      },
      {
        heading: 'Risk-first, by construction',
        paragraphs: [
          'The system trades exclusively in dry-run until an explicit phase gate is cleared, with the exchange API key held read-only for the entire duration. Daily, weekly, and total drawdown limits reject trades automatically rather than flagging them for review. A sideways-regime detector disables trading outright rather than letting a strategy fight a market with no trend to follow. Position sizing is regime-adjusted, cut automatically under high volatility.',
          'None of this is enforced by convention — it is structural. A strategy cannot reach live capital without passing through every one of these gates in order.',
        ],
      },
      {
        heading: 'Current production strategy',
        paragraphs: [
          'Five symbols each run a differentiated trend-following configuration — different EMA/MACD parameters, ADX thresholds, and stop-loss/take-profit structures per symbol, tuned against each asset\'s own volatility profile rather than a single set of parameters applied uniformly across the watchlist. Signals trigger on crossover events, not persistent state, which avoids re-signaling on every cycle a condition happens to still hold true.',
        ],
      },
      {
        heading: 'Ongoing research',
        paragraphs: [
          'Beyond the production strategy, a parallel research track continuously backtests and refines alternative models — volatility-breakout and market-structure approaches among them — against a strict statistical significance threshold, iterating toward strategies that could eventually clear a funded-account evaluation.',
        ],
      },
      {
        heading: 'What this project demonstrates',
        paragraphs: [
          'Distributed, event-driven system design with a real audit trail, not just working code. Statistical discipline — treating "not enough data to conclude" as a different outcome from "this does not work," and refusing to call either one a result until the sample size actually supports it. A risk-management mindset applied to the software architecture itself, not bolted on as a business rule at the end.',
        ],
      },
    ],
  },
};