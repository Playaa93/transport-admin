import { createClient } from '@/lib/supabase/server';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
    return <div className="text-destructive">Erreur lors du chargement des inspections</div>;
  }

  const count = inspections?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Inspections</h1>
        <p className="text-muted-foreground mt-1">
          {count} inspection{count !== 1 ? 's' : ''} au total
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Vehicule</TableHead>
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
                  <TableRow key={inspection.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <Link
                        href={`/inspections/${inspection.id}`}
                        className="hover:underline text-primary"
                      >
                        {inspection.vehicules?.immatriculation || 'N/A'}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full">
                        {inspection.type === 'prise_en_charge' ? 'Prise en charge' : 'Remise'}
                      </Badge>
                    </TableCell>
                    <TableCell>{inspection.conducteur || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          inspection.statut === 'conforme'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/15 dark:text-green-400'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-400'
                        }
                      >
                        {inspection.statut === 'conforme' ? 'Conforme' : 'Non conforme'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(inspection.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 text-muted-foreground">
                        <Camera className="h-4 w-4" />
                        <span>{inspection.photos_count || 0}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Aucune inspection trouvee
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
