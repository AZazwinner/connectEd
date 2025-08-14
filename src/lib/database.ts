// src/lib/database.ts

import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

const DB_NAME = 'ConnectEdDB';
// --- 1. INCREMENT THE DATABASE VERSION ---
// Any time you change the structure (add stores or indexes), you MUST bump the version.
const DB_VERSION = 2; 

// Define constants for our store names to avoid typos
const QUESTIONS_STORE = 'questions';
const PLACEMENT_TESTS_STORE = 'placementTests'; // New constant for clarity

// --- 2. UPDATE THE DATABASE SCHEMA INTERFACE ---
// Define the structure of our database, including the new store.
interface ConnectEdDBSchema extends DBSchema {
  // The existing questions store (unchanged)
  [QUESTIONS_STORE]: {
    key: number;
    value: {
      questionId: string;
      skillId: string;
      levelId: string;
      questionData: any;
      answeredCorrectly: boolean | null;
    };
    indexes: { 'by_level_and_skill': [string, string] };
  };
  
  // --- This is the new definition for our placement tests store ---
  [PLACEMENT_TESTS_STORE]: {
    key: string; // The key will be the testId, e.g., "level-3"
    value: {
      testId: string;
      questions: any[]; // An array of question objects
    };
    // No indexes are needed for this simple store
  };
}

// Singleton pattern to ensure we only have one database connection
let dbInstance: IDBPDatabase<ConnectEdDBSchema> | null = null;

async function getDb(): Promise<IDBPDatabase<ConnectEdDBSchema>> {
  if (dbInstance) {
    return dbInstance;
  }

  console.log("Opening new IndexedDB connection...");
  dbInstance = await openDB<ConnectEdDBSchema>(DB_NAME, DB_VERSION, {
    // The 'upgrade' function ONLY runs if the DB_VERSION is higher than the one
    // the browser currently has stored.
    upgrade(db, oldVersion) {
      console.log(`Upgrading database from version ${oldVersion} to ${DB_VERSION}`);
      
      // Check if the questions store already exists before creating it
      if (!db.objectStoreNames.contains(QUESTIONS_STORE)) {
        const questionStore = db.createObjectStore(QUESTIONS_STORE, {
          keyPath: 'key',
          autoIncrement: true,
        });
        questionStore.createIndex('by_level_and_skill', ['levelId', 'skillId']);
      }

      // --- 3. CREATE THE NEW OBJECT STORE ---
      // We check if the new store needs to be created.
      if (!db.objectStoreNames.contains(PLACEMENT_TESTS_STORE)) {
        // The key for this store will be the 'testId' property of the objects we store.
        db.createObjectStore(PLACEMENT_TESTS_STORE, { keyPath: 'testId' });
        console.log(`Object store '${PLACEMENT_TESTS_STORE}' created.`);
      }
    },
  });

  dbInstance.addEventListener('close', () => {
    console.warn('Database connection closed. Nullifying instance.');
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

export async function savePlacementTest(testId: string, questions: any[]) {
  const db = await getDb();
  // We use our constant to refer to the store name
  const tx = db.transaction(PLACEMENT_TESTS_STORE, 'readwrite');
  await tx.store.put({ testId, questions }); // 'put' will add or update the record
  await tx.done;
  console.log(`Successfully saved placement test '${testId}' to IndexedDB.`);
}

/**
 * Retrieves a saved placement test from IndexedDB.
 * @param testId - The ID of the test to retrieve.
 * @returns The array of questions, or undefined if not found.
 */
export async function getPlacementTest(testId: string): Promise<any[] | undefined> {
  const db = await getDb();
  const test = await db.get(PLACEMENT_TESTS_STORE, testId);
  return test?.questions;
}