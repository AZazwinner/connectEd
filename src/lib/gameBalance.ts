// --- XP Rewards ---
// This is where we define how much XP each action is worth.
// It's flexible, so we can easily add more sources later (like articles).
export const XP_REWARDS = {
  trivia: {
    easy: 10,
    medium: 15,
    hard: 20,
  },
  math: {
    // --- THIS IS THE NEW LOGIC ---
    // We now define a reward for each CORRECT math answer.
    base: 3, // Base XP for a correct answer
    perLevel: 1, // Extra XP for each level of difficulty (e.g., a Level 5 question gives 3 + 5*1 = 8 XP)
  },
  // We can add more sources here in the future
  // article: {
  //   read: 50,
  // }
};

// --- Leveling Formula ---
// This defines how much XP is needed to reach the next level.
// A common formula is an exponential curve, so each level takes a bit more effort.
const BASE_XP_FOR_LEVEL = 200; // XP needed for Level 2
const LEVEL_SCALING_FACTOR = 1.2; // Each level requires 20% more XP than the last

/**
 * Calculates the total XP required to reach a specific level.
 * @param level The target level.
 * @returns The total XP needed to be AT that level.
 */
export function getXpForLevel(level: number): number {
  if (level <= 0) return 0;
  if (level === 1) return BASE_XP_FOR_LEVEL;
  // This formula creates a smooth progression curve.
  return Math.floor(BASE_XP_FOR_LEVEL + (BASE_XP_FOR_LEVEL * Math.pow(level - 1, LEVEL_SCALING_FACTOR)));
}

/**
 * Calculates the user's current level based on their total XP.
 * @param totalXp The user's total experience points.
 * @returns The user's current level number.
 */
export function calculateLevelFromXp(totalXp: number): number {
  // --- THIS IS THE FIX ---
  // If the user has less than the XP needed for Level 1, they are Level 0.
  if (totalXp < BASE_XP_FOR_LEVEL) {
    return 0;
  }

  let level = 1;
  while (true) {
    const xpForNextLevel = getXpForLevel(level + 1);
    if (totalXp < xpForNextLevel) {
      return level;
    }
    level++;
    // Add a safety break for very high levels
    if (level > 999) return 999;
  }
}