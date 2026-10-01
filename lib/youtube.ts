// Latest upload from the channel's public RSS feed. No API key, and nothing is
// stored: if the feed cannot be read, the card falls back to linking the
// channel instead of showing a stale or made-up video.

const CHANNEL_ID = "UCKspvjvjolrLKGqt6tujvTQ"; // youtube.com/@hejoric
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export interface LatestVideo {
  id: string;
  title: string;
  url: string;
  /** ISO timestamp from the feed's <published>. */
  published: string;
}

function decodeXml(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

export async function fetchLatestVideo(): Promise<LatestVideo | null> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const xml = await res.text();

    // The feed lists entries newest first; only the first one is needed.
    const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/)?.[1];
    if (!entry) return null;

    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = entry.match(/<title>([^<]*)<\/title>/)?.[1];
    const url = entry.match(/<link rel="alternate" href="([^"]+)"/)?.[1];
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];
    if (!id || !title || !url || !published) return null;

    return { id, title: decodeXml(title), url, published };
  } catch (error) {
    console.warn("[youtube] could not read the channel feed", error);
    return null;
  }
}
