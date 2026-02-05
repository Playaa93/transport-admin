import { createClient } from '@/lib/supabase/server';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CarburantPage() {
  const supabase = await createClient();

  const { data: prises, error } = await supabase
    .from('prises_carburant')
    .select('*, vehicules(immatriculation)')
    .eq('statut', 'complete')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching prises_carburant:', error);
    return <div>Erreur lors du chargement des données</div>;
  }

  const count = prises?.length || 0;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Prises de carburant</h1>
        <p className="text-muted-foreground mt-2">{count} prise{count !== 1 ? 's' : ''}</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Véhicule</TableHead>
              <TableHead>Type carburant</TableHead>
              <TableHead>Quantité (L)</TableHead>
              <TableHead>Montant TTC (€)</TableHead>
              <TableHead>Conducteur</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prises && prises.length > 0 ? (
              prises.map((prise) => (
                <TableRow key={prise.id}>
                  <TableCell className="font-medium">
                    {prise.vehicules?.immatriculation || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{prise.type_carburant}</Badge>
                  </TableCell>
                  <TableCell>{prise.quantite ? `${prise.quantite} L` : 'N/A'}</TableCell>
                  <TableCell>{prise.montant_ttc ? `${prise.montant_ttc.toFixed(2)} €` : 'N/A'}</TableCell>
                  <TableCell>{prise.conducteur_nom || 'N/A'}</TableCell>
                  <TableCell>
                    {prise.date
                      ? new Date(prise.date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Link href={`/carburant/${prise.id}`}>
                      <ArrowRight className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Aucune prise de carburant
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
