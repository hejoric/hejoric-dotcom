// Real GitHub activity for the Code heatmap.
//
// Uses the GraphQL `contributionsCollection`, which is the same data behind the
// contribution graph on a GitHub profile: commits, pull requests, reviews, and
// issues. Private-repo contributions are included as long as "Include private
// contributions on my profile" is enabled in GitHub settings.
//
// Requires GITHUB_TOKEN (classic PAT with `read:user`, or a fine-grained token
// with read access to profile data). Without it we return null and the UI says
// so rather than rendering an empty grid that would read as "no work done".

const GITHUB_LOGIN = "hejoric";
const GITHUB_GRAPHQL = "https://api.github.com/graphql";

/** How long a fetched calendar is reused before GitHub is hit again. */
export const GITHUB_REVALIDATE_SECONDS = 3600;

export interface GitHubContributions {
  /** `YYYY-MM-DD` -> contribution count, for the last 365 days. */
  days: Record<string, number>;
  total: number;
  commits: number;
  pullRequests: number;
  reviews: number;
}

const QUERY = /* GraphQL */ `
  query ($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

interface CalendarDay {
  date: string;
  contributionCount: number;
}

export async function fetchGitHubContributions(): Promise<GitHubContributions | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("[github] GITHUB_TOKEN is not set; skipping contribution fetch");
    return null;
  }

  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 364);

  try {
    const res = await fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: {
          login: GITHUB_LOGIN,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
      next: { revalidate: GITHUB_REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      console.error(`[github] contributions request failed: ${res.status}`);
      return null;
    }

    const json = await res.json();
    if (json.errors?.length) {
      console.error("[github] GraphQL errors:", JSON.stringify(json.errors));
      return null;
    }

    const collection = json.data?.user?.contributionsCollection;
    if (!collection) {
      console.error("[github] unexpected response shape");
      return null;
    }

    const days: Record<string, number> = {};
    for (const week of collection.contributionCalendar.weeks) {
      for (const day of week.contributionDays as CalendarDay[]) {
        if (day.contributionCount > 0) days[day.date] = day.contributionCount;
      }
    }

    return {
      days,
      total: collection.contributionCalendar.totalContributions,
      commits: collection.totalCommitContributions,
      pullRequests: collection.totalPullRequestContributions,
      reviews: collection.totalPullRequestReviewContributions,
    };
  } catch (error) {
    console.error("[github] contribution fetch threw:", error);
    return null;
  }
}
