import React from 'react';

const watchlist = [
  { symbol: 'BTC/USD', strategy: 'MACD 12/26/9 + SMA200', exit: 'Trailing stop 3% (deferred activation 8%)' },
  { symbol: 'ETH/USD', strategy: 'EMA 21/50 + regime filter, ADX ≥ 25', exit: 'SL 4% · TP 8%' },
  { symbol: 'SOL/USD', strategy: 'EMA 21/50 + regime filter, ADX ≥ 30', exit: 'SL 5% · TP 15%' },
  { symbol: 'XRP/USD', strategy: 'EMA 21/50 + daily filter, ADX ≥ 25', exit: 'SL 4% · TP 10%' },
  { symbol: 'DOGE/USD', strategy: 'EMA 21/50 + daily filter, ADX ≥ 20', exit: 'SL 4% · TP 10%' },
];

export default function AITradingMetrics() {
  return (
    <div style={{ margin: '40px 0' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 1,
        background: 'rgba(255,255,255,0.03)',
        border: '0.5px solid rgba(255,255,255,0.08)',
        marginBottom: 24,
      }}>
        <div style={{ background: '#0a0a0a', padding: '24px 20px', gridColumn: 'span 2' }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 37.4,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: 8,
          }}>
            3.3%<span style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)' }}>/year</span>
          </div>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.08em',
            lineHeight: 1.7,
          }}>
            Production system, fixed $50 position sizing.
            <br />
            Dynamic capital-percentage sizing is the next lever, not yet deployed.
          </div>
        </div>
      </div>

      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 12,
        color: 'rgba(255,255,255,0.42)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom: 14,
      } as React.CSSProperties}>
        Production Watchlist — 4h Trend-Following
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
        {watchlist.map(row => (
          <div key={row.symbol} style={{
            display: 'grid',
            gridTemplateColumns: '110px 1fr 1fr',
            gap: 16,
            padding: '14px 0',
            borderBottom: '0.5px solid rgba(255,255,255,0.05)',
            alignItems: 'center',
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.85)',
            }}>
              {row.symbol}
            </div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12.5,
              color: 'rgba(255,255,255,0.58)',
            }}>
              {row.strategy}
            </div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12.5,
              color: 'rgba(255,255,255,0.42)',
            }}>
              {row.exit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}