# Data model

A post maps to a vault row, a public repository record and a Markdown file. The service stores posts and account links, and nothing else; a vault folder holds blocks, channels, sources and entities, and a cortex keeps its journal.

<a id="post"></a>

## A post in the vault

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | String, 13 characters | Permanent identifier, generated once by whichever client creates the post |
| `slug` | String | The last segment of the post's address. Mutable. Unique within a vault |
| `label`, `sublabel` | String | Where the post is filed, in the author's own words |
| `visibility` | `public`, `friends` or `private` | Who the post is for. A new post is `private` |
| `title`, `subtitle` | String, optional | |
| `date` | Timestamp, optional | When the post is from. A mirrored post keeps its original date |
| `body` | Markdown | As the author wrote it |
| `connect` | List, up to 32 | Other posts or web pages this post follows from |
| `address` | URL, optional | The post's address on the author's site, when it is not the one its label and slug give |
| `source` | Object, optional | Where the post first appeared, if elsewhere: platform, address, and the platform's own ID |
| `site` | Object, optional | Fields of the author's own site, outside the shared schema |
| `properties` | Object | Anything else the author gave it. Stored, and never published |

<a id="identifiers"></a>

## Identifiers and versions

| | Form | Purpose |
| --- | --- | --- |
| Post ID | 13 characters that sort by creation time, in the form the AT Protocol uses for record keys | Identity. Renaming or refiling a post does not change it. It is also the record key when the post is published |
| Version | `v` followed by a SHA-256 digest of the post's content | Concurrency control. Every write names the version it replaces. A mismatch is refused with `Changed` and the current version |
| Sequence | A counter per vault, advanced by every change | Incremental sync. `listPosts` with `since` returns only what changed after a cursor, removals included |

A removed post keeps its row with no version, so a client that asks what changed is told that it went.

<a id="record"></a>

## The published record

A public post is one record of type `com.ohmmmm.post` in the member's repository, stored under the post's ID. The schema is fixed and the same on every site.

| Field | Type | Meaning |
| --- | --- | --- |
| `body` | String, required | CommonMark with footnotes. `media:ID` as an image destination places an attachment |
| `publishedAt` | Datetime, required | |
| `canonicalUrl` | URI, required | The post's address on the author's website |
| `title`, `subtitle` | String | |
| `updatedAt` | Datetime | When the post last changed after it was published |
| `slug` | String | The last segment of the address |
| `label`, `sublabel` | String | Free-form, as the author named them |
| `form` | String | The kind of object, derived from the content: `writing`, `note`, `image`, `gallery`, `video`, `audio`, `file`, `media`, `link`, `embed`, `quote`, `list`, `code` or `other` |
| `connect` | List of URIs | AT URIs or web addresses of what the post follows from |
| `link` | Object | For a link or embed: the page as it described itself |
| `source` | Object | Where the post first appeared, if not on the author's site |
| `media` | List | Attachments, each with an ID unique within the post |
| `site` | Object | Site-specific data, namespaced by its own `$type` |

`visibility` and `properties` are not part of the record. A post that is not public has no record.

<a id="attachments"></a>

## Attachments

An entry in `media` is an image, a video, an audio recording or a file. Each carries a `file`, which is a blob stored in the member's repository, and may carry `sourceUrl`, the address the original came from.

| Kind | Accepts | Additional fields |
| --- | --- | --- |
| `image` | `image/*` | `alt`, `caption`, `width`, `height` |
| `video` | `video/*` | `poster`, `caption`, `durationMs` |
| `audio` | `audio/*` | `caption`, `durationMs` |
| `file` | `application/*`, `text/*` | `caption` |

