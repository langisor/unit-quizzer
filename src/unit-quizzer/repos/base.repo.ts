/**
 * BaseRepository<T>
 *
 * An abstract base class that defines the minimum API
 * any repository must implement.
 *
 * By extending this, both JSONVocabularyRepository and
 * SQLiteVocabularyRepository are guaranteed to have the same methods.
 * This is what makes swapping them easy later.
 */
export abstract class BaseRepository<T> {
  /** Return every record */
  abstract getAll(): Promise<T[]>;

  /** Return a single record by ID, or undefined if not found */
//   abstract getById(id: string): Promise<T | undefined>;
}
