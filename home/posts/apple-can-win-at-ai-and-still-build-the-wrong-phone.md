---
title: Apple can win at AI and still build the wrong phone
subtitle: The app has been the unit of everything on a phone since 2008. An agent’s task has no such unit.
date: 2026-11-22
number: "002"
writer: Haein Jung
---

<!-- The essay's full text, in Markdown. Text before the first "## " heading opens the essay;
     each "## " heading starts a section and becomes an entry in "On this page".
     Then run: npm run home:posts -->

We were walking through the streets of Shanghai, talking about phones, when he said the thing I keep coming back to. Whenever you start walking fast, your phone buzzes: should I track your outdoor walk? Yes, he said. Your job is to just track it in the background, and I will decide what to do with the info.

Sounded like the most reasonable thing anyone has ever said to a phone.

That is how I feel too. I do not want my phone to ping me at a weird moment when I don’t need it. I do not want my home screen and notification center screaming for my attention. I want it to be the canonical source of my information, quietly, so I can make the best use of technology in my own life.

The phone as a tool should carry out intent and the person should keep the authority.

## What an agentic phone should look like

Imagine Linda. One morning her flight is cancelled while she is stuck in a last-minute meeting. By the time she walks out, her phone has rebooked hers, moved the hotel by a night and messaged the two people she was supposed to meet. She taps twice to confirm. Afterwards there is one card: what changed, what it cost, and an undo for each step.

When she lands, she wants to split the trip and the bills in a way that actually works for her group. No app does it. So she describes it in plain words, and her phone builds a small tool in a minute, wired to her bank and her travel accounts. It is hers. She changes it by asking.

Nothing on her home screen screams for attention, because apps stopped earning money from keeping her there. Twitter is still around. So are games and videos, the things people actually enjoy doing themselves.

None of this needs a smarter model. Agents can already do much of it on the web. What stands between Linda and that morning is a quieter question: who does the agent work for? The person holding the phone, or the platform. A phone whose agent works for the platform is the version of the future we should refuse.

## The phone still thinks it is 2008

The App Store opened in 2008, and its model has barely moved since. You open one app at a time. You do each step by hand.

That made sense when a person was the only one doing the work. Now there is a second worker in the room, and we are asking it to tap through screens designed for human thumbs.

