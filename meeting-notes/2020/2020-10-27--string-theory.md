String theory meeting
=====================

Attendees:
 - @vmx
 - @ribasuhsi
 - @mvdan

Notetaker: @vmx


### Views on Data Model

It became clear that the Data Model means different things to different people:

 - @vmx: More like a mental model. It defines properties which we call kinds. Those kinds should be specific to a single thing.
 - @mvdan: The Data Model provides hints about certain types. It makes trade-offs between being too generic (everything is bytes) and too specific (integers of certain ranges). It is not about validation or constraints, it's a too complex topic other people take care of, e.g. [CUE](https://cuelang.org/).
 - @ribasushi: The Data Model is not specific enough. It should enable proper round-tripping across languages, but it does not. It is not concrete/specific enough. E.g. the `Integer` kind doesn't say anything about its size. What if a language and codec uses bigints. You cannot cleanly round-trip those.

@mvdan + @vmx + @ribasushi: Calling the Data Model kinds "hints" is a nice idea.


### Integers and Strings

 - @ribusushi: You can use very large integers which won't be supported by all implementations. This is not reflected in the Data Model. Integers are in a similar problem space as strings. The Data Model doesn't give an guarantees.


### Map keys

Map keys are different from Strings as values. Map keys and path segment must have the same kind. That kind must support arbitrary bytes.

Question is: how to name this kind?


### Meaning of strings

Strings mean so many different things to so many people. We want to have a kind which is clearly used for valid Unicode only.

Proposal: Rename the `String` kind to `Unicode`.

 - Pro: It clearly states its purpose.
 - Con: People might wonder: "Where is my String type?"

Someone might say "Filenames are strings", but would you say "Filenames are Unicode"?

This change implies that Map keys and strings as values are different concepts.


### Difference between UTF-8 and Unicode

The Data Model is rather abstract and not about concrete types. E.g. the `Float` kind is about fractions, it doesn't explicitly say it's a binary IEEE 754 double precision float. Although most programming languages and codecs implement it like that.

This applies to the kind that should contain Unicode as well. It's about valid Unicode, independent of the actual representation. Although it's probably UTF-8, in could also be e.g. UTF-16. Using UTF-16 directly might e.g. make sense for languages where UTF-16 is the encoding of the native string type.


### Discussions about RFC SHOULD and MUST

 - @mvdan: If you say "A programming language can expect that a Data Model string is valid Unicode", then it is the same things as a SHOULD, it is not a MUST
 - @vmx: When I say "MUST be Unicode" I don't mean that validation must be enforced
   - @ribasuhsi + @mvdan (+ @mikeal) say "MUST" also means that things must be validated
     - => then it should probably a "SHOULD"


### Takeaway

Needs further discussion: rename `String` to `Unicode` while saying that Unicode (RFC) SHOULD only contain valid Unicode code points.
