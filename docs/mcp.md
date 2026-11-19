# Agent integration

An agent reaches a vault through an MCP server that runs on the member's own machine. The server authenticates as the member, composes its tools from service requests, and requires confirmation for every change that others could see.

<a id="overview"></a>

## Overview

ohm does not run a background agent. It ships a Model Context Protocol (MCP) server, `ohm-vault`, that a member runs on their own machine and connects to the agent they already use. The server exposes 18 vault tools, composed from authenticated service requests made as that member.

Diagram: the path of one tool call.
1. Agent → MCP server: tools/call
2. MCP server → Member's PDS: getServiceAuth
3. Member's PDS → MCP server: Signed token (response)
4. MCP server → Vault service: Request with the token
5. Vault service → MCP server: Response
6. MCP server → Agent: Tool result (response)

1. **Call.** The agent calls a tool over the MCP connection.
2. **Vouch.** The server asks the member's PDS for a service token for the one request it is about to make.
3. **Token.** The PDS returns a token signed with the account's key.
4. **Request.** The server sends the request to the vault service with that token.
5. **Response.** The service verifies the token and answers. [Identity and access](https://docs.ohmmmm.com/identity.md#authentication)
6. **Result.** The server returns the tool's result to the agent.

The tools work in the same working copy the workspace shows. A post an agent saves is the same row, with the same version, that the editor opens.

<a id="model"></a>

## What an agent should know

Start with these rules.

- **The vault is one person's work,** as posts filed under labels and sublabels. Start with `vault_tree` to see its shape, then `vault_read` or `vault_search`.
- **Every post is private, for friends, or public.** Private posts are context for helping the member. Nothing from one belongs in anything another person can see.
- **These tools never see private posts.** They list, read and search only public and friends-only posts. `vault_save` changes an existing one; a new block starts on the device, through the local tool `vault_capture`. `vault_set_visibility` moves a post only between public and friends, and always asks first.
- **Friends tools work in the friends layer.** `vault_friends_*` read and change friends-only blocks and who can read them; `vault_shared_*` read what friends shared with the member. There is no tool to add a friend: that stays with the member, signed in.
- **Saving is not publishing.** A post marked public reaches the member's website and the network only through `vault_publish`. `vault_status` says what is waiting.
- **Changes are made from a version.** `vault_read` returns it, and `vault_save` passes it back. If the post changed in between, read it again.
- **A two-call tool is asking for the member's decision.** Show the member what the first call returned, and make the second call only if they agree.
- **Publishing cannot be recalled.** Other services copy a public post as soon as it is written.

<a id="protocol"></a>

## Protocol

| | |
| --- | --- |
| Transport | Standard input and output. One JSON-RPC 2.0 message per line in each direction |
| Protocol versions | `2025-06-18`, `2025-03-26`, `2024-11-05` |
| Methods | `initialize`, `ping`, `tools/list`, `tools/call` |
| Capabilities | Tools only. The server offers no resources and no prompts |
| Server name | `ohm-vault` |
| Ordering | Calls are handled one at a time, in the order received, so two changes to the same post cannot cross |
| Results | A tool's result is JSON, returned as text content. A refusal is a result marked `isError` with a message the agent can read and act on |
| Annotations | Tools that only read carry `readOnlyHint`. `vault_delete` carries `destructiveHint` |
| Instructions | On `initialize`, the server states the rules of the vault to the agent: what private means, and that any change other people can see is shown to the member first |

Listing the tools needs no configuration and no sign-in. The server signs in at the PDS the first time a tool is called.

<a id="configuration"></a>

## Configuration

| Setting | Source | Purpose |
| --- | --- | --- |
| The member's account | The site configuration file, found in the agent's working folder, or named with `--config` or `OHM_VAULT_CONFIG` | Which AT Protocol account the server acts as |
| `ATPROTO_APP_PASSWORD` | Environment | An app password for the member's PDS. It can be revoked at the PDS at any time |
| `OHM_VAULT_URL`, `OHM_VAULT_DID` | Configuration, or the flags `--vault` and `--vault-did` | The vault service to use. Defaults to `https://vault.ohmmmm.com` and `did:web:vault.ohmmmm.com` |

Start the server directly, or through a client configuration that loads it:

```
npx github:haeinej/ohmmmm mcp
```

This exposes the MCP tools.

<a id="authentication"></a>

## Authentication

The server holds one credential: the app password, in its own environment on the member's machine.

- **It signs in at the member's PDS** with `com.atproto.server.createSession` and renews the session when it expires.
- **Each request to the vault service carries its own token,** obtained from the PDS with `getServiceAuth` for that request's name and valid for 60 seconds.
- **The vault service never receives the app password** or the PDS session. It sees only tokens it can verify against the account's DID document.
- **Publishing uses the same PDS session.** The server uploads files and applies the plan's writes itself, as the workspace does in a browser. [Mirror and publish](https://docs.ohmmmm.com/protocols.md#publish)

<a id="tools"></a>

## Tools

| Tool | Effect | Confirmation | Requests used |
| --- | --- | --- | --- |
| `vault_tree` | Read | None | `getTree` |
| `vault_list` | Read | None | `getTree` |
| `vault_read` | Read | None | `getTree`, `getPost` |
| `vault_search` | Read | None | `searchPosts` |
| `vault_save` | Change | Always | `getTree`, `getPost`, `putPost` |
| `vault_set_visibility` | Change | Always | `getTree`, `getPost`, `putPost` |
| `vault_status` | Read | None | `getPublishPlan` |
| `vault_publish` | Change | Always | `getPublishPlan`, `getAttachment` |
| `vault_mirror` | Change | Always | `importPublished` |
| `vault_delete` | Change | Always | `getTree`, `getPost`, `deletePost` |
| `vault_friends_list` | Read | None | `listBlocks` |
| `vault_friends_read` | Read | None | `getBlock` |
| `vault_friends_save` | Change | Always | `putBlock` |
| `vault_friends_delete` | Change | Always | `deleteBlock` |
| `vault_friends_who` | Read | None | `listFriends` |
| `vault_friends_remove` | Change | Always | `listFriends`, `removeFriend` |
| `vault_shared_list` | Read | None | `listShared` |
| `vault_shared_read` | Read | None | `getShared` |

A tool has no capability of its own. Anything a tool can do, the service API can do, and the access rules are the service's. [Service API](https://docs.ohmmmm.com/api.md)

<a id="local"></a>

## Local tools

`ohm vault mcp --vault DIR --agent NAME` is a second stdio server, over a vault folder on the member's own machine. It needs no sign-in and reads only that folder and the roots it configures, private files included.

| Tool | Effect | What it does |
| --- | --- | --- |
| `vault_local_search` | Read | Searches the folder's index by words |
| `vault_local_read` | Read | One node, with its file's details and its journal history |
| `vault_neighbors` | Read | Follows evidence in or out by kind, up to five steps |
| `vault_capture` | Change | Proposes a block from a web address or a file in a root, marked as proposed by the agent |
| `vault_collect` | Change | Files a block in a channel, or moves it within the channel's order |
| `vault_index` | Change | Scans the folder and its roots, and reports what changed |

Changes are written to the folder's journal. Nothing here reaches the service or the network.

<a id="confirmation"></a>

## Confirmation

A vault tool that changes something other people can see, or removes a post, takes two calls.

1. **The first call changes nothing.** It returns `done: false`, a description of exactly what would happen in `willHappen`, and a `confirm` value.
2. **The agent shows that description to the member.**
3. **The second call repeats the request with the `confirm` value,** and only then does the change happen.

The `confirm` value is a digest of the request and of the state it was computed from: the post's current version, or the publish plan. If either has changed between the two calls, the value no longer matches and the call is refused. Vault confirmations need no server-side state and cannot authorize a different change.

<a id="safety"></a>

## Safety model

The same agent reads the member's private posts and content written by other people, which may be written to manipulate it. The controls are properties of the tools, not of the agent's judgement.

| Risk | Control |
| --- | --- |
| A private post is exposed by a save | Service tools never read or write private posts. Changing who can see a post, or saving a friends-only block, always requires confirmation |
| An agent widens who can read | There is no tool to add a friend. Removing one always requires confirmation |
| Something is published without the member knowing | Saving never publishes. `vault_publish` always requires confirmation of the exact plan |
| A post is overwritten | Every save names the version that was read. A stale save is refused |
| A post is lost | `vault_delete` always requires confirmation |
| Content leaves through an ohm tool | The tools target only the member's own vault and repository |

These controls do not govern other tools available to the coding agent. Whatever it reads is also processed by its model provider.

<a id="excluded"></a>

## Requests without a tool

Some service requests are deliberately not available to an agent.

| Requests | Reason |
| --- | --- |
| `listPosts` | It serves incremental sync. The tools read the repository tree |
| `exportFiles` | Export is for the command line and the workspace |
| `account.get`, `account.connect`, `account.disconnect` | They require an ohm session, which an agent does not have |
| `identity.findAccount`, `identity.whoAmI` | They are steps of signing in |

<a id="other"></a>

## Other servers

These tools work on posts in the vault service only.

- **A vault folder** has no MCP tools yet. Tools that search, read, follow connections, capture and collect blocks through `.vault/index.sqlite` are planned. Until then the `ohm vault` command reads the folder, and makes no network calls. [Other folders and the index](https://docs.ohmmmm.com/roots-and-index.md)
- **The cortex** is a separate MCP server, `cortex`, over standard input and output or HTTP, with twenty `cortex_*` tools. An agent connected to both keeps its conclusions there, never as edges between blocks. [The cortex](https://docs.ohmmmm.com/cortex.md)

---
ohm is in development. These docs cover the implementation and the work still planned. Built does not mean verified on the live service; see Status and limits.
All pages: https://docs.ohmmmm.com/llms.txt
