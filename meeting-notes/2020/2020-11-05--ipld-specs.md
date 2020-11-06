specs synch 2020.11.05
======================


dag-json bytes: remove multibase prefix
---------------------------------------

The dag-json spec currently states a multibase prefix should be applied to the bytes encoding.
In practice, this is a constant "m" for base64.

We think this should be removed.
It is a (small, but present) barrier to interop;
it wastes a byte;
and it suggests that other bases might be supported, which they are not (and will not be, because that would be a baroqueness problem).

The current specification can be found here:
https://github.com/ipld/specs/blob/109d2f82f62787fef3754675764290a1b027b467/block-layer/codecs/dag-json.md#bytes-kind

### discussion

(riba): *which* base64 flavor? Still `m`? `u` is a much more desirable target given our chat on pathing segments...
https://github.com/multiformats/multibase/blob/master/multibase.csv#L21-L24

the concern is: slashes appear in the 'm' form of b64.  these can make CLIs handling CIDs and pathing complicated and it's not fun.

we don't care about this here: not talking about CIDs at all, just bytes kind.
bytes kind is always inside of a string value in json so we're not worried about slashes appearing, so 'm' mode is not a problem in this context.

we prefer the 'm' mode because almost everything uses that RFC and that's what there's native support for in browsers.

(CIDs are still CIDs and still contain multibase prefixes.  the IPLD spec when it discusses Link kinds basically treat this as opaquely as possible.)

### votes:

- define the bytes string as base64, no multibase prefix:
	- N in favor
	- N in opposition
	- even the originator says let's drop this prefix, this is a super done deal
	- we skipped a formal vote on this, it's basically unanimous that nobody really wants the multibase prefix in there


dag-json bytes and links: discuss parsing rules edge cases
----------------------------------------------------------

