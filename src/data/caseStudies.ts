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
    stack: ['Python', 'Claude Sonnet 5', 'Claude Haiku', 'Whisper (CUDA)', 'PyQt5', 'Selenium', 'Fernet'],
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
        heading: 'Routing without a blind classifier',
        paragraphs: [
          'An early version of MARA split the work across two Claude models: a lightweight classifier read the latest message in isolation and decided what MARA should do — reply normally, generate a chart, look at the screen — while a second model streamed a full response in parallel, on the bet that the classification wouldn\'t change anything. It usually worked, but a classifier reading one sentence with no memory of the conversation will occasionally misfire on exactly the sentence that needed the context most — asking for a spoken recap of a conversation, for instance, getting reinterpreted as a request for a rendered chart because the word "summary" matched a keyword.',
          "The fix was architectural, not a prompt tweak: give the single model that already holds the full conversation a set of native tools — generate a visual, look at the screen, touch memory, reset the session — and let it decide for itself, in context, whether to just answer or invoke one of them. Claude Haiku still runs in parallel for what it's actually well-suited to at that speed: detecting the language of the message, so the perceived-latency gain survives without any model routing a request based on a single sentence stripped of everything said before it.",
          'Speech-to-text still runs entirely locally on CUDA via Whisper turbo, keeping network latency and raw audio out of the slowest part of the pipeline entirely.',
        ],
        diagram:
          'Push-to-talk -> Whisper (local, CUDA) -> Sonnet 5, full context + native tools   -\n' +
          '                                                                                    |- parallel\n' +
          '                                                    -> Haiku (language detection) -\n' +
          '                                                                                    v\n' +
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
          'MARA keeps encrypted, persistent memory across sessions (Fernet) — facts, preferences, and ongoing context, surfaced only when actually relevant rather than recited back. Conversation history is capped at a rolling window rather than left to grow unbounded, keeping every turn within the model\'s working context without extra summarization overhead. The UI runs on a thread-safe PyQt5 architecture — audio capture, model inference, and rendering happen on separate threads communicating through Qt signals, which was the only practical way to keep an always-on-top floating window responsive while a GPU model transcribes in the background.',
          "MARA launches on demand rather than silently at boot — a deliberate choice after running both ways, favoring an explicit start over a background process competing for GPU and CPU priority. It's been running continuously in daily use since it was built — not a proof of concept. Total running cost sits around $3.50–7.50/month in API usage; Whisper, the UI, and system control all run at zero marginal cost locally.",
        ],
      },
      {
        heading: 'What this project demonstrates',
        paragraphs: [
          'Real-time systems work under a hard latency budget, not just "make an API call and wait." Concurrent architecture across threads, processes, and parallel model calls. Local-first design for privacy and cost, with cloud inference used only where it adds real capability. Integration depth — audio, vision, browser automation, and OS-level control working as one coherent system rather than four separate demos glued together. And recognizing, from real usage, when a working architecture is still the wrong one — and re-architecting rather than patching around the symptom.',
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
    subtitle: 'Systematic Strategy Validation for CME Futures (NQ/MNQ)',
    status: 'Active — strategy research phase, targeting a funded prop-firm evaluation',
    stack: ['Python', 'FastAPI', 'Redis', 'PostgreSQL / TimescaleDB', 'Databento', 'Pydantic'],
    repoLabel: 'Private repository — active research phase',
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          'Most retail trading systems optimize for one thing: a backtest that shows a profitable equity curve — also the easiest number to accidentally overfit. AITradingAgent was built around the opposite priority, stated as a founding constraint before any strategy was written: profitability is a goal, not an assumption. Every strategy has to clear a fixed statistical significance bar, survive an out-of-sample test split, and hold up under an outlier-removal check before it counts as evidence of anything — and every one of those checks is enforced the same way regardless of how many prior strategies have already failed them.',
        ],
      },
      {
        heading: 'Architecture',
        paragraphs: [
          'The system is event-driven and cycle-based, not a single monolithic loop. Independent Python processes — market data ingestion, technical analysis, regime detection, decision engine, portfolio simulation — communicate through Redis pub/sub, with every intermediate decision written to PostgreSQL/TimescaleDB as an append-only audit trail. Nothing is inferred after the fact; every signal, regime read, and risk decision is logged at the moment it is made.',
          'Pydantic validates every message crossing an agent boundary — malformed data is rejected outright rather than silently coerced into something the next stage can technically process.',
        ],
        diagram:
          'Market Data (Databento, 1min) -> TA Agent -> Regime Agent\n' +
          '                                       |\n' +
          '                             Decision Engine -> Risk / Compliance Engine\n' +
          '                                       |\n' +
          '                             Portfolio Simulator (Lucid MLL rules)',
      },
      {
        heading: 'Risk-first, by construction',
        paragraphs: [
          'The system targets a live prop-firm evaluation (Lucid Trading), so every backtest runs through a purpose-built compliance engine that simulates the account\'s real trailing max-loss rules — end-of-day trailing, floor lock-in above the starting balance, consistency ratio — rather than a generic peak-drawdown metric. No overnight exposure is a structural constraint enforced by a dedicated session-calendar module, checked both as the primary trading gate and again as a redundant check immediately before any order — not a convention documented and hoped for.',
          'A strategy cannot be considered viable without clearing every one of these gates, in order, on both a training and a held-out test period.',
        ],
      },
      {
        heading: 'Current research status',
        paragraphs: [
          'Six strategies have been systematically tested and rejected across two tiers — opening-range breakout, VWAP mean reversion, gap fade, Donchian breakout, a cross-instrument pair trade, and RSI mean reversion — each judged independently against the same fixed bar: net profit factor above 1 on both sides of a chronological train/test split, a minimum trade-count threshold, and survival of the single best trade being removed from the sample. None has cleared it yet. Several failures pointed to genuine structural flaws (no per-trade stop-loss, prohibitive transaction costs from a mismatched instrument ratio); others failed by a narrow margin with results traced back to a single outsized month rather than a stable edge — a pattern that shows up consistently enough across independent strategies to be treated as a property of the sample, not of any one approach.',
          'Rather than loosen the validation bar or move to increasingly speculative strategy families to force a pass, the project is currently extending its historical dataset from roughly one year to six years of 1-minute bars — covering the 2022 bear market, the 2023 recovery, and the 2024–2025 bull run — and re-testing the strategies with the strongest partial evidence at coarser bar intervals, with an added cross-regime robustness check to catch exactly the single-month dependency problem described above before it can pass as a false positive.',
        ],
      },
      {
        heading: 'What this project demonstrates',
        paragraphs: [
          'Distributed, event-driven system design with a real audit trail, not just working code. Statistical discipline — treating "not enough data to conclude" as a different outcome from "this does not work," and refusing to call either one a result until the sample size actually supports it. A risk-management mindset applied to the software architecture itself, not bolted on as a business rule at the end. And a willingness to reject six consecutive strategies rather than lower the bar to produce a result — the kind of intellectual honesty that matters more in quantitative research than any single backtest ever will.',
        ],
      },
    ],
  },
};