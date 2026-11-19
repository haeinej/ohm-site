# Status and limits

What is built, what has been tested and what remains planned, for the vault service, the vault folder, the cortex and the workspace's design. A merged implementation is not evidence that the feature is deployed or verified with a live account.

<a id="status"></a>

## Implementation status

Each piece is one of: **Built**; **Built, not verified**, where tests pass but it has not been run for real; **Planned**, where a plan or design names it; or **Not built**, where nothing schedules it yet.

### The vault service and the workspace

| Area | Status | Notes |
| --- | --- | --- |
| Sign-in with Google or Microsoft | Built | In production |
| Sign-in with Bluesky | Built, not verified | Not yet verified end to end |
| Connecting a self-hosted PDS | Built | In production |
| Connecting a Bluesky account | Built, not verified | Not yet verified end to end |
| Accounts hosted by ohm | Planned | |
| Access | Restricted | An allow list of accounts during testing |
| Workspace | Built | Posts under labels; account switching clears private state |
| Mirror | Built | Runs automatically when an account is first connected |
| Publishing public posts | Built, not verified | Verified against a test PDS. Not yet run against a live account |
| Friends-only delivery | Planned | |
| Attachments stored by ohm | Planned | A post references files by address, and a copy is made at publish |
| Vault agent tools | Built, not verified | Ten tools over posts; stand-in services and signed-token checks do not prove a live sign-in |
| Folder sync | Built | Command line, local folders. Posts only: every Markdown file is read as a post |
| Sync from the workspace, and with cloud storage | Planned | |
| Earlier versions of a post, and bringing a removed one back | Not built | Each post has one current version |
| Deleting ohm's copy | Manual | Carried out on request |
| Agent keys | Planned | Until then an agent signs in with an app password from the member's PDS |
| Finding people | Planned | |

### The vault folder

| Area | Status | Notes |
| --- | --- | --- |
| Blocks, channels, sources and entities as files | Built | Read and written exactly; tested |
| Evidence edges | Built | Drawn from content only |
| Roots and the index: `vault init`, `index`, `status`, `inspect`, `search` | Built | Tested against real temporary folders |
| A Google Drive root | Built, not verified | Not tried against a real Google Drive mount |
| Two-way roots, such as an Obsidian vault | Planned | Refused until built |
| Agent tools over the index | Planned | Search, read, neighbours, capture and collect |
| Blocks other than posts in the vault service and the workspace | Not built | They stay in the folder |
| Sync that knows blocks | Not built | Sync reads every Markdown file as a post |

### The cortex

| Area | Status | Notes |
| --- | --- | --- |
| The cortex folder, its MCP server over standard input and over HTTP | Built | Separate software, ohm-cortex; 119 tests, on Node 20 and 22 |
| The journal: changes marked with who made them, history, as-of, save, restore, revert | Built | |
| Sessions and dead ends | Built | Shown at session start near the folder they were recorded in |
| Evidence on notes and memories | Built | Checked for shape and existence; how much is enough is guidance |
| Hooks for Claude Code and Codex | Built, not verified | Tested with synthetic inputs; not yet tried in a real session |
| Reading a vault folder | Built | Through cortex's own folder reader: one channel per file |
| Reading the vault's full format through its index | Planned | |
| Memories marked out of date when their blocks change | Planned | |
| ChatGPT and Claude web connectors | Not built | They need OAuth |
| Syncing the cortex with ohm | Not built | The cortex stays a folder of its own |

### Designed for the workspace

These are drawn in the ohm-ux wireframe with sample data. None is in the live editor.

| Area | Status | Notes |
| --- | --- | --- |
| Channels as records, a block in many, each channel's own order, drag and ⌥-drag | Planned | [Coming to the workspace](https://docs.ohmmmm.com/workspace.md#coming) |
| Connecting words, whole blocks and pulling a line; the connections card | Planned | [Connections](https://docs.ohmmmm.com/connections.md#designed) |
| The graph, with evidence and inference | Planned | [The graph](https://docs.ohmmmm.com/graph.md#designed) |
| Version history: Dates, You and Agents; revert, restore, save | Planned | [History](https://docs.ohmmmm.com/history.md#designed) |
| Daily autosaves | Planned | ohm-cortex does not write them yet |

<a id="for-good"></a>

## Anything you publish is public for good

A public post on the AT Protocol is copied by other services the moment it is written. Taking a post down removes it from your website, not from every copy.

<a id="agent"></a>

## Your agent reads your private posts

That is how it knows what you are working on. Whichever company runs the model your agent uses sees what it reads.

<a id="cortex"></a>

## Your agent edits your cortex without asking

Every change it makes is recorded with its name, and you can undo any of them. Nothing is undone on its own: read the history now and then. [History](https://docs.ohmmmm.com/history.md)

<a id="ohm"></a>

## ohm can read your private posts

Your workspace includes them, and ohm holds your workspace. ohm serves this private data only to you. A synced folder keeps a copy of your posts with you.

<a id="not"></a>

## What ohm is not

- **Not a place to build an audience.** There is no count of followers to grow and no feed built to keep you scrolling.
- **Not a replacement for talking to people.** The agent's job ends at the introduction.
- **Not only an editor.** The editor is what you see. The working copy under it, and your say over where each post goes, are the point.
- **Not a vault we cannot read.** The working copy includes your private posts, and we can read it.
- **Not a Bluesky competitor.** Your account, your follows and your public posts are part of the same network.

---
ohm is in development. These docs cover the implementation and the work still planned. Built does not mean verified on the live service; see Status and limits.
All pages: https://docs.ohmmmm.com/llms.txt
