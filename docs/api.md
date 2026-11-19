# Service API

The vault service registers 37 requests in 10 capabilities. This reference is generated from the tables the service runs on.

<a id="conventions"></a>

## Conventions

The vault service speaks XRPC, the request convention of the AT Protocol. Every request has a namespaced name and is sent to `/xrpc/` followed by that name.

| | |
| --- | --- |
| Base addresses | `https://vault.ohmmmm.com`, and `https://app.ohmmmm.com/vault` for the workspace, where the ohm session cookie is in scope |
| Reads | `GET`, with parameters in the query string |
| Changes | `POST`, with parameters as a JSON body |
| Responses | JSON, sent with `Cache-Control: private, no-store`. `getAttachment` answers with the file itself |
| Idempotency | Versioned writes name the version replaced; identical retries are safe. A multi-request tool can partially complete, so reread state before retrying after a failure |
| Authentication | A service token from the member's PDS in `Authorization: Bearer`, or an ohm session. [Identity and access](https://docs.ohmmmm.com/identity.md) |

The access level of each request is one of four.

| Access | Credential |
| --- | --- |
| Public | None. The response contains only public information |
| Any authenticated account | A service token from any PDS, issued for this request |
| Member | A service token from the member's own PDS, or an ohm session connected to that account |
| Member, with an ohm session | An ohm session only. A change must also originate from ohm's own pages |

<a id="posts"></a>

## Posts

Read and change the posts in a vault, one at a time. Every change names the version it replaces, so two edits never overwrite each other unseen.

### `com.ohmmmm.vault.listPosts`

Every post with the version it is at. With `since`, a point an earlier list returned, only what changed after it, removals included.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `since`: optional: the `cursor` of an earlier list |
| Returns | `posts` (id, version, slug, label, sublabel, visibility, title), `cursor`, and `more` when there is another page |

### `com.ohmmmm.vault.getPost`

One post in full, and its version.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `id`: the post's ID |
| Returns | `post`, `version` |

### `com.ohmmmm.vault.putPost`

Saves one post. `replaces` is the version being replaced and is left out for a new post. Sent twice, it ends the same as sent once. Whatever the post says about who may see it, only this copy changes.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `post`: the whole post<br>`replaces`: optional: the version it replaces |
| Returns | `id`, `version`, and `unchanged` when nothing differed |

### `com.ohmmmm.vault.deletePost`

Removes one post, for good.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `id`: the post's ID<br>`replaces`: the version being removed |
| Returns | `id`, `removed` |

<a id="friends"></a>

## Friends

The friends layer: friends-only blocks, kept readable so the friends a member chose can read them, and the friend list that says who they are. A friend reads friends-only posts and blocks alike. Private blocks are never kept here.

### `com.ohmmmm.vault.listBlocks`

Every friends-only block that is not a post, with the version it is at. With `since`, a point an earlier list returned, only what changed after it, removals included.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `since`: optional: the `cursor` of an earlier list |
| Returns | `blocks` (id, version, path, kind, title), `cursor`, and `more` when there is another page |

### `com.ohmmmm.vault.getBlock`

One friends-only block, as the file it is in the member's folder, and its version.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `id`: the block's ID |
| Returns | `block` (id, path, text), `version` |

### `com.ohmmmm.vault.putBlock`

Saves one friends-only block, as its file: its path in the folder and its text, which must say `visibility: friends`. A private or public block, or a post, is refused. `replaces` is the version being replaced and is left out for a new block. Sent twice, it ends the same as sent once. From then on the friends on the list can read it.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `block`: `id`, `path` and `text`<br>`replaces`: optional: the version it replaces |
| Returns | `id`, `version`, and `unchanged` when nothing differed |

### `com.ohmmmm.vault.deleteBlock`

Removes one friends-only block from this layer, for good. Friends can no longer read it.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `id`: the block's ID<br>`replaces`: the version being removed |
| Returns | `id`, `removed` |

### `com.ohmmmm.vault.listFriends`

Who may read the member's friends layer.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | None |
| Returns | `friends` (did, added) |

### `com.ohmmmm.vault.addFriend`

