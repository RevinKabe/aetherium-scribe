import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCharacterStore } from '@/hooks/use-character-store';
import { api } from '@/lib/api-client';
import type { Character } from '@shared/types';
import { Toaster } from '@/components/ui/sonner';
import { BookImage, Save, PlusCircle, Sparkles } from 'lucide-react';
import { CharacterSheetDisplay } from './CharacterSheetDisplay';
import { useShallow } from 'zustand/react/shallow';
import { Input } from '@/components/ui/input';
interface CharacterSheetViewProps {
  onStartOver: () => void;
  isEditing: boolean;
}
// Helper to convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};
export function CharacterSheetView({ onStartOver, isEditing }: CharacterSheetViewProps) {
  const character = useCharacterStore(
    useShallow((state) => state.character)
  ) as Character;
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(isEditing); // If editing, assume it's already "saved"
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | undefined>(character.generatedImageUrl);
  const [customPrompt, setCustomPrompt] = useState('');
  useEffect(() => {
    setGeneratedImageUrl(character.generatedImageUrl);
  }, [character.generatedImageUrl]);
  const handleGenerateImage = async () => {
    if (!character.race || !character.dndClass) return;
    setIsGenerating(true);
    toast.info("Generating your character's portrait, this may take a moment...");
    try {
      const response = await fetch('/api/characters/generate-portrait', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          race: character.race.name,
          dndClass: character.dndClass.name,
          customPrompt: customPrompt,
        }),
      });
      if (!response.ok) {
        let errorMessage = 'Failed to generate portrait from server.';
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // Ignore if response is not JSON
        }
        throw new Error(errorMessage);
      }
      const imageBuffer = await response.arrayBuffer();
      const base64Flag = 'data:image/png;base64,';
      const imageStr = arrayBufferToBase64(imageBuffer);
      const newUrl = base64Flag + imageStr;
      setGeneratedImageUrl(newUrl);
      toast.success("Portrait generated successfully!");
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Could not generate portrait. Please try again.";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleSaveCharacter = async () => {
    if (!character.race || !character.dndClass || !character.background) {
      toast.error("Cannot save an incomplete character.");
      return;
    }
    setIsSaving(true);
    const characterWithImage = { ...character, generatedImageUrl };
    try {
      if (isEditing && character.id) {
        // Update existing character
        await api(`/api/characters/${character.id}`, {
          method: 'PUT',
          body: JSON.stringify(characterWithImage),
        });
        toast.success(`${character.name} has been updated!`);
      } else {
        // Create new character
        const { id, ...characterToSave } = characterWithImage;
        const newChar = await api<Character>('/api/characters', {
          method: 'POST',
          body: JSON.stringify(characterToSave),
        });
        // Update store with new ID
        useCharacterStore.setState(state => {
            state.character.id = newChar.id;
        });
        toast.success(`${character.name} has been saved!`);
      }
      setIsSaved(true);
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'save'} character. Please try again.`);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  if (!character.race || !character.dndClass || !character.background) {
    return (
      <div className="text-center space-y-4">
        <p className="text-destructive">Character data is incomplete!</p>
        <Button onClick={onStartOver}>Start Over</Button>
      </div>
    );
  }
  return (
    <>
      <Toaster richColors />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <CharacterSheetDisplay character={character} generatedImageUrl={generatedImageUrl} />
        <div className="text-center mt-8 flex flex-col items-center gap-4">
          <div className="w-full max-w-lg flex flex-col sm:flex-row items-center gap-2">
            <Input
              type="text"
              placeholder="Add details (e.g., 'wearing silver armor', 'with a fiery aura')"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="flex-grow"
              disabled={isGenerating}
            />
            <Button onClick={handleGenerateImage} size="lg" disabled={isGenerating} className="bg-magic hover:bg-magic/90 text-magic-foreground w-full sm:w-auto">
              <Sparkles className="mr-2 h-5 w-5" />
              {isGenerating ? 'Generating...' : generatedImageUrl ? 'Re-generate Portrait' : 'Generate Portrait'}
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap">
            <Button onClick={handleSaveCharacter} size="lg" disabled={isSaving}>
              <Save className="mr-2 h-5 w-5" />
              {isSaving ? 'Saving...' : (isEditing || isSaved) ? 'Update Character' : 'Save Character'}
            </Button>
            <Button onClick={onStartOver} size="lg" variant="outline">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Another
            </Button>
            {(isEditing || isSaved) && (
              <Button asChild size="lg" variant="outline">
                <Link to="/characters">
                  <BookImage className="mr-2 h-5 w-5" />
                  View Gallery
                </Link>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}