import React, { type ReactNode } from 'react';

interface AnimatedHeaderButtonProps {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function AnimatedHeaderButton({
  label,
  icon,
  onClick,
  className = '',
}: AnimatedHeaderButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group bg-background relative w-32 cursor-pointer overflow-hidden rounded-full p-2 text-center shadow ${className}`}
      type="button"
    >
      {/* Label ban đầu (trạng thái đóng) - Slide lên khi hover */}
      <span className="font-signature inline-block translate-y-0 transition-all duration-300 group-hover:-translate-y-12 group-hover:opacity-0">
        {label}
      </span>

      {/* Label và Icon khi hover (trạng thái mở) - Slide từ dưới lên */}
      <div className="bg-sidebar-text-heading absolute top-0 left-0 z-10 flex h-full w-full translate-y-12 items-center justify-center gap-2 rounded-full text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:rounded-none group-hover:opacity-100">
        <span className="font-signature">{label}</span>
        {icon}
      </div>
    </button>
  );
}

export default AnimatedHeaderButton;
