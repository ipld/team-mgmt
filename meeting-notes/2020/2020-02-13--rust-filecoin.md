## IPLD Planning Meeting for Rust Filecoin 

Date: Feb 19, 2020
Attendees: Amer (@amerameen), Austin (@austinabell), David (@ansermino) (ChainSafe); vmx (Protocol Labs)


**Update from ChainSafe** 
Austin: Things are implemented but somewhat fragmented.

- Ensuring everything up to speed.
- David: I do see improvements are in place. Getting rid of some APIs
    - Big fear that David has is that we're implementing on these libraries

**VMX: Agree with the current state and the vision. The sooner the better**

- My impression is that it looks worse than it is.
- There are about 5 packages in total that need to be brought together
- Changes should be made to the Rust-IPLD library
    - async is out of date

**David: What do you anticipate Rust-IPLD to have in the future in this repo?**

- VMX: This crate won't use Serde in the future
    - The data model of Serde and IPLD are too different and it won't work going forward
        - Custom types and tags (CBOR)
        - Austin: Have been using serde with tags, not sure what the issue is.
        - VMX: explanation of why Serde isn't a good fit for IPLD: https://github.com/ipld/ipld/issues/83#issuecomment-579284535
- David: Status of dag-cbor?
    - Don't know current state
    - Shouldn't be used (it's async, but should be sync?): https://github.com/ipfs-rust/rust-ipld/issues/8
- David: How do you see us getting a working implementation into this repo?
    - This won't be ready in time for you
        - Keep using using cbor serialization that you current use, but
        - Use upstream lower level crates (i.e. Multiformats related ones) where possible.

**David: We would love to contribute as we develop Rust-IPLD**

- VMX: Often APIs change in Rust ecosystem, so we just want to get something reasonable done for Rust-IPLD
    - It's important to note that the API won't be stable
        - Ideas behind the API should stay the same
- Rust-ipfs team has a dev grant
- Did some work on a block API, think this is what you need
    - Serializing and traversing blocks
- No plans for CAR support
- Focus is making things work for Rust-IPFS people

**David: Any suggestions on implementing selectors?**

- Start with construction of the selectors
- Actual traversal would be going through a Rust data structure (array)
- IPLD schema vs native data structure. When do you use what?
    - Actual selectors will work on the data model
- There is a short hand for each of the selectors, when do we use these?
- How do you turn the selector to the data model:
    - [https://specs.ipld.io/schemas/](https://specs.ipld.io/schemas/)
    - Most schema types are 1:1 with the data model
        - structs is the exception
    - [https://github.com/ipld/specs/pull/239](https://github.com/ipld/specs/pull/239)
    - Go team should have fixtures for testing
        - currently they don't use fixtures, but construct them within the code:
          - https://github.com/ipld/go-ipld-prime/tree/80e0a4869d441166afa8f64eef11f2756e487658/traversal/selector
          - Complex example: https://github.com/ipld/go-ipld-prime/blob/80e0a4869d441166afa8f64eef11f2756e487658/traversal/selector/exploreRecursive_test.go#L178-L228
- Regular IPLD calls?
    - Current impression is that everything is fragmented, it needs to be defragmented, This is what vmx is working on.
    - vmx suggests a call in about two weeks.
        - ipfs dev grant is close to being approved. keep an eye on it.

- [https://github.com/PolkaX/rust-ipfs/pull/24](https://github.com/PolkaX/rust-ipfs/pull/24)

**ChainSafe timeline: 3-4 weeks for GraphSync working and Verifier node working**


**Going forward, please fork and change as necessary, but please merge upstream eventually.**

- Goal is that Forest is on the upstream version
- Please upstream AMT and HAMT as well
    - This is not as high of a priority

**vmx will send over a doc explaining why Serde doesn't work long term**

 - https://github.com/ipfs-rust/rust-ipld/issues/8
