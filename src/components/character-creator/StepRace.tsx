import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RACES } from '@/lib/dnd-srd-data';
import { useCharacterStore } from '@/hooks/use-character-store';
import { cn } from '@/lib/utils';
import type { DndRace } from '@shared/types';
interface StepRaceProps {
  onNext: () => void;
  nextStepName?: string;
}
export function StepRace({ onNext, nextStepName = 'Class' }: StepRaceProps) {
  const selectedRace = useCharacterStore((s) => s.character.race);
  const setRace = useCharacterStore((s) => s.actions.setRace);
  const handleSelectRace = (race: DndRace) => {
    setRace(race);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-display text-ink">Choose Your Race</h2>
        <p className="text-muted-foreground mt-2">Your race shapes your identity and innate abilities.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RACES.map((race) => (
          <motion.div key={race.name} whileHover={{ y: -5, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Card
              onClick={() => handleSelectRace(race)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectRace(race);
                }
              }}
              tabIndex={0}
              className={cn(
                'cursor-pointer transition-all duration-200 h-full flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                selectedRace?.name === race.name ? 'ring-2 ring-magic shadow-lg' : 'hover:shadow-md'
              )}
            >
              <CardHeader>
                <CardTitle className="font-display text-2xl">{race.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{race.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selectedRace} size="lg" className="bg-magic hover:bg-magic/90 text-magic-foreground">
          Next: {nextStepName}
        </Button>
      </div>
    </motion.div>
  );
}