Lets one more DID read the member's friends layer: every friends-only post and block, now and later. Only the member, signed in to ohm, can add a friend; an agent cannot.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member, with an ohm session |
| Parameters | `did`: the friend's DID |
| Returns | `did`, and `unchanged` when they were a friend already |

### `com.ohmmmm.vault.removeFriend`

Stops one DID reading the member's friends layer. What they read before cannot be taken back.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `did`: the friend's DID |
| Returns | `did`, `removed`, and `unchanged` when they were not a friend |

### `com.ohmmmm.vault.listShared`

What another member shares with the asker: their friends-only blocks and posts, when the asker is on their friend list. To anyone else it answers NotFound, whether or not anything is there.

| | |
| --- | --- |
| Method | `GET` |
| Access | Any authenticated account |
| Parameters | `owner`: the DID whose friends layer to read |
| Returns | `owner`, `blocks` (id, version, path, kind, title) |

### `com.ohmmmm.vault.getShared`

One friends-only block or post another member shares with the asker, as its file.

| | |
| --- | --- |
| Method | `GET` |
| Access | Any authenticated account |
| Parameters | `owner`: the DID whose friends layer to read<br>`id`: the block's or post's ID |
| Returns | `block` (id, path, text), `version` |

<a id="private"></a>

## Private

The private layer: private blocks, kept only as ciphertext sealed on the member's devices. The service stores and syncs them and cannot read them; no friend or agent can be given their contents by the service. Each is `{ id, ciphertext, version }`, with an opaque ID and compare-and-swap on the version. Several change together or not at all; every version is kept for restoring; the journal is sealed too; and a key rotation re-wraps every kept version and journal entry.

### `com.ohmmmm.vault.listPrivateBlocks`

Every private block, by opaque ID, with its version, size and the generation of the master key that wraps its key. With `since`, only what changed after an earlier list, removals included. With `below`, only blocks wrapped by an older generation than that, for finishing a key rotation.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `since`: optional: the `cursor` of an earlier list<br>`below`: optional: a generation |
| Returns | `blocks` (id, version, generation, size), `cursor`, and `more` when there is another page |

### `com.ohmmmm.vault.getPrivateBlock`

One private block's ciphertext and version. Only the member's devices can open it.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `id`: the block's opaque ID |
| Returns | `id`, `ciphertext`, `version` |

### `com.ohmmmm.vault.putPrivateBlock`

Saves one private block's ciphertext. Anything that is not a sealed file is refused, so readable text is never kept, and so is a block sealed under an older master key than a rotation started. `replaces` is the version being replaced and is left out for a new block. Sent twice, it ends the same as sent once.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `block`: `id` and `ciphertext` (the sealed file)<br>`replaces`: optional: the version it replaces<br>`journal`: optional: a sealed journal entry describing the change |
| Returns | `id`, `version`, `rev` (the kept version it made), and `unchanged` when nothing differed |

### `com.ohmmmm.vault.putPrivateBlocks`

Changes several private blocks together, all or none, as moving a block between channels changes the block and two channel files. Each change is a write (`id`, `ciphertext`, `replaces`) or a removal (`id`, `remove: true`, `replaces`); one stale version, or one block sealed under a key older than a rotation started, refuses them all. `batchId` makes it safe to send again: a repeat answers what the first did and changes nothing.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `changes`: the changes, 1 to 100<br>`batchId`: a key the device makes for this batch<br>`journal`: optional: a sealed journal entry describing them |
| Returns | `blocks` (id, version and rev, or removed), and `replayed` for a repeat |

### `com.ohmmmm.vault.listPrivateVersions`

A private block's kept versions, newest first, each by a `rev` that never changes. The device opens one to show or restore it; restoring is a new change.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `id`: the block's opaque ID |
| Returns | `id`, `versions` (rev, version, generation, size, created) |

### `com.ohmmmm.vault.getPrivateVersion`

One kept version of a private block, as ciphertext.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `id`: the block's opaque ID<br>`rev`: the version's rev |
| Returns | `id`, `rev`, `version`, `ciphertext` |

### `com.ohmmmm.vault.listPrivateJournal`

