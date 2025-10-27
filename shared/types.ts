export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// D&D 5e Core Types
export type Ability = "Strength" | "Dexterity" | "Constitution" | "Intelligence" | "Wisdom" | "Charisma";
export type AbilityScores = Record<Ability, number>;
export interface Spell {
  name: string;
  level: number;
  description: string;
}
export interface DndRace {
  name: string;
  description: string;
  imageUrl: string;
  abilityScoreIncrease: Partial<AbilityScores>;
}
export interface DndClass {
  name: string;
  description: string;
  imageUrl: string;
  hitDie: number;
  savingThrowProficiencies: Ability[];
  skillProficiency: {
    choices: string[];
    count: number;
  };
  startingEquipment: string[];
  spellcasting?: {
    ability: Ability;
    cantripsKnown: number;
    spellsKnown: number;
    spellList: string[]; // Names of spells
  };
}
export interface DndBackground {
  name: string;
  description: string;
  skillProficiencies: string[];
  startingEquipment: string[];
}
export interface Character {
  id: string;
  name: string;
  race: DndRace | null;
  dndClass: DndClass | null;
  abilityScores: AbilityScores;
  background: DndBackground | null;
  proficientSkills: string[];
  equipment: string[];
  spells: Spell[];
  generatedImageUrl?: string;
}
export type Skill = {
  name: string;
  ability: Ability;
};