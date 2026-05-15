import React from 'react';

const FLOWER_IMG = `${process.env.PUBLIC_URL}/landing/flower.png`;

const SIZE_CLASSES = {
  sm: 'w-16 sm:w-20',
  md: 'w-24 sm:w-28 md:w-32',
  lg: 'w-32 sm:w-40 md:w-44',
};

/** Botanical sprig overlay from design asset (sections 2 & 3). */
export const FloralDecoration = ({ size = 'md', className = '' }) => (
  <img
    src={FLOWER_IMG}
    alt=""
    aria-hidden="true"
    draggable={false}
    className={`pointer-events-none absolute h-auto max-w-none select-none mix-blend-multiply ${SIZE_CLASSES[size]} ${className}`}
  />
);

export default FloralDecoration;