The private layer's journal: sealed entries, oldest first, after `since`. Only the member's devices can read what each says.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `since`: optional: the `cursor` of an earlier list |
| Returns | `entries` (seq, entry, created), `cursor`, and `more` when there is another page |

### `com.ohmmmm.vault.beginPrivateRotation`

Starts a rotation of the member's master key to generation `target`, as the private store sees it: from now on a block sealed under an older generation is refused. The re-wrap happens on the member's device. The same target again changes nothing.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `target`: the generation being rotated to |
| Returns | `target`, `state`, `remaining` (blocks still below it), and `unchanged` when it was already started |

### `com.ohmmmm.vault.getPrivateRotation`

The member's latest key rotation, and how many private blocks are still below its target, so any device can resume it.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | None |
| Returns | `rotation` (target, state, remaining, started, finished) or null |

### `com.ohmmmm.vault.listPrivateBelow`

What a rotation to `target` still has to re-wrap: every kept version (by block and rev) and journal entry (by seq) sealed under an older key.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `target`: the generation being rotated to |
| Returns | `target`, `versions` (id, rev, generation), `journal` (seq, generation), and `more` when there is more |

### `com.ohmmmm.vault.rewrapPrivate`

Re-wrapped copies of kept versions and journal entries, for a rotation under way to `target`. Each must keep exactly the contents it replaces, with only its file key re-wrapped; a version that is its block's latest moves the block with it. All are kept or none. Safe to send again.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `target`: the generation being rotated to<br>`versions`: `id`, `rev`, `ciphertext` for each<br>`journal`: `seq`, `entry` for each |
| Returns | `target`, `remaining` |

### `com.ohmmmm.vault.finishPrivateRotation`

Finishes the rotation to `target`, only if no kept version or journal entry is still below it, checked in the same statement. The account deletes the old key's copies only after this.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `target`: the generation being rotated to |
| Returns | `target`, `state`, and `unchanged` when it was already finished |

### `com.ohmmmm.vault.deletePrivateBlock`

Removes one private block. Its kept versions stay, so it can be restored.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `id`: the block's opaque ID<br>`replaces`: the version being removed<br>`journal`: optional: a sealed journal entry |
| Returns | `id`, `removed` |

<a id="structure"></a>

## Structure

The shape of a vault: its labels, the sublabels inside them, and a line for each post. Enough to draw it or decide where something belongs, without reading any post in full.

### `com.ohmmmm.vault.getTree`

Labels, sublabels, and each post with who may see it, what kind of thing it is, the platform it first appeared on if that was somewhere else, and why it cannot be published, if it cannot.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | None |
| Returns | `posts`, `public`, `friends`, `private` (counts), and `labels`, each with its `posts` and `sublabels` |

<a id="search"></a>

## Search

Find posts by the words in them, at every visibility. A title counts for more than a label, and a label for more than the body.

### `com.ohmmmm.vault.searchPosts`

The posts that mention every word of `q`, best first, each with a passage that shows where.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `q`: the words to look for<br>`visibility`: optional: only posts at this visibility<br>`excludePrivate`: optional: pass 1 to search public and friends posts only<br>`limit`: optional: how many, 10 unless said, 50 at most |
| Returns | `found`, `posts` (id, slug, title, label, sublabel, visibility, date, passage), and `visibilityScope: shared` when private posts were excluded |

<a id="mirror"></a>

## Mirror

Bring what the member has already published on their PDS into the vault. It only reads the PDS, and it never changes a post the member has since changed in the vault.

### `com.ohmmmm.vault.importPublished`

Reads the member's repository and says what it holds as posts: how many, which would differ from what is published, and what could not be kept. With `apply`, saves them. Without it, changes nothing.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `apply`: optional: save the posts<br>`site`: optional: the member's website, when it is not the one their handle names<br>`from`: optional: one older post type to read, when it should not be found<br>`expectedSummary`: optional: the preview summary to require before saving; changed counts or caveats refuse the whole apply |
| Returns | `site`, `types`, `records`, `posts`, `sameAsPublished`, `differs`, `lost`, `cannotBePublishedYet`, `skipped`, `summary`, `applied`; and with `apply`, `saved`, `unchanged`, `changedThere`, `refused` |

