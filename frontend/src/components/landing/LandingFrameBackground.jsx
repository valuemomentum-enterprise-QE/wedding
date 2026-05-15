import React from 'react';
import { cn } from '@/lib/utils';

/** Frame assets are 1366×768 — scale by width so sections 1 & 4 match. */
const FRAME_ASPECT_HEIGHT = 'min(56.25vw, 768px)';
/** On phones, cap frame height so invitation content isn’t dwarfed by empty frame area. */
const FRAME_ASPECT_HEIGHT_MOBILE = 'min(56.25vw, max(42vh, 320px), 768px)';

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
  `min-h-[max(${FRAME_ASPECT_HEIGHT_MOBILE},${contentMin})] sm:min-h-[max(${FRAME_ASPECT_HEIGHT},${contentMin})]`;

export const LandingFrameBackground = ({ imageUrl, className }) => (
  <div
    className={cn(
      'absolute inset-x-0 top-0 pointer-events-none h-[min(56.25vw,max(42vh,320px),768px)] sm:h-[min(56.25vw,768px)]',
      className
    )}
    style={frameBackgroundStyle(imageUrl)}
    aria-hidden="true"
  />
);

export default LandingFrameBackground;
