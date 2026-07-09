import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Mail, FileText, LayoutGrid, Search, MessageSquare,
  Menu, X, Copy, Check, Send, Plus, Trash2, Sparkles,
} from "lucide-react";
import { generateEmail } from "@/lib/email.functions";
import { researchTopic } from "@/lib/research.functions";


export const Route = createFileRoute("/")({ component: App });

type ViewId = "email" | "notes" | "tasks" | "research" | "chat";

const NAV: { id: ViewId; label: string; icon: typeof Mail }[] = [
  { id: "email", label: "Email Generator", icon: Mail },
  { id: "notes", label: "Meeting Summarizer", icon: FileText },
  { id: "tasks", label: "Task Planner", icon: LayoutGrid },
  { id: "research", label: "Research Assistant", icon: Search },
  { id: "chat", label: "AI Chatbot", icon: MessageSquare },
];

function App() {
  const [view, setView] = useState<ViewId>("email");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const current = NAV.find((n) => n.id === view)!;

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide">REO</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">AI Assistant</div>
            </div>
          </div>
          <button
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setView(item.id); setSidebarOpen(false); }}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-primary/15 text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_40%,transparent)]"
                    : "text-sidebar-foreground hover:bg-muted/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-5 py-4 text-[11px] text-muted-foreground">
          v1.0 · Workplace edition
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-h-screen flex-col md:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:px-8">
          <button
            className="rounded-md p-2 text-muted-foreground hover:bg-muted md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold sm:text-lg">{current.label}</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">Powered by REO AI</p>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          {view === "email" && <EmailGenerator />}
          {view === "notes" && <MeetingSummarizer />}
          {view === "tasks" && <TaskPlanner />}
          {view === "research" && <ResearchAssistant />}
          {view === "chat" && <Chatbot />}
        </main>

        <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground md:px-8">
          AI generated content may contain inaccuracies. Please review and verify critical information before use.
        </footer>
      </div>
    </div>
  );
}

