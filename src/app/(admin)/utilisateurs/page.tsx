import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function UtilisateursPage() {
  const supabase = await createClient();
  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('nom', { ascending: true });

  if (error) {
    return <p className="text-red-500">Erreur : {error.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
        <p className="text-gray-500 mt-1">{users?.length ?? 0} utilisateur(s)</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Dernière connexion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!users || users.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                    Aucun utilisateur
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u: any) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium text-gray-900">
                      {[u.prenom, u.nom].filter(Boolean).join(' ') || u.pseudo || '—'}
                    </TableCell>
                    <TableCell className="text-gray-600">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                        {u.role ?? 'conducteur'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{u.site ?? '—'}</TableCell>
                    <TableCell className="text-gray-600">{u.telephone ?? '—'}</TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {u.last_login
                        ? new Date(u.last_login).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
