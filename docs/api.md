# Service API

The vault service registers 88 requests in 16 capabilities. This reference is generated from the tables the service runs on.

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

The access level of each request is one of five.

| Access | Credential |
| --- | --- |
| Public | None. The response contains only public information |
| Any authenticated account | A service token from any PDS, issued for this request |
| Member | A service token from the member's own PDS, or an ohm session connected to that account |
| Member, with an ohm session | An ohm session only. A change must also originate from ohm's own pages |
| Public, for the member `did` names (a viewer token shows more) | None for what the member published. A viewer token from `content.view` says who is reading, and shows what they may see |

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
| Returns | `friends` (did, added, channels: `*` or a list, name, email) |

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

### `com.ohmmmm.vault.askFriend`

A member asks someone to be their friend, by the email of that person's ohm account or by their DID: signed in to ohm, or through their agent with a token from their own PDS, once their ohm account is connected and has signed in here. Asked by email, ohm also emails them an invite once, from its own address with the asker's name, replies going to the asker's email (at most 20 a day for each asker). The member sees the asker's name and email from their ohm account, and their DID, and answers in the cockpit. The answer is the same whether or not the email has an ohm account, whether asked once or again, and whether or not they already let the asker in.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `email`: the email of the person asked<br>`owner`: or: their DID<br>`message`: optional: a line for them |
| Returns | `asked` |

### `com.ohmmmm.vault.listAsked`

Who the member asked to be friends with, by the email they typed, newest first: `waiting` until that person lets them in, then `friends`. An email with no ohm account, and a request declined, both stay waiting.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | None |
| Returns | `asks` (email, asked, state, and `did` once friends) |

### `com.ohmmmm.vault.listFriendOf`

The people who let the member into their friends layer, with their name and email from their ohm account: whose shared blocks the member reads with listShared and getShared.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | None |
| Returns | `people` (did, since, name, email) |

### `com.ohmmmm.vault.listFriendRequests`

Who has asked to be the member's friend and is waiting for an answer, oldest first.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | None |
| Returns | `requests` (id, did, name, email, message, asked, state) |

### `com.ohmmmm.vault.approveFriend`

The member lets someone who asked into their friends layer, for every channel (`*`, the default) or only the channels named, each covering the channels inside it. It lasts until the member removes them. Only the member, signed in to ohm, approves; an agent cannot. The friend's own agents read with the friend's access. Sent again with the same channels, it answers the same; a request already declined, or approved for other channels, is `Answered`.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member, with an ohm session |
| Parameters | `id`: the request's ID<br>`channels`: optional: `*`, or a list of channel paths |
| Returns | `did`, `channels` |

### `com.ohmmmm.vault.declineFriend`

The member declines someone who asked. They are not told. Sent again, it answers the same; a request already approved is `Answered`.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member, with an ohm session |
| Parameters | `id`: the request's ID |
| Returns | `id`, `declined` |

### `com.ohmmmm.vault.setFriendChannels`

Changes which channels one friend sees: `*` for every channel, or a list of channel paths. Only the member, signed in to ohm.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member, with an ohm session |
| Parameters | `friend`: the friend's DID<br>`channels`: `*`, or a list of channel paths |
| Returns | `did`, `channels` |

### `com.ohmmmm.vault.listShared`

What another member shares with the asker: their friends-only blocks and posts, when the asker is on their friend list. To anyone else it answers NotFound, whether or not anything is there.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `owner`: the DID whose friends layer to read |
| Returns | `owner`, `blocks` (id, version, path, kind, title) |

### `com.ohmmmm.vault.getShared`

One friends-only block or post another member shares with the asker, as its file.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
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

<a id="visibility"></a>

## Visibility

Moves between the public, friends and private layers, by one set of rules the cockpit and the agent tools share. Every move is previewed first and journalled with who asked, who approved and why; the journal names a block by its ID only. Showing a block to more people is the member's move: an agent asks, and its request waits in the cockpit until the member answers. An agent with a write grant may start a move to private, which hides the block from friends at once; the member's device seals it when next unlocked. Public is reached only through Publish.

### `com.ohmmmm.vault.previewMove`

What moving one block to another layer would do: the action, whether it shows the block to more people, the warning, who may finish it, what it still needs (a title, to be published), and any request already waiting. A private block is named by its opaque ID with `from=private`.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `id`: the block's or post's ID<br>`to`: public, friends or private<br>`from`: optional: `private` for a sealed block |
| Returns | `id`, `from`, `to`, `action`, `widens`, `warning`, `finishes`, `via`, `needs`, `store`, `version`, `leaving`, `waiting` |

