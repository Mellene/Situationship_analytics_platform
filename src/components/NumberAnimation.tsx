import React, { useEffect, useState } from 'react';

interface NumberAnimationProps {
  targetValue: number;
  duration?: number; // Duration in milliseconds
  suffix?: string;
  prefix?: string;
}

const NumberAnimation: React.FC<NumberAnimationProps> = ({
  targetValue,
  duration = 2000,
  suffix = '',
  prefix = '',
}) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTimestamp: DOMHighResTimeStamp;

    const animate = (timestamp: DOMHighResTimeStamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = easeOutQuad(progress); // Apply easing function
      setCurrentValue(Math.floor(easedProgress * targetValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentValue(targetValue); // Ensure final value is exactly targetValue
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  // Easing function: Quadratic easing out
  const easeOutQuad = (t: number) => t * (2 - t);

  return (
    <>
      {prefix}
      {currentValue.toLocaleString()}
      {suffix}
    </>
  );
};

export default NumberAnimation;
