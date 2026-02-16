
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface EarthSplitSectionProps {
  gridContentRef: React.RefObject<HTMLDivElement | null>;
  statsRef: React.RefObject<HTMLDivElement | null>;
  circleWhite2Ref: React.RefObject<HTMLDivElement | null>;
}

interface StatItemProps {
  value: string;
  label: string;
  isVisible: boolean;
}

function StatItem({ value, label, isVisible }: StatItemProps) {
  const numberRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isVisible || !numberRef.current || hasAnimated) return;

    // Parse the value to get number and suffix
    const match = value.match(/^(\d+\.?\d*)([MK+]*)/);
    if (!match) return;

    const targetNumber = parseFloat(match[1]);
    const suffix = match[2];

    const counter = { value: 0 };

    gsap.to(counter, {
      value: targetNumber,
      duration: 2.5,
      ease: 'power2.out',
      onUpdate: () => {
        if (numberRef.current) {
          // Format with decimal if original had decimal
          const formattedValue = value.includes('.')
            ? counter.value.toFixed(1)
            : Math.floor(counter.value).toString();
          numberRef.current.textContent = formattedValue + suffix;
        }
      },
      onComplete: () => {
        setHasAnimated(true);
      },
    });

    return () => {
      gsap.killTweensOf(counter);
    };
  }, [isVisible, value, hasAnimated]);

  return (
    <div className="text-center">
      <div
        ref={numberRef}
        className="text-2xl font-light text-[#2C2C2C] mb-1 tabular-nums"
      >
        {value}
      </div>
      <div className="text-xs uppercase tracking-[0.12em] font-medium text-black">
        {label}
      </div>
    </div>
  );
}

export default function EarthSplitSection({
  gridContentRef,
  statsRef,
  circleWhite2Ref,
}: EarthSplitSectionProps) {
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    if (!statsRef.current) return;

    // Observe when stats become visible (opacity > 0)
    const observer = new MutationObserver(() => {
      if (statsRef.current) {
        const opacity = window.getComputedStyle(statsRef.current).opacity;
        if (parseFloat(opacity) > 0.5 && !statsVisible) {
          setStatsVisible(true);
        }
      }
    });

    observer.observe(statsRef.current, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => observer.disconnect();
  }, [statsRef, statsVisible]);

  const stats = [
    { value: '85+', label: 'LANDMARK PROJECTS' },
    { value: '40M+', label: 'SQ. FT. CONSTRUCTION' },
    { value: '35K+', label: 'HAPPY FAMILIES' },
    { value: '21M+', label: 'UNDER DEVELOPMENT' },
  ];

  return (
    <>

      {/* CENTER CONTENT */}
      <div
        ref={gridContentRef}
        className="absolute inset-0 -top-16 w-full h-[110vh] overflow-hidden z-29 
                   flex flex-col justify-center items-center text-center 
                   opacity-0 pointer-events-none px-6  bg-[#FEF7F0]"
      >
        <h2 className="text-3xl  leading-[1.2] font-light text-[#F07D00] mb-6">
          Designing The Present With A Vision
          <br className="hidden md:block" />
          Of Tomorrow.
        </h2>

        <p className="text-lg md:text-xl leading-[1.6] font-light text-black mb-10 max-w-[700px]">
          Since 1986, our journey of real estate has evolved but not changed. The impact we have created has been driven by our steadfast belief in the motto: Great designs solve real problems! For nearly 4 decades, Ashwin Sheth has shaped a legacy by building 80+ remarkable real estate projects in Mumbai and abroad.
        </p>

        <button className="relative w-fit text-sm font-bold uppercase text-[#0E4194] pb-2 hover:opacity-70 transition-opacity cursor-pointer tracking-widest">
          Read More
          <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#0E4194]" />
        </button>
      </div>

      {/* STATS */}
      <div
        ref={statsRef}
        className="absolute bottom-28 left-0 w-full z-29 opacity-0 pointer-events-none"
      >
        <div className="w-full mx-auto px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat) => (
              <StatItem
                key={stat.label}
                value={stat.value}
                label={stat.label}
                isVisible={statsVisible}
              />
            ))}
          </div>
        </div>
      </div>

      {/* BEIGE CIRCLE REVEAL */}
      <div
        ref={circleWhite2Ref}
        className="fixed inset-0 z-28 pointer-events-none opacity-0"
        style={{
          clipPath: 'circle(0% at 50% 50%)',
          willChange: 'clip-path',
        }}
      />
    </>
  );
}