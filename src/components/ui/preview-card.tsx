/* eslint-disable react-hooks/refs */
/**
 * =============================================================================
 * FILE: preview-card.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Preview Card (Hover Card) Component.
 *   Tech: @floating-ui/react (Smart Positioning) + motion (Animation).
 *   Features: Auto placement (flip), shift-to-view, hover interaction.
 *
 * =============================================================================
 */

'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  useMergeRefs,
  safePolygon,
} from '@floating-ui/react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

// --- Context ---
interface PreviewCardContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  x: number;
  y: number;
  strategy: 'absolute' | 'fixed';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refs: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any;
  getFloatingProps: (
    userProps?: React.HTMLProps<HTMLElement>
  ) => Record<string, unknown>;
  getReferenceProps: (
    userProps?: React.HTMLProps<HTMLElement>
  ) => Record<string, unknown>;
}

const PreviewCardContext = createContext<PreviewCardContextType | undefined>(
  undefined
);

// --- Root ---
export function PreviewCard({
  children,
  placement = 'top',
}: {
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);

  // Floating UI Setup
  const { x, y, strategy, refs, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    // Auto Update position if content changes/scrolls
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(12), // Cách trigger 12px
      flip(), // Tự động lật nếu hết chỗ
      shift(), // Giữ trong viewport
    ],
  });

  // Interactions
  const hover = useHover(context, {
    delay: { open: 200, close: 300 }, // Delay tránh flicker
    handleClose: safePolygon(), // Cho phép di chuyển chuột sang popup
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <PreviewCardContext.Provider
      value={{
        open,
        setOpen,
        x,
        y,
        strategy,
        refs,
        context,
        getReferenceProps,
        getFloatingProps,
      }}
    >
      <div className="group relative w-full">{children}</div>
    </PreviewCardContext.Provider>
  );
}

// --- Trigger ---
export function PreviewCardTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { refs, getReferenceProps } = useContext(PreviewCardContext)!;

  // Merge refs (nếu children là React Element có ref sẵn)
  // Ở đây ta bọc div cho an toàn
  return (
    <div
      ref={refs.setReference}
      {...getReferenceProps()}
      className={cn('h-full w-full cursor-pointer', className)}
    >
      {children}
    </div>
  );
}

// --- Portal ---
export function PreviewCardPortal({ children }: { children: React.ReactNode }) {
  // Dùng FloatingPortal để render ra ngoài DOM tree (tránh z-index hell)
  return <FloatingPortal>{children}</FloatingPortal>;
}

// --- Positioner ---
// Component này quản lý vị trí (Position)
export function PreviewCardPositioner({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open, x, y, strategy, refs, getFloatingProps } =
    useContext(PreviewCardContext)!;

  return (
    <AnimatePresence>
      {open && (
        <div
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: 'max-content',
            zIndex: 50,
          }}
          {...getFloatingProps()}
          className={className}
        >
          {children}
        </div>
      )}
    </AnimatePresence>
  );
}

// --- Popup ---
// Component này quản lý Animation & Visual
export function PreviewCardPopup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'min-w-[300px] overflow-hidden rounded-3xl border border-white/10 bg-white/90 p-4 shadow-2xl backdrop-blur-xl dark:bg-black/90',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
