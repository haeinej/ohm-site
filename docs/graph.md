# The graph

Your vault and your cortex form one graph around you. Its edges are of two kinds: evidence, which your content shows, and inference, which your cortex concludes. Keeping them apart is the point.

<a id="two"></a>

## Two kinds of edge

- **Evidence** is what the content shows: a channel contains a block, a block links to another, mentions a person, or came from a source. You make it by writing and filing. Anyone can check it, and it can always be rebuilt from your files. **A model never makes evidence.**
- **Inference** is what your cortex concludes: a memory, a note, a skill or a tool, each pointing at what it was drawn from. Remove an inference and the evidence under it is untouched.

**A model never draws an edge between two blocks.** It writes a cortex node that points at both.

<a id="evidence"></a>

## Evidence

| Edge | Made when |
| --- | --- |
| `contains` | A channel holds a block, or a channel |
| `links` | A block links to another, or to a page |
| `embeds` | A block embeds a file or another block |
| `mentions` | A block names an entity |
| `from`, `quotes` | A block came from a source, or quotes it |

The vault's index draws these from your files. [Connections](https://docs.ohmmmm.com/connections.md#kinds)

<a id="inference"></a>

## Inference

Each part of the cortex joins the graph by pointing down at what it was drawn from.

| Cortex node | Edge | Points at | Its evidence |
| --- | --- | --- | --- |
| Memory | `grounds` | The blocks, channels or sessions it rests on | Two or more distinct blocks, each at the version read; or the session where you said it |
| Note | `observes` | What it saw it in | One session, or a node at a version |
| Skill | `learned` | The channels and blocks it was used on | Three or more sessions |
| Tool | `acts` | What it reads and writes | Its declaration, which you write |
| Identity fact | `about` | You | Your words, or the block and passage that state it |

The counts are guidance in the cortex's playbook, not rules in code: the cortex checks that each pointer is well formed and that what it cites exists. [The cortex](https://docs.ohmmmm.com/cortex.md#evidence)

Diagram: inference in the cortex points down at evidence in the vault.
- Cortex (inference): a skill, a memory, a note and a tool.
- Vault (evidence): the channel "essays", the blocks "On slowness" and "Bridge at dusk", a source (a book) and an entity (the Thames).
- Evidence, made by the person: the channel contains "On slowness"; "On slowness" links to "Bridge at dusk"; "On slowness" is from the book; "Bridge at dusk" mentions the Thames.
- Inference, drawn by the cortex: the skill was learned on the channel; the memory grounds on "On slowness"; the note observes "Bridge at dusk"; the tool acts on "Bridge at dusk".
- No line joins two blocks except one the person made.

<a id="layers"></a>

## The layers around you

The workspace draws the graph centred on you, a layer at a time.

1. **You.**
2. **Your cortex:** memories, notes, skills and tools, close around you. It is only ever yours.
3. **Your channels,** then the channels inside them.
4. **Blocks.** A block can be in any number of channels.
5. **Sources and entities** the blocks came from and mention.

<a id="status"></a>

## What is built

- **Evidence edges are built,** in the vault's index on your computer. `vault inspect` lists them for one block.
- **Inference is built,** in ohm-cortex: notes and memories carry their evidence as pointers to a node at a version, or to a session.
- **The cortex reads your vault through a simpler reader today.** Connecting a vault folder with `cortex vault connect` reads each Markdown file as a block in the one channel of its folder. Reading the vault's full format, through its index, is planned.

<a id="designed"></a>

## Designed for the workspace

The drawn graph is designed in the ohm-ux wireframe, with sample data, and **not built in the live editor**: you at the centre, evidence in grey and inference in green, nodes that drift and settle, hover to light one node's edges, click a block to open it, click an entity to centre the graph on them. Where evidence and inference join the same pair, evidence wins.

---
ohm is in development. These docs cover the implementation and the work still planned. Built does not mean verified on the live service; see Status and limits.
All pages: https://docs.ohmmmm.com/llms.txt