/* ---------- Shared UI ---------- */

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] ${className}`}>
      {children}
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{children}</label>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 ${props.className ?? ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 ${props.className ?? ""}`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 ${props.className ?? ""}`}
    />
  );
}

function Button({
  children, variant = "primary", className = "", ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
    outline: "border border-border text-foreground hover:bg-muted",
  }[variant];
  return <button {...rest} className={`${base} ${styles} ${className}`}>{children}</button>;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
      }}
    >
      {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

/* ---------- 1. Email Generator ---------- */

function EmailGenerator() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("Professional");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const { text } = await generateEmail({
        data: { recipient, subject, tone, context },
      });
      setOutput(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
      <Card>
        <h2 className="mb-4 text-sm font-semibold">Compose</h2>
        <div className="space-y-4">
          <div>
            <Label>Recipient</Label>
            <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Sarah or sarah@company.com" />
          </div>
          <div>
            <Label>Subject (optional)</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Project sync" />
          </div>
          <div>
            <Label>Tone</Label>
            <Select value={tone} onChange={(e) => setTone(e.target.value)}>
              <option>Professional</option>
              <option>Friendly</option>
              <option>Concise</option>
              <option>Formal</option>
              <option>Persuasive</option>
            </Select>
          </div>
          <div>
            <Label>Context / key points</Label>
            <Textarea rows={4} value={context} onChange={(e) => setContext(e.target.value)} placeholder="What should this email say?" />
          </div>
          <Button onClick={generate} disabled={loading}>
            <Sparkles className="h-4 w-4" /> {loading ? "Drafting..." : "Generate Email"}
          </Button>
          {error && <p className="text-xs text-rose-400">{error}</p>}

        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Draft (editable)</h2>
          {output && <CopyButton text={output} />}
        </div>
        <Textarea
          rows={16}
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder="Your generated email will appear here..."
          className="font-mono text-[13px] leading-relaxed"
        />
      </Card>
    </div>
  );
}

/* ---------- 2. Meeting Summarizer ---------- */

function MeetingSummarizer() {
  const [transcript, setTranscript] = useState("");
  const [decisions, setDecisions] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const summarize = () => {
    setLoading(true);
    setTimeout(() => {
      const lines = transcript.split(/[\n.!?]+/).map((l) => l.trim()).filter(Boolean);
      const decs = lines.filter((l) => /decide|agree|approv|confirm|final/i.test(l)).slice(0, 5);
      const acts = lines.filter((l) => /will|need to|should|todo|action|by (mon|tue|wed|thu|fri|next)/i.test(l)).slice(0, 6);
      setDecisions(decs.length ? decs : ["Team aligned on project scope and timeline.", "Approved Q3 roadmap priorities."]);
      setActions(acts.length ? acts : ["Share updated design mocks by Friday.", "Schedule stakeholder review next week.", "Draft rollout plan for engineering."]);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
      <Card>
        <h2 className="mb-4 text-sm font-semibold">Raw transcript</h2>
        <Textarea
          rows={18}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript or notes here..."
          className="text-[13px] leading-relaxed"
        />
        <div className="mt-4">
          <Button onClick={summarize} disabled={loading || !transcript.trim()}>
            <Sparkles className="h-4 w-4" /> {loading ? "Summarizing..." : "Summarize"}
          </Button>
        </div>
      </Card>

      <div className="space-y-6">
        <EditableList title="Key Decisions" items={decisions} setItems={setDecisions} accent="var(--primary)" />
        <EditableList title="Action Items" items={actions} setItems={setActions} accent="oklch(0.75 0.15 200)" />
      </div>
    </div>
  );
}

function EditableList({
  title, items, setItems, accent,
}: { title: string; items: string[]; setItems: (v: string[]) => void; accent: string }) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <button
          onClick={() => setItems([...items, ""])}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          + Add
        </button>
      </div>
      {items.length === 0 && <p className="text-xs text-muted-foreground">Nothing yet. Run a summary or add one.</p>}
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="group flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
            <input
              value={item}
              onChange={(e) => {
                const next = [...items]; next[i] = e.target.value; setItems(next);
              }}
              className="flex-1 rounded-md bg-transparent px-2 py-1 text-sm outline-none focus:bg-muted/60"
            />
            <button
              onClick={() => setItems(items.filter((_, idx) => idx !== i))}
              className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
              aria-label="Remove"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ---------- 3. Task Planner (Kanban) ---------- */

type Priority = "Low" | "Medium" | "High";
type Task = { id: string; title: string; priority: Priority; column: "todo" | "doing" | "done" };

const COLUMNS: { id: Task["column"]; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "doing", label: "In Progress" },
  { id: "done", label: "Done" },
];

const PRIORITY_STYLES: Record<Priority, string> = {
  Low: "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30",
  Medium: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  High: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30",
};

function TaskPlanner() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Draft Q3 marketing brief", priority: "High", column: "todo" },
    { id: "2", title: "Review pull requests", priority: "Medium", column: "doing" },
    { id: "3", title: "Ship onboarding update", priority: "High", column: "doing" },
    { id: "4", title: "Weekly team retro notes", priority: "Low", column: "done" },
  ]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [column, setColumn] = useState<Task["column"]>("todo");

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setTasks([...tasks, { id: crypto.randomUUID(), title: title.trim(), priority, column }]);
    setTitle("");
  };

  const move = (id: string, dir: 1 | -1) => {
    setTasks(tasks.map((t) => {
      if (t.id !== id) return t;
      const idx = COLUMNS.findIndex((c) => c.id === t.column);
      const next = COLUMNS[Math.max(0, Math.min(COLUMNS.length - 1, idx + dir))];
      return { ...t, column: next.id };
    }));
  };

  const remove = (id: string) => setTasks(tasks.filter((t) => t.id !== id));
  const updateTitle = (id: string, v: string) => setTasks(tasks.map((t) => t.id === id ? { ...t, title: v } : t));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Card>
        <form onSubmit={add} className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task..." />
          <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            <option>Low</option><option>Medium</option><option>High</option>
          </Select>
          <Select value={column} onChange={(e) => setColumn(e.target.value as Task["column"])}>
            {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </Select>
          <Button type="submit"><Plus className="h-4 w-4" /> Add</Button>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const list = tasks.filter((t) => t.column === col.id);
          return (
            <div key={col.id} className="rounded-xl border border-border bg-card/60 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">{col.label}</h3>
                <span className="text-xs text-muted-foreground">{list.length}</span>
              </div>
              <div className="space-y-2">
                {list.map((t) => (
                  <div key={t.id} className="group rounded-lg border border-border bg-background/60 p-3 shadow-[var(--shadow-card)]">
                    <input
                      value={t.title}
                      onChange={(e) => updateTitle(t.id, e.target.value)}
                      className="w-full bg-transparent text-sm outline-none focus:text-foreground"
                    />
                    <div className="mt-3 flex items-center justify-between">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${PRIORITY_STYLES[t.priority]}`}>{t.priority}</span>
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button onClick={() => move(t.id, -1)} className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">←</button>
                        <button onClick={() => move(t.id, 1)} className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">→</button>
                        <button onClick={() => remove(t.id)} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    </div>
                  </div>
                ))}
                {list.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">No tasks</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- 4. Research Assistant ---------- */

function ResearchAssistant() {
  const [topic, setTopic] = useState("");
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = topic.trim();
    if (!t) return;
    setLoading(true);
    setError(null);
    try {
      const res = await researchTopic({ data: { topic: t } });
      setInsights(res.insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate insights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <form onSubmit={search} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Research a topic..."
              className="pl-9"
            />
          </div>
          <Button type="submit" disabled={loading}>
            <Sparkles className="h-4 w-4" /> {loading ? "Researching..." : "Get insights"}
          </Button>
        </form>
        {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
      </Card>

      {insights.length > 0 && (
        <EditableList title="Key Insights" items={insights} setItems={setInsights} accent="var(--primary)" />
      )}
    </div>
  );
}


/* ---------- 5. Chatbot ---------- */

type Msg = { role: "user" | "assistant"; text: string };

const INITIAL_MSG: Msg = {
  role: "assistant",
  text: "Hi, I'm REO. Ask me anything about workplace productivity — email drafts, meeting prep, task strategies, or team workflows. Type 'clear' any time to reset the chat.",
};

function Chatbot() {
  const [messages, setMessages] = useState<Msg[]>([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;

    if (["clear", "/clear", "clera"].includes(q.toLowerCase())) {
      setMessages([]);
      setInput("");
      return;
    }

    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: localReply(q) }]);
      setTyping(false);
    }, 500);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-14rem)] max-w-3xl flex-col">
      <div
        ref={scrollRef}
        className="scrollbar-thin flex-1 space-y-4 overflow-y-auto pb-4 pr-1"
      >
        {messages.map((m, i) => (
          <ChatBubble
            key={i}
            msg={m}
            onEdit={(v) =>
              setMessages((prev) => prev.map((x, idx) => (idx === i ? { ...x, text: v } : x)))
            }
          />
        ))}
        {typing && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:240ms]" />
            </span>
            REO is thinking...
          </div>
        )}
      </div>

      <form onSubmit={send} className="flex gap-2 border-t border-border pt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask REO... (type 'clear' to reset)"
        />
        <Button type="submit" disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