### `com.ohmmmm.vault.hideBlock`

Starts a move to private for a friends-only block or post: from now on no friend and no site reads it, and the member's device seals it into the private layer when next unlocked. The agent tools call it only with the agent's write grant on the block's channel. Sent twice, it changes nothing more.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `id`: the block's or post's ID<br>`replaces`: the version read<br>`by`: me, or agent:<name><br>`reason`: optional: why |
| Returns | `id`, `hidden` (when), and `unchanged` when it was hidden already |

### `com.ohmmmm.vault.requestMove`

An agent asks the member for a move it may not finish, such as showing a block to more people. The request waits in the cockpit until the member approves or declines it; nothing moves until then. One request waits per block and layer.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `block`: the block's ID (opaque for a private block)<br>`store`: block, post or sealed<br>`from`: its layer now<br>`to`: the layer asked for<br>`version`: optional: the version read<br>`by`: agent:<name><br>`reason`: optional: why, shown to the member |
| Returns | `request` (id, block, store, from, to, version, askedBy, reason, asked, state), and `unchanged` when one was waiting already |

### `com.ohmmmm.vault.listMoveRequests`

Agents' requests for moves, oldest first: those waiting, or those approved or declined.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `state`: optional: waiting (the default), approved or declined |
| Returns | `requests` |

### `com.ohmmmm.vault.declineMoveRequest`

The member declines an agent's request. Nothing moves. Only the member, signed in to ohm, answers a request. Declining it again changes nothing more.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member, with an ohm session |
| Parameters | `id`: the request's ID<br>`reason`: optional: why |
| Returns | `id`, `declined`, and `unchanged` when it was declined already |

### `com.ohmmmm.vault.recordMove`

The member's cockpit records a move it made, after the member approved it: a request it answers, a hidden block it sealed, or a move to or from public it handed to Publish. Only the member, signed in to ohm, records a move. Sent again with the same `moveId` (or `sealedAs`, or `request`), it changes nothing more and answers as the first time.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member, with an ohm session |
| Parameters | `block`: the block's ID before the move<br>`from`: its layer before<br>`to`: its layer after<br>`request`: optional: the request this answers<br>`sealedAs`: optional: its opaque ID in the private layer<br>`cleanupPending`: optional: true when the old copy could not be removed<br>`reason`: optional: why<br>`moveId`: optional: the cockpit's own ID for this move, so sending it again records nothing more |
| Returns | `block`, `from`, `to`, `state` (done, cleanup-pending, or previewed for Publish), `approved` with the request, and `unchanged` when this move was recorded already |

### `com.ohmmmm.vault.listMoves`

The journal of visibility moves, newest first: each block by its ID, from and to which layer, the action, how it stands, who asked, who approved and why. No titles or text.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `since`: optional: a `seq`, for only what came after it<br>`limit`: optional: up to 500 |
| Returns | `moves` (seq, at, block, from, to, action, state, askedBy, approvedBy, reason, request) |

<a id="channels"></a>

## Channels

Channels as files: each one's `_channel.md`, with its title, kind, order and description, kept readable like the friends layer. Channels can be moved with everything filed in them, and removed when empty. Private channels are sealed and kept with the private layer, never here.

### `com.ohmmmm.vault.listChannels`

Every channel kept here, with the version it is at. With `since`, a point an earlier list returned, only what changed after it, removals included.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `since`: optional: the `cursor` of an earlier list |
| Returns | `channels` (path, version, title, kind), `cursor`, and `more` when there is another page |

### `com.ohmmmm.vault.getChannel`

One channel, as its `_channel.md`, and its version.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `path`: the channel's path, such as `writing/collisions` |
| Returns | `channel` (path, text), `version` |

### `com.ohmmmm.vault.putChannel`

Saves one channel's file. A channel marked `visibility: private` is refused. `replaces` is the version being replaced and is left out for a new channel. Sent twice, it ends the same as sent once.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `channel`: `path` and `text`<br>`replaces`: optional: the version it replaces |
| Returns | `path`, `version`, and `unchanged` when nothing differed |

### `com.ohmmmm.vault.deleteChannel`

Removes one channel. Refused while a block or post is filed in it or a channel is inside it.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `path`: the channel's path<br>`replaces`: the version being removed |
| Returns | `path`, `removed` |

### `com.ohmmmm.vault.moveChannel`

