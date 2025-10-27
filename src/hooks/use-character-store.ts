import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Character, DndRace, DndClass, DndBackground, AbilityScores, Ability, Spell } from '@shared/types';
const initialScores: AbilityScores = {
  Strength: 8,
  Dexterity: 8,
  Constitution: 8,
  Intelligence: 8,
  Wisdom: 8,
  Charisma: 8,
};
const initialState: Character = {
  id: '',
  name: '',
  race: null,
  dndClass: null,
  abilityScores: initialScores,
  background: null,
  proficientSkills: [],
  equipment: [],
  spells: [],
};
type CharacterState = {
  character: Character;
  actions: {
    setRace: (race: DndRace) => void;
    setDndClass: (dndClass: DndClass) => void;
    setAbilityScore: (ability: Ability, value: number) => void;
    setAbilityScores: (scores: AbilityScores) => void;
    setDetails: (name: string, background: DndBackground) => void;
    setProficientSkills: (skills: string[]) => void;
    setEquipment: (equipment: string[]) => void;
    setSpells: (spells: Spell[]) => void;
    setCharacterForEditing: (character: Character) => void;
    reset: () => void;
  };
};
export const useCharacterStore = create<CharacterState>()(
  immer((set) => ({
    character: initialState,
    actions: {
      setRace: (race) =>
        set((state) => {
          state.character.race = race;
        }),
      setDndClass: (dndClass) =>
        set((state) => {
          state.character.dndClass = dndClass;
        }),
      setAbilityScore: (ability, value) =>
        set((state) => {
          state.character.abilityScores[ability] = value;
        }),
      setAbilityScores: (scores) =>
        set((state) => {
          state.character.abilityScores = scores;
        }),
      setDetails: (name, background) =>
        set((state) => {
          state.character.name = name;
          state.character.background = background;
        }),
      setProficientSkills: (skills) =>
        set((state) => {
          state.character.proficientSkills = skills;
        }),
      setEquipment: (equipment) =>
        set((state) => {
          state.character.equipment = equipment;
        }),
      setSpells: (spells) =>
        set((state) => {
          state.character.spells = spells;
        }),
      setCharacterForEditing: (character) =>
        set({ character }),
      reset: () => set({ character: initialState }),
    },
  }))
);
// Hooks for selecting parts of the state, following Zustand best practices
export const useCharacterActions = () => useCharacterStore((state) => state.actions);