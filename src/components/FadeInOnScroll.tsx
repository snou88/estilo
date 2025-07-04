import React, { useRef, useEffect, useState, ReactNode } from 'react';

interface FadeInOnScrollProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const FadeInOnScroll: React.FC<FadeInOnScrollProps> = ({ children, className = '', as = 'div' }) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Element = as as any;
  return (
    <Element
      ref={ref as any}
      className={`fade-in${visible ? ' visible' : ''} ${className}`.trim()}
    >
      {children}
    </Element>
  );
};

export default FadeInOnScroll;
