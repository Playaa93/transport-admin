import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, ClipboardCheck, Fuel, Users } from 'lucide-react';

async function getStats() {
  const supabase = await createClient();

  const [vehicules, inspections, carburant, utilisateurs] = await Promise.all([
    supabase.from('vehicules').select('id', { count: 'exact', head: true }),
    supabase.from('inspections').select('id', { count: 'exact', head: true }),
    supabase.from('prises_carburant').select('id', { count: 'exact', head: true }).eq('statut', 'complete'),
    supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
  ]);

  return {
    vehicules: vehicules.count ?? 0,
    inspections: inspections.count ?? 0,
    carburant: carburant.count ?? 0,
    utilisateurs: utilisateurs.count ?? 0,
  };
}

async function getRecentInspections() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('inspections')
    .select('*, vehicules(immatriculation)')
    .order('created_at', { ascending: false })
    .limit(5);
  return data ?? [];
}

async function getRecentFuel() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('prises_carburant')
    .select('*, vehicules(immatriculation)')
    .eq('statut', 'complete')
    .order('created_at', { ascending: false })
    .limit(5);
  return data ?? [];
}

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [stats, recentInspections, recentFuel] = await Promise.all([
    getStats(),
    getRecentInspections(),
    getRecentFuel(),
  ]);

  const statCards = [
    { label: 'Vehicules', value: stats.vehicules, icon: Truck, iconColor: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-100 dark:bg-blue-500/15' },
    { label: 'Inspections', value: stats.inspections, icon: ClipboardCheck, iconColor: 'text-primary', iconBg: 'bg-primary/10' },
    { label: 'Prises carburant', value: stats.carburant, icon: Fuel, iconColor: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-500/15' },
    { label: 'Utilisateurs', value: stats.utilisateurs, icon: Users, iconColor: 'text-violet-600 dark:text-violet-400', iconBg: 'bg-violet-100 dark:bg-violet-500/15' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Vue d&apos;ensemble de la flotte</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-4xl font-bold text-foreground mt-1 animate-count-up">{card.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${card.iconBg}`}>
                  <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent inspections */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dernieres inspections</CardTitle>
          </CardHeader>
          <CardContent>
            {recentInspections.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune inspection</p>
            ) : (
              <div className="space-y-1">
                {recentInspections.map((i: any) => (
                  <div key={i.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{i.vehicules?.immatriculation ?? '—'}</p>
                      <p className="text-xs text-muted-foreground">
                        {i.type === 'prise_en_charge' ? 'Prise en charge' : 'Remise'}
                        {i.conducteur_nom ? ` · ${i.conducteur_nom}` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                        i.statut === 'complete'
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
                      }`}>
                        {i.statut === 'complete' ? 'Complete' : 'En cours'}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(i.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent fuel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dernieres prises carburant</CardTitle>
          </CardHeader>
          <CardContent>
            {recentFuel.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune prise de carburant</p>
            ) : (
              <div className="space-y-1">
                {recentFuel.map((f: any) => (
                  <div key={f.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{f.vehicules?.immatriculation ?? '—'}</p>
                      <p className="text-xs text-muted-foreground">
                        {f.type_carburant?.toUpperCase()}
                        {f.conducteur_nom ? ` · ${f.conducteur_nom}` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{f.quantite} L</p>
                      <p className="text-xs text-muted-foreground">{f.montant_ttc} € TTC</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
