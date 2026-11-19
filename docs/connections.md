# Connections

A connection says that one thing in your vault relates to another. Every connection is evidence: something your content shows, made by you when you write and file. A model never draws one.

<a id="why"></a>

## Why connections are yours

Two blocks belong together because you put them together: you filed them in one channel, linked one from the other, or quoted the same source. That is something anyone can check by reading your files, and it stays true until you change them.

What an agent concludes about your blocks is different. It may be useful, and it may be wrong. So it is never stored as a connection. It is kept in your cortex, as a note or a memory that points at the blocks it was drawn from, and your blocks are not changed by it. [The graph](https://docs.ohmmmm.com/graph.md)

<a id="kinds"></a>

## The kinds of connection

The vault draws a connection only where your content shows one, and records where it found it.

| Connection | Comes from |
| --- | --- |
| A channel contains a block | The block's folder, or its `channels` list |
| A channel contains a channel | A folder inside a folder |
| A block links to something | A double-bracket link, a `[words](https://…)` link, or a post's `connect` list |
| A block embeds something | `![[churn.sql]]`, or `![[another-block]]` |
| A block mentions an entity | `@ada`, matched to an entity's slug, name or aliases |
| A block is from a source, or quotes it | Its `from` and `excerpt` properties |

A link to something the vault does not have is kept as missing, not dropped, so you can see what you meant to write. Anything inside code is never a connection: an example of a link in a code block stays an example.

<a id="links"></a>

## Links in the text

Write another block's slug in double brackets, and your words become a connection.

- `[[bridge-at-dusk]]` links to the block whose slug, path, file name or title is `bridge-at-dusk`, or failing that, an entity of that name.
- `[[bridge-at-dusk|that bridge]]` links to the same block and shows your words in its place.
- `[the essay](https://example.com/essay)` links to a page on the web, and an `at://` address links to a record on the network.

These are the same links Obsidian reads, so a vault folder opened there shows them as links. Two blocks with the same slug make a double-bracket link ambiguous, and the vault tells you so.

<a id="connect"></a>

## A post's connect list

A post can also carry a `connect` list: up to 32 other posts or web pages it follows from, such as the essay it replies to or the last part of a series.

When the post is published, each entry becomes an address in the record's `connect`. Only a public post can be linked from a published one: a public post that connects to a private one does not show the private post's title, or that it exists, to anyone who cannot read it. [Posts](https://docs.ohmmmm.com/posts.md#connections)

<a id="index"></a>

## What the index finds

`vault index` reads every block and keeps every connection in `.vault/index.sqlite`, with the line it was found on, or the property it came from.

```
npx github:haeinej/ohm-vault vault inspect churn-query
```

`vault inspect` shows one block with what links to it and what it links to, besides where its original is and its size. Nothing is written into your files. [Other folders and the index](https://docs.ohmmmm.com/roots-and-index.md#index)

<a id="not"></a>

## What a connection is not

- **Not a guess.** If an agent sees that two blocks belong together, it writes a note or a memory in your cortex that cites both, and it may suggest the connection to you in words. If you agree and connect them, the connection is yours, like any other.
- **Not a tag.** A `#tag` is indexed for search, and is not a connection.
- **Not shared on their own.** Connections live in your files and your index. Only what a published post links to goes out, with the post, as addresses in its record.

<a id="designed"></a>

## Designed for the workspace

Making connections in the workspace is designed in the ohm-ux wireframe and **not built in the live editor**. In the live editor today, a link is Markdown you type.

- **Connect selected words.** Select words inside one paragraph, choose Connect, find a block, and the words become `[[slug|the words]]`.
- **Connect whole blocks.** From a block's connections card, + Connect finds another block and connects the two, with an optional line on why. The vault folder's format does not yet have a place for a whole-block connection or its why.
- **Pull a line.** Press the dot at the end of a block's row and pull a line to another block.
- **The connections card.** The graph around a block, the channels it sits in, and its connections in both directions, each saying where it was read: in the text, with the linked words, or on the whole block, with its why.
- **Read-only when shared.** On a block others can see, connections are read only, as its text is.

No agent tool makes a connection in this design either. [History](https://docs.ohmmmm.com/history.md#designed)

---
ohm is in development. These docs cover the implementation and the work still planned. Built does not mean verified on the live service; see Status and limits.
All pages: https://docs.ohmmmm.com/llms.txt
