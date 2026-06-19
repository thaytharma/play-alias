/** Difficulty tier tagged onto each word in the curated lists. */
export type Difficulty = 'easy' | 'medium' | 'hard' | 'veryHard';

/** Words grouped by difficulty tier. */
export type WordPool = Record<Difficulty, string[]>;

/** A language's words: the standard set, plus an adult set added only in party mode. */
export interface LanguageWords {
  standard: WordPool;
  adult: WordPool;
}

/** The difficulty level a player selects in settings. */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/** Play mode — `party` mixes in the adult (18+) pool on top of the standard one. */
export type PlayMode = 'default' | 'party';

/**
 * Which tiers each selected level pulls in. Cumulative: medium adds hard words
 * but stops short of veryHard, which only appears on the hard level.
 */
export const LEVEL_TIERS: Record<DifficultyLevel, readonly Difficulty[]> = {
  easy: ['easy'],
  medium: ['easy', 'medium', 'hard'],
  hard: ['easy', 'medium', 'hard', 'veryHard'],
};
