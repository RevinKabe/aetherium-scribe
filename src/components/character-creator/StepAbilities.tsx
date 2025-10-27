import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useCharacterStore } from '@/hooks/use-character-store';
import type { Ability, AbilityScores } from '@shared/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dices } from 'lucide-react';
interface StepAbilitiesProps {
  onBack: () => void;
  onNext: () => void;
  prevStepName?: string;
  nextStepName?: string;
}
const ABILITIES: Ability[] = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
const MAX_POINTS = 27;
const POINT_COST = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
const roll4d6DropLowest = () => {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => a - b);
  rolls.shift(); // Drop the lowest
  return rolls.reduce((sum, roll) => sum + roll, 0);
};
export function StepAbilities({ onBack, onNext, prevStepName = 'Class', nextStepName = 'Finalize' }: StepAbilitiesProps) {
  const initialScores = useCharacterStore((s) => s.character.abilityScores);
  const setAbilityScores = useCharacterStore((s) => s.actions.setAbilityScores);
  const [scores, setScores] = useState<AbilityScores>(initialScores);
  const [activeTab, setActiveTab] = useState('point-buy');
  const pointsSpent = useMemo(() => {
    return ABILITIES.reduce((total, ability) => {
      const score = scores[ability];
      return total + (POINT_COST[score as keyof typeof POINT_COST] || 0);
    }, 0);
  }, [scores]);
  const pointsRemaining = MAX_POINTS - pointsSpent;
  const handleScoreChange = (ability: Ability, value: number) => {
    const newScores = { ...scores, [ability]: value };
    const newPointsSpent = ABILITIES.reduce((total, ab) => total + (POINT_COST[newScores[ab] as keyof typeof POINT_COST] || 0), 0);
    if (newPointsSpent <= MAX_POINTS) {
      setScores(newScores);
    }
  };
  const handleRollAll = () => {
    const newScores: AbilityScores = {
      Strength: roll4d6DropLowest(),
      Dexterity: roll4d6DropLowest(),
      Constitution: roll4d6DropLowest(),
      Intelligence: roll4d6DropLowest(),
      Wisdom: roll4d6DropLowest(),
      Charisma: roll4d6DropLowest(),
    };
    setScores(newScores);
  };
  const handleNext = () => {
    setAbilityScores(scores);
    onNext();
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-display text-ink">Assign Ability Scores</h2>
        <p className="text-muted-foreground mt-2">Determine your core strengths through calculation or chance.</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="point-buy">Point Buy</TabsTrigger>
          <TabsTrigger value="dice-roll">Dice Roll</TabsTrigger>
        </TabsList>
        <TabsContent value="point-buy">
          <div className="p-6 border rounded-lg bg-card shadow-sm mt-4">
            <div className="text-center mb-6">
              <p className="text-2xl font-bold text-magic">{pointsRemaining}</p>
              <p className="text-muted-foreground">Points Remaining</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {ABILITIES.map((ability) => (
                <div key={ability} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-lg">{ability}</label>
                    <span className="text-xl font-mono px-2 py-1 bg-muted rounded">{scores[ability]}</span>
                  </div>
                  <Slider
                    value={[scores[ability]]}
                    onValueChange={([val]) => handleScoreChange(ability, val)}
                    min={8}
                    max={15}
                    step={1}
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="dice-roll">
          <div className="p-6 border rounded-lg bg-card shadow-sm mt-4">
            <div className="text-center mb-6">
              <Button onClick={handleRollAll} size="lg">
                <Dices className="mr-2 h-5 w-5" />
                Roll All Stats (4d6 drop lowest)
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {ABILITIES.map((ability) => (
                <div key={ability} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-lg">{ability}</label>
                    <span className="text-xl font-mono px-2 py-1 bg-muted rounded">{scores[ability]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" size="lg">
          Back: {prevStepName}
        </Button>
        <Button onClick={handleNext} disabled={activeTab === 'point-buy' && pointsRemaining < 0} size="lg" className="bg-magic hover:bg-magic/90 text-magic-foreground">
          Next: {nextStepName}
        </Button>
      </div>
    </motion.div>
  );
}