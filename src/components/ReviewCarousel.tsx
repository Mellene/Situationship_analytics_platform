import React, { useRef, useEffect, useState } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollSpeed = 500; // ms to scroll one item
  const pauseBetweenScroll = 3000; // ms to pause before next scroll

  // Duplicate reviews to create an infinite loop effect
  const extendedReviews = [...reviews, ...reviews, ...reviews];

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const itemWidthWithGap = (carousel.children[0]?.clientWidth || 0) + 40; // Card width + gap (from CSS)
    const originalReviewsCount = reviews.length;

    const autoScroll = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        const targetScrollLeft = nextIndex * itemWidthWithGap;

        if (nextIndex >= originalReviewsCount * 2) { // If we've scrolled past the second set of original reviews
          // Instantly jump back to the start of the second set (first duplicate)
          carousel.scrollLeft = originalReviewsCount * itemWidthWithGap;
          return originalReviewsCount; // Reset index to point to the first duplicate
        } else {
          carousel.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
          return nextIndex;
        }
      });
    }, pauseBetweenScroll);

    return () => clearInterval(autoScroll);
  }, [reviews, pauseBetweenScroll]);

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
