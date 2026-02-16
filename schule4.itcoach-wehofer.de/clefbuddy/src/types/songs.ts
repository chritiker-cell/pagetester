import type { Exercise } from './music';

export type SongCategory = 'kinderlieder' | 'klassiker' | 'internationale';

export interface SongMeta {
  category: SongCategory;
  composer: string;
  lyrics?: string;
}

export interface Song extends Exercise {
  songMeta: SongMeta;
}
