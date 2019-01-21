## Attendees
Mikeal
Jeromy
Juan
Steven
Volker
Pedro
Molly

## Agenda
1. more clearly unify our understanding of problem motivation and constraints for GraphSync
2. discuss the pros and cons of our current proposals - [Proposal C](https://github.com/ipld/specs/pull/78), [Proposal B](https://github.com/ipld/specs/pull/75), [Proposal A](https://github.com/ipld/specs/pull/66), [Replication Repo](https://github.com/ipld/replication/issues/1)
3. unblock a path forward to choose/merge/iterate on a proposal and define next steps

# Notes
### History
- Been trying to do something around replication that would fit many other scenarios
- Two requirements to make this maintainable
  - Wire protocol needs to be really simple (stream of responses, stateless)
    - A request shouldn’t require knowledge of prior requests
    - You should be able to use outside info, but not require it
    - Cancels, replace, request - sounds stateful, but TBD
    - Want to enable the wire protocol to have a response that references two initial requests (but maybe nice to have, not needed for mvp)
  - Going to iterate on selectors without fracturing the network
    - Want peers to specify which parts of the grammar they support before diving into things

### Problem motivation
- Blockchains and large trees with similar characteristics need to sync graphs of data efficiently
- Proposal needs to include ability to change selectors over time (be extensible) by adding new types
- Need room in the protocol for overlapping requests which dedupe into a single response (eventually)
- Want to be able to ask for two graphs that are highly overlapping and have people start sending responses
  - As long as the server can send back shared response, can send back multiple request ids with the same blocks
  - Primary motivation is deduplication (auto union) - don’t think there is much overhead of sending these as 2 messages if buffer correctly
  - Would an “and” grammar obviate this? Canceling an original broad request and sending two sub requests separately should allow for deduplication
  - Flexible wire protocol allows adding fancy things later
  - Boolean “full” - everything not in this list, cancel
    - When rebooting a connection, want to be able to send the full want list so as to close all hanging requests that are no longer interesting at once
- Not designed to send all messages over the same stream (more message based over a variety of streams)
  - Should we build this on libp2p substream implementation or make this message based?
    - Most of our bugs come from tracking peers in bitswap and pubsub
    - A single stream per request would make things simpler, but we may not want to make all responses have to come in on the same stream
    - If get blocks out of order, then proving we’re getting the right data will be hard
    - If getting stream of data, then that data should be ordered
    - Should be done such that easy to check the data
    - Other problem is about two separate messages that might be swapped in terms of order
    - Whole protobuf would arrive with it’s contents ordered
  - Want protocols to be resilient to one side getting in a wonky state (ex on accidental close)
- Want a trustless protocol - hard to send the structure of the graph along with the data because very large

Proposal C could be a subset of B with a limited set of selectors

## Next steps & timeline
- Want MVP version of Graphsync in go in Q1
  - Additionally has performance improvements for IPFS, but don't have direct benchmarks to chart this yet
- Proposal - implement selectors as a separate piece and implement replication separately / in parallel
  - There is an issue in replication repo of “things needed to do” via selectors
  - Succinctly express pulling an entire chain
  - Want to be able to say, from this head pull out all the blocks (not messages in blockchain)
    - Aka every connection between these two points (aka with a cid terminator or with “number of points”)
  - Path selector and glob would both be useful for ipfs (helps for pulling out directories)
- Idea for all selectors stuff to live in ipld, and selectors stuff that moves around graphs to either live in ipld or maybe libp2p
- How to own this work?
  - Given selector store, go get all these blocks - @vmx/@warpfork
  - Wire protocol - pull in ipfs folks because needs to land in ipfs (someone on go and someone on js)
  - Prototyping these quickly will be less time consuming and allow sharing state quickly
    - Should be possible to try out a proposal quickly
  - For now completely separate selector and wire protocol work
    - There is already a partial js implementation for selectors, @warpfork could do the go side (TBD, confirm with him)
    - Need a list of test vectors that both js and go test against
    - Actual protocol implemented by @hannahhoward or @whyrusleeping

### Action items: 
  - @vmx, @mikeal - Review Juan's selectors proposal along with mvp subset
    - Tentatively: Cid, path, glob, + a recursive blockchain one
    - Unions and multiple selectors at once are both not rooted at the same node (so need to add that to Proposal B)
  - Sync up between @hannahhoward, @stebalien, @whyrusleeping on wire protocol work to see if there's bandwidth to pick this up
  - Connect with @warpfork re go-ipld selectors