Moves a channel to another path, with every channel inside it and every friends-only block filed in or listed under it, all at once or not at all. Refused while a published post is filed in it, because a post's address comes from its label: that changes through Publish.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `from`: the channel's path<br>`to`: its new path<br>`replaces`: the channel's version, or nothing for a folder with no `_channel.md` |
| Returns | `from`, `to`, and how many `channels` and `blocks` moved |

<a id="cortex"></a>

## Cortex

The cortex: what the member's agents know about them and can do, as files sealed on the member's devices. The service keeps and syncs them and cannot read them. Each is `{ id, ciphertext, version }` with an opaque ID; several change together or not at all; every version is kept; the journal of who changed what, and why, is sealed too. Agents reach the cortex through the member's device, never through the service.

### `com.ohmmmm.cortex.listFiles`

Every cortex file, by opaque ID, with its version, size and key generation. With `since`, only what changed after an earlier list, removals included. With `below`, only files wrapped by an older generation.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `since`: optional: the `cursor` of an earlier list<br>`below`: optional: a generation |
| Returns | `blocks` (id, version, rev, generation, size), `cursor`, and `more` when there is another page |

### `com.ohmmmm.cortex.getFile`

One cortex file's ciphertext and version.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `id`: the file's opaque ID |
| Returns | `id`, `ciphertext`, `version`, `rev` |

### `com.ohmmmm.cortex.putFile`

Saves one cortex file's ciphertext, with compare-and-swap on its version. Readable text, or a file sealed under a key older than a rotation started, is refused. The journal entry says, sealed, who made the change and why.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `file`: `id` and `ciphertext` (the sealed file)<br>`replaces`: optional: the version it replaces<br>`journal`: optional: a sealed journal entry |
| Returns | `id`, `version`, `rev`, and `unchanged` when nothing differed |

### `com.ohmmmm.cortex.putFiles`

Changes several cortex files together, all or none: each a write (`id`, `ciphertext`, `replaces`) or a removal (`id`, `remove: true`, `replaces`). `batchId` makes it safe to send again.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `changes`: the changes, 1 to 100<br>`batchId`: a key the device makes for this batch<br>`journal`: optional: a sealed journal entry |
| Returns | `blocks` (id, version and rev, or removed), and `replayed` for a repeat |

### `com.ohmmmm.cortex.deleteFile`

Removes one cortex file. Its kept versions stay, for restoring.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `id`: the file's opaque ID<br>`replaces`: the version being removed<br>`journal`: optional: a sealed journal entry |
| Returns | `id`, `removed` |

### `com.ohmmmm.cortex.listVersions`

A cortex file's kept versions, newest first, each by a `rev` that never changes.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `id`: the file's opaque ID |
| Returns | `id`, `versions` (rev, version, generation, size, created) |

### `com.ohmmmm.cortex.getVersion`

One kept version of a cortex file, as ciphertext.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `id`: the file's opaque ID<br>`rev`: the version's rev |
| Returns | `id`, `rev`, `version`, `ciphertext` |

### `com.ohmmmm.cortex.listJournal`

The cortex journal's sealed entries after `since`, oldest first: who changed what, and why, readable only on the member's devices.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `since`: optional: the `cursor` of an earlier list |
| Returns | `entries` (seq, entry, created), `cursor`, and `more` |

### `com.ohmmmm.cortex.listBelow`

What the member's key rotation to `target` still has to re-wrap in the cortex: kept versions and journal entries.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `target`: the generation being rotated to |
| Returns | `target`, `versions` (id, rev, generation), `journal` (seq, generation), and `more` |

### `com.ohmmmm.cortex.rewrap`

Re-wrapped copies of cortex versions and journal entries for the rotation under way. Each keeps exactly its contents; only the file key is re-wrapped. All are kept or none.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `target`: the generation being rotated to<br>`versions`: (id, rev, ciphertext)<br>`journal`: (seq, entry) |
| Returns | `target`, `remaining` across the private layer and the cortex |

<a id="media"></a>

## Media

The media cache. A picture or file in a vault is a block that saves where the file is and what it is; its bytes are sent here once, so the cockpit can show them, and can always be sent again. Public and friends-only media is sent readable under its content address and can be shown smaller; private media is sealed on the member's device first and never rendered here. Nothing here is published: publishing sends a copy to the member's PDS.

### `com.ohmmmm.media.hasMedia`

