// src/lib/progress.ts

const UNLOCKED_LEVEL_KEY = 'connected-unlocked-level';
const SKILL_PROGRESS_KEY = 'connected-skill-progress';

// --- LEVEL PROGRESS ---
export function getUnlockedLevel(): number {
  const level = localStorage.getItem(UNLOCKED_LEVEL_KEY);
  return level ? parseInt(level, 10) : 1;
}

export function setUnlockedLevel(levelNumber: number) {
  const currentUnlocked = getUnlockedLevel();
  if (levelNumber > currentUnlocked) {
    localStorage.setItem(UNLOCKED_LEVEL_KEY, levelNumber.toString());
    console.log(`Progress saved! Unlocked up to level ${levelNumber}.`);
  }
}

export interface SkillProgress {
  bestScore: number;
  isMastered: boolean;
}

/**
 * Gets an object containing the progress for all skills.
 * e.g., { "place-value": { bestScore: 0.9, isMastered: true } }
 */
export function getAllSkillProgress(): Record<string, SkillProgress> {
  const progressJSON = localStorage.getItem(SKILL_PROGRESS_KEY);
  return progressJSON ? JSON.parse(progressJSON) : {};
}

/**
 * Saves the result of a practice session for a specific skill.
 */
export function saveSkillAttempt(skillId: string, currentScore: number) {
  const allProgress = getAllSkillProgress();
  
  const existingProgress = allProgress[skillId] || { bestScore: 0, isMastered: false };
  
  const newBestScore = Math.max(existingProgress.bestScore, currentScore);
  const newIsMastered = existingProgress.isMastered || newBestScore >= 0.8; // Mastery is permanent

  allProgress[skillId] = {
    bestScore: newBestScore,
    isMastered: newIsMastered,
  };

  localStorage.setItem(SKILL_PROGRESS_KEY, JSON.stringify(allProgress));
  console.log(`Saved attempt for ${skillId}. New best score: ${newBestScore}, Mastered: ${newIsMastered}`);
}

/**
 * Checks if a specific skill has been mastered (80% or higher).
 */
export function isSkillMastered(skillId: string): boolean {
  const allProgress = getAllSkillProgress();
  return allProgress[skillId]?.isMastered || false;
}

export function unlockLevelsUpTo(targetLevelId: string) {
  const levelNumStr = targetLevelId.split('-')[1];
  if (!levelNumStr) {
    console.error("Could not parse level number from ID:", targetLevelId);
    return;
  }
  
  const targetLevelNum = parseInt(levelNumStr, 10);
  if (isNaN(targetLevelNum)) {
    console.error("Parsed level number is not a valid number:", levelNumStr);
    return;
  }

  // Use the existing setUnlockedLevel function to update progress
  setUnlockedLevel(targetLevelNum);
}