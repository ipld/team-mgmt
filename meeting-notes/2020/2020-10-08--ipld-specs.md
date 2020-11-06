Docs Kickoff
============

Why We Are Here
---------------

**Why we are here**: Documentation and Specs improvement for IPLD is a key goal to growing our impact.
They're critical for making our work established as protocols, not just a soggy sack of implementation details.

**Proceding on that in practice**: has been difficult, because it requires a high degree of consensus.
So, let's set ourelves up for that: allocate time and make processes that get us to get things done.




Organizing and Shipping the work
--------------------------------

Let's make a cadence:

1. Group decision and commitment: what's the one thing we want, a week from now?
2. Someone is selected to be the Author of that work (hopefully volunteers, but :))
3. One week later: we meet to discuss.

This process is intended to address two things that make this work hard:

- destroy bystander syndrome -- someone is selected and making a promise
- get guaranteed review and break group noncommitalness -- we're going to review things on a cadence and stay aligned -- no gridlocks because of insufficient sync

Here are some other thoughts:

- One thing that's **not** specified in advance is: what stage of document you have to write.
	- it can be a an exploration report or a full documentation PR or a spec document.
	- Anything written counts as long as we can cite it somehow.

- One person is nominated Author.  (It's the concept of "DRI" but applied to docs -- same thing.)
	- One person can be nominated First Co-Author.  This person doesn't have the responsibility to write anything, but should be available to provide quick feedback on early drafts during the week.
	- Ideally these two will reach some consensus during the writing and reviewing, so there's two people who can explain it to the rest.
	- (If they don't reach consensus: they should both write exploration reports :))

### comments

- we don't want exploration reports to become semipermanent docs -- not ideal either
- we did have draft specs!  but hopefully a cadence improves this pace


Structuring the documentation
-----------------------------

### ideas about how to track progress on skeletons or other things

- if we have a cadence it should be possible to track plain issues pretty well
	- plus one'd
- stubs aren't very good at being visibily "open"
- issues in the specs repo have been difficult to manage because they include a lot of discussions
	- not sure how to improve on this?


- docs vs specs....
	- "nothing should be in the docs repo except things that can refer to specs"
	- maybe we focus on the specs repo for the rest of the year?
	- if it doesn't fit in specs we try to fit it in docs?
	- docs is to accept an influx of people...
	- 

- "must" and "should" are useful to be clear about
	- we probably don't care about the rest of RFC verbosity


### okay sidetrack: we're going to do a close-a-thon before anything new

#### wishes discovered from this process

- wish: add inline CID behavior to #286
- wish: update hashmap spec to say "code" instead of "identifier" following on to #277
- wish: #239 should probably turn into an exploration report file (@vmx will deploy a script)
- wish: where we specify the determinism requirements of the datamodel....... bigger question
	- probably a couple of concepts floating around here that need discrete vocab, even
- wish: #129 should probably turn into an exploration report file (@vmx will deploy a script)

... PR triage got rid of about half of them.

### meander

We discovered ourselves talking about the string situation again.

Our strings are like FFI.  We're integrating with things.  We gotta be comprehensive.




okay, some structuring talking for real
---------------------------------------


I want us to buy into the following as siblings, and as chapters in roughly this order:

- Blocks (includes CIDs)
- Codecs
- Data Model
- Pathing
- ADLs
- Schemas

n.b. this is not claiming these are a layercake model.
Just ordering for a TOC.

n.b. this is not claiming this is the exclusive set of stuff in the TOC.
Only that these things should be siblings.

### comments

- @wmv: yes.  codecs inside blocks is strange.
	- @mikeal: yeah.
- @mikeal: something common about selectors and paths but can't quite put my finger on it.
	- @vmx: could be traversals.

---

I want to decide where Selectors go.

- Are they a sibling in the above set?
- Are they a page within Pathing?
- Are they pushed further away, into an "ecosystem" heading (e.g. with graphsync)?

### comments

- @mikeal: probably a sibling, because it would like to pathing.
	- @warpfork: probably agree.
- @vmx: traversals as one of these siblings, and it contains pathing and selectors.
	- @mikeal: maybe if we get another query system, then... we would want this.
	- @willscott: i want to make graphsync work so maybe that?
		- @warpfork: yeah... i think that maybe goes in an "ecosystem" chapter though?
		- @willscott: btw we do need ADLs to become pathing supported before we can do graphQL or anything like that.
- @mikeal: we need an abstract pathing spec, and it focuses entirely on just splitting the segments.  Path parsing should be unified no matter what.

---

I want us to buy into the existence of several "vibe" oriented chapters:

- Overview
	- Every project has an overview chapter.  It just is.
- Vision
	- The vision chapter is where we put documents about content-addressing as a virtue, etc.
	- Objectives and Scope(-limits) go here too.
- Getting Started / Tutorials
	- Newcomers need to see these.  Should be somewhere in the first three entries on the TOC.

### comments:

- @mikeal: would like to not own the docs site, at some point, and someone closer to UX is, and they decide all this.
- @mikeal: getting started 



Bees exceptionally in our bonnet?
---------------------------------

### strings

"you have the strings things in there right?"

### numbers

- there needs to be a document about numbers
	- it goes in the data model
		- it needs to say more than just "int" and "float"
		- this should be very simple still: most of the complex fiddling bits should be pushed to specific codec documents.
		- unclear if consistency goes directly in this area or a separate primary document
- we will need a section on numbers for every single codec, pratically speaking.
- maybe some kind of recommendation document about how to convert an existing format to be more ipld-friendly
- maybe some kind of recommendation document for how you'd make a new codec that's pure ipld -- different than the above
- @vmx: both of these recommendations documents above could probably contain both numbers and strings discussions.

### hash-consistent serialization

- we need 'vision' scale docs for this.

### more

- documentation about why things are the way they are in our specs!
	- sometimes this is too verbose to include in the spec body as prose
	- make sibling files for each spec that has this concern: maybe "-motivation.md" suffix.
