import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

export interface VrIframePlayerProps {
  id?: string;
  title: string;
  src: string;
  height?: string | number;
}

export function extractIframeSrc(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (trimmed.includes('<iframe')) {
    const match = trimmed.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1].replace(/&amp;/g, '&');
    }
  }
  return trimmed.replace(/&amp;/g, '&');
}

export const VrIframePlayer: React.FC<VrIframePlayerProps> = ({
  id = 'tour-embedded',
  title,
  src,
  height = '600px',
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const normalizedSrc = extractIframeSrc(src);

  useEffect(() => {
    let isReady = false;
    const targetOrigin = 'https://tour.panoee.net';

    function s(v: any, a: string[]) {
      if (!v) return null;
      const x: Record<string, any> = {};
      a.forEach((k) => {
        x[k] = typeof v[k] === 'number' ? v[k] : null;
      });
      return x;
    }

    function ready(f: HTMLIFrameElement) {
      try {
        const h = f.contentWindow?.location.href;
        if (h && h !== 'about:blank') isReady = true;
      } catch (e) {
        isReady = true;
      }
    }

    function send(payload: any) {
      const el = iframeRef.current || (document.getElementById(id) as HTMLIFrameElement | null);
      if (!el || !el.contentWindow) return;
      try {
        el.contentWindow.postMessage(payload, targetOrigin);
      } catch (t) {}
    }

    const f = iframeRef.current || (document.getElementById(id) as HTMLIFrameElement | null);
    const handleLoad = () => {
      isReady = true;
    };

    if (f) {
      f.addEventListener('load', handleLoad);
      ready(f);
    }

    const handleMessage = (ev: MessageEvent) => {
      if (!isReady || !ev.data || ev.data.type !== 'devicemotion') return;
      if (ev.source !== window.parent) return;
      send(ev.data);
    };

    const handleMotion = (e: DeviceMotionEvent) => {
      if (!isReady) return;
      send({
        type: 'devicemotion',
        deviceMotionEvent: {
          acceleration: s(e.acceleration, ['x', 'y', 'z']),
          accelerationIncludingGravity: s(e.accelerationIncludingGravity, ['x', 'y', 'z']),
          rotationRate: s(e.rotationRate, ['alpha', 'beta', 'gamma']),
          interval: typeof e.interval === 'number' ? e.interval : 0,
          timeStamp: e.timeStamp,
        },
      });
    };

    window.addEventListener('message', handleMessage, false);
    window.addEventListener('devicemotion', handleMotion, { passive: true });

    return () => {
      if (f) {
        f.removeEventListener('load', handleLoad);
      }
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [id, normalizedSrc]);

  const cssHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <Box
      sx={{
        width: '100%',
        height: cssHeight,
        minHeight: '600px',
        position: 'relative',
        bgcolor: '#19130E',
        borderRadius: '6px',
        overflow: 'hidden',
      }}
    >
      <iframe
        ref={iframeRef}
        id={id}
        title={title}
        src={normalizedSrc}
        frameBorder="0"
        width="100%"
        height={cssHeight}
        scrolling="no"
        allow="autoplay; accelerometer; gyroscope; fullscreen; xr-spatial-tracking"
        loading="eager"
        allowFullScreen
        style={{
          border: 0,
          width: '100%',
          height: cssHeight,
          minHeight: '600px',
          display: 'block',
        }}
      />
    </Box>
  );
};
