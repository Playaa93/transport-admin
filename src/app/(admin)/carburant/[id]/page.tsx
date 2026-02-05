import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import Image from 'next/image';

const PHOTO_LABELS: Record<string, string> = {
  compteur_avant: 'Compteur Avant',
  compteur_apres: 'Compteur Après',
  ticket_caisse: 'Ticket de Caisse',
};

export default async function CarburantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: prise, error } = await supabase
    .from('prises_carburant')
    .select('*, vehicules(*), prise_carburant_photos(*)')
    .eq('id', params.id)
    .single();

  if (error || !prise) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link
          href="/carburant"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux prises de carburant
        </Link>
        <h1 className="text-3xl font-bold">{prise.vehicules?.immatriculation || 'N/A'}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Type de carburant</div>
              <div className="mt-1">
                <Badge variant="outline">{prise.type_carburant}</Badge>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Quantité</div>
              <div className="mt-1 text-lg font-semibold">
                {prise.quantite ? `${prise.quantite} L` : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Montant TTC</div>
              <div className="mt-1 text-lg font-semibold">
                {prise.montant_ttc ? `${prise.montant_ttc.toFixed(2)} €` : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Conducteur</div>
              <div className="mt-1">{prise.conducteur_nom || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Date</div>
              <div className="mt-1">
                {prise.date
                  ? new Date(prise.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'N/A'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Véhicule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Immatriculation</div>
              <div className="mt-1 text-lg font-semibold">
                {prise.vehicules?.immatriculation || 'N/A'}
              </div>
            </div>
            {prise.vehicules?.marque && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Marque</div>
                <div className="mt-1">{prise.vehicules.marque}</div>
              </div>
            )}
            {prise.vehicules?.modele && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Modèle</div>
                <div className="mt-1">{prise.vehicules.modele}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {prise.prise_carburant_photos && prise.prise_carburant_photos.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {prise.prise_carburant_photos.map((photo: any) => (
                <div key={photo.id} className="space-y-2">
                  <div className="text-sm font-medium">
                    {PHOTO_LABELS[photo.angle] || photo.angle}
                  </div>
                  <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                    {photo.storage_url ? (
                      <Image
                        src={photo.storage_url}
                        alt={PHOTO_LABELS[photo.angle] || photo.angle}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        Image non disponible
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
