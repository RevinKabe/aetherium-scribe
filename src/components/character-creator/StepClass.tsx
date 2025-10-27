import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CLASSES } from '@/lib/dnd-srd-data';
import { useCharacterStore } from '@/hooks/use-character-store';
import { cn } from '@/lib/utils';
import type { DndClass } from '@shared/types';
interface StepClassProps {
  onBack: () => void;
  onNext: () => void;
  prevStepName?: string;
  nextStepName?: string;
}
export function StepClass({ onBack, onNext, prevStepName = 'Race', nextStepName = 'Abilities' }: StepClassProps) {
  const selectedClass = useCharacterStore((s) => s.character.dndClass);
  const setDndClass = useCharacterStore((s) => s.actions.setDndClass);
  const handleSelectClass = (dndClass: DndClass) => {
    setDndClass(dndClass);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-display text-ink">Choose Your Class</h2>
        <p className="text-muted-foreground mt-2">Your class is your vocation and defines your skills.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CLASSES.map((dndClass) => (
          <motion.div key={dndClass.name} whileHover={{ y: -5, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Card
              onClick={() => handleSelectClass(dndClass)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectClass(dndClass);
                }
              }}
              tabIndex={0}
              className={cn(
                'cursor-pointer transition-all duration-200 h-full flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                selectedClass?.name === dndClass.name ? 'ring-2 ring-magic shadow-lg' : 'hover:shadow-md'
              )}
            >
              <CardHeader>
                <CardTitle className="font-display text-2xl">{dndClass.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{dndClass.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" size="lg">
          Back: {prevStepName}
        </Button>
        <Button onClick={onNext} disabled={!selectedClass} size="lg" className="bg-magic hover:bg-magic/90 text-magic-foreground">
          Next: {nextStepName}
        </Button>
      </div>
    </motion.div>
  );
}