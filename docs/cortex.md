# The cortex

ohm-cortex keeps what your agent knows about you and what it can do for you, as a folder you can read. It is separate software from the vault: it points at your blocks and never changes them.

<a id="why"></a>

## Why a cortex

A coding agent forgets you between sessions. Each new session learns again how you name things, what you tried last week, and what you asked it never to do. Where an agent does remember, the memory is usually kept somewhere you cannot read or correct.

A cortex is that memory as a folder of Markdown files you can open. Your agent writes to it as it works, and every change it makes is recorded with its name, so you can see what it did and undo what you do not want.

It holds no content of yours. Your writing stays in your vault; the cortex points at blocks by their ID and version, and never copies them.

<a id="need"></a>

## What you need, and why

| You need | Why |
| --- | --- |
| A checkout of ohm-cortex and Node | It runs on your own computer. Its tests run on Node 20 and 22. Its repository is not public yet |
| A folder for the cortex | The cortex is the folder. `~/cortex` unless you name another |
| A coding agent that speaks MCP | It reads and writes the cortex through twenty `cortex_*` tools. Claude Code and Codex can also run its hooks |
| A vault folder | Optional. It lets memories point at your blocks, and tells the agent what each channel means |

Cortex does not need ohm, an ohm account or a vault. ohm does not store or sync it.

<a id="folder"></a>

## The folder

```
cortex/
├── agents/         AGENTS.md, the rules for keeping this cortex, and secrets/
├── identity.md     whose cortex it is, read in full every session
├── vault.md        how to read your vault: each channel, what it means, how blocks there are filed
├── memory/         one thing learned per file, and an index of them
├── skills/         <name>/SKILL.md, in the form coding agents already read
├── tools/          what the agent can use, each on or off
└── .cortex/        the journal, earlier versions, working memory
```

For you it is three folders: what your agent has learned, what it knows how to do, and what it is able to use. `agents/` says how the cortex is kept, and `identity.md` says whose it is.

<a id="layers"></a>

## Who may change what

| Part | Where | Changed by | Read |
| --- | --- | --- | --- |
| Rules | `agents/AGENTS.md` | Cortex itself, and your own additions | Every session |
| Secrets | `agents/secrets/` | You only | Never by the agent. Never committed |
| Identity | `identity.md` | You confirm; an agent only proposes, with evidence | Every session, in full |
| Memory | `memory/` | An agent, at once, as its own change. You revert or edit any time | The index every session; a memory when it fits |
| Working memory | `.cortex/working/` | Each agent its own, at once | Every session |
| What a channel means | `vault.md` | An agent or you, at once. What you wrote by hand stands | Every session |
| Skills | `skills/` | An agent proposes; you approve | Descriptions every session; a skill when it fits |
| Tools | `tools/` | You only. An agent may ask for one | The list every session |

<a id="first-use"></a>

## Your first use

From your checkout of ohm-cortex, start a cortex:

```
node bin/cortex.mjs init ~/cortex
```

Then give your agent this as an MCP server's command:

```
node /path/to/cortex/bin/cortex.mjs mcp ~/cortex
```

When it connects, the agent is told to call `cortex_start`, which hands it the rules, your identity, its memories and what is waiting for you. Ask it something about yourself, then ask it to remember one thing. Run `cortex history` and you see the memory it wrote, under its name.

`cortex status` lists everything waiting for you or broken, and how to clear each. For a client that connects to a server rather than starting one, `cortex serve` offers the same tools over HTTP on your own machine, with a token from `cortex token`.

<a id="edits"></a>

## Agents edit; you revert

An agent does not ask before it writes a memory, its own working memory, or what a channel means. It writes, and the write is recorded as a change under its name, with its reason. You read what each agent did in the history, and revert or restore what you do not want. Nothing is lost: what a change replaced is kept. [History](https://docs.ohmmmm.com/history.md)

<a id="waits"></a>

## What waits for you

Some things need your trust, so an agent can only propose them.

- **An identity fact** is proposed with its evidence, and set only when you run `cortex confirm`. `cortex reject` turns it down, and that value is not proposed again.
- **A skill** an agent writes waits until you run `cortex approve`, and is not used before.
- **A tool** is only asked for. You build it, add it to `tools/` and switch it on.

Confirming and approving are done from the command line only, because an MCP client cannot prove that it is you. An agent never writes the rules, your identity, a skill or a tool, not even by restoring an earlier version, and never another agent's working memory.

<a id="hooks"></a>

## Hooks for Claude Code and Codex

With the hooks installed, your agent does not have to remember to start from the cortex. `cortex install-hooks claude-code` or `cortex install-hooks codex` prints what to add to that client's settings, and writes nothing.

| Moment | What the hook does |
| --- | --- |
| Session start | Hands the agent the rules, your identity, memories marked always, working memory, and the open dead ends recorded near its folder |
| A prompt | Nothing yet |
| The end of a turn | Asks the agent to distill its working memory, once for each change not distilled |
| Session end | Records nothing |

A hook never fails a session: on any error it writes nothing and lets the session go on. The hooks are tested with synthetic inputs and have not yet been tried in a real Claude Code or Codex session.

<a id="sessions"></a>

## Sessions and dead ends

Nothing is captured on an agent's behalf. When it finishes a task, or gives up, it writes a session with `cortex_session`, like a commit message: one line of what it did, the changes it made, and its dead ends.

A dead end is what it tried and dropped, why, and a command that would show whether it still holds. The next session that starts in that folder is shown the open dead ends, so it does not try the same thing again. A later session marks a dead end resolved when it no longer holds. Cortex never runs the command itself. [History](https://docs.ohmmmm.com/history.md#sessions)

<a id="evidence"></a>

## Evidence

A note or a memory says what it was drawn from, as a list of pointers: a node at the version read, such as a block in your vault or another memory, or a session.

- **Something you said** rests on the session you said it in, and becomes a memory at once.
- **Something inferred about you** rests on two or more sessions.
- **Something inferred about your work** rests on two or more distinct blocks, each at the version read.
- **A skill** rests on three sessions where the same method was used.

Cortex checks that each pointer is well formed and that what it cites exists. How much is enough is judgement, written in the rules as guidance. This is how inference joins the graph without touching your blocks. [The graph](https://docs.ohmmmm.com/graph.md#inference)

<a id="vault"></a>

## Connecting a vault

`cortex vault connect <folder>` connects a vault kept in a folder and writes `vault.md`, where the agent records what each channel means and how blocks there are filed. Each session, cortex brings `vault.md` in step: counts, what moved or left, and memories pointing at blocks no longer there.

Cortex's own folder reader is simpler than the vault format: it reads each Markdown file as a block in the one channel of its folder. Reading a vault's blocks in many channels, through the vault's index, is planned.

<a id="not"></a>

## What the cortex does not do

- **It does not record what an agent reads.** Only what it changes, and what it says it did.
- **It does not sync with ohm.** It stays a folder of its own; keep it in git if you want it on two machines.
- **It does not mark memories out of date** when a block they point at changes. That is planned.
- **It does not yet serve ChatGPT's or Claude's web connectors,** which need OAuth.

---
ohm is in development. These docs cover the implementation and the work still planned. Built does not mean verified on the live service; see Status and limits.
All pages: https://docs.ohmmmm.com/llms.txt
