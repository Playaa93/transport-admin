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

  const getStatutBadge = (statut: string) => {
    return statut === 'conforme' ? (
      <Badge className="bg-green-500 hover:bg-green-600">Conforme</Badge>
    ) : (
      <Badge className="bg-amber-500 hover:bg-amber-600">Non conforme</Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const isPickup = type === 'prise_en_charge';
    return (
      <Badge variant={isPickup ? 'default' : 'secondary'}>
        {isPickup ? 'Prise en charge' : 'Remise'}
      </Badge>
    );
  };

  const getAngleLabel = (angle: string): string => {
    const labels: Record<string, string> = {
      avant: 'Avant',
      trois_quarts_droit: '3/4 Droit',
      trois_quarts_arriere_gauche: '3/4 Arr. Gauche',
      arriere: 'Arrière',
      jauge_carburant: 'Jauge Carburant',
    };
    return labels[angle] || angle;
  };

  const getStorageUrl = (storagePath: string) => {
    return `https://qchlxzuaindiekknfich.supabase.co/storage/v1/object/public/inspection-photos/${storagePath}`;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link
          href="/inspections"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux inspections
        </Link>

        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">
            {inspection.vehicules?.immatriculation || 'N/A'}
          </h1>
          {getTypeBadge(inspection.type)}
          {getStatutBadge(inspection.statut)}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Conducteur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{inspection.conducteur || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Kilométrage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {inspection.kilometrage ? `${inspection.kilometrage.toLocaleString('fr-FR')} km` : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Niveau de carburant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{inspection.niveau_carburant || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Date d'inspection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
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
              <CardTitle className="text-sm font-medium">Commentaires</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base whitespace-pre-wrap">{inspection.commentaires}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Photos d'inspection ({inspection.inspection_photos?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {inspection.inspection_photos && inspection.inspection_photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inspection.inspection_photos.map((photo: any) => (
                <div key={photo.id} className="space-y-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={getStorageUrl(photo.storage_path)}
                      alt={getAngleLabel(photo.angle)}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-sm font-medium text-center">
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
