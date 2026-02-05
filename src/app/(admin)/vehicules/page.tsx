import { createClient } from '@/lib/supabase/server';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        <p className="text-red-500">Erreur lors du chargement des véhicules</p>
      </div>
    );
  }

  const vehiculeCount = vehicules?.length || 0;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Véhicules</h1>
          <p className="text-muted-foreground mt-1">
            {vehiculeCount} véhicule{vehiculeCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des véhicules</CardTitle>
        </CardHeader>
        <CardContent>
          {vehicules && vehicules.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Immatriculation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Kilométrage</TableHead>
                  <TableHead>Date révision</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicules.map((vehicule) => (
                  <TableRow key={vehicule.id}>
                    <TableCell className="font-medium">
                      {vehicule.immatriculation}
                    </TableCell>
                    <TableCell>{vehicule.type}</TableCell>
                    <TableCell>{vehicule.site || '-'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={vehicule.statut === 'Disponible' ? 'default' : 'secondary'}
                        className={
                          vehicule.statut === 'Disponible'
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-amber-500 hover:bg-amber-600'
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
              Aucun véhicule trouvé
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
