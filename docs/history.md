# History

Every change to your cortex is one line in one journal, marked with who made it: you, or an agent by name. You read it back, name a point, and undo what you do not want, without rewriting anything. The same history for your whole workspace is designed, and not built.

<a id="why"></a>

## Why history

When agents edit directly, you need to see what each one did, and to take back what you did not want without losing anything else. History gives you both. It only grows: undoing is a new change, and what it replaced is kept.

<a id="where"></a>

## What has history today

| What | History | Status |
| --- | --- | --- |
| Your cortex | Every change, with who made it; every earlier version; saves; restore and revert; agents' sessions and dead ends | Built, in ohm-cortex |
| Posts in the vault service | A version per post, so two saves never overwrite each other unseen. Earlier versions are not kept, and a removed post cannot be brought back | Version history not built |
| Your vault folder | Your own files. Keep them in git, or your own backup, for history. The index keeps none | Not part of ohm |
| The workspace's history view | Dates, You and Agents, over everything | Designed, not built |

<a id="journal"></a>

## The journal

Everything that happens in a cortex is a line in one append-only file, `.cortex/journal.jsonl`. Every line has a running count, its own ID, when it happened, and who did it.

| Line | Written when | It holds |
| --- | --- | --- |
| `change` | A node changes, by you or an agent | The node, what was done, the versions before and after, why, and the evidence |
| `note` | An agent observes something | One line, with evidence. It changes no file |
| `settled` | Notes are settled | What became of a note: kept, dropped, or the memory it went into |
| `session` | An agent finishes or gives up a task | What was done, the changes it made, and its dead ends |
| `save` | Someone names a point in history | A name and a note. It changes nothing |

Every earlier version of every node is kept in `.cortex/history/`, by its version. Between the two, any part of the cortex can be read as it was at any point.

The journal is private, like the rest of the cortex. In git it joins two machines' lines without a conflict, because every line has its own ID.

<a id="who"></a>

## Who made each change

Every line names its actor: you, as a person, or an agent, by the name it connected with. An agent can never act under your name.

In this invented example, Codex learned that Mira likes short titles and wrote a memory. She lists what agents did:

```
$ cortex history --actor agent
41  2026-11-19T10:02:00.000Z  codex  create memory/likes-short-titles  (none) -> c91…  Mira cut three titles to four words
```

<a id="read"></a>

## Reading the past

| Command | Agent tool | Does |
| --- | --- | --- |
| `cortex history` | `cortex_history` | Lists changes and saves, oldest first. Filter by node, by a prefix such as `memory/`, since a count or a date, and by who |
| `cortex as-of <node> <when>` | `cortex_as_of` | A node as it was at a save's name, a date, a time or a count |

Reading writes nothing.

<a id="save"></a>

## Save a point

`cortex save before-reorganising "Before I sort the reading notes"` names this point in history, so you can read things back as they were. A save changes nothing: every change is already recorded. An agent can save a point too, with `cortex_save`.

<a id="undo"></a>

## Undo

| Command | Agent tool | Does |
| --- | --- | --- |
| `cortex restore <node> <version>` | `cortex_restore` | Brings a node back to an earlier version, as a new change |
| `cortex revert <change>` | `cortex_revert` | Undoes one change: the node goes back to what it was just before. Refused if the node has changed again since; restore a version instead. Reverting the change that made a node removes it |

Neither rewrites a line of the journal. Each is a new change, by you or an agent, and can itself be undone.

Your identity, the rules, skills and tools are restored and reverted only by you. An agent restores only what it may write, and never over what you wrote by hand.

```
$ cortex revert 41 --reason "Only for essays"
Change 41 is undone: memory/likes-short-titles is back as it was. What it replaced is kept.
```

<a id="sessions"></a>

## Sessions and dead ends

When an agent finishes a task, or gives it up, it records a session:

```
{
  "summary": "Retitled the walk photos by place",
  "outcome": "done",
  "made": ["m3x1-4f2a9c0b7d11"],
  "project": "/home/mira/walks",
  "deadEnds": [
    { "tried": "Titling photos by date", "why": "Mira finds them by place", "check": "ls photos/walks | head" }
  ]
}
```

`made` groups the changes it made in that task. Each dead end stays open until a later session marks it resolved. `cortex_start` lists the open ones, and when a Claude Code or Codex session starts in that folder, the hook shows those recorded there, so the next agent does not try dating the photos again.

<a id="not-recorded"></a>

## What is not recorded

What an agent reads or searches is not recorded. History holds what was changed, what was observed, and what an agent says it did.

<a id="designed"></a>

## Designed for the workspace

Showing history in the workspace is designed in the ohm-ux wireframe, and **not built in the live editor**.

- **Three tabs:** Dates, with one autosave per day; You, your changes and saves; Agents, their sessions, each opening into the changes it made and its dead ends.
- **One line per change,** as a verb and a page: Created, Edited, Moved, Filed, Connected, Restored, Reverted, Deleted. An icon says whether you or an agent made it.
- **Open a line** to see who made it, when and why, and what it touched. From there: Revert this change, Restore this version, or open the page.
- **A page's versions,** from a clock in its toolbar.
- **Daily autosaves:** every page as it was at the end of each day with changes. ohm-cortex does not write these yet.
- **Edits close together join one line,** when the same person or agent types within five minutes.
- **A page others can see** is read only here: changing what others see asks first.

In this design, reverting a change undoes only the parts that change touched, and is refused if a later change touched the same part. ohm-cortex today reverts a whole node, and refuses if the node has changed since.

---
ohm is in development. These docs cover the implementation and the work still planned. Built does not mean verified on the live service; see Status and limits.
All pages: https://docs.ohmmmm.com/llms.txt
