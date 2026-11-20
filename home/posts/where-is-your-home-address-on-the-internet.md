---
title: Where is your home address on the internet?
subtitle: Why we need personal data servers more than ever, and more than any agent, to survive in the agentic era.
date: 2026-11-20
number: "001"
writer: Haein Jung
---

<!-- The essay's full text, in Markdown. Text before the first "## " heading opens the essay;
     each "## " heading starts a section and becomes an entry in "On this page".
     Then run: npm run home:posts -->

This morning my cousin Olivia asked for my address so she could send me a wedding invitation. Me, as a digital citizen, sent her my Gmail. She wrote back, “No sis, where is your home address?”

![A text message: “Hey girl do you have a mailing address I can send you something?” The reply is an email address. “Where you live address.”](/assets/blog/home-address-text.jpg)

There is something unique about an address. It is tied to you, to your human identity, and it is yours alone. And it is not only physical. Think about an email account on your own domain: someone else runs the server, every mail app can connect to it, and you can move providers without changing your address. The address is yours and the provider is replaceable.

It has been a while since we became digi-web citizens. We have left footprints everywhere: Reddit, Twitter, Tinder, RedNote, personal websites, and now thousands of conversations with AI. Yet we still do not have a home for our traces. Every one of them lives in someone else’s building, under someone else’s rules.

Olivia can send a card to my apartment. Where would you send something to my digital self?

## The answer is a home of your own

The clear solution to this problem is having your own personal data server.

