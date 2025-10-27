import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useCharacterStore, useCharacterActions } from '@/hooks/use-character-store';
import { SPELLS } from '@/lib/dnd-srd-data';
import type { Spell } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wand2 } from 'lucide-react';
interface StepSpellsProps {
  onBack: () => void;
  onNext: () => void;
  prevStepName?: string;
  nextStepName?: string;
}
export function StepSpells({ onBack, onNext, prevStepName = 'Class', nextStepName = 'Abilities' }: StepSpellsProps) {
  const dndClass = useCharacterStore((s) => s.character.dndClass);
  const { setSpells } = useCharacterActions();
  const [selectedCantrips, setSelectedCantrips] = useState<Spell[]>([]);
  const [selectedSpells, setSelectedSpells] = useState<Spell[]>([]);
  const spellcasting = dndClass?.spellcasting;
  const availableSpells = useMemo(() => {
    if (!spellcasting) return { cantrips: [], level1: [] };
    const allSpells = SPELLS.filter(spell => spellcasting.spellList.includes(spell.name));
    return {
      cantrips: allSpells.filter(s => s.level === 0),
      level1: allSpells.filter(s => s.level === 1),
    };
  }, [spellcasting]);
  if (!spellcasting) {
    return (
      <div>
        <p>This class does not have spellcasting.</p>
        <Button onClick={onNext}>Skip</Button>
      </div>
    );
  }
  const handleToggle = (spell: Spell, list: Spell[], setList: React.Dispatch<React.SetStateAction<Spell[]>>, max: number) => {
    setList(prev => {
      const isSelected = prev.some(s => s.name === spell.name);
      if (isSelected) {
        return prev.filter(s => s.name !== spell.name);
      }
      if (prev.length < max) {
        return [...prev, spell];
      }
      return prev;
    });
  };
  const handleNext = () => {
    setSpells([...selectedCantrips, ...selectedSpells]);
    onNext();
  };
  const isReady = selectedCantrips.length === spellcasting.cantripsKnown && selectedSpells.length === spellcasting.spellsKnown;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-4xl font-display text-ink">Choose Your Spells</h2>
        <p className="text-muted-foreground mt-2">Select the arcane arts you will wield on your adventures.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl flex items-center gap-2"><Wand2 className="h-6 w-6" /> Cantrips</CardTitle>
            <CardDescription>Choose {spellcasting.cantripsKnown}. ({selectedCantrips.length} / {spellcasting.cantripsKnown} selected)</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 pr-4">
              <div className="space-y-4">
                {availableSpells.cantrips.map(spell => (
                  <div key={spell.name} className="flex items-start space-x-3">
                    <Checkbox
                      id={`cantrip-${spell.name}`}
                      checked={selectedCantrips.some(s => s.name === spell.name)}
                      onCheckedChange={() => handleToggle(spell, selectedCantrips, setSelectedCantrips, spellcasting.cantripsKnown)}
                      disabled={!selectedCantrips.some(s => s.name === spell.name) && selectedCantrips.length >= spellcasting.cantripsKnown}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label htmlFor={`cantrip-${spell.name}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{spell.name}</label>
                      <p className="text-sm text-muted-foreground">{spell.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl flex items-center gap-2"><Wand2 className="h-6 w-6" /> 1st-Level Spells</CardTitle>
            <CardDescription>Choose {spellcasting.spellsKnown}. ({selectedSpells.length} / {spellcasting.spellsKnown} selected)</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 pr-4">
              <div className="space-y-4">
                {availableSpells.level1.map(spell => (
                  <div key={spell.name} className="flex items-start space-x-3">
                    <Checkbox
                      id={`spell-${spell.name}`}
                      checked={selectedSpells.some(s => s.name === spell.name)}
                      onCheckedChange={() => handleToggle(spell, selectedSpells, setSelectedSpells, spellcasting.spellsKnown)}
                      disabled={!selectedSpells.some(s => s.name === spell.name) && selectedSpells.length >= spellcasting.spellsKnown}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label htmlFor={`spell-${spell.name}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{spell.name}</label>
                      <p className="text-sm text-muted-foreground">{spell.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" size="lg">
          Back: {prevStepName}
        </Button>
        <Button onClick={handleNext} disabled={!isReady} size="lg" className="bg-magic hover:bg-magic/90 text-magic-foreground">
          Next: {nextStepName}
        </Button>
      </div>
    </motion.div>
  );
}