// Latest upload from the channel. No API key, and nothing is stored: if no
// source can be read, the card falls back to linking the channel instead of
// showing a stale or made-up video.
//
// The public RSS feed is the first choice because it is the one documented,
// keyless source. It has been unreliable since late 2025 (long stretches of
// 404s for every channel), so when it fails we read the same uploads list from
// the public playlist and watch pages instead. Both sources list every upload,
// Shorts included, newest first.

const CHANNEL_ID = "UCKspvjvjolrLKGqt6tujvTQ"; // youtube.com/@hejoric
// The channel's auto-generated "uploads" playlist: the channel ID with UU in
// place of UC.
const UPLOADS_PLAYLIST_ID = `UU${CHANNEL_ID.slice(2)}`;
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const UPLOADS_URL = `https://www.youtube.com/playlist?list=${UPLOADS_PLAYLIST_ID}`;

// The homepage revalidates every 300s; a new upload shows up within this.
const REVALIDATE_SECONDS = 900;

const REQUEST_INIT = {
  // Pin the language so the markup we read does not vary by server region.
  headers: { "Accept-Language": "en-US,en;q=0.9" },
  next: { revalidate: REVALIDATE_SECONDS },
};

export interface LatestVideo {
  id: string;
  title: string;
  url: string;
  /**
   * ISO timestamp of when the video was published. The feed gives the exact
   * time; the page fallback only gives the day, as midnight UTC.
   */
  published: string;
}

const VIDEO_ID = /^[\w-]{11}$/;

function decodeXml(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

/** First entry of the channel's Atom feed. */
export function parseFeed(xml: string): LatestVideo | null {
  // The feed lists entries newest first; only the first one is needed.
  const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/)?.[1];
  if (!entry) return null;

  const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
  const title = entry.match(/<title>([^<]*)<\/title>/)?.[1];
  const url = entry.match(/<link rel="alternate" href="([^"]+)"/)?.[1];
  const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];
  if (!id || !title || !url || !published) return null;

  return { id, title: decodeXml(title), url, published };
}

/** The JSON a YouTube page embeds as `var ytInitialData = {...};`. */
function initialData(html: string): unknown {
  const json = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/)?.[1];
  return json ? JSON.parse(json) : null;
}

/**
 * Depth-first search in document order for the first node `pick` accepts.
 * The page data's nesting changes often, so the parsers below look for the
 * renderer they need wherever it sits instead of following a fixed path.
 */
function findFirst<T>(node: unknown, pick: (node: Record<string, unknown>) => T | undefined): T | null {
  if (!node || typeof node !== "object") return null;
  const children = Array.isArray(node) ? node : Object.values(node);
  if (!Array.isArray(node)) {
    const picked = pick(node as Record<string, unknown>);
    if (picked !== undefined) return picked;
  }
  for (const child of children) {
    const found = findFirst(child, pick);
    if (found !== null) return found;
  }
  return null;
}

/** ID of the first (newest) video on the uploads playlist page. */
export function parseUploadsPage(html: string): string | null {
  return findFirst(initialData(html), (node) => {
    const lockup = node.lockupViewModel as { contentId?: unknown; contentType?: unknown } | undefined;
    const legacy = node.playlistVideoRenderer as { videoId?: unknown } | undefined;
    const id =
      lockup?.contentType === "LOCKUP_CONTENT_TYPE_VIDEO" ? lockup.contentId : legacy?.videoId;
    return typeof id === "string" && VIDEO_ID.test(id) ? id : undefined;
  });
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Title and publish day from a watch page. From server IPs YouTube withholds
 * the player and the usual meta tags ("Sign in to confirm you're not a bot"),
 * but the page data still carries the primary info block, so read that.
 */
export function parseWatchPage(html: string, id: string): LatestVideo | null {
  const data = initialData(html) as
    | { currentVideoEndpoint?: { watchEndpoint?: { videoId?: unknown } } }
    | null;
  // Guard against a redirect or interstitial serving some other page.
  if (data?.currentVideoEndpoint?.watchEndpoint?.videoId !== id) return null;

  const info = findFirst(data, (node) =>
    node.videoPrimaryInfoRenderer
      ? (node.videoPrimaryInfoRenderer as {
          title?: { runs?: { text?: unknown }[] };
          dateText?: { simpleText?: unknown };
        })
      : undefined,
  );
  const title = info?.title?.runs
    ?.map((run) => (typeof run.text === "string" ? run.text : ""))
    .join("")
    .trim();
  const dateText = info?.dateText?.simpleText;
  if (!title || typeof dateText !== "string") return null;

  // "Sep 29, 2026", or "Premiered Sep 29, 2026" and similar. The language is
  // pinned to English by the request headers.
  const [, month, day, year] = dateText.match(/\b([A-Z][a-z]{2})[a-z]* (\d{1,2}), (\d{4})\b/) ?? [];
  const monthIndex = MONTHS.indexOf(month);
  if (monthIndex < 0) return null;

  return {
    id,
    title,
    url: `https://www.youtube.com/watch?v=${id}`,
    // Only the day is published here; midnight UTC renders as that day.
    published: new Date(Date.UTC(Number(year), monthIndex, Number(day))).toISOString(),
  };
}

async function fetchText(url: string): Promise<string | null> {
  const res = await fetch(url, REQUEST_INIT);
  return res.ok ? res.text() : null;
}

async function fromFeed(): Promise<LatestVideo | null> {
  const xml = await fetchText(FEED_URL);
  return xml ? parseFeed(xml) : null;
}

async function fromPages(): Promise<LatestVideo | null> {
  const uploads = await fetchText(UPLOADS_URL);
  const id = uploads ? parseUploadsPage(uploads) : null;
  if (!id) return null;
  const watch = await fetchText(`https://www.youtube.com/watch?v=${id}`);
  return watch ? parseWatchPage(watch, id) : null;
}

export async function fetchLatestVideo(): Promise<LatestVideo | null> {
  for (const [name, source] of [
    ["feed", fromFeed],
    ["uploads page", fromPages],
  ] as const) {
    try {
      const video = await source();
      if (video) return video;
    } catch (error) {
      console.warn(`[youtube] could not read the channel ${name}`, error);
    }
  }
  return null;
}
