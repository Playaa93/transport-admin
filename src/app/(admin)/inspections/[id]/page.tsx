import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Camera } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InspectionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: inspection, error } = await supabase
    .from('inspections')
    .select('*, vehicules(*), inspection_photos(*)')
    .eq('id', id)
    .single();

  if (error || !inspection) {
    notFound();
  }

  const getAngleLabel = (angle: string): string => {
    const labels: Record<string, string> = {
      avant: 'Avant',
      trois_quarts_droit: '3/4 Droit',
      trois_quarts_arriere_gauche: '3/4 Arr. Gauche',
      arriere: 'Arriere',
      jauge_carburant: 'Jauge Carburant',
    };
    return labels[angle] || angle;
  };

  const getStorageUrl = (storagePath: string) => {
    return `https://qchlxzuaindiekknfich.supabase.co/storage/v1/object/public/inspection-photos/${storagePath}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/inspections"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux inspections
        </Link>

        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {inspection.vehicules?.immatriculation || 'N/A'}
          </h1>
          <Badge variant="outline" className="rounded-full">
            {inspection.type === 'prise_en_charge' ? 'Prise en charge' : 'Remise'}
          </Badge>
          <Badge
            className={
              inspection.statut === 'conforme'
                ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
            }
          >
            {inspection.statut === 'conforme' ? 'Conforme' : 'Non conforme'}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Conducteur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{inspection.conducteur || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Kilometrage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {inspection.kilometrage ? `${inspection.kilometrage.toLocaleString('fr-FR')} km` : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Niveau de carburant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{inspection.niveau_carburant || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Date d&apos;inspection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-foreground">
              {new Date(inspection.created_at).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </CardContent>
        </Card>

        {inspection.commentaires && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Commentaires</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base whitespace-pre-wrap text-foreground">{inspection.commentaires}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            Photos d&apos;inspection ({inspection.inspection_photos?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {inspection.inspection_photos && inspection.inspection_photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inspection.inspection_photos.map((photo: any) => (
                <div key={photo.id} className="space-y-2">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
                    <img
                      src={getStorageUrl(photo.storage_path)}
                      alt={getAngleLabel(photo.angle)}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-sm font-medium text-center text-muted-foreground">
                    {getAngleLabel(photo.angle)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucune photo disponible pour cette inspection
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
