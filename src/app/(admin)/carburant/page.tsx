import { createClient } from '@/lib/supabase/server';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
    return <div className="text-destructive">Erreur lors du chargement des donnees</div>;
  }

  const count = prises?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Prises de carburant</h1>
        <p className="text-muted-foreground mt-1">{count} prise{count !== 1 ? 's' : ''}</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Vehicule</TableHead>
                <TableHead>Type carburant</TableHead>
                <TableHead>Quantite (L)</TableHead>
                <TableHead>Montant TTC</TableHead>
                <TableHead>Conducteur</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prises && prises.length > 0 ? (
                prises.map((prise) => (
                  <TableRow key={prise.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-foreground">
                      {prise.vehicules?.immatriculation || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full">{prise.type_carburant}</Badge>
                    </TableCell>
                    <TableCell>{prise.quantite ? `${prise.quantite} L` : 'N/A'}</TableCell>
                    <TableCell>{prise.montant_ttc ? `${prise.montant_ttc.toFixed(2)} €` : 'N/A'}</TableCell>
                    <TableCell>{prise.conducteur_nom || 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground">
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
                        <ArrowRight className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Aucune prise de carburant
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
