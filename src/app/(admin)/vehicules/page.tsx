import { createClient } from '@/lib/supabase/server';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function VehiculesPage() {
  const supabase = await createClient();

  const { data: vehicules, error } = await supabase
    .from('vehicules')
    .select('*')
    .order('immatriculation', { ascending: true });

  if (error) {
    console.error('Error fetching vehicules:', error);
    return (
      <div className="p-8">
        <p className="text-destructive">Erreur lors du chargement des vehicules</p>
      </div>
    );
  }

  const vehiculeCount = vehicules?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Vehicules</h1>
        <p className="text-muted-foreground mt-1">
          {vehiculeCount} vehicule{vehiculeCount !== 1 ? 's' : ''}
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {vehicules && vehicules.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Immatriculation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Kilometrage</TableHead>
                  <TableHead>Date revision</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicules.map((vehicule) => (
                  <TableRow key={vehicule.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-foreground">
                      {vehicule.immatriculation}
                    </TableCell>
                    <TableCell>{vehicule.type}</TableCell>
                    <TableCell>{vehicule.site || '-'}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          vehicule.statut === 'Disponible'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/15 dark:text-green-400 dark:hover:bg-green-500/25'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:hover:bg-amber-500/25'
                        }
                      >
                        {vehicule.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vehicule.kilometrage
                        ? `${vehicule.kilometrage.toLocaleString('fr-FR')} km`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {vehicule.date_revision
                        ? new Date(vehicule.date_revision).toLocaleDateString('fr-FR')
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucun vehicule trouve
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
