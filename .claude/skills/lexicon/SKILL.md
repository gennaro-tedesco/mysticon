---
name: lexicon
description: Use when adding fantasy dictionary or fictionary lexicon entries for requested characters, places, names, or lore terms.
compatibility: opencode
---

## Purpose

Create dictionary-style lexicon entries for fantasy characters, places, names, and lore terms requested by the user.

## When To Use

Use this skill when the user asks to create, add, draft, or update entries for a fantasy dictionary, fictionary lexicon, glossary, character index, place index, or similar reference.

The user may provide one name, multiple names, or a mixed list of characters, places, and terms.

## Required Workflow

1. Identify the exact list of requested entries.
2. Read the `AGENTS.md` file in the current working directory before drafting any entry.
3. Follow the lexicon format, style, source URL, and repository-specific instructions from that `AGENTS.md`.
4. Use only the wiki page indicated by `AGENTS.md` as the source of truth.
5. For each requested entry, find the corresponding wiki page. Always fetch wiki pages using direct API calls (e.g. the MediaWiki REST API or action API); never use the WebFetch tool.
6. Draft entries strictly from that wiki page only.
7. If a requested page is missing, incomplete, ambiguous, or does not contain enough non-spoiler information, report that clearly instead of inventing content.

## Source Rules

Use the wiki page specified in `AGENTS.md` as the exclusive source of truth.

Do not use:

- internal memory
- other websites
- fandom knowledge
- books, games, films, or adaptations not present on the wiki page
- inferred lore
- plausible but unsourced details

If the wiki page does not support a detail directly, omit it.

## Entry Requirements

Each entry must be:

- thorough
- lore-rich
- clearly written
- strictly derived from the corresponding wiki page
- spoiler-free
- suitable for a dictionary or lexicon

## Spoiler Policy

Avoid spoilers completely.

Do not include:

- plot twists
- deaths
- betrayals
- hidden identities
- late-story revelations
- final outcomes
- major character arc resolutions
- chronology that reveals future events

If the wiki page is spoiler-heavy, extract only safe introductory, descriptive, or contextual information.

## Content Guardrails

Do not include wiki metadata, navigation text, edit notices, citations, tables of contents, category labels, or maintenance notes.

Avoid:

- repeated names
- filler
- irrelevant trivia
- unsupported interpretation
- overly generic descriptions
- details included only to make the entry longer

Also avoid filling the entry with redundant useless details, like overblown descriptions of clothes, appearances and so forth.

## Missing Or Unsafe Entries

If an entry cannot be created safely, explain the reason briefly.

Use this kind of response:

`Could not create an entry for <name>: the wiki page is missing, incomplete, ambiguous, or too spoiler-heavy to produce a safe entry from the allowed source.`

## Output

- Produce only the requested lexicon entries unless the user asks for explanation. Keep the final entries polished, concise, and directly usable in the target lexicon.

- If you find that the entry is already present, determine nevertheless if it conforms to all the requirements above, in particular if it is lore-rich and spoiler free. If not, re-do it.

- At the end of the task, after having performed the changes, go through the requirements and conditions listed above and validate one by one if all of them are fulfilled. If even one isn't fulfilled the task is deemed as wrong and you must re-do it again, until you conform to each one of them.
