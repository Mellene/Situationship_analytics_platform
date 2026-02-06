import React, { useRef, useEffect } from 'react';
import styles from '../pages/LandingPage.module.css';

interface Review {
  id: number;
  content: string;
  author: string;
}

interface ReviewCarouselProps {
  reviews: Review[];
}

const ReviewCarousel: React.FC<ReviewCarouselProps> = ({ reviews }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0); // Changed from useState to useRef for internal counter
  const pauseBetweenScroll = 3000; // ms to pause before next scroll

  // Duplicate reviews to create an infinite loop effect
  const extendedReviews = [...reviews, ...reviews, ...reviews];

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const itemWidthWithGap = (carousel.children[0]?.clientWidth || 0) + 40; // Card width + gap (from CSS)
    const originalReviewsCount = reviews.length;

    const autoScroll = setInterval(() => {
      currentIndexRef.current += 1; // Update ref directly
      let nextIndex = currentIndexRef.current;

      const targetScrollLeft = nextIndex * itemWidthWithGap;

      if (nextIndex >= originalReviewsCount * 2) { // If we've scrolled past the second set of original reviews
        // Instantly jump back to the start of the second set (first duplicate)
        carousel.scrollLeft = originalReviewsCount * itemWidthWithGap;
        currentIndexRef.current = originalReviewsCount; // Reset ref to point to the first duplicate
      } else {
        carousel.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
      }
    }, pauseBetweenScroll);

    return () => clearInterval(autoScroll);
  }, [reviews, pauseBetweenScroll]); // currentIndexRef is not a dependency as its .current property is mutable

  const blurId = (id: string) => {
    if (id.length <= 2) return '*'.repeat(id.length);
    return id.substring(0, 1) + '*'.repeat(id.length - 2) + id.substring(id.length - 1);
  };

  return (
    <div className={styles.reviewCarouselContainer}>
      <div className={styles.reviewCarousel} ref={carouselRef}>
        {extendedReviews.map((review, index) => (
          <div key={`${review.id}-${index}`} className={styles.reviewCard}>
            <p className={styles.reviewContent}>"{review.content}"</p>
            <p className={styles.reviewAuthor}>- {blurId(review.author)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewCarousel;
