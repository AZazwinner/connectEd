// This interface defines the shape of a single achievement
export interface Achievement {
  id: string; // A unique identifier
  title: string;
  description: string;
  goal: number; // The target number to reach for completion
}

// This is our definitive list of all achievements in the application.
// We can easily add more here later.
export const ALL_ACHIEVEMENTS: Achievement[] = [
  // --- Progression Milestones ---
  // --- THIS IS THE CORRECTED TEXT ---
  { id: 'level_5', title: 'Level Up!', description: 'Reach Overall Level 5.', goal: 5 },
  { id: 'level_10', title: 'Rising Star', description: 'Reach Overall Level 10.', goal: 10 },
  { id: 'level_20', title: 'Top Scholar', description: 'Reach Overall Level 20.', goal: 20 },
  { id: 'level_50', title: 'Legendary Learner', description: 'Reach Overall Level 50.', goal: 50 },

  // --- Learning & Participation Achievements (Unchanged) ---
  { id: 'first_math_course', title: 'First Steps', description: 'Complete your first course in math.', goal: 1 },
  { id: 'first_trivia_correct', title: 'Trivia Starter', description: 'Answer a trivia question correctly.', goal: 1 },
  { id: 'trivia_wizard', title: 'Trivia Wizard', description: 'Solve 50 correct trivia questions.', goal: 50 },
  { id: 'perfect_score', title: 'Perfectionist', description: 'Score 100% on any math quiz.', goal: 1 },
  
  // --- Streak Achievements (Unchanged) ---
  { id: 'streak_3', title: 'Streak Starter', description: 'Log in and learn 3 days in a row.', goal: 3 },
  { id: 'streak_30', title: 'Consistency King/Queen', description: 'Log in and learn 30 days in a row.', goal: 30 },
];