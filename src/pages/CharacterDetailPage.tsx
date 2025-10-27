import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api-client';
import type { Character } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CharacterSheetDisplay } from '@/components/character-creator/CharacterSheetDisplay';
import { ArrowLeft, FileDown, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCharacterActions } from '@/hooks/use-character-store';
export function CharacterDetailPage() {
  const { id } = useParams<{id: string;}>();
  const navigate = useNavigate();
  const { setCharacterForEditing } = useCharacterActions();
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!id) {
      setError("Character ID is missing.");
      setIsLoading(false);
      return;
    }
    const fetchCharacter = async () => {
      try {
        setIsLoading(true);
        const fetchedCharacter = await api<Character>(`/api/characters/${id}`);
        setCharacter(fetchedCharacter);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch character details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCharacter();
  }, [id]);
  const handleEdit = () => {
    if (character) {
      setCharacterForEditing(character);
      navigate('/');
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button asChild variant="outline">
              <Link to="/characters">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Gallery
              </Link>
            </Button>
            <h1 className="text-5xl md:text-6xl font-display text-ink text-center">Character Sheet</h1>
            <div className="flex items-center gap-2">
              <Button onClick={handleEdit} variant="outline" disabled={!character}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button asChild variant="outline" disabled={!character}>
                <Link to={character ? `/characters/${id}/print` : '#'}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export PDF
                </Link>
              </Button>
            </div>
          </header>
          <main className="max-w-4xl mx-auto">
            {isLoading &&
            <Card>
                <CardHeader><Skeleton className="h-12 w-3/4 mx-auto" /></CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-3 gap-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
                  <Skeleton className="h-2 w-full" />
                  <div className="grid grid-cols-6 gap-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            }
            {error && <p className="text-center text-destructive bg-destructive/10 p-4 rounded-lg">{error}</p>}
            {!isLoading && !error && character && <CharacterSheetDisplay character={character} />}
          </main>
        </div>
      </div>
    </div>);
}