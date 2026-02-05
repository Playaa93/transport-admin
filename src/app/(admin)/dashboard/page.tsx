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
    { label: 'Véhicules', value: stats.vehicules, icon: Truck, color: 'text-blue-600 bg-blue-50' },
    { label: 'Inspections', value: stats.inspections, icon: ClipboardCheck, color: 'text-teal-600 bg-teal-50' },
    { label: 'Prises carburant', value: stats.carburant, icon: Fuel, color: 'text-amber-600 bg-amber-50' },
    { label: 'Utilisateurs', value: stats.utilisateurs, icon: Users, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Vue d&apos;ensemble de la flotte</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${card.color}`}>
                  <card.icon className="h-6 w-6" />
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
            <CardTitle className="text-lg">Dernières inspections</CardTitle>
          </CardHeader>
          <CardContent>
            {recentInspections.length === 0 ? (
              <p className="text-sm text-gray-400">Aucune inspection</p>
            ) : (
              <div className="space-y-3">
                {recentInspections.map((i: any) => (
                  <div key={i.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{i.vehicules?.immatriculation ?? '—'}</p>
                      <p className="text-xs text-gray-500">
                        {i.type === 'prise_en_charge' ? 'Prise en charge' : 'Remise'}
                        {i.conducteur_nom ? ` · ${i.conducteur_nom}` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${i.statut === 'complete' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                        {i.statut === 'complete' ? 'Complète' : 'En cours'}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
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
            <CardTitle className="text-lg">Dernières prises carburant</CardTitle>
          </CardHeader>
          <CardContent>
            {recentFuel.length === 0 ? (
              <p className="text-sm text-gray-400">Aucune prise de carburant</p>
            ) : (
              <div className="space-y-3">
                {recentFuel.map((f: any) => (
                  <div key={f.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{f.vehicules?.immatriculation ?? '—'}</p>
                      <p className="text-xs text-gray-500">
                        {f.type_carburant?.toUpperCase()}
                        {f.conducteur_nom ? ` · ${f.conducteur_nom}` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{f.quantite} L</p>
                      <p className="text-xs text-gray-500">{f.montant_ttc} € TTC</p>
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
