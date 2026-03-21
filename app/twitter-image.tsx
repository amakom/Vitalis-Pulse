import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'VitalisPulse — The Credit Score for Web3 Projects';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h4l3-9 4 18 3-9h4" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: '36px', fontWeight: 800, color: '#F8FAFC' }}>VitalisPulse</span>
        </div>

        <h1 style={{ fontSize: '52px', fontWeight: 800, color: '#F8FAFC', textAlign: 'center', margin: 0 }}>
          The Credit Score for <span style={{ color: '#14B8A6' }}>Web3 Projects</span>
        </h1>
        <p style={{ fontSize: '22px', color: '#94A3B8', textAlign: 'center', maxWidth: '700px', margin: '16px 0 0 0' }}>
          Free, real-time health scoring for DeFi projects.
        </p>

        <p style={{ position: 'absolute', bottom: '24px', fontSize: '16px', color: '#475569' }}>
          www.vitalispulse.xyz
        </p>
      </div>
    ),
    { ...size }
  );
}
