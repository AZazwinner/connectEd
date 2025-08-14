// src/lib/sync.ts

import { addQuestionsToBank } from './database';

/**
 * Fetches a large, single batch of questions for all skills within a level
 * and stores them in IndexedDB. This is MUCH more efficient.
 * @param levelId The ID of the level to sync (e.g., "level-1").
 * @param questionsPerSkill The number of questions to fetch for EACH skill.
 */
export async function syncQuestionsForLevel(levelId: string, questionsPerSkill: number = 30) {
  console.log(`[Sync] Starting BULK sync for ${levelId}...`);

  try {
    // 1. Make a SINGLE fetch request to our new bulk endpoint
    const response = await fetch(`/api/math/bulk-lessons/${levelId}?questions_per_skill=${questionsPerSkill}`);
    
    if (!response.ok) {
      throw new Error(`Bulk API request failed with status ${response.status}`);
    }

    const allQuestions: any[] = await response.json();
    console.log(`[Sync] Successfully fetched a bulk batch of ${allQuestions.length} questions.`);

    // 2. Group the results by skillId so we can add them to the DB efficiently
    const questionsBySkill: Record<string, any[]> = {};
    for (const question of allQuestions) {
      const skillId = question.skillId;
      if (!questionsBySkill[skillId]) {
        questionsBySkill[skillId] = [];
      }
      // We only need to store the raw question data from the generator
      questionsBySkill[skillId].push(question.questionData);
    }
    
    // 3. Add each batch to the database, one skill at a time
    for (const skillId in questionsBySkill) {
      await addQuestionsToBank(levelId, skillId, questionsBySkill[skillId]);
    }

    console.log(`[Sync] Bulk process complete for ${levelId}!`);
    
  } catch (error) {
    console.error(`[Sync] An error occurred during the bulk sync process:`, error);
  }
}