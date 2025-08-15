import { useState, useEffect } from 'react';
import { ALL_ACHIEVEMENTS } from './achievements';
import { showAchievementToast } from './toastManager';
import { XP_REWARDS, calculateLevelFromXp } from './gameBalance';

// --- Interfaces (Unchanged) ---
export interface AchievementProgress {
  id: string;
  currentProgress: number;
  unlockedAt: Date | null;
}
export interface UserProfile {
  lastLoginDate: string | null;
  currentStreak: number;
  longestStreak: number;
  totalCoursesCompleted: number;
  totalTriviaCorrect: number;
  totalXp: number;
  achievements: Record<string, AchievementProgress>;
}

// --- Constants (Unchanged) ---
const USER_PROFILE_KEY = 'connected-user-profile';

// --- Internal Helper Functions ---
function createDefaultProfile(): UserProfile {
  const defaultAchievements: Record<string, AchievementProgress> = {};
  ALL_ACHIEVEMENTS.forEach(ach => {
    defaultAchievements[ach.id] = {
      id: ach.id,
      currentProgress: 0,
      unlockedAt: null,
    };
  });

  return {
    lastLoginDate: null,
    currentStreak: 0,
    longestStreak: 0,
    totalCoursesCompleted: 0,
    totalTriviaCorrect: 0,
    totalXp: 0, // <-- CORRECT: A new user starts with 0 XP.
    achievements: defaultAchievements,
  };
}

// These functions now only interact with localStorage and are not exported.
function getProfileFromStorage(): UserProfile {
  const profileJSON = localStorage.getItem(USER_PROFILE_KEY);
  
  // Start with a default profile. This guarantees all achievement slots exist.
  let profile: UserProfile = createDefaultProfile();

  if (profileJSON) {
    try {
      const storedProfile = JSON.parse(profileJSON);
      
      // --- THIS IS THE CRITICAL FIX ---
      // We merge the stored data into our safe, default profile.
      // This ensures that even if we add a new achievement later, the user's
      // profile will automatically get a placeholder for it.
      profile = { ...profile, ...storedProfile };

      // Ensure the nested achievements object is also merged, not replaced.
      profile.achievements = { ...profile.achievements, ...storedProfile.achievements };
      
      // We still need to parse dates correctly from JSON
      for (const key in profile.achievements) {
          if (profile.achievements[key]?.unlockedAt) {
              profile.achievements[key].unlockedAt = new Date(profile.achievements[key].unlockedAt);
          }
      }
    } catch (e) {
      console.error("Error parsing user profile from localStorage. Reverting to default.", e);
      // If parsing fails, we stick with the clean default profile.
    }
  }

  // Save the potentially updated profile back to storage to fix it for the future.
  saveProfileToStorage(profile);
  return profile;
}
function saveProfileToStorage(profile: UserProfile) {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

// --- Global State Management for the Hook ---
// This is the clean way to share state between all components that use the hook.
let globalProfile: UserProfile = getProfileFromStorage();
const listeners: Set<(profile: UserProfile) => void> = new Set();

function updateGlobalProfile(updater: (profile: UserProfile) => UserProfile) {
  const oldProfile = JSON.parse(JSON.stringify(globalProfile));
  const newProfile = updater(globalProfile);

  checkForNewAchievements(oldProfile, newProfile);
  
  globalProfile = newProfile;
  saveProfileToStorage(globalProfile);
  listeners.forEach(listener => listener(globalProfile));
}

// --- The Custom Hook ---
export function useUserProfile() {
  const [profile, setProfile] = useState(globalProfile);

  useEffect(() => {
    listeners.add(setProfile);
    return () => {
      listeners.delete(setProfile);
    };
  }, []);

  return profile;
}

// --- Logic Functions (Now internal to this module) ---
function checkForNewAchievements(oldProfile: UserProfile, newProfile: UserProfile) {
  for (const ach of ALL_ACHIEVEMENTS) {
    const oldProg = oldProfile.achievements[ach.id];
    const newProg = newProfile.achievements[ach.id];
    if (oldProg?.unlockedAt === null && newProg?.unlockedAt !== null) {
      console.log(`SUCCESS: Firing achievement toast for: ${ach.title}`);
      showAchievementToast(ach);
    }
  }
}

function checkAndUnlockAchievements(profile: UserProfile) {

    const overallLevel = calculateLevelFromXp(profile.totalXp);
    
    // Update progress for level-based achievements
    profile.achievements.level_5.currentProgress = overallLevel;
    profile.achievements.level_10.currentProgress = overallLevel;
    profile.achievements.level_20.currentProgress = overallLevel;
    profile.achievements.level_50.currentProgress = overallLevel;

    // This function can be expanded to update all achievement progress in one place
    profile.achievements.first_math_course.currentProgress = profile.totalCoursesCompleted;
    profile.achievements.first_trivia_correct.currentProgress = profile.totalTriviaCorrect;
    profile.achievements.trivia_wizard.currentProgress = profile.totalTriviaCorrect;
    profile.achievements.streak_3.currentProgress = profile.longestStreak;
    profile.achievements.streak_30.currentProgress = profile.longestStreak;
    // Add logic for math level achievements here if you track math level separately

    for (const ach of ALL_ACHIEVEMENTS) {
        if (profile.achievements[ach.id].unlockedAt === null) {
            if (profile.achievements[ach.id].currentProgress >= ach.goal) {
                profile.achievements[ach.id].unlockedAt = new Date();
            }
        }
    }
}

// --- EXPORTED "ACTION" FUNCTIONS ---
// These are the functions your components will call.

/**
 * Call this function every time a user gets a MATH question right.
 * @param mathLevelNum The level of the math course (e.g., 1, 2, 3).
 */
export function recordMathCorrectAnswer(mathLevelNum: number) {
  updateGlobalProfile(profile => {
    const xpEarned = XP_REWARDS.math.base + (mathLevelNum * XP_REWARDS.math.perLevel);
    profile.totalXp += xpEarned;
    
    // We don't need to check achievements here, as they are based on course completion,
    // but we can if we want to add "answer X math questions" achievements later.
    
    return profile;
  });
}

// We also need to update recordMathCourseCompletion to NOT award XP anymore.
export function recordMathCourseCompletion(newBestScore: number) {
  updateGlobalProfile(profile => {
    // We no longer need the mathLevelNum parameter here
    profile.totalCoursesCompleted += 1;
    if (newBestScore >= 1.0) {
      profile.achievements.perfect_score.currentProgress += 1;
    }
    return profile;
  });
}


export function recordTriviaCorrectAnswer(difficulty: 'easy' | 'medium' | 'hard') {
  updateGlobalProfile(profile => {
    // --- THIS IS THE FIX ---
    // Grant XP based on the question's difficulty, with a fallback for safety.
    const xpEarned = XP_REWARDS.trivia[difficulty] || XP_REWARDS.trivia.medium;
    profile.totalXp += xpEarned;
    
    // The rest of the logic is correct
    profile.totalTriviaCorrect += 1;

    checkAndUnlockAchievements(profile);
    return profile;
  });
}

export function updateUserStreak() {
  updateGlobalProfile(profile => {
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastLoginDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (profile.lastLoginDate === yesterday) {
        profile.currentStreak += 1;
      } else {
        profile.currentStreak = 1;
      }
      profile.lastLoginDate = today;
      profile.longestStreak = Math.max(profile.longestStreak, profile.currentStreak);
      checkAndUnlockAchievements(profile);
    }
    return profile;
  });
}