# Result cacheability pilot

This local pilot extends `CachedOptions<T>.cacheable` to
`boolean | ((value: T) => boolean)`. `T` is inferred from the loader through
`withCache` and the namespace adapter `Datasource.cached`. This is a result
predicate, unlike the removed `@cache` decorator's method-argument callback.

The synchronous predicate must be pure and return exactly boolean true to allow
caching; other runtime values, including promises, are denied. It governs fresh admission, warm reuse,
and stale fallback. `cachePrivatePackages` bypasses this privacy decision;
`shouldCacheResult` remains independent quality validation. Boolean false still
bypasses lookup and locking unless the administrator overrides it. Fresh
undefined is never stored; a denied fresh result is returned normally. Policy
exceptions propagate outside the loader-error fallback catch.

Denial concerns one value and does not delete or revoke the key. A stale accepted
snapshot remains eligible for later fallback even after a denied refresh. A
stored public classification is historical evidence, not a fresh upstream access
check. Immediate visibility revocation requires a separate preflight or origin
revalidation before reuse; this API does not supply that guarantee.

Cached values are deserialized unknown data. Typed predicates do not validate
storage. Callers must maintain serialization-compatible keys, validate old data
through `shouldCacheResult`, or version incompatible keys. Existing boolean calls
keep their runtime behavior. Predicate callers must choose their legacy policy.

## Selected epic tasks

Orb, issue #46009 under epic #45939, already returns `isPrivate` from its REST
package response. The pilot preserves missing/null visibility through parsing
and admits only an explicit public result from the canonical CircleCI cloud
registry without an Authorization header. Custom servers and unknown visibility
are non-shareable. `visibility-v2` separates old `datasource-orb` records whose
missing visibility was coerced to false. Quality validation rejects null even
with the administrative override.

Conda, issue #45977, demonstrates a metadata adapter: the Anaconda parser now
retains `public` and `access`, and the datasource marks a result shareable only
when `public` is explicitly true and `access` is absent or public. The exact canonical
`https://api.anaconda.org/package/` base and no Authorization header are also
required. Supported channel-prefixed registry forms (including those produced
by Pixi) remain non-shareable in this deliberately narrow pilot, even with
public response metadata. Legacy
`datasource-conda` values lack `isPrivate: false` and are rejected without a key
migration. Unknown/custom hosts stay non-shareable. The prefix.dev query still
lacks channel visibility; its results are conservatively non-shareable until a
separate adapter retains and checks `Channel.isPublic` across pagination. This
pilot does not complete that provider's selective-public caching task.

For both callers, `caching = false` bypasses the independent central
`datasource-releases-*` package cache by default, including its old entries.
The administrator override intentionally re-enables that outer cache and can
reuse private entries there. Turning the override off again bypasses the outer
entries and filters inner private entries. The unchanged release lookup memory
cache and HTTP GET memory cache remain execution-local caches; the HTTP cache
keys include prepared headers. Neither caller installs a persistent HTTP cache
provider. No claim is made that a denied result is absent from every cache.

Authorization-header detection is an additional conservative filter, not proof
that every possible deployment/network credential was absent. Custom headers,
proxies, certificates, redirects, and provider-specific authenticated field
visibility need separate provenance work for stronger guarantees. Hosted private
accounts and real public-to-private transitions were not exercised.

## Applicability beyond this slice

The API directly supports result values already retaining reliable eligibility,
as demonstrated by Orb. Conda's Anaconda path demonstrates preserving response
metadata through parsing rather than using a universal `!isPrivate` test.

Azure tags (#45968) and Bitbucket tags (#45971) need adapters retaining their
repository/project visibility and coordinating every inner and outer cache.
GitLab tags (#45996), releases (#45995), and packages (#45994) need feature/access
checks or anonymous route probes: project visibility alone can be insufficient.
Git refs (#45988) has no universal protocol visibility field. These require
provider-specific evidence or preflights, beyond a synchronous result callback.
GitHub digest (#45992) has lower GraphQL privacy handling and redundant outer
caches; changing an inner result predicate alone does not resolve its layering.
The Go fallback timing noted in #45949 needs source provenance carried out of
fetching before this API can distinguish proxy versus direct results.

A priori public-endpoint decisions remain boolean policies. Persistent HTTP
providers, downloaded files, direct package-cache operations, distributed
invalidation, and key collisions remain outside this change. This pilot neither
migrates all epic tasks nor changes their existing policy.
