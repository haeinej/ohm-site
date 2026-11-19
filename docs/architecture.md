# System overview

ohm has three parts. ohm-vault holds what a member knows and makes, ohm-cortex holds what agents know about the member, and the member's PDS owns public records. The vault service stores the working copy of posts; clients on the member's device perform approved publication.

<a id="parts"></a>

## Vault, cortex and PDS

| | ohm-vault | ohm-cortex | The member's PDS |
| --- | --- | --- | --- |
| Holds | Blocks, channels, sources, entities; posts among them | Identity, memories, working memory, notes, skills, tools, the journal | Public `com.ohmmmm.post` records, identity, files |
| Edges | Evidence only: what the content shows | Inference: cortex nodes pointing at vault blocks (`grounds`, `observes`, `learned`, `acts`) | None of ohm's |
| Kept as | A folder on the member's machine, and for posts, the vault service's working copy | A folder on the member's machine | A repository at the member's host |
| Repository | [haeinej/ohm-vault](https://github.com/haeinej/ohm-vault) | [haeinej/ohm-cortex](https://github.com/haeinej/ohm-cortex) | External |

The vault never imports cortex, and cortex never imports the vault. Cortex refers to blocks by ID and version only, through a small read-only vault contract: today its own folder reader, and planned, a reader over the vault's index. The cortex is not synced with ohm or stored by the vault service.

<a id="how"></a>

## How it works

The vault service holds what a member makes for the web: posts filed under labels and sublabels, private, for friends or public. A post's label and sublabel are its home channel. The service is member-scoped, and only public posts can become repository records. A vault folder on the member's machine holds every kind of block, and is read and indexed locally. [Data model](https://docs.ohmmmm.com/data-model.md#nodes)

1. **Sign in.** A person signs in to ohm, and once connects the AT Protocol account that owns their posts. That account lives on a Personal Data Server (PDS) they host themselves or at Bluesky. It is theirs whether or not they use ohm.
2. **Mirror.** What the account has already published is read from its repository into the vault. From then on the vault holds everything: public posts, and private and friends-only ones that exist nowhere else on the network.
3. **Work.** Posts are read, written and filed in the vault, through any of three clients: the workspace in a browser, an agent's tools, or a synced folder of Markdown files. A new post is private. Saving changes the vault and nothing else.
4. **Mark.** Setting a post to public or friends marks it. Nothing is shared by marking.
5. **Publish.** The vault service works out what would have to change in the member's repository for what is published to match the vault. The member reviews that plan and approves it, and their own device, signed in at their own PDS, makes the changes. Public posts become `com.ohmmmm.post` records.
6. **Read.** The member's website and any other AT Protocol application read those records from the repository. ohm is not in that path.
7. **Keep.** The vault can be synced to a folder the member holds, or exported, as Markdown files. With a folder connected, nothing depends on ohm keeping its copy.

Three rules hold everywhere and are worth knowing before anything else.

- **Saving never publishes.** Only Publish changes what other people see, and it always shows the change first.
- **ohm never writes to a member's repository.** It has no credential that could. Every write comes from the member's own device.
- **Private stays in the vault.** A private post is never written to the repository, where everything is public.

<a id="components"></a>

## Components

Diagram: the parts of ohm and what passes between them.
- On the member's device: the workspace (browser), the agent tools (MCP server) and folder sync (command line).
- Run by ohm: the vault service (posts and account links) and ohm sign-in (accounts and sessions).
- The member's own account, on the AT Protocol: a Personal Data Server holding their identity and public repository.
- Device → vault service: API requests.
- Device → Personal Data Server: sign-in, service tokens, and the writes of a publish.
- Vault service → Personal Data Server: reads only.
- Vault service → ohm sign-in: session check.
- Personal Data Server → the member's website and other applications: public records.

| Component | Runs on | Responsibility | Status |
| --- | --- | --- | --- |
| Workspace | The member's browser, served from `app.ohmmmm.com/vault` | Editor, repository tree, publish review | Implemented |
| Agent tools | An MCP server, `ohm-vault`, on the member's machine | Vault tools composed from service requests. [Agent integration](https://docs.ohmmmm.com/mcp.md) | Implemented |
| Folder sync | A command-line client on the member's machine | Two-way sync between the vault and a folder of Markdown files, for posts | Implemented |
| Vault folder and index | The `ohm vault` command on the member's machine | Reads blocks, channels, sources and entities, and read-only roots; keeps `.vault/index.sqlite`. No network calls | Implemented |
| ohm-cortex | The member's machine: MCP over stdio or HTTP, CLI, hooks | Agent memory, the journal, history. Separate software | Implemented, outside this repository |
| Vault service | Cloudflare Workers and D1 | Stores posts; checks versions; computes mirror and publish plans | Implemented |
| ohm sign-in | Cloudflare Workers and D1 | ohm accounts and sessions, with Google, Microsoft and Bluesky as identity providers | Implemented |
| Personal Data Server (PDS) | The member's host: self-hosted, or Bluesky | The account's DID, signing key, and repository of public records and files | External |
| Website and other applications | Their own hosts | Read public records from the repository | External |
| Network service | | Friends-only delivery, the follow graph, and matching | Planned |

<a id="ownership"></a>

## Ownership

Public records remain at the member's PDS. Posts have a portable folder format.

| Data | System of record | What ohm holds |
| --- | --- | --- |
| Identity: DID, handle, signing key | The member's PDS | A reference to the DID |
| Public posts | The member's repository, as `com.ohmmmm.post` records | A working copy |
| Private and friends-only posts | The member's folder, once connected | A working copy. Until a folder is connected, the only copy |
| ohm account and session | ohm sign-in | The account itself |
| The link between an ohm account and a DID | Vault service | One row, unique in both directions |

<a id="principles"></a>

## Design principles

1. **The service never writes to a member's repository.** It holds no credential that could. Publishing is planned by the service and carried out from the member's device. [Mirror and publish](https://docs.ohmmmm.com/protocols.md)
2. **Authentication is delegated to the member's PDS.** The PDS signs a short-lived token for each request, and the service verifies it against the account's own DID document. ohm stores no PDS password or token. [Identity and access](https://docs.ohmmmm.com/identity.md)
3. **Versioned changes are conditional.** A post is replaced against the version read. A stale write is refused rather than silently overwriting newer work.
4. **Capabilities are isolated.** Requests are grouped by responsibility. Agent tools compose those requests and add no service privileges. [Service API](https://docs.ohmmmm.com/api.md)
5. **Requests are idempotent.** A request sent twice ends in the same state as one sent once. A post's ID is generated by the client, so creating it twice creates one post.
6. **One portable post format.** Post sync and export produce the same Markdown files. [Posts as files](https://docs.ohmmmm.com/files.md)
7. **The service makes no model calls.** Judgement belongs to the member and their own agent.
8. **Evidence and inference are kept apart.** The vault derives edges from content alone. What an agent concludes is a cortex node that points at blocks; it never becomes an edge between two blocks. [The graph](https://docs.ohmmmm.com/graph.md)
9. **Derived data stays rebuildable.** The vault index holds only what can be read again from files, and never writes cache data into them.

<a id="deployment"></a>

## Deployment

| Address | Serves |
| --- | --- |
| `app.ohmmmm.com/vault/` | The workspace, and the service API under `/vault/xrpc/`, where the ohm session cookie is in scope |
| `vault.ohmmmm.com` | The service API under `/xrpc/`. The service identifies itself as `did:web:vault.ohmmmm.com` |
| `app.ohmmmm.com/api/auth/` | ohm sign-in |
| `docs.ohmmmm.com` | This documentation |

The vault service and ohm sign-in are separate Workers with separate databases. The vault service asks ohm sign-in whose session a request carries; ohm sign-in asks the vault service which account a PDS token names. Neither reads the other's database.

<a id="section"></a>

## In this section

- [Identity and access](https://docs.ohmmmm.com/identity.md): the two identities, and how every request is authenticated.
- [Data model](https://docs.ohmmmm.com/data-model.md): a post in the vault, the published record, identifiers and versions; vault folder nodes, evidence edges, and the cortex journal.
- [Mirror and publish](https://docs.ohmmmm.com/protocols.md): the two exchanges with a member's repository.
- [Agent integration](https://docs.ohmmmm.com/mcp.md): the MCP server, its tools, and how changes are confirmed.
- [Service API](https://docs.ohmmmm.com/api.md): every request, error and agent tool.

---
ohm is in development. These docs cover the implementation and the work still planned. Built does not mean verified on the live service; see Status and limits.
All pages: https://docs.ohmmmm.com/llms.txt