Which of the named media the cache already holds, so a device sends only what is missing.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `names`: up to 100 content addresses or sealed IDs, separated by commas |
| Returns | `present`, the names held |

### `com.ohmmmm.media.putMedia`

Sends one file's bytes, whole, as the request body (not JSON), up to 25 MB. Readable media is named by its content address, which the bytes must match; sealed media by its opaque ID, as `application/octet-stream`. Sent again, it changes nothing.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `name`: in the address: its content address (sha256-<hex>) or sealed ID<br>`body`: the bytes, with their type as Content-Type |
| Returns | `name`, `size`, and `unchanged` when it was held already |

### `com.ohmmmm.media.getMedia`

One file's bytes, as they were sent. It answers with the file itself, not JSON.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `name`: its content address or sealed ID |
| Returns | The file, with its type |

### `com.ohmmmm.media.getRendition`

A smaller copy of a readable picture to show, 160, 480, 960 or 1600 pixels wide, made once and kept. Sealed media is refused: the device renders it.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `name`: its content address<br>`width`: 160, 480, 960 or 1600 |
| Returns | The picture, with its type |

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

### `com.ohmmmm.vault.getAgenda`

What waits for the member and their curator, as counts: posts with no label of their own (`other`) and media with no alt text. Counted from the public and friends-only layers only, without reading anything with a model; the private layer and the cortex are counted on the member's device.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | None |
| Returns | `unlabelled`, `mediaWithoutAlt`, and `counted`, the layers counted |

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

Work out what would have to change in the member's own repository for what is published to match their vault. The service changes nothing there and holds no permission to: the member, signed in at their own PDS, makes the changes from the list. Only standard.site documents holding an ohm post are touched, with the member's publication made the first time; a record the vault knows nothing about is never removed.

### `com.ohmmmm.vault.getPublishPlan`

What publishing would do: the posts it would publish for the first time, replace and take down, the ones that cannot be published and why, and the published records the vault knows nothing about. With `prepare`, also the changes themselves, ready to be made.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `prepare`: optional: `1` to include `writes`, the changes to make<br>`only`: optional: one post's ID, for a preview of that post alone, as a visibility move to or from public shows it |
| Returns | `repository`, `pds`, `collection` (`site.standard.document`), `contentType` (`com.ohmmmm.post`), `publication` when it is to be made, `create`, `replace`, `remove`, `unchanged`, `cannot`, `notInVault`, `changes` (how many); and with `prepare`, `writes` and `plan`, a name for exactly these changes |

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

<a id="content-requests"></a>

## Content

Content for sites, read by the member's DID: channels become collections and blocks become entries. Anyone gets what the member published to their PDS, and nothing before they publish it. A viewer the member put on their friend list, proved by a viewer token, also gets the friends layer. A viewer who is not a friend gets exactly what anyone gets. Private content is never read. Entries leave out where a file came from and who made it. When the member's PDS cannot be reached, Friends is still served, with the last public copy and `publicStale` (when it was read), or with `publicUnavailable` when there is none.

### `com.ohmmmm.content.listChannels`

The member's channels that hold something the asker may see, or a channel inside one that does, each with its title, description, and an order naming only what the asker may see.

| | |
| --- | --- |
| Method | `GET` |
| Access | Public, for the member `did` names (a viewer token shows more) |
| Parameters | `did`: the member's DID |
| Returns | `owner`, `channels` (path, title, description, order, count) |

### `com.ohmmmm.content.getChannel`

One channel, as `listChannels` gives it. A channel with nothing the asker may see answers NotFound, as if it were not there.

| | |
| --- | --- |
| Method | `GET` |
| Access | Public, for the member `did` names (a viewer token shows more) |
| Parameters | `did`: the member's DID<br>`path`: the channel's path |
| Returns | `owner`, `channel` (path, title, description, order, count) |

### `com.ohmmmm.content.listBlocks`

What the asker may see, 200 entries at a time, without their bodies. With `channel`, only what is filed in it, in the channel's order first.

| | |
| --- | --- |
| Method | `GET` |
| Access | Public, for the member `did` names (a viewer token shows more) |
| Parameters | `did`: the member's DID<br>`channel`: optional: a channel's path<br>`cursor`: optional: the `cursor` of the page before |
| Returns | `owner`, `blocks` (id, layer, kind, slug, channel, channels, title, tags, created, updated, media, and `address` for a published post), and `cursor` when there is another page |

### `com.ohmmmm.content.getBlock`

One entry with its Markdown body. Something the asker may not see answers NotFound, the same as something that is not there.

