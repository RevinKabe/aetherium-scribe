import { IndexedEntity } from "./core-utils";
import type { Character } from "@shared/types";
import type { Env } from './core-utils';
// CHARACTER ENTITY: one DO instance per character
export class CharacterEntity extends IndexedEntity<Character> {
  static readonly entityName = "character";
  static readonly indexName = "characters";
  static readonly initialState: Character = {
    id: "",
    name: "",
    race: null,
    dndClass: null,
    abilityScores: {
      Strength: 8,
      Dexterity: 8,
      Constitution: 8,
      Intelligence: 8,
      Wisdom: 8,
      Charisma: 8,
    },
    background: null,
    proficientSkills: [],
    equipment: [],
    spells: [],
    generatedImageUrl: '',
  };
  static async get(env: Env, id: string): Promise<Character | null> {
    const inst = new this(env, id);
    if (!(await inst.exists())) {
      return null;
    }
    return inst.getState();
  }
  static async update(env: Env, id: string, data: Partial<Character>): Promise<Character | null> {
    const inst = new this(env, id);
    if (!(await inst.exists())) {
      return null;
    }
    // Use mutate for an atomic read-modify-write operation to prevent data loss.
    // This merges the existing state with the new partial data.
    return inst.mutate((currentState) => ({
      ...currentState,
      ...data,
      id, // Ensure the ID from the URL parameter is preserved
    }));
  }
}