In the vault, a post references its attachments by address. The copy in the repository is made when the post is published. [Mirror and publish](https://docs.ohmmmm.com/protocols.md#attachments)

<a id="mapping"></a>

## From vault to record

| In the vault | In the record |
| --- | --- |
| `id` | The record key |
| `label`, `sublabel`, `slug` | The same fields, and `canonicalUrl`: `/posts/<label>/<sublabel>/<slug>` on the member's site, lowercased and hyphenated |
| `date` | `publishedAt`. A post with no date is dated when it is first published and keeps that date |
| The content of `body` | `form`, derived |
| A link to another post | An entry in `connect`, as that post's address. Only a public post can be linked from a published one |
| `visibility`, `properties` | Not published |

<a id="storage"></a>

## Storage

The service stores posts and account links in two tables.

| Table | Key | Holds |
| --- | --- | --- |
| `posts` | Account DID and post ID | The post as JSON, its version and sequence, and indexed copies of the fields the repository tree is drawn from |
| `links` | ohm user ID, with the DID unique | Which AT Protocol account an ohm account works in, and when its published posts were first mirrored |

The database enforces unique keys and conditional updates.

<a id="nodes"></a>

## Vault folder nodes

A vault folder is read as four kinds of node by [vault/node.mjs](https://github.com/haeinej/ohm-vault/blob/main/vault/node.mjs), which is pure: callers pass `{ path, text }` and write what they get back. The lexicons in `lexicons/com/ohmmmm/vault/` (`block`, `channel`, `entity`, `source`, all keyed by TID) describe file contents; none is written to a PDS.

| Node | Path | Fields |
| --- | --- | --- |
| Block | `<folders>/<name>.md` | `kind`, `title`, `slug`, `channels`, `origin`, `from`, `excerpt`, `tags`, `by`, `status`, `intent`, `created`, `updated`; the body |
| Channel | `<folders>/_channel.md`, or any folder holding a block | `title`, `kind`, `order`, `site`; the body is the description |
| Entity | `_entities/<kind>/<name>.md` | `name`, `aliases`, `uri`; `kind` from the folder |
| Source | `_sources/<id>/source.json` | `kind`, `uri`, `platform`, `platformId`, `title`, `author`, `publishedAt`, `capturedAt`, `retain`, `meta` |

The values each kind of field allows:

| Values | Allowed |
| --- | --- |
| Block `kind` | `text`, `excerpt`, `link`, `media`, `file`, `code`, `post` |
| Channel `kind` | `collection`, `concept`, `inbox`, `import` |
| Entity kind | `person`, `work`, `place`, `org` |
| Source `kind` | `page`, `post`, `file`, `image`, `video`, `audio`, `thread`, `book`, `other` |
| `retain` | `reference`, `text`, `full` |
| `status` | `proposed`, `kept`, `archived` |
| `intent` | `private`, `friends`, `public` |

A block's folder is its home channel. A file with `kind: post`, or with no `kind` and a `visibility`, is read and written by the unchanged post code, so it keeps its version and syncs as before; `channels` is stored as an ordinary post property. Unknown properties are kept. IDs are 13-character TIDs, given once; a node without one is keyed by its path until it has one. `readNode(nodeFile(n))` gives back `n` for any node that was read, and problems come back as sentences rather than errors.

<a id="edges"></a>

## Evidence edges

`evidence(vault)` returns `{ kind, from, to, at }` for each edge, from content alone.

| Kind | From |
| --- | --- |
| `contains` | A block's folder or `channels` list; a folder inside a folder |
| `links` | A double-bracket link, a web or `at://` link, a post's `connect` |
| `embeds` | `![[file]]` or `![[block]]` |
| `mentions` | `@handle`, matched to an entity's slug, name or aliases |
| `from`, `quotes` | A block's `from` and `excerpt` |

`at` is a body line number, or the property the edge came from. A target is a node key, `url:`, `at:`, `file:<name>`, or `missing:<as written>`. Fenced code, inline code and e-mail addresses are skipped. Inference has no edge kind here: it is a cortex node that cites a block as `{node, version}`.

<a id="index"></a>

## The index

`.vault/index.sqlite`, written only by `scan` in [vault/indexer.mjs](https://github.com/haeinej/ohm-vault/blob/main/vault/indexer.mjs), holds the tables `meta`, `files`, `nodes`, `edges`, `terms` and `problems`. It is derived data: a different index version drops and recreates it, a damaged file is set aside and recreated, and nothing in it is the only copy of anything. A file is reread only when its inode, size, modified time or changed time moves, and addressed by a CIDv1 of its bytes; a `reference` root is never opened and has no address. Search uses its own word table with character bigrams for Korean, Japanese and Chinese. [The agent reference](https://github.com/haeinej/ohm-vault/blob/main/docs/agents/vault-format.md) has the full contract.

<a id="journal"></a>

## The cortex journal

ohm-cortex keeps one append-only file, `.cortex/journal.jsonl`. Every line has `seq`, a unique `id`, `at`, `actor` (`{kind: "human" or "agent", name}`), sometimes `session`, and a `type`.

| `type` | Holds |
| --- | --- |
| `change` | `node`, `op` (create, update, remove, restore), `before` and `after` versions, `reason`, `evidence`; `proposedBy` for a confirmed identity fact or an approved skill |
| `note` | One observation, with `evidence`. Changes no file |
| `settled` | What became of a note |
| `session` | `summary`, `outcome`, `made` (change IDs), `project`, `deadEnds` (`tried`, `why`, `check`), `resolved` |
| `save` | A name and a note. Changes nothing |

Nodes are named `identity`, `playbook`, `memory/<name>`, `working/<agent>`, `skill/<name>`, `tool/<name>` and `channel/<path>`. Earlier versions are kept in `.cortex/history/` by version hash. Evidence pointers are `{node, version}` or `{session}`. Lines are ordered by time, then ID, so two machines' journals join by union. Older `proposal` and `decision` lines are read and change nothing. No line records what an agent read.

---
ohm is in development. These docs cover the implementation and the work still planned. Built does not mean verified on the live service; see Status and limits.
All pages: https://docs.ohmmmm.com/llms.txt
