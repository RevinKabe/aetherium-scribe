import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StepIndicator } from '@/components/character-creator/StepIndicator';
import { StepRace } from '@/components/character-creator/StepRace';
import { StepClass } from '@/components/character-creator/StepClass';
import { StepSpells } from '@/components/character-creator/StepSpells';
import { StepAbilities } from '@/components/character-creator/StepAbilities';
import { StepFinalize } from '@/components/character-creator/StepFinalize';
import { StepEquipment } from '@/components/character-creator/StepEquipment';
import { CharacterSheetView } from '@/components/character-creator/CharacterSheetView';
import { useCharacterActions, useCharacterStore } from '@/hooks/use-character-store';
import { BookImage } from 'lucide-react';
import { cn } from '@/lib/utils';
const BASE_STEPS = ['Race', 'Class', 'Abilities', 'Finalize', 'Equipment'];
export function HomePage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const { reset } = useCharacterActions();
  const character = useCharacterStore((s) => s.character);
  const dndClass = character.dndClass;
  const isEditing = !!character.id;
  const hasSpellcasting = !!dndClass?.spellcasting;
  const steps = useMemo(() => {
    if (hasSpellcasting) {
      const newSteps = [...BASE_STEPS];
      newSteps.splice(2, 0, 'Spells'); // Insert 'Spells' after 'Class'
      return newSteps;
    }
    return BASE_STEPS;
  }, [hasSpellcasting]);
  useEffect(() => {
    // When the component mounts, if we are in edit mode,
    // we need to determine the correct starting step.
    // For simplicity, we'll start from the beginning, but the data is pre-filled.
    // A more advanced implementation could jump to a specific step.
    setCurrentStepIndex(0);
    setIsFinished(false);
  }, [isEditing]); // Rerun if we switch from creating to editing
  const nextStep = () => setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  const finishCreation = () => setIsFinished(true);
  const handleStartOver = () => {
    reset();
    setCurrentStepIndex(0);
    setIsFinished(false);
  };
  const renderStep = () => {
    const currentStepName = steps[currentStepIndex];
    const prevStepName = currentStepIndex > 0 ? steps[currentStepIndex - 1] : undefined;
    const nextStepName = currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : undefined;
    switch (currentStepName) {
      case 'Race':
        return <StepRace onNext={nextStep} nextStepName={nextStepName} />;
      case 'Class':
        return <StepClass onBack={prevStep} onNext={nextStep} prevStepName={prevStepName} nextStepName={nextStepName} />;
      case 'Spells':
        return <StepSpells onBack={prevStep} onNext={nextStep} prevStepName={prevStepName} nextStepName={nextStepName} />;
      case 'Abilities':
        return <StepAbilities onBack={prevStep} onNext={nextStep} prevStepName={prevStepName} nextStepName={nextStepName} />;
      case 'Finalize':
        return <StepFinalize onBack={prevStep} onNext={nextStep} prevStepName={prevStepName} nextStepName={nextStepName} />;
      case 'Equipment':
        return <StepEquipment onBack={prevStep} onFinish={finishCreation} prevStepName={prevStepName} />;
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center mb-12 relative"
          >
            <h1 className="text-6xl md:text-7xl font-display text-ink">Aetherium Scribe</h1>
            <p className="text-xl text-muted-foreground mt-2">
              {isEditing ? `Editing: ${character.name}` : 'Craft Your Legend'}
            </p>
            <Button asChild variant="outline" className="absolute top-0 left-0 hidden sm:inline-flex">
              <Link to="/characters">
                <BookImage className="mr-2 h-4 w-4" />
                Character Gallery
              </Link>
            </Button>
          </motion.header>
          <main>
            <AnimatePresence mode="wait">
              {isFinished ? (
                <CharacterSheetView key="sheet" onStartOver={handleStartOver} isEditing={isEditing} />
              ) : (
                <motion.div
                  key="creator"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                >
                  <StepIndicator steps={steps} currentStep={currentStepIndex} />
                  <Card className={cn(
                    "bg-card/80 backdrop-blur-sm border-ink/10 shadow-lg transition-shadow duration-500",
                    !isFinished && "animate-magic-glow"
                  )}>
                    <CardContent className="p-8 md:p-12">
                      {renderStep()}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
          <footer className="text-center mt-12 text-muted-foreground text-sm">
            <p>Built with ❤️ at Cloudflare</p>
          </footer>
        </div>
      </div>
    </div>
  );
}