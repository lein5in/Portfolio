import { useEffect, useState } from 'react';
import { FaStar, FaCodeBranch } from 'react-icons/fa';

interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
}

const CACHE_KEY = 'pf-github-repos';
const CACHE_TTL = 10 * 60 * 1000; 

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days < 1) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default function GitHubActivityFeed() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached) as { data: Repo[]; ts: number };
        if (Date.now() - ts < CACHE_TTL) {
          setRepos(data);
          return;
        }
      }
    } catch {
    }

    const controller = new AbortController();
    fetch('https://api.github.com/users/lein5in/repos?sort=updated&per_page=4', {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then(res => {
        if (!res.ok) throw new Error('github api error');
        return res.json();
      })
      .then((data: Repo[]) => {
        setRepos(data);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
        } catch {
        }
      })
      .catch(err => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setFailed(true);
      });
    return () => controller.abort();
  }, []);

  if (failed || (repos && repos.length === 0)) return null;

  return (
    <div style={{ marginTop: 72 }}>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 12,
        color: 'rgba(255,255,255,0.42)',
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        marginBottom: 20,
      } as React.CSSProperties}>
        Recent GitHub Activity
      </div>

      <div style={{ overflowX: 'auto', marginBottom: 32 }}>
        <img
          src="https://ghchart.rshah.org/6b7a99/lein5in"
          alt="Habib's GitHub contribution graph"
          style={{ display: 'block', minWidth: 720, width: '100%', filter: 'saturate(0.9)' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {repos === null && (
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
            color: 'rgba(255,255,255,0.3)',
            padding: '16px 0',
          }}>
            Loading…
          </div>
        )}
        {repos?.map((repo, i) => (
          <a
            key={repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              padding: '14px 0',
              borderBottom: i < repos.length - 1 ? '0.5px solid rgba(255,255,255,0.05)' : 'none',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.7'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.85)',
                marginBottom: 3,
              }}>
                {repo.name}
              </div>
              {repo.description && (
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12.5,
                  color: 'rgba(255,255,255,0.42)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {repo.description}
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              flexShrink: 0,
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              color: 'rgba(255,255,255,0.38)',
            }}>
              {repo.language && <span>{repo.language}</span>}
              {repo.stargazers_count > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FaStar size={9} /> {repo.stargazers_count}
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <FaCodeBranch size={9} /> {timeAgo(repo.updated_at)}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}