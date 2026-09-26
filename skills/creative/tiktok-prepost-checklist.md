# TikTok Pre-Post Checklist

Run this for every clip before it goes up — manual or via the Content Posting API.
Fill one row of the posting log (`projects/posting-log.csv`) per post so we can read
results by test variable instead of by gut.

Source notes: OpenQuok, "Why My TikTok Videos Have Low Views and What to Fix First"
(2026-09-26). Items marked *(anecdotal)* come from creator experience, not TikTok policy.

## 1. Must pass (do not post if any fails)

- [ ] **AI label on.** Every clip with AI-generated picture or voice (Microlore, สไตล์ tales,
      anything from Kling / Nano Banana / Logan TTS) → turn on "AI-generated content" in the
      post settings. Via API: set the AI-content disclosure field in the post info.
- [ ] **Hook is new.** The first 2 seconds (first shot + first caption line) differ from the
      last post in the same series. Same series look is fine; same opening is not.
- [ ] **No face/scale rule breaks** for the style (see `memory/microlore-style` — humans at
      real size, faces only out of focus).
- [ ] **Clean file.** Final render from `projects/<slug>/.../renders/final.mp4`, 9:16, −14 LUFS,
      no other platform's watermark, not the exact same file already posted on another
      of our accounts.
- [ ] **One test variable written down** (see §3). If nothing changed vs the last post,
      write `none` — that's a control post.

## 2. Should do

- [ ] Caption: 1 line that adds to the hook (question, stake, or "EP2 of 4"), not a
      summary. Read it aloud once — no AI-sounding phrasing.
- [ ] Cover frame chosen on purpose (a readable moment, not frame 0 black).
- [ ] Series posts say which episode in the caption and pin/playlist the series.
- [ ] Trending sound added in-app only if the format needs it (narrated reels usually
      don't — keep VO clear; if added, keep it under the voice).
- [ ] Post inside the planned slot (3–5 posts/week, steady; no gaps then bursts).

## 3. Test variables (change ONE per post)

Pick one, log it, and judge it only after 3–5 posts with the same change.

| code | variable | example |
|---|---|---|
| `hook` | opening shot / first line | cold-open on the centipede vs elder on the beam |
| `len` | total length | 60 s cut vs full 120 s |
| `pace` | cut rhythm / VO speed | atempo 1.1 vs 1.2 |
| `cap` | caption style or text | question vs cliffhanger line |
| `cover` | cover frame | creature close-up vs wide |
| `time` | post time | 12:00 vs 20:00 |
| `none` | control | repeat of last settings |

## 4. After posting (day 1 and day 3)

- Open Analytics on the post. If it shows **For You ineligible** or any restriction notice,
  stop and fix that first — that's not a content problem.
- Record in the log: views, avg watch time, % watched full, shares, saves.
- Judge by watch time and completion on the last 3–5 posts, not by views alone.

## 5. Account hygiene *(anecdotal but cheap to follow)*

- New account: post by hand from the phone for the first 7 days, scroll the niche daily,
  leave a few real comments. Connect any scheduler/API only after that week.
- Keep device region, App Store country, timezone and network consistent; no free/shared VPNs.
- Max ~2–3 TikTok accounts per phone. If fresh signups on one phone keep dying, change phone.
- Automation only through TikTok's official Content Posting API, sending posts as inbox
  drafts so a person adds sound and taps publish. Never browser bots or unofficial uploaders.