- How do we parse `{"/":"FF"}`
	- link (that's easy) (although probably broken, being that short!)
	- parse this as a link: fail during link parsing.  this is clear.
- How do we parse `{"/":{"bytes":"FF"}}`
	- bytes (that's easy) (assuming we ratify "no multibase", above)
- How do we parse `{"bytes":{"/":"FF"}}`
	- map with a key called "bytes" and a value that's a link (trick question :))
- How do we parse `{"/":1}`
	- ??? DISCUSS
- How do we parse `{"foo":{"/":{}}}`
	- map with a key called "foo" and a value that's... ??? DISCUSS
- How do we parse `{"foo":{"/":"FF", "uhoh":"zot"}`
	- map with a key called "foo" and a value that's... ??? DISCUSS
- How do we parse `{"/":{"bytes":"FF","uhoh":"zot"}}`
	- ??? DISCUSS
- How do we parse `{"/":{"bytes":"FF"},"nope":true}`
	- ??? DISCUSS

The parsing rule we state colloquially is:

- if it's an object with one entry
- and it's key is a slash
- that's ours.

Is this really true though?
Oh, but that's really hard.  If you get a second entry in a map: you might have to backtrack (a lot!).

Reviewing: It's unavoidable that we eat up some keyspace in order to keep dag-json *near* json.

Do we have escaping: we do not, historically.  (Unfortunate, but true.)

Should consider: are we just pushing a bug further and further into edge cases without fixing it?
Are we making the parser rules more complicated and more likely to be implemented incorrectly?

So there's big agreement that the rule we pick need to be simple to explain and simple to implement.

Discussion of ``{"/":{"bytes":"FFF.......9000 bytes later..... FF"}, "shit": "really late in the stream"}`

^ if we agree that this is an error it's a DOS issue but maybe viable in correctness
no: retract that statement: it's not a DOS issue -- this amount of parsing is a table-stakes resource budgeting issue, it's not exceptionally bad.
AS LONG AS: the reaction to that later second key is a parse error and halt, and not a backtracking -- if we did backtracking at this point, it *that's* a new form of cost we aren't sure we want.

Concerns raised about the problem that user-provided maps aren't safe in general, if this "/" does so much, and we have no escaping.

Serious issues for the whole group to accept that dag-json is an incomplete codec.
It's very frustrating to have to admit this, we all agree.
Important to be clear: in the situation we have today: it *is* an incomplete codec.  If we want it to be complete, that means changes.  Which we have limited maneuverability on.

Discuss `{"ok": "fine", "/": "weird but fine?"}`

^ concerns that -- given also that dag-json has sorting rules -- sorting rules in combination with a rule that "/" only switches parser mode if it's the first entry in a map: then this would mean the sheer presense of some values (e.g. ".") might change the validity.
What does this mean about documents that don't obey canonical sorting order though?
Is this a reason to discuss the sorting rule -- would we regard this object differently if we didn't have the sorting rule?

History review: the thing with a slash was introduced by IPFS, before IPLD was even a thing.
It was a lot less problematic in that context because at the time they had a limited funnel for creating this data, and at that time it was reasonable to use it to insure single objects with slash keys didn't enter data in the first place.
This is no longer true!  (And hasn't been for a while.)

Conclusion: we're now more aware of some of the issues here.
To move forward, we need to write a step-by-step list of parse instructions, including being very clear on what's going to halt with error.
(This is important to be clear about because parsers that try to limp along and "interpret" data farther than others will breed incompatibilities (and also generally be more expensive, so we don't really want to let the ecosystem grow them).)
Once we have a step-by-step form that's clear enough to slap a label on and vote on it, we can have this conversation again.


let's get more selector examples into specs
-------------------------------------------

https://github.com/ipld/specs/issues/327

Anyone opposed to replicating these JSON files into the specs repo?

### discussion

Yeah, let's just go ahead with this.
If we later decide there's a better place for fixtures, we'll move them.
For now, let's gather them up.


Review DAG-JOSE spec contribution
---------------------------------

https://github.com/ipld/specs/pull/269

We should take a look at this because a close collaborator has pinged.
Do we have an opinion on who owns this (either most knowledge, or most concern with topic)?

### discussion

Okay, very few of us have the full context in this.  Someone will have to go deeper on this.
(Probably Mikeal or Warpfork.)


discuss invariants for IPLD codecs
----------------------------------

https://github.com/ipld/specs/issues/328

### discussion

"If we do DAG-{whatever}, I would like it to be valid {whatever}, according to the {whatever} spec."

(riba): this is a different statement than round-trip.

mention of strict encoding vs strict decoding

"ideally".  if it's not possible then it's not possible.

discussion becomes discussion of strings.

proposal that we parse data that contains non-unicode strings, but 

sometimes you can't tell the difference between strings that are "new" vs strings that we've decoded and are worried about round-tripping.

lesson we should learn from this: make the arguments concrete.  use fixtures.

other codec fun questions: floats between codecs generally don't "roundtrip".
complicated topic.
floats are difficult to roundtrip in interesting ways in json (`.0` difficulty in some contexts; base ten serially and bitwise things in computers are also very different);
floats are difficult to roundtrip in cbor (various encoding precisions).
floats are also definitely not "roundtripping" between changes in codec -- the base-10 issue in json for example also definitely makes this not fly.
(but: we probably would consider maintaining precision _between_ codecs a slightly different issue than round-tripping within one codec to itself.)
moving on from this very quickly because it's clearly a deep pit we could tumble into for quite some time.

okay, agree this definition doesn't work.
the proposal's idea is to emphasize creating valid data.
but it doesn't always survive with the goal of round-tripping data that we see and parse.
not sure how to phrase this.


Defining Any
------------

https://github.com/ipld/specs/issues/318

Punted until next week; EAGAIN.


Changing to CC-BY
-----------------

https://github.com/ipld/specs/issues/298

We are a little concerned about licensing on specs... specs and docs are maybe a little different and we should be mindful on that.
There are arguments against using code license for docs, but specs are distinctive.

Also, ask Ian.


Should we record these?
-----------------------

Well, maybe.  Maybe not.
Meetings that take a lot of twists and turns while discovering something, play by play of every twist isn't always necessary or useful to reread later.
Sometimes it's better to emit artifacts on only what was actually decided or learned and not the confusion along the way.
(Also: forces us to take good notes and focus on resolution _during_ the synchronous time, which is itself a useful forcing function.)
