# PLAN — Storyboard (Picture Collage) Implementation

Implementation plan for `PICTURE_COLLAGE.md`'s Part 1 (and the parts of Part 2 that don't
need TPN features that don't exist yet), grounded in the actual code in this repo and in
`C:\source\repos\ThirdPartyNetwork` — not the aspirational version either doc originally
sketched. Part 3 (image editing) is intentionally not scoped here; revisit once Part 1/2A
ship.

---

## 0. Decisions, up front

### 0.1 Tags: local to AtHomeServer, open-edit, no TPN involvement

Confirmed with product: MVP userbase is small and trusted (friends), so tag edit rights
need no ownership/approval model — **any authenticated network member can add or remove
any tag on any file they can see.** No suggestion/approval workflow, no per-tag author
tracking beyond an audit `added_by` column.

Given that, tags live in **AtHomeServer's own Postgres**, not TPN, because:

- TPN has zero concept of tags today (checked: no `Tag`/`ContentTag` anywhere in its
  models, migrations, or PLAN.md). Adding one means extending TPN's schema, migrations,
  and the generic `ContentKind`-polymorphic pattern it already uses for grants/moderation
  — real scope, in a repo that just shipped its "Wave 1" a day ago and has a "Wave 2"
  already queued (§1 below).
- Open-edit-by-anyone needs **no authorization model at all** — the one thing that would
  make "put it in TPN" compelling (reusing `ContentAccessGrant`'s capability system to
  gate who can edit a tag) is exactly the part this MVP explicitly doesn't want. A bare
  table with no ACL is simpler and correct for the stated requirement.
- TPN's file-listing endpoints don't support filtering by anything (§1.3) — so "browse by
  tag" already requires AtHomeServer to hold and query its own index of files regardless
  of where the tag strings physically live. Keeping tags local doesn't cost an extra join
  across services; that join is unavoidable either way given TPN's current API surface.
- Nothing else consumes TPN today that would want generic tagging. Building it into TPN
  now is speculative generality for a single consumer.

**Revisit trigger, not a permanent decision:** if a second TPN-backed app wants generic
content tagging, or once TPN's list endpoints grow real filtering/search, reconsider
migrating tags into TPN using the same `ContentKind`+`ContentId` polymorphic shape
`ContentAccessGrant`/`ContentModerationFlag` already use. The local schema below (§3) is
deliberately shaped close to that pattern so the migration wouldn't be a rewrite.

### 0.2 Story data: local to AtHomeServer, not TPN `CustomPage`/`PageBlock`

Unchanged from the earlier review: stories (title, ordered image list, captions, location,
co-editors) are modeled in AtHomeServer's own DB, referencing TPN file IDs for the actual
media. `PageBlock`'s own sharing granularity is still an open, undecided question in TPN's
PLAN.md (unchanged since last check, see §1.4) — don't build load-bearing product features
on top of a data shape its own author hasn't committed to.

### 0.3 No thumbnail dependency for MVP — use a second uploaded file instead of waiting on TPN Wave 2

TPN's PLAN.md now has a "Wave 2" section (added since the last review, not yet built —
see §1.1) that plans on-demand resized image variants. MVP doesn't wait for it: at upload
time, the client generates a downscaled preview (e.g. max-800px, canvas-based resize) and
uploads it to TPN as a **second, ordinary file** alongside the original. AtHomeServer's
local `MediaItem` row stores both `tpn_file_id` (original) and `tpn_preview_file_id`
(preview). The gallery renders previews; detail/story views can request the original.
This uses TPN capability that already exists (upload a file) instead of capability that's
only planned, and it's strictly better than serving full-resolution images inline (today's
only alternative). Drop this the day W2.1 ships and a real resize-on-request path exists —
tracked as a follow-up, not a permanent second-file hack.

### 0.4 Pagination: solved locally, doesn't wait on TPN either

