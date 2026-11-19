# Your vault as files

In a vault folder, every block, channel and entity is a Markdown file, and a source is a small folder of its own. A post is a block with a visibility, in the folder of its label.

<a id="folder"></a>

## The folder

```
Vault/
├── writings/                         a channel; for posts, the label
│   ├── _channel.md                   the channel itself: its title and order
│   ├── collisions/                   a channel inside it; for posts, the sublabel
│   │   └── trap-of-independency.md   a post
│   └── why-i-started-ohm.md
├── analytics/
│   ├── churn-query.md                a block about a query
│   └── churn.sql                     the query itself
├── _entities/person/ada-lovelace.md  an entity
├── _sources/<id>/source.json         a source you captured
├── .vault/                           the vault's own files: configuration and index
└── loose-thought.md                  no folder: a post here is filed under other
```

Folders whose names start with `_` or `.` hold things that are not blocks. Obsidian and other editors see blocks and channels, and can ignore the rest.

<a id="file"></a>

## One post

```
---
title: Trap of independency
date: 2026-03-01
visibility: public
---

The body, in Markdown.

![The author](https://example.com/media/author.webp)
```

The part between the two lines of dashes holds the post's properties, as plain YAML. Obsidian shows it in its own properties panel, and you can edit it there.

The `visibility` property is what makes this file a post. A file with `kind: post` is one too.

<a id="mapping"></a>

## What maps to what

For a post, the file and the workspace say the same things.

| In the file | In your workspace |
| --- | --- |
| The folder | The label: the post's home channel |
| The folder inside it | The sublabel |
| `channels` | Other channels it is in. Kept with the post, and never published |
| The file name | The slug |
| `title`, `subtitle`, `date` | The same |
| `visibility` | Who can see it. A file with none is private |
| A picture or file placed by its address or path | An attachment |
| A link to another post | A connection |
| Any other property | Kept with the post, and never published |

Each file also carries the post's permanent ID as a property. Leave it as it is: it is how a renamed or moved file is known to be the same post.

<a id="links"></a>

## Links and pictures

Both ways of writing them are read, and each file keeps whichever it was written in.

| | Standard Markdown | Obsidian |
| --- | --- | --- |
| A link to another post | `[the first essay](first-essay.md)` | `[[first-essay]]` |
| A picture | `![A wet street](street.jpg)` | `![[street.jpg]]` |

`[[first-essay|the first essay]]` links to the same post and shows your own words. [Connections](https://docs.ohmmmm.com/connections.md#links)

<a id="block"></a>

## A block that is not a post

A block has no `visibility`. It says what it is with `kind` when the vault would guess otherwise, and where its original lives with `origin`.

```
---
kind: code
title: Q3 churn query
channels: [sql-snippets]
origin: ~/work/queries/churn.sql
---

What I used for the board review.

![[churn.sql]]
```

The query itself can sit beside the block, as `churn.sql`, or stay where it is, named by `origin`. [Blocks and channels](https://docs.ohmmmm.com/blocks-and-channels.md#properties)

<a id="channel"></a>

## A channel

A folder is a channel. A `_channel.md` inside it describes the channel; you only need one when there is something to say.

```
---
title: Writings
kind: collection
order: [why-i-started-ohm, writings/collisions]
---

Essays, finished and not.
```

`order` names blocks by slug and channels by path. What it leaves out follows, newest first.

<a id="entity"></a>

## An entity

An entity is a file in `_entities/`, in a folder for its kind: `person`, `work`, `place` or `org`.

```
_entities/person/ada-lovelace.md
---
name: Ada Lovelace
aliases: [ada]
---

Wrote the first published program.
```

`@ada` in any block mentions her.

<a id="source"></a>

## A source

A source is a folder in `_sources/`, named by its ID. Its `source.json` says what it is (`page`, `post`, `file`, `image`, `video`, `audio`, `thread`, `book` or `other`), its address, title and author, when it was published and captured, and how much of it is kept. Its extracted text and the original can sit beside it. A block names it with `from`.

<a id="exact"></a>

## Nothing is lost on the way

A post written out as a file and read back is the same post. That holds for titles and text in any script, and for text that YAML would otherwise misread.

The same holds for every block, channel, entity and source: the vault reads your files and writes them back exactly as it found them, so a file changes only when you change it.

What only a machine needs, such as a file's size, dates and content address, is never written into your files. It is kept in `.vault/index.sqlite`, which can always be rebuilt. [Other folders and the index](https://docs.ohmmmm.com/roots-and-index.md#written)

---
ohm is in development. These docs cover the implementation and the work still planned. Built does not mean verified on the live service; see Status and limits.
All pages: https://docs.ohmmmm.com/llms.txt
