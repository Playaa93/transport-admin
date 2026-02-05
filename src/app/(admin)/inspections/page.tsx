import { createClient } from '@/lib/supabase/server';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Camera } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InspectionsPage() {
  const supabase = await createClient();

  const { data: inspections, error } = await supabase
    .from('inspections')
    .select('*, vehicules(immatriculation)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inspections:', error);
    return <div>Erreur lors du chargement des inspections</div>;
  }

  const getStatutBadge = (statut: string) => {
    return statut === 'conforme' ? (
      <Badge className="bg-green-500 hover:bg-green-600">Conforme</Badge>
    ) : (
      <Badge className="bg-amber-500 hover:bg-amber-600">Non conforme</Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    return type === 'prise_en_charge' ? 'Prise en charge' : 'Remise';
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Inspections</h1>
        <p className="text-muted-foreground mt-1">
          {inspections?.length || 0} inspection(s) au total
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Véhicule</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Conducteur</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Photos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inspections && inspections.length > 0 ? (
              inspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/inspections/${inspection.id}`}
                      className="hover:underline text-blue-600"
                    >
                      {inspection.vehicules?.immatriculation || 'N/A'}
                    </Link>
                  </TableCell>
                  <TableCell>{getTypeBadge(inspection.type)}</TableCell>
                  <TableCell>{inspection.conducteur || 'N/A'}</TableCell>
                  <TableCell>{getStatutBadge(inspection.statut)}</TableCell>
                  <TableCell>
                    {new Date(inspection.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Camera className="h-4 w-4 text-muted-foreground" />
                      <span>{inspection.photos_count || 0}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Aucune inspection trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
