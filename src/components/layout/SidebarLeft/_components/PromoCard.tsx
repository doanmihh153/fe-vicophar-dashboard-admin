'use client';

/**
 * PromoCard Component
 * Card promotional ở cuối sidebar (Download App, etc.)
 */

import React from 'react';
import { Smartphone } from 'lucide-react';

export interface PromoCardProps {
  /** Title của card */
  title?: string;
  /** Description */
  description?: string;
  /** Button text */
  buttonText?: string;
  /** Button click handler */
  onButtonClick?: () => void;
  /** Custom icon (mặc định: Smartphone) */
  icon?: React.ReactNode;
}

export function PromoCard({
  title = 'Download our\nMobile App',
  description = 'Get easy in another way',
  buttonText = 'Download',
  onButtonClick,
  icon,
}: PromoCardProps) {
  return (
    <div className="from-primary/90 to-primary text-primary-foreground relative overflow-hidden rounded-xl bg-gradient-to-br p-4">
      {/* Decorative background shapes */}
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-white/10" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
          {icon || <Smartphone className="h-5 w-5" />}
        </div>

        {/* Title - xử lý \n thành <br /> */}
        <h4 className="font-display mb-1 font-semibold whitespace-pre-line">
          {title}
        </h4>

        {/* Description */}
        <p className="mb-3 text-xs opacity-80">{description}</p>

        {/* Button */}
        <button
          onClick={onButtonClick}
          className="text-primary w-full rounded-lg bg-white py-2 text-sm font-medium transition-colors hover:bg-white/90"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default PromoCard;