A personal data server (PDS) is the one place on the network that is yours. It stores your records, vouches for your identity and decides which apps get in. It comes from AT Protocol, the open protocol behind Bluesky, whose own docs call it your [home in the cloud](https://atproto.com/guides/the-at-stack). In practice it is a hosted account that holds your identity and your data, so apps and agents connect to you, instead of each one keeping its own fragmented copy of you.

And no, you do not need a server in your closet. Someone can host it for you, the same way someone hosts your email. What matters is whose name is on the door, and whether you can leave.

## Why now?

This design matters now more than ever for one reason: with AI, whoever holds your accumulated context holds the switching cost.

Agents changed the math. It is now easy to pour unprocessed information in (notes, chats, half-finished thoughts) and have it come out structured. It is just as easy to pull it back out and morph it into whatever you need. So your context compounds. Every month of it makes the next month more useful, for your personal life and your professional one.

Models, meanwhile, are replaceable. The best one changes every few months. What it knows about you took years. So the real question of the AI era is not which model you use. It is where the “you” that every model reads from actually lives.

Right now the answer is: inside whichever company you happened to type it into.

## We tried this before, and it failed for a good reason

Big tech has attempted the personal record before, specifically with health. Microsoft launched HealthVault in 2007. Google launched Google Health in 2008. Both are dead.

Google Health [did not catch on](https://www.itnews.com.au/news/google-switches-off-health-life-support-261770) beyond tech-savvy patients, and the person who led it said why: it was just a data repository, and people did not want that. HealthVault survived until 2019, but it [stayed browser-based](https://www.thefresh.co.uk/blog/microsofts-healthvault-what-was-it-and-why-did-it-fail/), with no mobile app and no connection to wearables, so the data never arrived on its own. Among people who gave up on these records, a common reason was simple. They [did not want to spend time typing their data in](https://www.informationweek.com/electronic-health-records/5-reasons-why-google-health-failed).

The lesson is pretty clear. A store is only as valuable as what uses it. A filing cabinet means nothing when no one is opening the drawers.

Apple understood this. When it launched health records in 2018, the phone and the watch were already collecting data continuously, with no effort of typing anything in. So the store that wins is the one that fills itself and sits where people already are. A PDS has to live where people actually live.

That is exactly the part that changed. An agent turns stored context into something useful every day, so the drawers finally have someone opening them. And on AT Protocol the store fills itself, since your repository grows as a side effect of posting, following and writing in apps you already use.

## Big tech sees the same prize

Do not think the platforms missed this. They are building their version right now, around their existing ecosystems.

Google connected Gmail, Photos, Search and YouTube to Gemini in [January 2026](https://www.androidauthority.com/google-gemini-personal-intelligence-rollout-3632287) and called it Personal Intelligence. Apple [opened Siri to third-party apps](https://techjournal.org/siri-ai-third-party-apps) on November 3rd, 2026, through App Intents, where apps describe their content in [schemas that Apple defines](https://developer.apple.com/videos/play/wwdc2026/240/).

So everyone agrees. Context across all your apps is the prize. The only disagreement is who gets to hold it.

And their answer is always the same: them.

On a platform, the assistant that sees across your whole life is the platform’s own. Your context does not come with you when you switch ecosystems. The format is theirs. The rules are theirs. To be fair, this model does protect you from apps. It does not protect you from the platform.

But we are not bounded by one company. A platform is more or less a service that we use, and our agency should not stop where a company’s control begins.

## What happens when the platform holds your context

None of this is hypothetical. All four happened in the last two years.

- It gets repurposed. In February 2026 OpenAI [began testing ads in ChatGPT](https://www.theregister.com/on-prem/2026/02/10/openai-introduces-adsfor-the-people/4820407). Ad personalization is on by default, and when it is on, your past chats and saved memories can help decide which ad you see. OpenAI says advertisers never receive your chats. Still, the context you gave in order to be helped is now also inventory.
- It gets swapped out. In August 2025 OpenAI replaced the model people were used to, overnight. Users said they lost a familiar voice and workflows they had built, and Sam Altman [admitted](https://www.techrepublic.com/article/news-openai-reinstates-gpt4o/) the company had underestimated how much that mattered. Nobody asked us first.
- Delete does not mean delete. From May to September 2025 a [court order](https://www.malwarebytes.com/blog/news/2025/06/openai-forced-to-preserve-chatgpt-chats) made OpenAI keep chats that users had already deleted. OpenAI objected, and the order stayed in place for months anyway. When the only copy sits with a vendor, “delete” means whatever the vendor, or a judge, says it means.
- It disappears. Humane sold a $700 AI Pin, then [shut it down](https://petapixel.com/2025/02/19/humanes-ai-pin-is-dead-and-all-devices-will-stop-working-in-10-days) with about ten days of notice and permanently deleted all customer data.

This matters because whoever holds your context also shapes your interface: what you see, what you are offered, what you come to understand. Imagine the extreme version of personalized ads, built on everything you ever told an assistant at 2am. We should be able to know what a platform knows about us, and have control over what we consume on the internet.

And one more thing. If you do not own the operating system, you do not get to build the assistant that sees across apps. The platform model does not only lock users in. It locks out everyone else who might build something better.

## What does it look like?

![Your PDS: you, your identity and handle, point at it; it holds records (public, signed), media, private data and keys. Apps write with permission, agents read and act for you, feeds read what is public. Change your host and everything moves with you.](/assets/blog/home-address-pds.png)

Your entire digital identity points at the PDS, and the PDS holds four things:

- **Records.** Your repository: public records, signed with your key. Posts, follows, documents, one folder per app.
- **Media.** The photos, audio and video those records point to.
- **Private data.** Preferences and settings today, shared private spaces next.
- **Keys.** Your signature, your login, and the consent screen that appears when an app asks to come in.

Three kinds of things connect to it: the apps you use, your agents, and the feeds and search built from whatever is public. If you change hosts, the whole box moves and your identity is re-pointed. The apps and agents keep working. Like moving apartments and keeping your name.

To a normal user, honestly, it looks like almost nothing. You sign in with your handle and you see a consent screen. I assume that invisibility is one of the reasons this is not mainstream yet. The best version of it is infrastructure you never think about, like email.

## Why this is the stronger position

Context in a PDS is a stronger position than context in a vendor, for three reasons.

**It is wider.** A vendor’s memory covers only what you did inside that vendor. A PDS collects what you do across every app that writes to it, so the whole is larger than any one silo. That also means a better experience inside each platform, when the platform reads from you instead of holding you.

**It lasts.** Vendor memory gets rewritten or reset when the product changes. A PDS persists across model generations, so the compounding never restarts.

**It is connected.** Your records link to other people’s records. That gives an agent your network, not just your profile, which no single assistant holds.

## What is not solved yet

There still are few things are still missing.

- There is no mainstream agent product or infrastructure that reads from a PDS today.
- Everything in the repository is public. Private data on AT Protocol only reached [alpha in August 2026](https://atproto.com/blog/atproto-spaces-alpha), and it is access control, not encryption. Your host can still read it.
- Almost everyone is still on one company’s servers. The exit door exists, but few people have walked through it.
- Today your phone knows far more about you than your PDS does.

So this is an argument about structure and direction, not about what works perfectly this afternoon. Owning your context gives you control and an exit. Privacy is a separate fight, and it is the next one.

## We are still not late

The platforms are early in building their version. So are we.

This is the layer [ohm](https://ohmmmm.com/) is working towards: a hybrid of personal encrypted spaces, a layer for friends, and a public layer, so that your digital identity can surface across the agentic web, and web applications and platforms become what they should have been all along. Mere interfaces.

Olivia’s card will reach my apartment next week, because my address is mine no matter who delivers the mail.

My digital self deserves the same.
