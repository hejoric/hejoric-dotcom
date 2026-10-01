// Run with `npm test` (node:test, loading the TypeScript module directly).
// Plain .mjs so `tsc` does not need to accept the `.ts` import extension.
import assert from "node:assert/strict";
import { test } from "node:test";
import { parseFeed, parseUploadsPage, parseWatchPage } from "./youtube.ts";

const ID = "PWD7n828jzc";

test("parseFeed reads the newest entry", () => {
  const xml = `<feed>
    <entry>
      <yt:videoId>${ID}</yt:videoId>
      <title>Fishing &amp; Big Joe&#39;s boat</title>
      <link rel="alternate" href="https://www.youtube.com/watch?v=${ID}"/>
      <published>2026-09-29T22:13:42+00:00</published>
    </entry>
    <entry>
      <yt:videoId>lACV5PRpuBQ</yt:videoId>
      <title>Older</title>
      <link rel="alternate" href="https://www.youtube.com/watch?v=lACV5PRpuBQ"/>
      <published>2026-08-01T00:00:00+00:00</published>
    </entry>
  </feed>`;
  assert.deepEqual(parseFeed(xml), {
    id: ID,
    title: "Fishing & Big Joe's boat",
    url: `https://www.youtube.com/watch?v=${ID}`,
    published: "2026-09-29T22:13:42+00:00",
  });
});

test("parseFeed rejects a feed with no entries", () => {
  assert.equal(parseFeed("<feed></feed>"), null);
});

function uploadsPage(data) {
  return `<script>var ytInitialData = ${JSON.stringify(data)};</script>`;
}

test("parseUploadsPage takes the first video, skipping non-video lockups", () => {
  const html = uploadsPage({
    header: { lockupViewModel: { contentId: "PLnotavideo", contentType: "LOCKUP_CONTENT_TYPE_PLAYLIST" } },
    contents: [
      { lockupViewModel: { contentId: ID, contentType: "LOCKUP_CONTENT_TYPE_VIDEO" } },
      { lockupViewModel: { contentId: "lACV5PRpuBQ", contentType: "LOCKUP_CONTENT_TYPE_VIDEO" } },
    ],
  });
  assert.equal(parseUploadsPage(html), ID);
});

test("parseUploadsPage still reads the older playlistVideoRenderer shape", () => {
  const html = uploadsPage({ contents: [{ playlistVideoRenderer: { videoId: ID } }] });
  assert.equal(parseUploadsPage(html), ID);
});

test("parseUploadsPage returns null without page data", () => {
  assert.equal(parseUploadsPage("<html>Before you continue to YouTube</html>"), null);
  assert.equal(parseUploadsPage(uploadsPage({ contents: [] })), null);
});

function watchPage(id, dateText = "Sep 29, 2026") {
  return `<script>var ytInitialData = ${JSON.stringify({
    contents: {
      results: [
        {
          videoPrimaryInfoRenderer: {
            title: { runs: [{ text: "just landed in bolivia! " }, { text: "#bolivia" }] },
            dateText: { simpleText: dateText },
          },
        },
      ],
    },
    currentVideoEndpoint: { watchEndpoint: { videoId: id } },
  })};</script>`;
}

test("parseWatchPage reads title and publish day from the page data", () => {
  assert.deepEqual(parseWatchPage(watchPage(ID), ID), {
    id: ID,
    title: "just landed in bolivia! #bolivia",
    url: `https://www.youtube.com/watch?v=${ID}`,
    published: "2026-09-29T00:00:00.000Z",
  });
});

test("parseWatchPage accepts prefixed dates such as premieres", () => {
  assert.equal(parseWatchPage(watchPage(ID, "Premiered Jun 2, 2026"), ID)?.published, "2026-06-02T00:00:00.000Z");
});

test("parseWatchPage rejects a page for a different video", () => {
  assert.equal(parseWatchPage(watchPage("lACV5PRpuBQ"), ID), null);
});

test("parseWatchPage rejects an unreadable date", () => {
  assert.equal(parseWatchPage(watchPage(ID, "1 day ago"), ID), null);
});
