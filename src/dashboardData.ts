// src/dashboardData.ts

import level1Img from './assets/math/level1math.png';
import level2Img from './assets/math/level2math.png';
import level3Img from './assets/math/level3math.png';
import level4Img from './assets/math/level4math.png';
import level5Img from './assets/math/level5math.png';
import level6Img from './assets/math/level6math.png';
import level7Img from './assets/math/level7math.png';

export interface Level {
  title: string;
  image: string; // URL to the image for the level card
  isNew?: boolean;
  path: string; // The URL path for this level
}

export interface LearningPathData {
  id: string;
  icon: string; // URL to the main category icon
  title: string;
  description: string;
  levels?: Level[]; // Optional, as Trivia might not have levels
  type: 'math' | 'trivia' | 'explore' | 'nasa';
}

export const dashboardData: LearningPathData[] = [
  {
    id: 'foundational-math',
    icon: level1Img, // or another math icon if you have one
    title: 'Core Curriculum: Math',
    description: 'Master problem-solving essentials and build your foundation.',
    type: 'math',
    levels: [
      { title: 'Level 1', image: level1Img, path: '/math/level-1', isNew: true },
      { title: 'Level 2', image: level2Img, path: '/math/level-2' },
      { title: 'Level 3', image: level3Img, path: '/math/level-3' },
      { title: 'Level 4', image: level4Img, path: '/math/level-4' },
      { title: 'Level 5', image: level5Img, path: '/math/level-5' },
      { title: 'Level 6', image: level6Img, path: '/math/level-6' },
      { title: 'Level 7', image: level7Img, path: '/math/level-7' },
    ]
  },
  {
    id: 'trivia-challenge',
    icon: 'https://ds055uzetaobb.cloudfront.net/category-images/Technology-JFXNyW.png',
    title: 'Trivia Challenge',
    description: 'Test your knowledge on a wide variety of topics.',
    type: 'trivia',
  },
  {
    id: 'explore-wikipedia',
    icon: 'https://ds055uzetaobb.cloudfront.net/category-images/Science-eBE22L.png',
    title: 'Explore: The Library',
    description: 'Dive deep into topics with our offline article database.',
    type: 'explore',
    levels: [
      { title: 'History', image: 'https://ds055uzetaobb.cloudfront.net/brioche/chapter/history-of-math-Q4Wj8a.png?width=156', path: '/explore/history' },
      { title: 'Science', image: 'https://ds055uzetaobb.cloudfront.net/brioche/chapter/scientific-thinking-CVUo4R.png?width=156', path: '/explore/science' },
      { title: 'Technology', image: 'https://ds055uzetaobb.cloudfront.net/brioche/chapter/how-computers-work-AoG7Jw.png?width=156', path: '/explore/technology' },
      { title: 'Geography', image: 'https://ds055uzetaobb.cloudfront.net/brioche/chapter/astronomy-a92S3T.png?width=156', path: '/explore/geography' },
    ]
  },
  // Add NASA section later
];