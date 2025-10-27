import { useEffect, useState, MouseEvent, KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api-client';
import type { Character } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Swords, Trash2, Sparkles } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast, Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};
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
const ImageWithLoader = ({ src, alt, className }: { src?: string; alt: string; className: string; }) => {
  const [isLoading, setIsLoading] = useState(true);
  if (!src) {
    return (
      <div className={cn("bg-muted flex items-center justify-center", className)}>
        <Swords className="w-12 h-12 text-muted-foreground/50" />
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <Skeleton className="absolute inset-0 h-full w-full" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn('h-full w-full object-cover transition-opacity duration-300', isLoading ? 'opacity-0' : 'opacity-100')}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)} // Stop loading on error to show placeholder or broken image icon
      />
    </div>
  );
};
const CharacterCard = ({ character, onDelete, onImageUpdate }: {
  character: Character;
  onDelete: (id: string) => void;
  onImageUpdate: (characterId: string, newImageUrl: string) => void;
}) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(character.generatedImageUrl || character.dndClass?.imageUrl || character.race?.imageUrl);
  const handleDeleteClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(character.id);
  };
  const handleCardClick = () => {
    navigate(`/characters/${character.id}`);
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };
  const handleGenerateImage = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!character.race || !character.dndClass) return;
    setIsGenerating(true);
    toast.info(`Generating portrait for ${character.name}...`);
    try {
      // Step 1: Generate the image
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
        const errorData = await response.json().catch(() => ({ error: 'Failed to generate portrait.' }));
        throw new Error(errorData.error);
      }
      const imageBuffer = await response.arrayBuffer();
      const newUrl = `data:image/png;base64,${arrayBufferToBase64(imageBuffer)}`;
      // Step 2: Update the character with the new image URL
      await api(`/api/characters/${character.id}`, {
        method: 'PUT',
        body: JSON.stringify({ generatedImageUrl: newUrl }),
      });
      setImageUrl(newUrl);
      onImageUpdate(character.id, newUrl);
      toast.success(`Portrait for ${character.name} updated!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not generate portrait.";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <motion.div variants={cardVariants} className="w-full">
      <Card
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className={cn(
          "h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-subtle-glow hover:-translate-y-1 border-ink/10 cursor-pointer group relative",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}>
        <CardHeader className="p-0 relative">
          <ImageWithLoader src={imageUrl} alt={character.name} className="w-full h-48 object-cover" />
        </CardHeader>
        <CardContent className="p-4 flex flex-col flex-grow justify-between">
          <div>
            <CardTitle className="font-display text-2xl text-ink">{character.name}</CardTitle>
            <p className="text-muted-foreground">{character.race?.name} {character.dndClass?.name}</p>
          </div>
          <div className="mt-4 space-y-2" onClick={(e) => e.stopPropagation()}>
            <Input
              type="text"
              placeholder="Add details..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              disabled={isGenerating}
              className="text-sm"
            />
            <Button onClick={handleGenerateImage} size="sm" disabled={isGenerating} className="w-full bg-magic hover:bg-magic/90 text-magic-foreground">
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate Portrait'}
            </Button>
          </div>
        </CardContent>
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleDeleteClick}
          aria-label={`Delete ${character.name}`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </Card>
    </motion.div>
  );
};
export function CharacterGalleryPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setIsLoading(true);
        const result = await api<{ items: Character[] }>('/api/characters');
        setCharacters(result.items);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch characters.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCharacters();
  }, []);
  const handleDeleteRequest = (id: string) => {
    setDeleteCandidateId(id);
  };
  const confirmDelete = async () => {
    if (!deleteCandidateId) return;
    try {
      await api(`/api/characters/${deleteCandidateId}`, { method: 'DELETE' });
      setCharacters((prev) => prev.filter((c) => c.id !== deleteCandidateId));
      toast.success("Character has been deleted.");
    } catch (err) {
      toast.error("Failed to delete character.");
      console.error(err);
    } finally {
      setDeleteCandidateId(null);
    }
  };
  const handleImageUpdate = (characterId: string, newImageUrl: string) => {
    setCharacters(prev =>
      prev.map(char =>
        char.id === characterId ? { ...char, generatedImageUrl: newImageUrl } : char
      )
    );
  };
  return (
    <>
      <Toaster richColors />
      <div className="min-h-screen bg-background text-foreground font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <header className="text-center mb-12">
              <h1 className="text-6xl md:text-7xl font-display text-ink">Character Gallery</h1>
              <p className="text-xl text-muted-foreground mt-2">A Hall of Heroes</p>
              <Button asChild size="lg" className="mt-6 bg-magic hover:bg-magic/90 text-magic-foreground">
                <Link to="/">Create a New Character</Link>
              </Button>
            </header>
            <main>
              {isLoading &&
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) =>
                    <Card key={i}>
                      <Skeleton className="h-48 w-full" />
                      <CardContent className="p-4 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardContent>
                    </Card>
                  )}
                </div>
              }
              {error && <p className="text-center text-destructive">{error}</p>}
              {!isLoading && !error && characters.length === 0 &&
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 px-6 border-2 border-dashed border-ink/20 rounded-lg bg-card/50">
                  <Swords className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
                  <h3 className="mt-4 text-2xl font-display text-ink">No Adventurers Yet</h3>
                  <p className="mt-2 text-muted-foreground">Your legend awaits. Go forth and create your first character!</p>
                </motion.div>
              }
              <AnimatePresence>
                {!isLoading && !error && characters.length > 0 &&
                  <motion.div
                    variants={gridVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {characters.map((char) =>
                      <CharacterCard key={char.id} character={char} onDelete={handleDeleteRequest} onImageUpdate={handleImageUpdate} />
                    )}
                  </motion.div>
                }
              </AnimatePresence>
            </main>
            <footer className="text-center mt-12 text-muted-foreground text-sm">
              <p>Built with ❤️ at Cloudflare</p>
            </footer>
          </div>
        </div>
      </div>
      <AlertDialog open={!!deleteCandidateId} onOpenChange={(open) => !open && setDeleteCandidateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the character from your gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}