TPN's file/content list endpoints are unpaginated today, and even Wave 2's planned
pagination (§1.1) wouldn't help directly, because AtHomeServer needs to paginate over its
**own** `MediaItem`/`Story` tables (joined with local tags/captions), not over a raw TPN
file list. `BaseRepository.get_page()` (`backend/infrastructure/database/repositories/_base.py`)
and the `Page[T]`/`BaseSearchQuery` schema (`backend/core/common/schema.py`) already exist
and are already used by the gym feature — reuse them as-is. No new pagination primitive
needed on either side.

---

## 1. Recheck of TPN's PLAN.md — gap audit

Re-read `ThirdPartyNetwork/PLAN.md` in full, including its **uncommitted local changes**
(a "Wave 1 Implementation Review" and a "Wave 2 — Planned Features" section were added
since the version reviewed earlier this session — not yet merged, not yet built).

### 1.1 What Wave 2 (planned, unbuilt) would fix for us

| Wave 2 item | Status | Relevance here |
|---|---|---|
| W2.1 on-demand image variants (`?width=&height=`) | Planned only — no `FileVariant` table, no `SixLabors.ImageSharp` dependency, no code exists yet (confirmed by grep) | Would obsolete §0.3's second-file workaround once shipped |
| W2.2 universal pagination (`PagedResultDto<T>` on ~30 list endpoints) | Planned only, same as above | Doesn't actually help us — see §0.4, we paginate our own local tables regardless |

Neither is implemented. Don't design MVP around either being available.

### 1.2 Still genuinely missing from TPN's plan (Wave 1 or Wave 2), not just "not yet built"

These aren't scheduled in either wave — flagging so they don't get assumed-available later:

- **No bulk upload endpoint.** `POST /networks/{id}/files` takes exactly one `IFormFile`.
  Bulk upload from the client is N sequential (or client-throttled-parallel) requests —
  workable at trusted-friends scale, not addressed by either wave.
- **No batch grant endpoint.** `POST .../{fileId}/access` is one file at a time. "Share
  all except these 3" after a 50-photo bulk upload is up to 50 sequential grant calls.
  Fine at this scale; would not survive a larger userbase without a batch endpoint TPN
  doesn't have and hasn't planned.
- **No tags, captions, or geolocation fields on `File`.** Confirmed still absent — matches
  §0.1's decision to keep these local.
