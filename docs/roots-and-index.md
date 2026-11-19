# Other folders and the index

Your vault can read folders you already keep, such as Google Drive, an Obsidian vault or a folder of code, where they are. An index on your computer makes all of it searchable and records how it connects.

<a id="why"></a>

## Why read other folders

Some of what you know is not in your vault folder: papers on Google Drive, an Obsidian vault you already keep, a folder of SQL you run at work. Copying them in would leave two versions of each to keep in step. The vault reads those folders where they are instead, without copying them in and without ever writing to them.

Each one is a **root**, and its files appear as blocks in a channel of their own. The index then finds them by their words, alongside everything else.

<a id="need"></a>

## What you need, and why

| You need | Why |
| --- | --- |
| A vault folder | The vault is the folder. Its configuration and index are kept inside it, in `.vault/` |
| Node 22 or newer | The index is a SQLite database, which Node has built in. Before Node 22.13 the command turns it on for itself |
| The folders you want read, on this computer | A root is a folder on this machine. Google Drive is read through the folder Google Drive for desktop mounts |
| Nothing else | No account and no service. Indexing never reaches ohm or publishes anything |

<a id="first-use"></a>

## Your first index

**Start the configuration,** from inside your vault folder:

```
npx github:haeinej/ohm-vault vault init
```

**Name the folders it should read,** in `.vault/config.json`:

```
{
  "roots": [
    { "name": "research", "path": "~/Library/CloudStorage/GoogleDrive-you@example.com/My Drive/Research", "include": ["**/*.pdf", "**/*.md"] },
    { "name": "notes", "path": "~/Documents/Obsidian/Notes", "channel": "reading/notes" },
    { "name": "queries", "path": "~/work/queries", "include": ["*.sql"], "retain": "full" }
  ]
}
```

**Read everything,** and keep what was found:

```
npx github:haeinej/ohm-vault vault index
```

**Look for something,** and look at one block closely:

```
npx github:haeinej/ohm-vault vault search 서울 rain
npx github:haeinej/ohm-vault vault inspect churn-query
```

You have succeeded when `vault search` finds a file from one of your roots. Each command prints what it did as JSON, and says in a sentence what it could not do.

<a id="config"></a>

## Naming a root

| Setting | What it changes |
| --- | --- |
| `name` | What the root is called: lowercase letters, digits and hyphens. `vault` is taken by the vault folder itself |
| `path` | The folder, absolute or starting `~/`. It cannot be the vault itself, a folder inside it, or a folder around it |
| `channel` | The channel its files appear in. The root's name, unless you say otherwise. Folders inside the root become channels inside that one |
| `include`, `exclude` | Which files to take, as patterns: `*.sql` matches by name anywhere, `docs/*.md` only in that folder, `**` any depth. Everything, unless you say otherwise |
| `retain` | How much the vault keeps of each file. See below |

A root entry the vault cannot use is left out with a sentence saying why; the others still apply.

<a id="retain"></a>

## How much is kept

| `retain` | What the vault keeps | Choose it when |
| --- | --- | --- |
| `reference` | Where the file is, its size and date. The file is never opened | Opening a file would cost something, as on Google Drive |
| `text` | Its words too, so search finds it | You want to find it by what it says. The default, except on Google Drive |
| `full` | A copy of its bytes in `.vault/cache` as well | The original may change or go, and you want what you saw |

A Google Drive folder keeps only references unless you say otherwise. Google Drive for desktop keeps many files online only, and opening one makes Drive download it; a reference never opens the file, so it has no content address either.

<a id="blocks"></a>

## What each file becomes

Every file a root takes becomes a block whose `origin` is the file's own path.

- **A Markdown file** is read as the block it is, with its links and properties.
- **A `.sql`, `.py` or other code file** is a `code` block.
- **An image, video or recording** is a `media` block.
- **Anything else** is a `file` block, such as a PDF.

A root is read only. Two-way sync with a folder such as an Obsidian vault is planned, and a root that asks for it is refused until it is built.

<a id="index"></a>

## The index

`vault index` reads your vault folder and every root, and keeps what it found in `.vault/index.sqlite`: every block, channel, entity and source, every connection, the words for search, and each file's size, date and content address.

- **The first time, it reads everything.** After that it reads only files whose size or dates changed, so an unchanged vault takes as long as listing its folders.
- **It says what changed:** what was added, changed, moved and removed. A file that was renamed or moved is recognised as the same file.
- **`vault search`** finds blocks by their words. Words in a title, name or tag count more than words in the text. Korean, Japanese and Chinese are found without spaces.
- **`vault inspect`** shows one block with everything known about it, including what is not in its file: where its original is, its size, when it last changed, its content address, whether a copy is cached, and what links to it.
- **`vault status`** says what the index holds, root by root, and when it last read them.

<a id="written"></a>

## What is written, and what is not

- **Your files are not changed.** Size, dates and content addresses are kept in the index, not in your files, so a file changes only when you change it.
- **Nothing is ever written in a root.**
- **The index can always be deleted.** The next `vault index` makes it again from your files. A damaged index is set aside and made again.
- **Nothing leaves your computer.** Indexing never reaches the vault service, signs in, or publishes.

<a id="problems"></a>

## When something cannot be read

- **A root that is not there,** such as Google Drive when it is not running, cannot be read. The index keeps what it knew about it and says so, rather than treating its files as removed.
- **A file the vault cannot make sense of** is named with a sentence and left as it is: a channel that is not a folder, two files with the same name, an origin it does not understand, a copied file that carries another file's ID.
- **A root you remove from the configuration** has its blocks removed from the index at the next `vault index`. The folder itself is untouched.

<a id="status"></a>

## What is built

The configuration, roots and the index are built and tested against real temporary folders. They have not been tried against a real Google Drive mount. Agent tools that search, read and collect blocks through the index are planned, and so is the cortex reading your vault through it. [Status and limits](https://docs.ohmmmm.com/limits.md#status)

---
ohm is in development. These docs cover the implementation and the work still planned. Built does not mean verified on the live service; see Status and limits.
All pages: https://docs.ohmmmm.com/llms.txt