<a id="publish"></a>

## Publish

Work out what would have to change in the member's own repository for what is published to match their vault. The service changes nothing there and holds no permission to: the member, signed in at their own PDS, makes the changes from the list. Only the shared post type is touched, and a record the vault knows nothing about is never removed.

### `com.ohmmmm.vault.getPublishPlan`

What publishing would do: the posts it would publish for the first time, replace and take down, the ones that cannot be published and why, and the published records the vault knows nothing about. With `prepare`, also the changes themselves, ready to be made.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `prepare`: optional: `1` to include `writes`, the changes to make |
| Returns | `repository`, `pds`, `collection`, `create`, `replace`, `remove`, `unchanged`, `cannot`, `notInVault`, `changes` (how many); and with `prepare`, `writes` and `plan`, a name for exactly these changes |

### `com.ohmmmm.vault.getAttachment`

One file that one of the member's posts places, fetched from where the post says it is. It answers with the file itself, not JSON. It is for publishing, which sends a copy of each such file to the member's PDS.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `id`: the post's ID<br>`attachment`: the name the post's record places the file under |
| Returns | The file, with its type |

<a id="export"></a>

## Export

The whole vault written out as files a person can keep: each post as Markdown, where it sits in a folder. The same files open in Obsidian, and read back as the same posts.

### `com.ohmmmm.vault.exportFiles`

Every post as a file: its path in a folder, and its text.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | None |
| Returns | `files` (path, text) |

<a id="account"></a>

## Account

For a member signed in to ohm: who they are, and which AT Protocol account their vault is. One ohm account works in one AT Protocol account, and the other way round. These ride on the ohm session only; a token from a PDS does not reach them.

### `com.ohmmmm.account.get`

Who is signed in, the AT Protocol account they connected if they have, and whether what it had published has been brought in.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member, with an ohm session |
| Parameters | None |
| Returns | `user` (name), `did`, `mirrored`, and `service`: who a PDS has to address its token to when the member connects |

### `com.ohmmmm.account.connect`

Ties an AT Protocol account to the ohm account. `token` is one the account's PDS issued for this request and nothing else.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member, with an ohm session |
| Parameters | `token`: a token from the account's PDS, issued for this request |
| Returns | `did`, and `already` when it was connected before |

### `com.ohmmmm.account.disconnect`

Unties the AT Protocol account. The vault is kept, and opens again when the account is connected.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member, with an ohm session |
| Parameters | None |
| Returns | `did`, now empty |

<a id="identity"></a>

## Identity

The first steps of signing in: finding an account from its handle, and saying who a token from a PDS names. Neither touches a vault.

### `com.ohmmmm.identity.findAccount`

Finds an account from what a person types to sign in: their handle, or their DID. Needs no sign-in, and answers only with what is public.

| | |
| --- | --- |
| Method | `GET` |
| Access | Public |
| Parameters | `account`: a handle, such as example.com, or a DID |
| Returns | `did`, `handle`, `pds`, and `service`: this service's own DID |

### `com.ohmmmm.identity.whoAmI`

Says who a token from a PDS names. The token has to be issued for this request and nothing else, so only its holder can ask.

| | |
| --- | --- |
| Method | `GET` |
| Access | Any authenticated account |
| Parameters | None |
| Returns | `did`, and `handle` when the handle points back to the account |

<a id="errors"></a>

## Errors

A refusal is JSON with an `error` code from the table below and a `message` written to be shown to a person as it is.

