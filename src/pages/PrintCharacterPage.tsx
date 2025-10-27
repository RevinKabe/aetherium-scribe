import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api-client';
import type { Character } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CharacterSheetDisplay } from '@/components/character-creator/CharacterSheetDisplay';
import { ArrowLeft, FileDown, Info } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
export function PrintCharacterPage() {
  const { id } = useParams<{ id: string }>();
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
  const handlePrint = () => {
    window.print();
  };
  return (
    <div className="bg-background text-foreground font-sans print:bg-white">
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-container {
              padding: 0 !important;
              max-width: 100% !important;
            }
          }
          @page {
            size: A4;
            margin: 1cm;
          }
        `}
      </style>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 print-container">
        <header className="no-print mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-display text-ink">PDF Export Preview</h1>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to={`/characters/${id}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sheet
                </Link>
              </Button>
              <Button onClick={handlePrint}>
                <FileDown className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your browser's print dialog will open. To save the file, choose <strong>"Save as PDF"</strong> as the destination.
            </AlertDescription>
          </Alert>
        </header>
        <main>
          {isLoading && (
            <div className="no-print">
              <Card>
                <CardHeader><Skeleton className="h-12 w-3/4 mx-auto bg-gray-200" /></CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-3 gap-4"><Skeleton className="h-24 w-full bg-gray-200" /><Skeleton className="h-24 w-full bg-gray-200" /><Skeleton className="h-24 w-full bg-gray-200" /></div>
                  <Skeleton className="h-2 w-full bg-gray-200" />
                  <div className="grid grid-cols-6 gap-4"><Skeleton className="h-16 w-full bg-gray-200" /><Skeleton className="h-16 w-full bg-gray-200" /><Skeleton className="h-16 w-full bg-gray-200" /><Skeleton className="h-16 w-full bg-gray-200" /><Skeleton className="h-16 w-full bg-gray-200" /><Skeleton className="h-16 w-full bg-gray-200" /></div>
                  <Skeleton className="h-2 w-full bg-gray-200" />
                  <Skeleton className="h-40 w-full bg-gray-200" />
                </CardContent>
              </Card>
            </div>
          )}
          {error && <p className="no-print text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>}
          {!isLoading && !error && character && (
            <div className="border-2 border-black p-2">
              <CharacterSheetDisplay character={character} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}