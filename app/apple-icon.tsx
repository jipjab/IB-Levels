import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        <div style={{ display: 'flex' }}>
          IB<span style={{ color: '#FBBF24' }}>Levels</span>
        </div>
        <div style={{ fontSize: 20, marginTop: 10, opacity: 0.9 }}>
          Trading Analysis
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

