// src/lib/database.ts

import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

const DB_NAME = 'ConnectEdDB';
const DB_VERSION = 1;
const QUESTIONS_STORE = 'questions';

// Define the structure of our database using TypeScript
interface ConnectEdDBSchema extends DBSchema {
  [QUESTIONS_STORE]: {
    key: number; // The auto-incrementing primary key
    value: {
      questionId: string; // e.g., "place-value-16893849"
      skillId: string;   // e.g., "place-value"
      levelId: string;   // e.g., "level-1"
      questionData: any; // The full question object from your API
      answeredCorrectly: boolean | null;
    };
    indexes: { 'by_level_and_skill': [string, string] };
  };
}

// Singleton pattern to ensure we only have one database connection
let dbInstance: IDBPDatabase<ConnectEdDBSchema> | null = null;

async function getDb(): Promise<IDBPDatabase<ConnectEdDBSchema>> {
  // If we have an instance, we assume it's good and return it.
  // The event listener below will handle cases where it closes.
  if (dbInstance) {
    return dbInstance;
  }

  console.log("No active DB instance found. Opening new connection...");
  dbInstance = await openDB<ConnectEdDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore(QUESTIONS_STORE, {
        keyPath: 'key',
        autoIncrement: true,
      });
      store.createIndex('by_level_and_skill', ['levelId', 'skillId']);
    },
  });

  // --- THIS IS THE FIX ---
  // The underlying IDBDatabase connection can be closed by the browser
  // (especially during development with HMR). We listen for that event.
  dbInstance.addEventListener('close', () => {
    // When the connection closes, we nullify our singleton instance.
    // This forces getDb() to create a brand new, fresh connection
    // the next time it's called.
    console.warn('Database connection closed unexpectedly. Nullifying instance.');
    dbInstance = null;
  });

  return dbInstance;
}

// --- Our Reusable Database Functions ---

/**
 * Adds a batch of questions to the IndexedDB question bank.
 * @param levelId - e.g., "level-1"
 * @param skillId - e.g., "place-value"
 * @param questions - An array of question objects from your API.
 */
export async function addQuestionsToBank(levelId: string, skillId: string, questions: any[]) {
  const db = await getDb();
  const tx = db.transaction(QUESTIONS_STORE, 'readwrite');
  const store = tx.objectStore(QUESTIONS_STORE);

  const questionPromises = questions.map(q => {
    return store.add({
      questionId: `${skillId}-${Date.now()}-${Math.random()}`,
      skillId,
      levelId,
      questionData: q,
      answeredCorrectly: null, // Not answered yet
    });
  });

  await Promise.all(questionPromises);
  await tx.done;
  console.log(`Successfully added ${questions.length} questions for skill: ${skillId}`);
}

/**
 * Fetches a specified number of unanswered questions for a given level.
 * @param levelId - The level to get questions for (e.g., "level-1")
 * @param count - The number of questions to retrieve.
 * @returns An array of question objects from the database.
 */
export async function getQuestionsForLevel(levelId: string, count: number): Promise<any[]> {
    const db = await getDb();
    const tx = db.transaction(QUESTIONS_STORE, 'readonly');
    const index = tx.objectStore(QUESTIONS_STORE).index('by_level_and_skill');
    
    // We get all unanswered questions for the level
    const allUnanswered = await index.getAll(IDBKeyRange.bound([levelId, ''], [levelId, '\uffff']));
    
    const questions = allUnanswered.filter(q => q.answeredCorrectly === null);

    // Shuffle and pick a "random" set of questions from the bank
    return questions.sort(() => 0.5 - Math.random()).slice(0, count);
}


/**
 * Counts how many questions we have banked for a specific level.
 * @param levelId - The level to check.
 * @returns The number of questions available.
 */
export async function countBankedQuestionsForLevel(levelId: string): Promise<number> {
    const db = await getDb();
    const range = IDBKeyRange.bound([levelId, ''], [levelId, '\uffff']);
    return db.countFromIndex(QUESTIONS_STORE, 'by_level_and_skill', range);
}