function ChatBubble({ msg, onEdit }: { msg: Msg; onEdit: (v: string) => void }) {
  const isUser = msg.role === "user";
  const ref = useRef<HTMLDivElement>(null);

  // Only sync from state -> DOM when the external text differs from what's
  // already rendered. This preserves caret position while editing.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.innerText !== msg.text) {
      el.innerText = msg.text;
    }
  }, [msg.text]);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground shadow-[var(--shadow-card)]"
        }`}
      >
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onEdit((e.currentTarget as HTMLDivElement).innerText)}
          spellCheck={false}
          className="w-full whitespace-pre-wrap break-words outline-none"
        />
      </div>
    </div>
  );
}


function localReply(q: string): string {
  const s = q.toLowerCase().trim();

  let keyword: "help" | "email" | "schedule" | "meeting" | "summarize" | "default" = "default";
  if (/\bhelp\b|what can you do|commands?/.test(s)) keyword = "help";
  else if (/email|draft|reply|inbox/.test(s)) keyword = "email";
  else if (/schedule|calendar|book|reschedul/.test(s)) keyword = "schedule";
  else if (/meeting|standup|1:1|agenda/.test(s)) keyword = "meeting";
  else if (/summar|recap|tl;?dr|notes?/.test(s)) keyword = "summarize";

  switch (keyword) {
    case "help":
      return `I am REO, your conversational workplace assistant. Right here in chat I can help you:\n• Draft and refine emails\n• Prioritize tasks and plan your day\n• Prepare for meetings\n• Summarize notes and isolate action items\n• Optimize your workflow\n\nTry asking about email subjects, the Eisenhower Matrix, meeting prep, or active listening. Type 'clear' to reset the chat.`;
    case "email":
      return `Here are three professional subject line templates for difficult workplace conversations:\n\n1. "Request: quick alignment on [topic] before [deadline]" — frames urgency without blame.\n2. "Following up on [decision]: next steps and timeline" — keeps the focus forward-looking.\n3. "A brief note on [situation]: can we find 10 minutes to sync?" — opens a dialogue instead of escalating.\n\nTip: keep the subject under 8 words, name the topic, and avoid emotional words like 'urgent' unless it truly is.`;
    case "schedule":
      return `Here is a quick breakdown of the Eisenhower Matrix for task prioritization:\n\n1. Urgent & Important — Do first. Crises, deadlines, pressing problems.\n2. Important & Not Urgent — Schedule. Planning, skill building, relationship building.\n3. Urgent & Not Important — Delegate. Interruptions, some emails and meetings.\n4. Not Urgent & Not Important — Delete or defer. Busy work, excessive notifications.\n\nTip: spend most of your time in quadrant 2; that is where long-term productivity lives.`;
    case "meeting":
      return `Here is a quick checklist of three things to prepare before joining a client call:\n\n1. Know the objective — write down the one outcome the call must achieve.\n2. Prepare three talking points — client context, open questions, and the value you bring.\n3. Confirm logistics and materials — test your audio/video, have the agenda visible, and open any shared documents before the call starts.\n\nBonus: send a one-line agenda 10 minutes ahead so everyone arrives aligned.`;
    case "summarize":
      return `Here is a tip on how to actively listen and isolate action items during a busy call:\n\nListen for three signals: decisions ('we agreed...'), owners ('Alex will...'), and deadlines ('by Friday...'). Jot each in a three-column grid: Decision | Owner | Due Date. Ignore filler and repeated examples. At the end, read back the action items aloud to confirm ownership before the call ends.\n\nThis keeps your recap accurate and prevents tasks from slipping through the cracks.`;
    default:
      return `I am REO, an AI optimized strictly for workplace productivity. While I cannot answer general knowledge queries, I am ready to help you draft communications, plan your daily tasks, or summarize meeting notes. How can I assist your workflow today?`;

  }
}