| | |
| --- | --- |
| Method | `GET` |
| Access | Public, for the member `did` names (a viewer token shows more) |
| Parameters | `did`: the member's DID<br>`id`: the entry's ID |
| Returns | `owner`, `block`: as in `listBlocks`, with `body` |

### `com.ohmmmm.content.getMedia`

The file behind a media entry the asker may see, or a smaller copy of a picture with `width`. It answers with the file itself, not JSON.

| | |
| --- | --- |
| Method | `GET` |
| Access | Public, for the member `did` names (a viewer token shows more) |
| Parameters | `did`: the member's DID<br>`name`: the entry's `media.name`<br>`width`: optional: 160, 480, 960 or 1600 |
| Returns | The file, with its type |

### `com.ohmmmm.content.view`

Where a site sends a viewer to be recognised. If they are signed in to ohm with an AT Protocol account connected, it posts a viewer token for this one member back to the return address, which must be one of the member's sites. Otherwise it posts back `error`. The token lasts ten minutes and proves only who the viewer is; Friends is checked against the friend list on every read.

| | |
| --- | --- |
| Method | `GET` |
| Access | Public |
| Parameters | `owner`: the member's DID<br>`return`: the address on one of the member's sites to post back to |
| Returns | A page that posts `viewer` (the token) and `expires`, or `error`, to the return address |

### `com.ohmmmm.content.listSites`

The member's own sites: the only addresses a viewer token is posted back to.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | None |
| Returns | `sites` (origin, added) |

### `com.ohmmmm.content.addSite`

Adds one of the member's sites, by its https origin, so viewers can be sent back to it with a viewer token. Only the member, signed in to ohm, can add one; an agent cannot.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member, with an ohm session |
| Parameters | `origin`: the site's https address |
| Returns | `origin`, and `unchanged` when it was there already |

### `com.ohmmmm.content.removeSite`

Stops sending viewer tokens to one of the member's sites. Tokens it already holds run out within ten minutes.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `origin`: the site's https address |
| Returns | `origin`, `removed`, or `unchanged` when it was not there |

<a id="agents"></a>

## Agents

The member's coding agents: each one that used ohm's tools, what it did lately, whether the member paused or disconnected it, and the actions it waits for the member to approve in the cockpit. An agent never approves its own action.

### `com.ohmmmm.vault.agentCheckIn`

ohm's agent tools call this before every tool call: the agent is seen, its call is kept among its recent ones, and it is refused when the member paused or disconnected it.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `agent`: agent:<name><br>`tool`: the tool being called |
| Returns | `state` (active) |

### `com.ohmmmm.vault.askApproval`

An agent's tool asks the member to approve one exact plan. It waits in the cockpit's Agents panel, showing `shown`. The same plan asked again while it waits or is approved gives the same approval, even when asked at the same moment.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `agent`: agent:<name><br>`tool`: the tool<br>`plan`: the exact plan, as JSON<br>`shown`: what the member is shown, as JSON |
| Returns | `approval` (id, agent, tool, shown, state, asked), and `unchanged` when it was waiting already |

### `com.ohmmmm.vault.getApproval`

One approval and how it stands: waiting, approved, declined or used.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `id`: the approval's ID |
| Returns | `approval` |

### `com.ohmmmm.vault.useApproval`

An agent's tool uses an approval to carry out its plan: once, and only when the member approved exactly that plan. The same agent, tool and plan sent again within 15 minutes, because the action failed or its answer was lost, answers the same with `unchanged`. Otherwise it is refused with NotApproved, saying why.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member |
| Parameters | `id`: the approval's ID<br>`agent`: agent:<name><br>`tool`: the tool<br>`plan`: the plan, as JSON |
| Returns | `id`, `used`, and `unchanged` when it was a retry |

### `com.ohmmmm.vault.listApprovals`

Agents' actions, oldest first: waiting (the default), approved, declined or used.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | `state`: optional: waiting, approved, declined or used |
| Returns | `approvals` |

### `com.ohmmmm.vault.answerApproval`

The member approves or declines an agent's action, in the cockpit. Only the member, signed in to ohm; never an agent.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member, with an ohm session |
| Parameters | `id`: the approval's ID<br>`approve`: true or false |
| Returns | `id`, `state` |

### `com.ohmmmm.vault.listAgents`

Every agent that used ohm's tools, newest seen first: its state, when it was last seen and with which tool, how many of its actions wait, and its last ten calls.

