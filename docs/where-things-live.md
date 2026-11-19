# Where your things live

Public posts live in your AT Protocol repository. ohm keeps the working copy of your posts. A vault folder and your cortex are folders on your own computer, and sync or export can keep a copy of your posts with you.

<a id="places"></a>

## The places

| | What is there | Whose it is |
| --- | --- | --- |
| Your account on the open network | Your public posts, and your identity | Yours. It is hosted by Bluesky or on a server you run, and it can be moved |
| Your ohm account | Who you are when you sign in to ohm | Made with Google, Microsoft or Bluesky. It holds no posts |
| Your folder, once synced | Your posts as Markdown files | Yours, on your machine or in locally synced storage |
| Your vault on ohm | A working copy of every post | ohm holds it for you |
| A vault folder | Blocks, channels, sources and entities as Markdown files | Yours, on your machine. Indexing never sends it anywhere; only posts you sync reach ohm |
| The folders a vault reads | Your Google Drive, Obsidian or code folders, where they already are | Yours. The vault only reads them |
| Your cortex | What your agent knows about you, as a folder | Yours, on your machine. ohm never sees it |

<a id="folders"></a>

## Inside the folders

| Path | What it holds | Can it be rebuilt |
| --- | --- | --- |
| `.vault/config.json` | The folders the vault reads, and how much it keeps of each | No: you wrote it |
| `.vault/index.sqlite` | Every block, channel, entity, source and connection the vault found, the words for search, each file's size, date and content address | Yes: delete it, and `vault index` makes it again |
| `.vault/cache/` | Copies of files from folders set to keep them in full | Yes, while the originals are there |
| `_entities/`, `_sources/` | Entities, and what you captured from outside | No: they are your content |
| `.cortex/journal.jsonl` | Every change to your cortex, with who made it; notes, sessions, saves | No: it is the cortex's history |
| `.cortex/history/` | Every earlier version of every part of your cortex | No |
| `.cortex/working/` | Each agent's working memory | No |
| `agents/secrets/` | Secrets, such as the token for the cortex over HTTP | No. Never read by the agent, never committed |

<a id="by-visibility"></a>

## By who can see the post

| | The original | ohm's working copy | Who ohm shows it to |
| --- | --- | --- | --- |
| Public | Your account, in the open | Yes | The vault API serves only you; published records are public at your PDS |
| Friends | Your folder, once connected | Yes | Only you for now; friends-only delivery is planned |
| Private | Your folder, once connected | Yes | Only you |

<a id="reads"></a>

## What ohm can read

Everything in your workspace, private posts included. An editor and an agent need the whole of your work to be useful, so ohm holds all of it.

- ohm shows your private posts to nobody.
- ohm does not use your private posts to match you with other people.
- A private post is never written to your account on the open network. Everything there can be read by anyone.

The promise is not that ohm cannot read your posts. It is that nothing depends on ohm keeping them.

<a id="folder"></a>

## With and without a folder

With an up-to-date synced folder, you have a copy of your posts. Until you sync or export, ohm may hold the only copy of private and friends-only posts. [Sync with a folder](https://docs.ohmmmm.com/sync.md)

<a id="identity"></a>

## Your identity

Your identity is your own. It is an AT Protocol account, and its name can be your domain. Your follows are kept there too. [Sign in](https://docs.ohmmmm.com/sign-in.md#identity)

---
ohm is in development. These docs cover the implementation and the work still planned. Built does not mean verified on the live service; see Status and limits.
All pages: https://docs.ohmmmm.com/llms.txt