| Error | Status | Cause |
| --- | --- | --- |
| `SignInRequired` | 401 | The request rides on an ohm session, and there is none |
| `AccountChanged` | 409 | The authenticated DID differs from X-Ohm-Did, the member displayed by the editor. Reopen before reading or changing content |
| `AuthRequired` | 401 | The token is missing, cannot be read, was issued for another request or service, has run out, or its signature does not match |
| `NotAMember` | 403 | The account has not been let in yet |
| `WrongOrigin` | 403 | A request that changes something came with a session but not from ohm's own pages |
| `NotConnected` | 409 | The ohm account has no AT Protocol account connected yet |
| `AlreadyConnected` | 409 | The ohm account already works in another AT Protocol account |
| `ConnectedElsewhere` | 409 | The AT Protocol account is already connected to another ohm account |
| `SignInUnavailable` | 503 | ohm's sign-in could not be reached to check a session |
| `MethodNotFound` | 404 | There is no such request |
| `WrongMethod` | 405 | The request is the other of GET and POST |
| `InvalidRequest` | 400 | The request is not JSON, or something it says is not what that request takes |
| `InvalidPost` | 400 | The post is not one the vault can hold. The message lists every reason |
| `InvalidBlock` | 400 | The block is not one the layer can hold: for the friends layer, it is private or public, a post, or its file has problems; for the private layer, it is not a sealed file under an opaque ID. The message says why |
| `InvalidCursor` | 400 | `since` is not a value an earlier list returned |
| `NotFound` | 404 | There is no such post, block or saved version, or nothing there is shared with the asker |
| `Changed` | 409 | The post, block or private block has changed since the version the request names. The answer carries the current version |
| `SlugTaken` | 409 | Another post in the vault already has that slug |
| `PathTaken` | 409 | Another block in the friends layer is already at that path |
| `OlderKey` | 409 | The private block is sealed under an older master key than the member is rotating, or rotated, to |
| `NoRotation` | 409 | No rotation to that generation is under way |
| `RotationAhead` | 409 | The member already rotated to a later master key than the one asked for |
| `RotationRemaining` | 409 | A rotation cannot finish while some kept versions or journal entries are still sealed under the older key. The answer says how many |
| `TooLarge` | 413 | The post or block is more than 600 KB of text, a sealed private block is more than 1 MB, or a file it places is empty or larger than 25 MB |
| `FileUnreachable` | 502 | A file a post places could not be fetched from where the post says it is |
| `AccountNotFound` | 404 | No AT Protocol account answers to that handle or DID |
| `NoRepository` | 400 | The account's DID document does not say where its repository is kept |
| `RepositoryUnreachable` | 502 | The account's PDS would not answer |
| `InternalError` | 500 | Something went wrong in the service itself |

<a id="agent-tools"></a>

## Agent tools

An agent's tools are compositions of the requests above and add no capability of their own. Each runs on the member's machine and authenticates as the member, with a service token per request.

| Tool | Effect | Requests used |
| --- | --- | --- |
| `vault_tree` | Read | `getTree` |
| `vault_list` | Read | `getTree` |
| `vault_read` | Read | `getTree`, `getPost` |
| `vault_search` | Read | `searchPosts` |
| `vault_save` | Change | `getTree`, `getPost`, `putPost` |
| `vault_set_visibility` | Change | `getTree`, `getPost`, `putPost` |
| `vault_status` | Read | `getPublishPlan` |
| `vault_publish` | Change | `getPublishPlan`, `getAttachment` |
| `vault_mirror` | Change | `importPublished` |
| `vault_delete` | Change | `getTree`, `getPost`, `deletePost` |
| `vault_friends_list` | Read | `listBlocks` |
| `vault_friends_read` | Read | `getBlock` |
| `vault_friends_save` | Change | `putBlock` |
| `vault_friends_delete` | Change | `deleteBlock` |
| `vault_friends_who` | Read | `listFriends` |
| `vault_friends_remove` | Change | `listFriends`, `removeFriend` |
| `vault_shared_list` | Read | `listShared` |
| `vault_shared_read` | Read | `getShared` |

The server that offers these tools is described in [Agent integration](https://docs.ohmmmm.com/mcp.md). Vault tools follow these rules.

1. **A new post is private.** Marking it for anyone else is a separate, confirmed step.
2. **Changes that others can see take two calls.** The first returns what would happen and a `confirm` value bound to exactly that outcome. Only a second call carrying the value proceeds.
3. **A post is changed from the version that was read.** If it has changed since, nothing is saved.

---
ohm is in development. These docs cover the implementation and the work still planned. Built does not mean verified on the live service; see Status and limits.
All pages: https://docs.ohmmmm.com/llms.txt