| | |
| --- | --- |
| Method | `GET` |
| Access | Member |
| Parameters | None |
| Returns | `agents` (agent, state, firstSeen, lastSeen, lastTool, waiting, recent) |

### `com.ohmmmm.vault.setAgentState`

The member pauses, resumes, disconnects or allows again one agent. Disconnecting also declines what it was waiting for. Only the member, signed in to ohm.

| | |
| --- | --- |
| Method | `POST` |
| Access | Member, with an ohm session |
| Parameters | `agent`: agent:<name><br>`state`: active, paused or disconnected |
| Returns | `agent`, `state` |

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
| `InvalidChannel` | 400 | The channel is not one the service can hold: its path is not a channel's path, it is private, or its file has problems. The message says why |
| `InvalidCursor` | 400 | `since` is not a value an earlier list returned |
| `NotFound` | 404 | There is no such post, block or saved version, or nothing there is shared with the asker |
| `Changed` | 409 | The post, block, channel or private block has changed since the version the request names. The answer carries the current version |
| `SlugTaken` | 409 | Another post in the vault already has that slug |
| `PathTaken` | 409 | Another block in the friends layer, or another channel, is already at that path |
| `NotEmpty` | 409 | A block or post is filed in the channel, or a channel is inside it. Move them first |
| `HasPosts` | 409 | Published posts are filed in the channel. Their addresses come from their label, which changes through Publish |
| `OlderKey` | 409 | The private block is sealed under an older master key than the member is rotating, or rotated, to |
| `NoRotation` | 409 | No rotation to that generation is under way |
| `RotationAhead` | 409 | The member already rotated to a later master key than the one asked for |
| `RotationRemaining` | 409 | A rotation cannot finish while some kept versions or journal entries are still sealed under the older key. The answer says how many |
| `TooLarge` | 413 | The post or block is more than 600 KB of text, a channel file is more than 200 KB, media is empty or more than 25 MB, a sealed private block is more than 1 MB, or a file it places is empty or larger than 25 MB |
| `FileUnreachable` | 502 | A file a post places could not be fetched from where the post says it is |
| `AccountNotFound` | 404 | No AT Protocol account answers to that handle or DID |
| `NoRepository` | 400 | The account's DID document does not say where its repository is kept |
| `RepositoryUnreachable` | 502 | The account's PDS would not answer |
| `MediaUnavailable` | 503 | The media cache is not set up on this service |
| `ViewerTokenInvalid` | 401 | The viewer token is not one this service made, is for another member, or has run out |
| `ViewersUnavailable` | 503 | Viewer tokens, and so Friends reads for sites, are not set up on this service |
| `NotFriendsOnly` | 409 | Only a friends-only block or post is hidden on its way to private |
| `Answered` | 409 | The move request or agent action has been approved or declined already |
| `NotThisMove` | 409 | The move recorded is not the one the request asked for |
| `InvalidMove` | 400 | The layer named is not public, friends or private, or the block is in it already |
| `NotTheirSite` | 400 | The return address is not on one of the member's sites |
| `AgentPaused` | 409 | The member paused this agent in the cockpit's Agents panel |
| `AgentDisconnected` | 403 | The member disconnected this agent in the cockpit's Agents panel |
| `NotApproved` | 409 | The action waits for the member, was declined, was carried out already, or is not the one the member approved |
| `TooManyWaiting` | 409 | A hundred agent actions wait for the member already |
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
| `vault_set_visibility` | Change | `getTree`, `getPost`, `getBlock`, `previewMove`, `hideBlock`, `requestMove` |
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
| `vault_connections` | Read | `listFriends`, `listFriendOf`, `listAsked` |
| `vault_friends_ask` | Change | `listAsked`, `askFriend` |
| `vault_mail_ask` | Change |  |
| `vault_shared_list` | Read | `listShared` |
| `vault_shared_read` | Read | `getShared` |

The server that offers these tools is described in [Agent integration](https://docs.ohmmmm.com/mcp.md). Vault tools follow these rules.

1. **A new post is private.** Marking it for anyone else is a separate, confirmed step.
2. **Changes that others can see take two calls.** The first returns what would happen and a `confirm` value bound to exactly that outcome. Only a second call carrying the value proceeds.
3. **A post is changed from the version that was read.** If it has changed since, nothing is saved.

---
ohm is in development. These docs cover the implementation and the work still planned. Built does not mean verified on the live service; see Status and limits.
All pages: https://docs.ohmmmm.com/llms.txt
