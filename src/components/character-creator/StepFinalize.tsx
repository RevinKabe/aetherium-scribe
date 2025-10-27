import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCharacterStore } from '@/hooks/use-character-store';
import { BACKGROUNDS } from '@/lib/dnd-srd-data';
import type { DndBackground } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
interface StepFinalizeProps {
  onBack: () => void;
  onNext: () => void;
  prevStepName?: string;
  nextStepName?: string;
}
export function StepFinalize({ onBack, onNext, prevStepName = 'Abilities', nextStepName = 'Equipment' }: StepFinalizeProps) {
  const { setDetails, setProficientSkills } = useCharacterStore((s) => s.actions);
  const initialName = useCharacterStore((s) => s.character.name);
  const initialBg = useCharacterStore((s) => s.character.background);
  const dndClass = useCharacterStore((s) => s.character.dndClass);
  const [name, setName] = useState(initialName);
  const [background, setBackground] = useState<DndBackground | null>(initialBg);
  const [selectedClassSkills, setSelectedClassSkills] = useState<string[]>([]);
  const classSkillChoices = useMemo(() => {
    if (!dndClass || !background) return [];
    return dndClass.skillProficiency.choices.filter(
      (skill) => !background.skillProficiencies.includes(skill)
    );
  }, [dndClass, background]);
  const handleSkillToggle = (skill: string) => {
    setSelectedClassSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      }
      if (dndClass && prev.length < dndClass.skillProficiency.count) {
        return [...prev, skill];
      }
      return prev;
    });
  };
  const handleNext = () => {
    if (name.trim() && background && dndClass) {
      setDetails(name.trim(), background);
      const allProficientSkills = [...background.skillProficiencies, ...selectedClassSkills];
      setProficientSkills(allProficientSkills);
      onNext();
    }
  };
  const isReady = name.trim() && background && dndClass && selectedClassSkills.length === dndClass.skillProficiency.count;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-4xl font-display text-ink">Final Details</h2>
        <p className="text-muted-foreground mt-2">Give your character a name, a past, and hone their skills.</p>
      </div>
      <div className="space-y-6 p-6 border rounded-lg bg-card shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="character-name" className="text-lg font-semibold">Character Name</Label>
          <Input
            id="character-name"
            placeholder="e.g., Eldrin the Brave"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="background" className="text-lg font-semibold">Background</Label>
          <Select onValueChange={(value) => setBackground(BACKGROUNDS.find(b => b.name === value) || null)} defaultValue={initialBg?.name}>
            <SelectTrigger id="background" className="text-lg">
              <SelectValue placeholder="Select a background" />
            </SelectTrigger>
            <SelectContent>
              {BACKGROUNDS.map((bg) => (
                <SelectItem key={bg.name} value={bg.name}>
                  {bg.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {background && <p className="text-sm text-muted-foreground pt-2">{background.description}</p>}
        </div>
      </div>
      {background && dndClass && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">Skill Proficiencies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">From Background ({background.name}):</h3>
              <div className="flex flex-wrap gap-2">
                {background.skillProficiencies.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">From Class ({dndClass.name}):</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Choose {dndClass.skillProficiency.count} skills. ({selectedClassSkills.length} / {dndClass.skillProficiency.count} selected)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {classSkillChoices.map(skill => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={selectedClassSkills.includes(skill)}
                      onCheckedChange={() => handleSkillToggle(skill)}
                      disabled={!selectedClassSkills.includes(skill) && selectedClassSkills.length >= dndClass.skillProficiency.count}
                    />
                    <label htmlFor={skill} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
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