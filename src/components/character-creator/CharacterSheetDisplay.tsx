import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SKILLS } from '@/lib/dnd-srd-data';
import type { Ability, Character } from '@shared/types';
import { Shield, Heart, Star, CheckCircle2, Package, Wand2, UserSquare2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
interface CharacterSheetDisplayProps {
  character: Character;
  generatedImageUrl?: string;
}
const getAbilityModifierAsNumber = (score: number) => Math.floor((score - 10) / 2);
const formatModifier = (mod: number) => (mod >= 0 ? `+${mod}` : `${mod}`);
export function CharacterSheetDisplay({ character, generatedImageUrl }: CharacterSheetDisplayProps) {
  if (!character.race || !character.dndClass || !character.background) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive">Character data is incomplete and cannot be displayed.</p>
      </div>
    );
  }
  const finalScores = { ...character.abilityScores };
  for (const [ability, increase] of Object.entries(character.race.abilityScoreIncrease)) {
    if (finalScores[ability as Ability]) {
      finalScores[ability as Ability] += increase as number;
    }
  }
  const modifiers = {
    Strength: getAbilityModifierAsNumber(finalScores.Strength),
    Dexterity: getAbilityModifierAsNumber(finalScores.Dexterity),
    Constitution: getAbilityModifierAsNumber(finalScores.Constitution),
    Intelligence: getAbilityModifierAsNumber(finalScores.Intelligence),
    Wisdom: getAbilityModifierAsNumber(finalScores.Wisdom),
    Charisma: getAbilityModifierAsNumber(finalScores.Charisma),
  };
  // Level 1 stats
  const proficiencyBonus = 2;
  const armorClass = 10 + modifiers.Dexterity;
  const hitPoints = character.dndClass.hitDie + modifiers.Constitution;
  const spellcasting = character.dndClass.spellcasting;
  let spellSaveDC = 0;
  let spellAttackModifier = 0;
  if (spellcasting) {
    const spellcastingModifier = modifiers[spellcasting.ability];
    spellSaveDC = 8 + proficiencyBonus + spellcastingModifier;
    spellAttackModifier = proficiencyBonus + spellcastingModifier;
  }
  const imageUrl = generatedImageUrl || character.generatedImageUrl;
  return (
    <Card className="shadow-xl border-2 border-ink/20">
      <CardHeader className="text-center bg-muted/50 p-6">
        <h1 className="text-5xl font-display text-ink">{character.name}</h1>
        <p className="text-xl text-muted-foreground">Level 1 {character.race.name} {character.dndClass.name}</p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            {imageUrl ? (
              <img src={imageUrl} alt={`Portrait of ${character.name}`} className="w-full h-auto object-cover rounded-lg shadow-md aspect-square" />
            ) : (
              <div className="w-full aspect-square bg-muted/50 rounded-lg flex items-center justify-center">
                <UserSquare2 className="w-24 h-24 text-muted-foreground/50" />
              </div>
            )}
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg flex flex-col items-center justify-center">
                <Shield className="h-6 w-6 text-muted-foreground mb-1" />
                <p className="text-3xl font-bold">{armorClass}</p>
                <p className="text-sm uppercase text-muted-foreground">Armor Class</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg flex flex-col items-center justify-center">
                <Heart className="h-6 w-6 text-muted-foreground mb-1" />
                <p className="text-3xl font-bold">{hitPoints}</p>
                <p className="text-sm uppercase text-muted-foreground">Hit Points</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg flex flex-col items-center justify-center">
                <Star className="h-6 w-6 text-muted-foreground mb-1" />
                <p className="text-3xl font-bold">+{proficiencyBonus}</p>
                <p className="text-sm uppercase text-muted-foreground">Proficiency</p>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-4 text-center">
              {(Object.keys(finalScores) as Ability[]).map((ability) => (
                <div key={ability} className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm uppercase text-muted-foreground font-bold">{ability.substring(0, 3)}</p>
                  <p className="text-2xl font-bold">{formatModifier(modifiers[ability])}</p>
                  <p className="text-xs text-muted-foreground">{finalScores[ability]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <CardTitle className="font-display text-2xl mb-4 text-center">Saving Throws</CardTitle>
            <div className="space-y-2 text-sm">
              {(Object.keys(modifiers) as Ability[]).map(ability => {
                const isProficient = character.dndClass!.savingThrowProficiencies.includes(ability);
                const modifier = modifiers[ability] + (isProficient ? proficiencyBonus : 0);
                return (
                  <div key={ability} className="flex justify-between items-center border-b border-dashed border-ink/10 py-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={cn("h-4 w-4", isProficient ? "text-magic" : "text-muted-foreground/30")} />
                      <span className={cn(isProficient && "font-bold")}>{ability}</span>
                    </div>
                    <span className="font-bold bg-muted/50 px-2 rounded">{formatModifier(modifier)}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <CardTitle className="font-display text-2xl mb-4 text-center">Skills</CardTitle>
            <div className="space-y-2 text-sm">
              {SKILLS.map(skill => {
                const isProficient = character.proficientSkills.includes(skill.name);
                const modifier = modifiers[skill.ability] + (isProficient ? proficiencyBonus : 0);
                return (
                  <div key={skill.name} className="flex justify-between items-center border-b border-dashed border-ink/10 py-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={cn("h-4 w-4", isProficient ? "text-magic" : "text-muted-foreground/30")} />
                      <span className={cn("text-muted-foreground text-xs w-6", isProficient && "font-bold")}>{skill.ability.substring(0, 3)}</span>
                      <span className={cn(isProficient && "font-bold")}>{skill.name}</span>
                    </div>
                    <span className="font-bold bg-muted/50 px-2 rounded">{formatModifier(modifier)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          {spellcasting && (
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-2xl flex items-center gap-2"><Wand2 className="h-6 w-6" /> Spellcasting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div className="p-2 bg-muted/50 rounded-lg">
                    <p className="text-sm uppercase text-muted-foreground">Ability</p>
                    <p className="text-xl font-bold">{spellcasting.ability}</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded-lg">
                    <p className="text-sm uppercase text-muted-foreground">Save DC</p>
                    <p className="text-xl font-bold">{spellSaveDC}</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded-lg">
                    <p className="text-sm uppercase text-muted-foreground">Attack Bonus</p>
                    <p className="text-xl font-bold">{formatModifier(spellAttackModifier)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  <div>
                    <h4 className="font-bold mb-2">Cantrips</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {character.spells.filter(s => s.level === 0).map(s => <li key={s.name}>{s.name}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">1st-Level Spells</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {character.spells.filter(s => s.level === 1).map(s => <li key={s.name}>{s.name}</li>)}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-2xl">Background: {character.background.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{character.background.description}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-2xl flex items-center gap-2">
                <Package className="h-6 w-6" /> Equipment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground columns-2">
                {character.equipment.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}