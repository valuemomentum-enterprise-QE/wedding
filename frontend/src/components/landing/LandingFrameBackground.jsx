import React from 'react';
import { cn } from '@/lib/utils';

/** Frame assets are 1366×768 — scale by width so sections 1 & 4 match. */
const FRAME_ASPECT_HEIGHT = 'min(56.25vw, 768px)';

export const frameBackgroundStyle = (imageUrl) => ({
  backgroundImage: `url('${imageUrl}')`,
  backgroundSize: '100% auto',
  backgroundPosition: 'center top',
  backgroundRepeat: 'no-repeat',
});

export const landingFrameSectionClass = (extra = '') =>
  cn('relative w-full overflow-hidden', extra);

/** Minimum height so the full frame width is visible (not cropped like bg-cover). */
export const landingFrameMinHeightClass = (contentMin = '0px') =>
  `min-h-[max(${FRAME_ASPECT_HEIGHT},${contentMin})]`;

export const LandingFrameBackground = ({ imageUrl, className }) => (
  <div
    className={cn('absolute inset-x-0 top-0 pointer-events-none', className)}
    style={{
      height: FRAME_ASPECT_HEIGHT,
      ...frameBackgroundStyle(imageUrl),
    }}
    aria-hidden="true"
  />
);

export default LandingFrameBackground;