People are already trying. Some builders run literal phone farms. One San Francisco startup rents out real iPhones that robots tap, so agents can use apps built for people ([Runtime Wire](https://runtimewire.com/article/phoneuse-launches-ai-phone-service-founder-says-phones-are-c-7dc844)). Apple’s own answer this year was App Intents: Siri can call the actions a developer chooses to expose. Phone farms and App Intents are two workarounds for the same gap. The phone has no idea what an agent is.

And the gap is not hardware. Chips improve every year, and Apple already ships a 20-billion-parameter model that runs on the phone itself ([Apple](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models)). What has not moved on a yearly cadence is the operating system’s model of who is allowed to do what.

## Why Apple can’t just fix it

The reason Apple cannot build *the* agentic phone is more structural. Four things the company is built on all point the other way.

First is the sandbox. Every app is walled off from every other app, and that wall is Apple’s privacy architecture. iOS 27 added a system orchestrator for app actions, but apps still cannot call each other’s actions, and indexed content is “available to the system and to the system alone” ([WWDC26 Apple Intelligence lab](https://developer.apple.com/videos/play/wwdc2026/8011/)). Any agent that is not Apple’s own is locked out. The phone is built for humans and for Siri, not for your agent.

Second, privacy is Apple’s brand, and it has been burned before. It paid $95 million over accidental Siri recordings while denying wrongdoing. An agent that sees everything you do is hard to square with that, so Apple moves carefully. Almost too carefully.

Third, Apple does not let software change after it has been reviewed. Its App Review Guidelines say an app may not download or run code that changes what it does. Software that writes itself breaks that rule by design. The stance is clear: keep users inside the conventions.

Lastly, Apple’s business model, and the regulation around it, both sit on the app. Apple takes its cut at each app’s checkout. An agent that books a flight, a hotel and a dinner for you never passes through one app’s checkout, so there is nothing to take a cut of, and little reason to build it. And if Apple lets Siri reach deep into the phone, European regulators say rival assistants must get the same reach. The two sides could not agree on how, so Siri AI did not ship on iPhones in the EU.

Put together, every control Apple has hangs off one unit: the reviewed app. An agent’s task has no such unit, so the controls have nothing to hold.

## Software you make for yourself

Software is quietly becoming something a person makes, not something a person downloads. An app store assumes developers build for many users. AI makes it cheap to build for one person, then change it, or throw it away when the need passes.

Lovable reports about 8 million users and more than a million new projects a week, four in five of them non-technical ([Mercury](https://mercury.com/blog/vibe-coding-startups-no-code)). TechCrunch found people building their own restaurant pickers, allergy trackers and parking-ticket payers ([TechCrunch](https://techcrunch.com/?p=3082739)). It is still early. Only about 1% of people can do this today, because setup, security and deployment are still hard ([a16z](https://a16z.com/most-people-cant-vibe-code-heres-how-we-fix-that/)).

And the phone is exactly where it stops. To keep a native app you built on your own iPhone, you join Apple’s paid developer program at $99 a year. Then you still face a review process built for products with millions of users, not a small tool you made for yourself. So people fall back on web apps. You can build something in an afternoon and still not be allowed to keep it on the phone you own.

A different phone would treat that as the normal way software arrives: made on the device or your computer, scoped to its owner’s data, checked when it runs instead of before it ships.

## I am still the integration layer

Think about AirDropping a photo from your phone to your own laptop. You pick the file, pick the device, wait, then go find it on the other side. The feature itself is fine. The odd part is that you are doing the moving at all.

On an iPhone everything belongs to an app, and apps do not talk to each other. So I become the connector. Find the attachment. Save it. Switch apps. Upload it again.

An agentic phone should take that job away, and it starts with what I ask for. Today I ask for apps: open mail, open the bank, open the calendar. I would rather ask for an outcome, renew the lease, sort out Friday night, and let the phone work out which pieces are involved.

The pieces are already there. My messages, files, payments, calendar and places all live on the device. Today each one is visible only to the app that owns it. The phone should treat them as one body of information about me, so a PDF in my mail, a transfer at my bank and a date in my calendar are recognised as parts of the same job. And it should carry that job through, so a signature, a reply and a payment do not fall apart into three trips through three apps.

Then I deal with decisions instead of steps. The phone does the legwork between my intent and the result, and I show up only for the parts that need me.

The closest thing I have seen to a system built this way is Huawei’s HarmonyOS. Apps that support it can find nearby devices and borrow what those devices can do ([Huawei](https://support.huaweicloud.com/intl/en-us/usermanual-iothub/iot_02_2154.html)), and pass a task along in the state you left it ([Qt](https://wiki.qt.io/Qt_for_HarmonyOS/user_development_guide/application_continuation_guild)). A document opened on the phone is ready to continue on the tablet, and nobody sent it anywhere.

That matters more once an agent is involved. An agent does not need to imitate a person tapping through screens. It can call a function an app has published and pick up the work on whichever device fits. What I take from HarmonyOS is the division of labour: the system manages the devices and the data, and the person decides what should happen.

The real shift is organising the phone around the person instead of around apps. If that does not happen, AI just inherits today’s silos, and connecting them is still my job.

## What we have to think about

None of this is about a better chip or a smarter model. It is about a decision made in 2008: the app is the unit of everything on a phone. It is what gets reviewed, what gets permission, and what gets paid.

That decision made sense when a person did every step by hand. It makes less sense now that the phone can act for you and build what you ask for.

So the questions worth sitting with are simple. Who does the agent work for? Who is allowed to make software? And who decides what runs on the phone you own?
