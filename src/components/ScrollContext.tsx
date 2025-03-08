// ScrollContext.tsx
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
} from 'react';

import { ScrollArea } from './ui/scroll-area';

interface ScrollContextType {
  registerScrollable: (element: HTMLElement) => void;
  unregisterScrollable: (element: HTMLElement) => void;
}

const ScrollContext = createContext<ScrollContextType | null>(null);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const scrollableElementsRef = useRef<Set<HTMLElement>>(new Set());

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const flowersBackground = document.querySelector('.bg-flowers') as HTMLElement;
      if (!flowersBackground?.contains(target)) {
        return;
      }
      // Find the active scrollable element (the one that should receive scroll events)
      const scrollableElement = Array.from(scrollableElementsRef.current).find((element) => {
        const viewport = element.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
        if (!viewport) return false;
        const rect = viewport.getBoundingClientRect();
        return rect.top <= e.clientY && rect.bottom >= e.clientY;
      });
      if (scrollableElement) {
        const viewport = scrollableElement.querySelector(
          '[data-radix-scroll-area-viewport]'
        ) as HTMLElement;
        if (viewport) {
          e.preventDefault();
          viewport.scrollTop += e.deltaY;
        }
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const value = {
    registerScrollable: (element: HTMLElement) => {
      scrollableElementsRef.current.add(element);
    },
    unregisterScrollable: (element: HTMLElement) => {
      scrollableElementsRef.current.delete(element);
    },
  };

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
};

// Hook to use in scrollable components
export const useScrollRegister = (ref: React.RefObject<HTMLElement>) => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollRegister must be used within a ScrollProvider');
  }
  useEffect(() => {
    const element = ref.current;
    if (element) {
      context.registerScrollable(element);
      return () => context.unregisterScrollable(element);
    }
  }, [ref, context]);
};

// Enhanced ScrollArea component
interface EnhancedScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollArea> {
  children: React.ReactNode;
  className?: string;
}

export const EnhancedScrollArea = ({ children, className, ...props }: EnhancedScrollAreaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollRegister(containerRef);

  return (
    <div
      ref={containerRef}
      className={className}
    >
      <ScrollArea {...props}>{children}</ScrollArea>
    </div>
  );
};
