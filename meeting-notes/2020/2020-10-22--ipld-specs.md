2020-10-22 docs
===============

What do we think "multicodec" means anyway?
-------------------------------------------

https://github.com/ipld/specs/issues/288

- Main issue of confusion: this table called "multicodec" contains a ton of references to stuff that... are not what we'd call "Codecs" in IPLD land.
	- for example: multihash is also referenced by the multicodec table.
- Also a consideration: what is this thing in the CID prefix called?
	- it's definitely called a multicodec something.
		- "multicodec code" by some
		- "multicodec indicator" by some
	- and it definitely only makes sense for it to specify something that's a codec (not, e.g., a hash)
	- this does seem pretty darn conflictory with the "multicodec table" containing a bunch of references to multihash!

- Option: rename it to "multicode" table.
	- Question: will that clarify sufficiently, or will we have a conversation similar to this in 6months?

- Is this the answer?: https://github.com/multiformats/multiformats#multiformats

- Other issues:
	- Do we like this table being all in one?
		- Some: no.
		- Some: yes.

- Detail:
	- "Multibase" is the _one_ thing that's not in the "multiformats" table.
		- Why?  Multibases are not integer values.  They're characters.

- Concern: if we push a rename of this, should we make "multicodec" a scarred earth term?
	- at least one opposed

- VOTE: Do we want to push a rename of this?
	- 5/6 in favor
	- 0/6 opposed

- VOTE: Do we want to rename to "the multiformat table"?
	- 1/6 in favor
	- 1/6 opposed

- Other rename ideas:
	- "multi-ID table"
		- ribasushi proposes that multihash multicodec but not multibase.  All of multihash, mulicodec, and multibase are multiformats.

---

ribasushi story time
--------------------

- I came to PL as part of a quest to save files.
- That means POSIX, in practice.
- I have no guarantees about any kind of encoding.
- "I don't care what Strings are.  I care that I be able to build things interoperably."
- That means they need to carry all possible bytes around.

---

pathing, strings, and fun
-------------------------

many words are had

### possible future option organizating

(where "text" means "strictly unicode (which?)")
(where "string" means "it's secretely bytes but we really nudge you hard to be utf8 strings")

top row is the things we have in the data model Kind enum

left column is how we solve the definition of maps

|                  | `{string\|bytes}` | `{text\|bytes}` | `{string\|bytes\|text}` |
| ---------------- | ----------------- | --------------- | ----------------------- |
| `mapkey=string`  |                   |                 |                         |
| `mapkey=bytes`   |                   |                 |                         |
| `mapkey=text`    |                   |                 |                         |
| `mapkey=[mixed]` |                   |                 |                         |
| `[many mapkind]` |                   |                 |                         |

^ this is a prototype table developed during the conversation; we'll marinate on it

### things that need an answer

- What is this line in the selectors spec supposed to say: https://github.com/ipld/specs/blame/fd3697982f031405ffa00fff71801d3759d06f1f/selectors/selectors.md#L77
	- Key highlights of this: Selectors are describing *other data* in the Data Model, so, one way or anyother, what currently is stated as "String" on that line **must** be the **same** as the definition of what map keys are.

### also fun

- dag-pb link names: are they actually bytes, but we consider them as strings in many places?
	- yes, yes it seems so.
	- https://github.com/ipfs/go-merkledag/blob/master/pb/merkledag.pb.go#L437
	- JS: it does an "encode" the string

### takeaways

- Volker totally agrees map keys being bytes, at any rate, we all seem to agree on that.
- Ribasushi would implement this using bytes, regardless of what the spec says, so that it's clear to him what the library is actually doing.
-
