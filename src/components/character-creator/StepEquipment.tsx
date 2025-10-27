import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCharacterStore, useCharacterActions } from '@/hooks/use-character-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package } from 'lucide-react';
interface StepEquipmentProps {
  onBack: () => void;
  onFinish: () => void;
  prevStepName?: string;
}
export function StepEquipment({ onBack, onFinish, prevStepName = 'Finalize' }: StepEquipmentProps) {
  const dndClass = useCharacterStore((s) => s.character.dndClass);
  const background = useCharacterStore((s) => s.character.background);
  const { setEquipment } = useCharacterActions();
  const startingEquipment = useMemo(() => {
    const fromClass = dndClass?.startingEquipment || [];
    const fromBackground = background?.startingEquipment || [];
    return [...new Set([...fromClass, ...fromBackground])]; // Use Set to remove duplicates
  }, [dndClass, background]);
  const handleFinish = () => {
    setEquipment(startingEquipment);
    onFinish();
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-4xl font-display text-ink">Starting Equipment</h2>
        <p className="text-muted-foreground mt-2">Your journey begins with this gear, granted by your class and background.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl flex items-center gap-2">
            <Package className="h-6 w-6" /> Your Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 pr-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {startingEquipment.map((item, index) => (
                <li key={index} className="text-base">{item}</li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" size="lg">
          Back: {prevStepName}
        </Button>
        <Button onClick={handleFinish} size="lg" className="bg-magic hover:bg-magic/90 text-magic-foreground">
          Create Character
        </Button>
      </div>
    </motion.div>
  );
}