- **`ExternalContentKinds` / cross-network adoption (§2.6 of TPN's plan) is irrelevant
  here** — AtHomeServer operates against a single fixed TPN network
  (`config.auth.NETWORK_ID`), so there's no second network ever adopting this content.
  Noted only so nobody spends time wiring it in later by mistake.

### 1.3 A real bug this plan depends on, not just a gap — flag back to TPN before building the profile-gallery page

`UserProxyContentController.GetFiles` (and its `blogs`/`configurations`/`customPages`
siblings) is gated `[RequirePermission(IsUserOwner, ReadFile)]`, and its repository method
(`UserContentBaseRepository<T>.GetByUserProxyIdAsync`) does **not** call
`GetAccessibleQueryableAsync` — no `AccessLevelVerifier` predicate, no grant check, just
`AuthorUserProxyId == userProxyId`, unfiltered. Compare to `GetByNetworkIdAsync`, which
correctly runs the access predicate.

Net effect: **any network member holding the ordinary `ReadFile` permission can list every
file another user has ever uploaded — including `Draft` and `Private` ones — through this
endpoint**, entirely bypassing `ContentAccessGrant`. `ReadFile` is exactly the kind of
permission a normal member (not an admin) would hold by default, so this isn't a
theoretical admin-only bypass.

This directly blocks PICTURE_COLLAGE.md's "profile page — see all images the user has
uploaded, filtered to public/shared-with-you" requirement (Part 2B): today, calling this
endpoint as anything other than the owner returns the user's *entire* library, not the
visibility-filtered subset the doc describes. **Needs a fix on the TPN side (route
`GetByUserProxyIdAsync` through the same access predicate `GetByNetworkIdAsync` uses)
before Part 2B's other-user profile view can be built safely.** Doesn't block Part 1 (own
uploads, own gallery) or Part 2A (stories) — only the "browse someone else's uploads" view.

### 1.4 Unchanged from last review

- `PageBlock` sharing granularity: still explicitly an open question in TPN's plan (§2.3).
  Not our problem since §0.2 avoids `PageBlock` for stories entirely.
- No video transcoding anywhere, none planned. Raw upload + direct browser playback of
  whatever codec a phone produced is the only option; a real compatibility risk for Part 1
  video support, not solved by anything in either wave.
- "Draft visible to more than the author" (Wave 1 Implementation Review, divergence #1) —
  worth knowing about but doesn't block anything here since MVP always explicitly
  publishes before sharing (§4.3).

**Answer to "are all the features we want now in there?": No.** Two of the previously
flagged gaps (thumbnails, pagination) now have a plan (Wave 2) but zero implementation;
this plan doesn't depend on either (§0.3, §0.4). Bulk upload, batch grants, tags/captions/
geo are still absent and not scheduled — this plan keeps those local or does them
client-side in a loop. And §1.3 is a new, actual bug (not a missing feature) that blocks
one specific sub-feature (Part 2B) until fixed upstream.

---

## 2. Prerequisite — Part 0: build the missing TPN client

AtHomeServer's TPN integration today is **auth-only** (`backend/infrastructure/trojonetworks/`):
login, token refresh, `/me`, `/me/permissions`. Nothing calls TPN's File, ContentAccessGrant,
or ContentViewingLink endpoints. This has to exist before any Storyboard endpoint can work.

Per `backend/PLAN.md`'s own §2 ("Introduce Infrastructure and Integrations Layers"), new
outgoing HTTP client code belongs in `infrastructure/trojonetworks/`, not scattered into
use cases directly — follow that shape now rather than adding more of the debt that plan
already calls out.

New client surface, `infrastructure/trojonetworks/service/files_client.py`
(mirrors `api_client.py`'s `_request_handler` pattern):

- `upload_file(network_id, access_token, file_bytes, filename, content_type) -> httpx.Response`
  → `POST /networks/{network_id}/files`
- `get_file(network_id, access_token, file_id) -> httpx.Response`
  → `GET /networks/{network_id}/files/{file_id}` (also returns `ViewingUrl`)
- `list_network_files(network_id, access_token) -> httpx.Response`
  → `GET /networks/{network_id}/files` (unpaginated, access-filtered per §1.3's *correct*
  sibling method — used only for the "own network's shared files" browse case, not synced
  wholesale; see §4.4 on how this is actually used)
- `publish_file` / `unpublish_file` → `POST .../{file_id}/publish` / `/unpublish`
- `create_access_grant(network_id, file_id, grant_dto)` → `POST .../{file_id}/access`
- `revoke_access_grant(network_id, file_id, grant_id)` → `DELETE .../{file_id}/access/{grant_id}`
- `get_access_grants(network_id, file_id)` → `GET .../{file_id}/access`

New DTOs under `infrastructure/trojonetworks/dtos/files.py` mirroring TPN's `FileDto`,
`CreateContentAccessGrantDto`, `ContentAccessGrantDto` shapes (`GranteeType`, `Capabilities`
as the flags TPN defines) — same convention as the existing `dtos/auth.py`/`dtos/user.py`.

All calls need the caller's TPN access token — same pattern `fetch_user`/`fetch_user_permissions`
already use (`Authorization: Bearer {access_token}` pulled from the session), and
`config.auth.NETWORK_ID` for the network segment, same as the rest of the app.

---

## 3. Data model (AtHomeServer's own Postgres, SQLAlchemy)

New file: `backend/infrastructure/database/models/storyboard.py`. Follows the existing
`Base` convention (`id`/`created_at`/`updated_at` inherited, see `_base.py`) and the gym
feature's relationship style.

```python
class MediaItem(Base):
    __tablename__ = "media_item"

    tpn_file_id: Mapped[uuid.UUID] = mapped_column(unique=True)
    tpn_preview_file_id: Mapped[uuid.UUID | None] = mapped_column(nullable=True)  # §0.3
    media_type: Mapped[str] = mapped_column()  # cached from TPN's MediaType, avoids a refetch for gallery filtering
    uploaded_by_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"))
    uploaded_by: Mapped["User"] = relationship()

    caption: Mapped[str | None] = mapped_column(nullable=True)
    latitude: Mapped[float | None] = mapped_column(nullable=True)
    longitude: Mapped[float | None] = mapped_column(nullable=True)

    tags: Mapped[list["MediaTag"]] = relationship(back_populates="media_item", cascade="all, delete-orphan")


class MediaTag(Base):
    __tablename__ = "media_tag"
    __table_args__ = (UniqueConstraint("media_item_id", "tag_normalized"),)

    media_item_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("media_item.id"))
    media_item: Mapped["MediaItem"] = relationship(back_populates="tags")

    tag: Mapped[str] = mapped_column()             # as typed, for display
    tag_normalized: Mapped[str] = mapped_column()  # lowercased, for the uniqueness/lookup index
    added_by_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"))
    # §0.1: no owner/permission check on delete — any authenticated member may remove any tag.


class Story(Base):
    __tablename__ = "story"

    title: Mapped[str] = mapped_column()
    created_by_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"))
    cover_media_item_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("media_item.id"), nullable=True)
    latitude: Mapped[float | None] = mapped_column(nullable=True)
    longitude: Mapped[float | None] = mapped_column(nullable=True)

    items: Mapped[list["StoryItem"]] = relationship(back_populates="story", cascade="all, delete-orphan", order_by="StoryItem.position")
    editors: Mapped[list["StoryEditor"]] = relationship(back_populates="story", cascade="all, delete-orphan")


class StoryItem(Base):
    __tablename__ = "story_item"

    story_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("story.id"))
    story: Mapped["Story"] = relationship(back_populates="items")
    media_item_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("media_item.id"))
    position: Mapped[int] = mapped_column()
    caption_override: Mapped[str | None] = mapped_column(nullable=True)  # per-story caption; falls back to MediaItem.caption if null


class StoryEditor(Base):
    __tablename__ = "story_editor"
    __table_args__ = (UniqueConstraint("story_id", "user_id"),)

    story_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("story.id"))
    story: Mapped["Story"] = relationship(back_populates="editors")
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"))
```

Notes:

- `MediaItem.uploaded_by_id`/`Story.created_by_id`/`StoryEditor.user_id` all FK straight to
  `user.id` — confirmed `_persist_user` (`application/auth/usecases/refresh_user_session.py`)
  upserts the local `User` row with `id = session.profile.id`, i.e. **local `user.id` already
  equals TPN's `UserProxyId`**. No separate identity-mapping table needed.
  `AuthorUserProxyId` on the TPN side and `uploaded_by_id` here are therefore the same GUID
  for the same person — worth relying on, not re-deriving.
- `MediaItem` deliberately does **not** cache TPN's visibility tier or grant list. Tier is
  re-derived live from TPN on read (§4.4) — caching it here would recreate exactly the
  "two things that must independently agree" failure TPN's own plan explicitly designed
  around (its §2.1). `MediaItem` is a local *index* (for tags/captions/pagination/join),
  not a second source of truth for access control.
- New Alembic migration under `backend/infrastructure/database/migrations/versions/`.

---

## 4. Backend — application/presentation layers

Mirrors the gym feature's layout (`backend/application/gym/` → `backend/application/storyboard/`):

```
application/storyboard/
  dto.py                    # MediaItemDto, CreateMediaItemDto, TagDto, StoryDto, MutateStoryDto, FetchMediaFilters
  usecases/
    upload_media.py         # calls files_client.upload_file (+ preview upload, §0.3), creates MediaItem
    get_media.py / get_media_list.py   # paginated, local table + live TPN viewing-url/tier fetch (§4.4)
    delete_media.py
    set_media_sharing.py    # publish/unpublish + create/revoke ContentAccessGrant (§4.3)
    add_tag.py / remove_tag.py
    create_story.py / update_story.py / get_story.py / get_stories.py
    add_story_editor.py / remove_story_editor.py
presentation/endpoints/storyboard.py
```

Follows existing conventions exactly: `@resolve_response`, `@require_permission(IsAuthenticated)`,
`Result`/`Failure`/`succeed`/`fail` from `core/common/result.py`, `Page[T]`/`BaseSearchQuery`
from `core/common/schema.py`, `Annotated[X, Depends()]` DI (no direct instantiation — this
is also the moment to *not* repeat the `backend/PLAN.md` §1 anti-pattern in new code).

### 4.1 API surface

```
POST   /storyboard/media                  multipart upload, one file — client loops for bulk
GET    /storyboard/media                  paginated (BaseSearchQuery), filterable by tag/author/mediaType/caption
GET    /storyboard/media/{id}             detail incl. live TPN ViewingUrl
DELETE /storyboard/media/{id}
POST   /storyboard/media/{id}/tags        { tag: string } — any authenticated member (§0.1)
DELETE /storyboard/media/{id}/tags/{tagId}
POST   /storyboard/media/{id}/sharing     { mode: "private" | "network" | "network_except", exceptIds?: [] }

POST   /storyboard/stories
GET    /storyboard/stories                paginated
GET    /storyboard/stories/{id}
PUT    /storyboard/stories/{id}
POST   /storyboard/stories/{id}/editors   { userId }
DELETE /storyboard/stories/{id}/editors/{userId}
```

### 4.2 Upload flow (Part 1, item 1 of PICTURE_COLLAGE.md)

1. Client picks N files. For each, client-side: generate an ≤800px preview blob (canvas),
   then `POST /storyboard/media` once per file, `multipart/form-data` with both the
   original and preview bytes.
2. `upload_media` use case: calls `files_client.upload_file` twice (original + preview,
   §0.3) against TPN, both starting **private** (TPN's default — nothing is published
   until step 3, matching PICTURE_COLLAGE.md's "all files private from the start").
   Creates one local `MediaItem` row referencing both TPN file IDs.
3. Client shows a progress bar per item (N independent requests — no batch endpoint
   exists on TPN, §1.2). A failed item retries independently; it doesn't block the rest
   of the batch.
4. Immediately after the batch finishes, the client presents the four sharing options
   from PICTURE_COLLAGE.md's Part 1 step 2 (§4.3 below implements them).

### 4.3 Sharing flow

Maps the doc's four choices onto TPN's real primitives, one `MediaItem` (i.e. one
`tpn_file_id` + `tpn_preview_file_id`, both go through the same calls) at a time:

- **Keep all private** → do nothing; `PublishedAt` stays null, no grant. Already TPN's
  default state after upload.
- **Keep private, except for these...** → `publish_file`, then `create_access_grant`
  per chosen recipient with `GranteeType = User`.
- **Share all to network** → `publish_file`, then one `create_access_grant` with
  `GranteeType = Network, GranteeNetworkId = config.auth.NETWORK_ID` per file.
- **Share all, except for these...** → `publish_file` on everything, network-grant on
  everything except the excluded set.

Both the original and its preview file need the same grant (a preview visible to nobody
because only the original got shared would break the gallery). This is N×2 sequential
calls per batch — acceptable at trusted-friends scale (§1.2's honest ceiling; revisit only
if TPN ever ships a batch grant endpoint).

### 4.4 Reading media / computing what's visible

`get_media_list` does **not** trust a cached tier. For each `MediaItem` page returned
locally (already filtered to "mine" or joined against tag/search filters), the use case
calls TPN's `GET /networks/{id}/files/{id}` (or a small batch of them) to get the current
`ViewingUrl` and confirm the file is still accessible to the caller — TPN's own
`AccessLevelVerifier` is the actual authority, never re-implemented here. If TPN 404s
(revoked/deleted) or returns a tier the caller can no longer see, the item is dropped from
the page (or shown as "no longer available" inside a story, per PICTURE_COLLAGE.md's own
spec for that case) rather than served from local cache.

This means gallery pages do a fan-out of per-item TPN calls today — a real cost, not
hidden. It's the same "no bulk lookup" ceiling flagged in §1.2, just showing up on read
instead of write. Acceptable at MVP scale (~dozens to low hundreds of items per network);
worth a batched `GET .../files?ids=` endpoint on TPN if this ever becomes the bottleneck.

---

## 5. Frontend (Vue 3 + TS + Vite + Pinia)

New top-level nav entry, one line in the existing hardcoded array
(`frontend/src/components/layout/NavBar.vue`):

```ts
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/gym', label: 'Gym' },
  { to: '/storyboard', label: 'Storyboard' },
];
```

New route block in `frontend/src/router/index.ts` (same lazy-import pattern as `/gym`):
`/storyboard`, `/storyboard/upload`, `/storyboard/gallery`, `/storyboard/stories`,
`/storyboard/stories/:id`, `/storyboard/stories/new`.

New, from scratch (nothing reusable exists today — confirmed no `IntersectionObserver`,
gallery, or lazy-load code anywhere in `frontend/src`):

- `composables/storyboard/useLazyMedia.ts` — `IntersectionObserver`-backed composable
  implementing PICTURE_COLLAGE.md's render-near-viewport rule (50% below viewport on
  desktop / 300% on mobile — two threshold configs, not one).
- `composables/storyboard/useMediaUpload.ts` — per-file progress state machine over the
  N-sequential-uploads flow (§4.2).
- `components/storyboard/MediaGrid.vue`, `MediaCard.vue`, `TagEditor.vue` (open-add/remove,
  no confirmation dialog needed per §0.1's trust model — but debounce/dedupe submissions),
  `SharingPicker.vue` (the four-option post-upload flow), `StoryEditor.vue`,
  `VideoPlayer.vue` (enforces "only one video plays at once" — a shared Pinia ref holding
  "currently playing video id," each player pauses itself when it's not that id).

`WorkoutFeed.vue`'s skeleton-shimmer loading-state pattern is worth copying for
`MediaGrid.vue`'s loading state — it's the only genuinely reusable piece from the gym
feature; its list itself is not paginated/virtualized and isn't a model for the gallery.

---

## 6. Implementation order

1. **Part 0** (§2) — TPN files/access-grant client in `infrastructure/trojonetworks/`.
   Nothing below can be tested end-to-end without this.
2. **Data model** (§3) — migration, models, repositories.
3. **Upload + private-by-default** — `POST /storyboard/media` single-file path first,
   bulk (client loop) second. Verify against a real TPN instance that files land private.
4. **Sharing flow** (§4.3) — all four options, single file first, then batch loop.
5. **Tags** (§0.1) — trivial once media exists; add/remove, no workflow.
6. **Gallery** (§4.4 read path + §5 lazy-load composable + pagination) — this is where
   the per-item TPN fan-out cost (§4.4) becomes visible; measure it here before going
   further.
7. **Stories** (§3/§0.2 data model, §4 endpoints, `StoryEditor.vue`) — Part 2A.
8. **Profile pages / "recently uploaded" browsing** (Part 2B) — **blocked on the TPN fix
   in §1.3** (`GetByUserProxyIdAsync` access-predicate bug). Don't build this against the
   current endpoint; it would either under-serve (if we defensively re-filter client-side,
   duplicating TPN's own authorization logic — exactly the anti-pattern TPN's own plan
   warns against) or leak private content (if we trust the endpoint as-is).
9. Geo display, video autoplay/single-playback rules, EXIF orientation handling — fold
   into steps 3/6 as they touch the same upload/render code paths, not separate phases.

Part 3 (image editing) stays out of scope, unchanged from the original review.

---

## 7. Open risks carried forward

- Video codec compatibility (no transcoding anywhere, none planned) — accept for MVP,
  revisit if playback complaints show up.
- EXIF orientation on upload — not addressed above; add a client-side or
  `files_client.upload_file`-time normalization pass before it becomes a support burden.
- Per-item TPN fan-out on gallery read (§4.4) — fine at MVP scale, first thing to
  reconsider if the network grows.
- §1.3's TPN bug needs a decision: fix upstream in TPN, or treat as permanently
  out-of-scope and drop Part 2B. Recommend fixing upstream — it's a one-line change
  (route through `GetAccessibleQueryableAsync` like `GetByNetworkIdAsync` already does)
  and it's a real access-control gap independent of this feature.
