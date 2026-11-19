# Blocks and channels

A block is one unit of thought, and a channel is an ordered collection of blocks. A block can sit in many channels; the first one, its home, gives it its address when you publish it as a post.

<a id="why"></a>

## Why blocks and channels

Until now a vault held one kind of thing: posts, each filed under one label. That is enough for a website, but not for thinking. An article you saved, the passage you kept from it, a SQL query, a PDF on Google Drive and your own half-formed idea all had to be a post, and each could sit in only one place.

A vault now holds **blocks**, arranged in **channels**, the way Are.na arranges things. **Sources** keep what came in from outside as it was, and **entities** are the people, works, places and organisations many blocks are about. Your posts are blocks too, so nothing you already have changes.

<a id="today"></a>

## Where this works today

| Where | What it holds |
| --- | --- |
| A vault folder on your computer | Blocks of every kind, channels, sources and entities, as Markdown files. Read and indexed by the `vault` command. [Other folders and the index](https://docs.ohmmmm.com/roots-and-index.md) |
| The workspace and the vault service | Posts only. A post is filed under a label and sublabel, which are its home channel |

Agent tools for the vault folder are planned and not built. Blocks of other kinds are not stored by the vault service. [Status and limits](https://docs.ohmmmm.com/limits.md#status)

<a id="blocks"></a>

## Blocks

A block is a Markdown file. What it is, its **kind**, is one of these.

| Kind | What it is | Read as this when |
| --- | --- | --- |
| `text` | Your own writing | Nothing else fits |
| `excerpt` | Words you kept from a source | You say so |
| `link` | A web address, and what you said about it | The block is one address |
| `media` | A picture, video or recording | The block is one embedded media file |
| `file` | A PDF, a spreadsheet, any other file | The block is one embedded file |
| `code` | A query, a script, a notebook | The block is one fenced code block |
| `post` | A block with a visibility, published or ready to be | It has a `visibility` property |

You rarely write the kind yourself: the vault works it out from what the block contains. Write it when you mean something else.

The vault never runs code. SQL, Python or any other code sits in a fenced block with its language, and Obsidian's links, embeds, callouts, Mermaid diagrams and math keep working.

<a id="properties"></a>

## What a block says about itself

Properties sit at the top of the file, between two lines of dashes. Each is optional.

| Property | What it says |
| --- | --- |
| `kind` | What the block is, when the vault would guess otherwise |
| `title` | A name that helps you recognise it |
| `slug` | The name other blocks link to it by. The file name, unless you say otherwise |
| `channels` | Every channel it is in besides its folder |
| `origin` | Where the original lives, when it is not this file: a path on your computer, a Google Drive path, a web address or an AT URI |
| `from`, `excerpt` | The source it was captured from, and the exact words kept from it |
| `tags` | Words to find it by |
| `by` | Who made it: `me`, or `agent:<name>` |
| `status` | `proposed`, `kept` or `archived` |
| `intent` | Who you mean it for if you publish it: `private`, `friends` or `public`. It shares nothing |
| `created`, `updated` | When |

A block also gets an ID once, which never changes. Renaming or moving a file does not make it a different block.

<a id="channels"></a>

## Channels

A folder is a channel, and a folder inside it is a channel inside that one. Every folder that holds a block is a channel, whether or not you describe it.

To describe a channel, put a `_channel.md` in its folder.

- **Its body** is the channel's description.
- **`title`** is its name, when the folder name is not enough.
- **`kind`** is `collection`, `concept`, `inbox` or `import`.
- **`order`** lists what comes first, by block slug or channel path. Everything it does not list follows, newest first.

Each channel keeps its own order, so a block can be first in one channel and last in another.

<a id="many"></a>

## One block, many channels

A block's folder is its **home channel**. To put it in more channels, list them:

```
---
kind: code
title: Q3 churn query
channels: [sql-snippets]
origin: ~/work/queries/churn.sql
---

What I used for the board review. It joins on account_id, not user_id, because of the merge.

![[churn.sql]]
```

This block lives in `analytics/` and is also in `sql-snippets`. Nothing is copied: it is one block, listed in two channels. A channel named in `channels` must be a folder in the vault; if it is not, the vault says so.

<a id="home"></a>

## The home channel and the address

When a block is published as a post, its home channel gives it its address on your site.

```
writing/collisions/ep-01.md   ->   /posts/writing/collisions/ep-01
```

- **The first folder is the post's label,** and the folder inside it is its sublabel. That is all a label is: a post's home channel, under the name your site uses for its sections. [Labels](https://docs.ohmmmm.com/labels.md)
- **Other channels do not change the address.** Listing `channels` on a post leaves where it is published as it was.
- **A post sits at most two folders deep:** its label, and a sublabel inside it.
- **Moving a post out of its home channel changes its address,** at the next Publish, which shows you the new address first.

<a id="sources"></a>

## Sources

A source is something that came in from outside, kept as it was: a page, a post, a file, an image, a video, a recording, a thread, a book. It lives in its own folder, `_sources/<id>/`, with a `source.json` that says what it is, where it came from and when it was captured, beside any extracted text or the original.

A block names its source with `from`, and keeps the exact words it quotes in `excerpt`. The source stays as it was, so a block that quotes it can always be checked against it.

<a id="entities"></a>

## Entities

An entity is a person, a work, a place or an organisation that many blocks are about. Each is a file in `_entities/person/`, `_entities/work/`, `_entities/place/` or `_entities/org/`, with a `name`, other names in `aliases`, and an optional `uri`.

Writing `@ada` in a block mentions the entity whose slug, name or alias is `ada`. The mention is a connection the index records. [Connections](https://docs.ohmmmm.com/connections.md#kinds)

<a id="posts"></a>

## Posts are blocks

A post is a block you publish. In the folder it is a block of kind `post`: it has a `visibility`, and it is read and written exactly as before. When it is published it is a `com.ohmmmm.post` record in your own account, unchanged.

| In the vault folder | In the workspace | On your site |
| --- | --- | --- |
| The folder `writing/collisions` | Label `writing`, sublabel `collisions` | The section `/posts/writing/collisions/` |
| The file `ep-01.md` | The post's slug | `/posts/writing/collisions/ep-01` |
| `channels: [slowness]` | A property, kept and never published | Nothing |
| `visibility: public` | Marked for everyone | Shown after you publish |

[Posts](https://docs.ohmmmm.com/posts.md) · [Posts as files](https://docs.ohmmmm.com/files.md)

---
ohm is in development. These docs cover the implementation and the work still planned. Built does not mean verified on the live service; see Status and limits.
All pages: https://docs.ohmmmm.com/llms.txt
