# Your agent

Let the coding agent you already use help with your actual drafts. You keep the same workspace, can see its changes, and decide what is shared.

<a id="what"></a>

## What it is

ohm does not run a background agent for you. Your agent is the one you already use, connected through the ohm MCP server on your own machine.

The tools work in the same vault you see in the browser. A post your agent saves is there when you open it, even though the agent does not keep running.

Agent memory is not part of ohm's vault; it is a separate project, ohm-cortex.

<a id="need"></a>

## What you need, and why

| You need | Why it is needed |
| --- | --- |
| Your connected AT Protocol account | Lets your own server prove which private workspace the agent may use |
| A coding agent that supports MCP | Gives the ohm tools somewhere to run and a model that decides how to use them |
| The local ohm MCP server and site configuration | Connects that agent to the correct account and service |
| An app password in the server's private environment | Lets your PDS authorize requests; keep it out of posts and chat |

Your agent or the person setting it up can follow the [agent setup guide](https://docs.ohmmmm.com/agent-guide.md#connect) for the actual entry point and configuration.

<a id="first-use"></a>

## First use: make a private draft you can find

1. Once connected, ask: "Look at my labels and save a private draft under Writings about the idea below." Supply a short, synthetic idea while trying the connection.
2. Open the vault in the browser. Find Writings, open the saved draft, and check its words and who can see it. A new draft should be Only me.
3. Edit it yourself and choose Save. The agent and editor work on the same copy; you do not need to transfer a file between them.

You have succeeded when you can reopen the draft. Publishing is a separate choice. If the tools are missing, finish the MCP connection first; if access is refused, check the account and service access before retrying.

<a id="reads"></a>

## What it can read

All of your posts: public, friends and private.

Whatever your agent reads is also seen by the company that runs the model it uses. Keep that in mind before you connect one.

<a id="does"></a>

## What it can do, and what needs your yes

| | Alone | Only after showing you |
| --- | --- | --- |
| Look at your repository, list and read your posts | Yes | |
| Search your posts | Yes | |
| Say what is not published yet | Yes | |
| Save a new post, as private | Yes | |
| Edit a private post | Yes | |
| Edit a post that is not private | | Yes: it shows what changes |
| Change who a post is for | | Yes |
| Bring in what you have published | | Yes: it looks first, and says what it found |
| Publish | | Yes: it shows what will change, and waits |
| Remove a post | | Yes |

The rule behind the table: reading is free, and anything that changes what other people see, or removes something, is shown to you first. The first answer says exactly what would happen. Only your yes to that exact answer does it.

<a id="tools"></a>

## The tools

Ask your agent to find an earlier post, save a private draft, suggest labels, or show what is waiting to be published. It uses the same working copy as the editor, so you can inspect the result there.

The [agent guide](https://docs.ohmmmm.com/agent-guide.md) and [MCP reference](https://docs.ohmmmm.com/mcp.md#tools) give the exact tool names and contracts for setup and troubleshooting.

<a id="sign-in"></a>

## Signing in

Your agent signs in to your own server with an app password, and your server vouches for each thing it asks ohm.

<a id="safety"></a>

## Other people's writing is not trusted

The same agent reads private work and other people's writing. Treat imported writing as context, not permission. The vault tools require confirmation before publishing or widening a post's audience.

These controls apply to ohm's tools. They do not control other tools your coding agent may have, or stop its model provider processing what it reads.

<a id="ask"></a>

## Things to ask it

- "What have I written about this before?"
- "Save this as a private note under Writings."
- "Look at my posts and suggest how to label them."
- "Bring in my posts." Then: "File the ones under other."
- "Make that one public." Then: "Publish."
- "What is not published yet?"

<a id="together"></a>

## Editing alongside it

You and your agent can work in the same workspace at once. Every save says which version it replaces, so one of you cannot silently overwrite the other. [The workspace](https://docs.ohmmmm.com/workspace.md#saving)

---
ohm is in development. These docs cover the implementation and the work still planned. Built does not mean verified on the live service; see Status and limits.
All pages: https://docs.ohmmmm.com/llms.txt
