IPLD docs&specs synchronous 2020-11-12
======================================

Meta
----

Add h3's in the agenda section for anything you'd like to discuss.

We'll cover what we can every week, and copy things forward to the agenda if we don't get to them and still need to.

### attendees

- @warpfork
- @willscott
- @ribasushi
- @mikeal
- @vmx
- @rvagg
- @mvdan


Agenda and Notes
-----------------

### Defining 'Any'

Issue: https://github.com/ipld/specs/issues/318

Problem tl;dr: One currently can't have a node in a schema which will behave interchangably with an untyped node; this is bewildering.
(This happens in two regards: one, you can't have null in the union; two, kinded unions have different type-level and representation-level semantics, and if you don't want that, it's weird to have it foisted on you.)

- Option 0: keep trying to use a kinded union for this, as-is
- Option 1: change defn of kinded unions: type-level behavior mirrors representation-level behavior.  Downer?  type-level behavior would be different for this than unions with any other representation strategy; very surprising.
- Option 2: 'Any' as a magic built-in type.  Forget this: strictly worse than Option 3, let's move on.
- Option 3: 'any' as a new type-kind

Rod suggests we should be careful about implementation details of our one implementation that drive decisions here,
vs whether these issues can be driven purely from the design level.

// Most of the following disucssion is somewhat tangental, but is probing the consistency rules around typekinds and their semantics in general

Maybe interesting maybe tangent: think about `&Any` vs `Any`.
Also: as a design langauge: `Link` vs `&Any`: these connote somewhat different things:
the former says I care about the link as an endpoint itself; the later says I'm linking into some more things that are unstructured but will walk.


Discussion: who cares about anything but the representation level at all?

Yes: if you created a struct with a tuple representation, and didn't get any of the behaviors of struct out of it, what was the point?

Can we do things like have a selector that aims at schema and gets compiled down to match on its representation?
Yeah.
Further Discussion: yes, but even though this is a very different implementation track than the two-node-interfaces-on-same-data approach,
interesting, _it shakes out to roughly the same implicatations_ anyway:
one still needs a defn of what the type level behavior _is_ in order to define an algorithm that transforms that behavior to behavior that's meant to be evaluated on the representation.

Refine: is it necessary for each typekind to have a single DMkind that it conforms to for its type level behaviors?  Could it be just orthagonal?
Currently go-ipld-prime believes each typekind has a single DMkind (ex: struct always acts as map).
But would it have to be like this?  Maybe not.
Having a typekind have a DMkind means things like selectors and pathing can apply over it trivially, which is nice.
Having a typekind have a *single* DMkind that's a deterministic property of typekind: is just _nice_:
system becomes much harder to explain and starts to have many more twisty conditions if this isn't a simple deterministic constant property.

Interesting example: structs with optional fields and representation strategy of tuple: optionals aren't allowed in all places!
This is an example where representation strategy choices do leak back up into type info -- uh oh: we're usually trying to avoid this.
But: okay, this is less bad than it sounds, because: this is something that you check while validating a schema,
and it's a go-or-no-go thing; it doesn't _change_ how the struct will be expected to behave in confusing ways.
So this is an interesting example, but *not* the kind of abstraction level leakage we want to have a hard line stance against.
The thing we want to avoid is having the expected type-level behavior _change_ due to a represetation strategy detail.
Having some type-level behavior definitions just be rejected because they're uncomposable is fine.

Volker: I see Schema level kinds as "more powerful" than DM kinds.
Should there be a distinction between Schema level kinds and DM kinds?
While DM maps only support strings as keys, should Schema level maps perhpas support other kinds as well?
The data would still be encoded as valid DM, but would have a different shape (e.g. like the listpairs representation for the map kind).

Warpfork: the first half of that describes what's already true.
The second half of that would make traversing typed maps the same way as data model maps into an undefined operation, which is a pretty big show-stopper.

Misc discussion of ADLs and other things having behaviors.
Tangents and much more discussed more rapidly than was possible to sort into notes.

Mikeal: we should document all the operations that can be performed on these things.
Some of this can be documented by saying what reprkind things behave as -- but it's maybe clearer to document things redundantly.
And things may have supersets of operations available as well, and that's easier to say if we just enumerate everything you can do.

Warpfork: yes to that, but be very very mindful of what's superset -- "yes some things have more features" does not imply we don't need some minimal subset of common features.
Still also important to mind that things have some common core functionalities.
Supersets are fine, don't confuse this with anything-goes no-promises-made.

### Reserved time for anything about Filecoin Schematization that needs discussion

- When I have a CID, I can refer to other data in other codecs, and it's clear.
- When I have a field that's bytes, but I know it's a CBOR message that just happens to be embedded in another document... there's no way to mark this right now?
- Is this a situation where an inline CID would actually be desirable?
- Could this be an alternative to inline CIDs (which can be used for such cases atm)?

Is there a way in IPLD Schemas to say
representation for "schema object _x_ encoded as bytes with codec _y_"
where such a field is really just bytes?

There's such a hacky thing done in the graphQL thing that Will has bound to the filecoin data.

Do we want this?

Not really

- there are many alternative ways to do what you want
	- why are you embedding documents like that, don't do that
	- try using CIDs and putting that data in another block
	- or even inline CIDs
	- or just do it and don't have an annotation for this; you'll live
- part of the utility of someone writing a structure like this may actually be to intentionally defer decoding
	- so we wouldn't nceessarily want to undo that?
- this would be an expensive thing to check
	- bit like the https://github.com/ipld/specs/issues/275 situation -- if we did this, we'd want it to be a relatively optional feature, late in the pipeline
		- definitely and absolutely would not want to make "schema matching" conditional on this, because then all of version detection would be dependent on this very complex feature, and that would be bad for the ecosystem

### Aliases in Schemas

Things like "type CborEncodedBytes bytes" would be useful sometimes

"type BitField bytes" + "type CertainThinger BitField" comes up a lot in the filecoin schematization efforts.

The documentational purpose of this is desirable.
Can we not break other things by doing it though?

Discussion about how in golang this would relate a lot to how type aliases work in golang;
which is really cool and might do awesome things for this...
but is maybe hard to translate to other languages, so unsure if we actually want to do something like this.

Can inheritance things do create similar things in many languages as to what golang type aliases would do?
Maybe.  We're not immediately sure.

General question here is: okay, we want to be optimistic about having features for this... IF someone has time budgeted to make it happen.
But more real question is: do we want to be optimistic and presume this feature can work... if we DON'T have time budgeted to make it happen right now.

### Describing filecoin: has the "implicit union" problem

// has been discussed elsewhere; didn't get time to this during this session

### Describing filecoin two ways: Schema using ADLs vs Schema flattening it

// didn't get to this
