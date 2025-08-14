import { addQuestionsToBank } from './database';
import api from './api'; // <-- 1. Import our new central API helper

/**
 * Fetches a large, single batch of questions for all skills within a level
 * and stores them in IndexedDB.
 * @param levelId The ID of the level to sync (e.g., "level-1").
 * @param questionsPerSkill The number of questions to fetch for EACH skill.
 */
export async function syncQuestionsForLevel(levelId: string, questionsPerSkill: number = 300) { // <-- 2. Default is now 300
  console.log(`[Sync] Starting BULK sync for ${levelId}...`);

  try {
    // 3. Make a SINGLE request using our new 'api' helper.
    // The URL is now relative to the baseURL defined in api.ts.
    // Axios cleanly handles query parameters with the `params` object.
    const response = await api.get(`/math/bulk-lessons/${levelId}`, {
      params: {
        questions_per_skill: questionsPerSkill,
      },
    });
    
    // With axios, the JSON data is automatically parsed and available on `response.data`.
    // The explicit `if (!response.ok)` check is no longer needed, as axios
    // will automatically throw an error for non-2xx status codes.
    const allQuestions: any[] = response.data;
    console.log(`[Sync] Successfully fetched a bulk batch of ${allQuestions.length} questions.`);

    // --- The logic below this line for processing the data is unchanged and correct ---

    // Group the results by skillId so we can add them to the DB efficiently
    const questionsBySkill: Record<string, any[]> = {};
    for (const question of allQuestions) {
      const skillId = question.skillId;
      if (!questionsBySkill[skillId]) {
        questionsBySkill[skillId] = [];
      }
      // We only need to store the raw question data from the generator
      questionsBySkill[skillId].push(question.questionData);
    }
    
    // Add each batch to the database, one skill at a time
    for (const skillId in questionsBySkill) {
      await addQuestionsToBank(levelId, skillId, questionsBySkill[skillId]);
    }

    console.log(`[Sync] Bulk process complete for ${levelId}!`);
    
  } catch (error) {
    // The catch block will now handle errors from the axios request automatically.
    console.error(`[Sync] An error occurred during the bulk sync process:`, error);
  }
}