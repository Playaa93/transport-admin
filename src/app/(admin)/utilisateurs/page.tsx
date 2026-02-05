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
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function UtilisateursPage() {
  const supabase = await createClient();
  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('nom', { ascending: true });

  if (error) {
    return <p className="text-destructive">Erreur : {error.message}</p>;
  }

  const count = users?.length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Utilisateurs</h1>
        <p className="text-muted-foreground mt-1">{count} utilisateur{count !== 1 ? 's' : ''}</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Telephone</TableHead>
                <TableHead>Derniere connexion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!users || users.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Aucun utilisateur
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u: any) => (
                  <TableRow key={u.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-foreground">
                      {[u.prenom, u.nom].filter(Boolean).join(' ') || u.pseudo || '—'}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          u.role === 'admin'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'bg-muted text-muted-foreground'
                        }
                      >
                        {u.role ?? 'conducteur'}
                      </Badge>
                    </TableCell>
                    <TableCell>{u.site ?? '—'}</TableCell>
                    <TableCell>{u.telephone ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
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
