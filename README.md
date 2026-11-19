# ohm-site

The public websites of ohm, one folder to a site. Each is edited and deployed from here.

| Folder | Address | Worker | Run | Deploy |
| --- | --- | --- | --- | --- |
| `home/` | https://ohmmmm.com, and `www` | `ohm-web` | `npm run home:dev` | `npm run home:check`, then `npm run home:deploy` |
| `docs/` | https://docs.ohmmmm.com | `ohm-docs` | `npm run docs:dev` (port 8791) | `npm run docs:build`, then `npm run docs:deploy` |

- `home/` is a Worker (`src/worker.js`) in front of static pages (`public/`), with a database of the people who joined the plan (`schema.sql`, `npm run home:joiners`). Its map is [home/README.md](home/README.md).
- `docs/` is authored in `docs/build.py`, which generates its HTML, Markdown and LLM copies.
- After a deploy of `home/`, `npm run home:seo` crawls the live site and checks it.
- The vault at `vault.ohmmmm.com` is not here. It is `vault/service/` in [haeinej/ohmmmm](https://github.com/haeinej/ohmmmm).

The commands serve only on loopback; no private launcher file, Cloudflare login or deployment is needed to run them. Build the docs before previewing an authored change. The docs build does not touch the live home.

Search and sharing: [human guide](home/docs/seo.md) · [agent reference](agents/public-sites-seo.md). `npm run sites:seo` crawls both live sites.

## Work on this repository

```sh
npm ci
npm test
```

**The docs read from ohmmmm.** Their Service API page is built from `vault/service/CAPABILITIES.md` in ohmmmm, and a test checks that the docs list every request the vault service registers and every vault tool. Both look for the `vault/` folder of a checkout of [haeinej/ohmmmm](https://github.com/haeinej/ohmmmm) beside this one (`../ohmmmm/vault`), or the folder `OHM_VAULT_DIR` names. Without it, `npm run docs:build` stops and says why, and that one test is skipped. The other tests need nothing else.

Deploying needs a Cloudflare login for the account in each `wrangler.jsonc`.

## Where this came from

These folders were `public/` in haeinej/ohm-vault, now [haeinej/ohmmmm](https://github.com/haeinej/ohmmmm) (before that, ohm-content-layer), until 19 November 2026, and their history came with them. `home/` came into that repository from the app repository (haeinej/ohm, `website/`) on 13 November 2026.
