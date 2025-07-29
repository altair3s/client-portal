import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, TrendingUp, Shield, Truck, AlertCircle, 
  CheckCircle, Calendar, Activity, Settings,
  Zap, Wrench, Award, AlertTriangle, GraduationCap,
   Car, Building, Bot, BarChart3, Search,  Eye, Clock, Target,
  UserCheck
} from 'lucide-react';
import { 
  Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
   CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';

const ComiteJuillet = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [animatePyramid, setAnimatePyramid] = useState(false);
  const [showAllActions, setShowAllActions] = useState(false);
  
  // États pour le tableau des formations
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    if (activeTab === 'overview') {
      setAnimatePyramid(false);
      setTimeout(() => setAnimatePyramid(true), 100);
    }
  }, [activeTab]);

  // Données réelles basées sur votre fichier Excel - FORMATIONS
  const formationsData = [
    {
      id: 1,
      formation: "PERMIS PIETON",
      category: "Sécurité",
      totalCollaborateurs: 36,
      collaborateursFormes: 32,
      validiteOK: 32,
      aProgrammer: 0,
      expires: 0,
      tauxCouverture: 88.9,
      tauxValidite: 100.0,
      priorite: "Obligatoire",
      renouvellement: "5 ans",
      icon: Car,
      color: "blue"
    },
    {
      id: 2,
      formation: "11.2.6.2",
      category: "Réglementation",
      totalCollaborateurs: 36,
      collaborateursFormes: 34,
      validiteOK: 34,
      aProgrammer: 0,
      expires: 0,
      tauxCouverture: 94.4,
      tauxValidite: 100.0,
      priorite: "Obligatoire",
      renouvellement: "3 ans",
      icon: Shield,
      color: "green"
    },
    {
      id: 3,
      formation: "FH",
      category: "Technique",
      totalCollaborateurs: 36,
      collaborateursFormes: 23,
      validiteOK: 23,
      aProgrammer: 0,
      expires: 0,
      tauxCouverture: 63.9,
      tauxValidite: 100.0,
      priorite: "Recommandée",
      renouvellement: "2 ans",
      icon: Wrench,
      color: "purple"
    },
    {
      id: 4,
      formation: "GESTES ET POSTURES",
      category: "Prévention",
      totalCollaborateurs: 36,
      collaborateursFormes: 24,
      validiteOK: 24,
      aProgrammer: 0,
      expires: 0,
      tauxCouverture: 66.7,
      tauxValidite: 100.0,
      priorite: "Obligatoire",
      renouvellement: "3 ans",
      icon: UserCheck,
      color: "green"
    },
    {
      id: 5,
      formation: "EPI",
      category: "Sécurité",
      totalCollaborateurs: 36,
      collaborateursFormes: 36,
      validiteOK: 0,
      aProgrammer: 36,
      expires: 0,
      tauxCouverture: 100.0,
      tauxValidite: 0.0,
      priorite: "Urgente",
      renouvellement: "1 an",
      icon: Shield,
      color: "red"
    },
    {
      id: 6,
      formation: "MANAGEMENT DES EQUIPES",
      category: "Management",
      totalCollaborateurs: 36,
      collaborateursFormes: 25,
      validiteOK: 25,
      aProgrammer: 0,
      expires: 0,
      tauxCouverture: 69.4,
      tauxValidite: 100.0,
      priorite: "Recommandée",
      renouvellement: "2 ans",
      icon: Users,
      color: "indigo"
    },
    {
      id: 7,
      formation: "GESTION UTILISATION DES PDTS CHIMIQUES",
      category: "Sécurité",
      totalCollaborateurs: 36,
      collaborateursFormes: 15,
      validiteOK: 15,
      aProgrammer: 0,
      expires: 0,
      tauxCouverture: 41.7,
      tauxValidite: 100.0,
      priorite: "Spécialisée",
      renouvellement: "3 ans",
      icon: AlertTriangle,
      color: "orange"
    },
    {
      id: 8,
      formation: "PERMIS PISTE",
      category: "Sécurité",
      totalCollaborateurs: 36,
      collaborateursFormes: 9,
      validiteOK: 9,
      aProgrammer: 0,
      expires: 0,
      tauxCouverture: 25.0,
      tauxValidite: 100.0,
      priorite: "Spécialisée",
      renouvellement: "5 ans",
      icon: Zap,
      color: "yellow"
    }
  ];

  const prioriteColors = {
    'Urgente': 'bg-red-100 text-red-800 border-red-200',
    'Obligatoire': 'bg-green-100 text-green-800 border-green-200',
    'Recommandée': 'bg-blue-100 text-blue-800 border-blue-200',
    'Spécialisée': 'bg-purple-100 text-purple-800 border-purple-200'
  };

  const categoryColors = {
    'Sécurité': 'bg-red-50 text-red-700 border-red-200',
    'Réglementation': 'bg-green-50 text-green-700 border-green-200',
    'Technique': 'bg-blue-50 text-blue-700 border-blue-200',
    'Prévention': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Management': 'bg-purple-50 text-purple-700 border-purple-200'
  };

  // Statistiques globales formations
  const globalStats = useMemo(() => {
    const totalFormations = formationsData.reduce((sum, f) => sum + f.collaborateursFormes, 0);
    const totalAProgrammer = formationsData.reduce((sum, f) => sum + f.aProgrammer, 0);
    const formationsUrgentes = formationsData.filter(f => f.priorite === 'Urgente').length;
    const tauxCouvertureMoyen = formationsData.reduce((sum, f) => sum + f.tauxCouverture, 0) / formationsData.length;
    
    return {
      totalFormations,
      totalAProgrammer,
      formationsUrgentes,
      tauxCouvertureMoyen: tauxCouvertureMoyen.toFixed(1),
      collaborateursTotal: 36
    };
  }, []);

  // Données pour les graphiques formations
  const pieChartData = formationsData.map(f => ({
    name: f.formation.substring(0, 15) + (f.formation.length > 15 ? '...' : ''),
    value: f.tauxCouverture,
    color: f.color === 'red' ? '#ef4444' : 
           f.color === 'green' ? '#22c55e' :
           f.color === 'blue' ? '#3b82f6' :
           f.color === 'purple' ? '#8b5cf6' :
           f.color === 'indigo' ? '#6366f1' :
           f.color === 'orange' ? '#f97316' :
           f.color === 'yellow' ? '#eab308' : '#6b7280'
  }));

  const barChartData = formationsData.map(f => ({
    formation: f.formation.substring(0, 12) + '...',
    couverture: f.tauxCouverture,
    validite: f.tauxValidite
  }));

  const filteredFormations = formationsData.filter(formation => {
    const matchesSearch = formation.formation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'urgent' && formation.priorite === 'Urgente') ||
                         (filterStatus === 'obligatoire' && formation.priorite === 'Obligatoire') ||
                         (filterStatus === 'aprogrammer' && formation.aProgrammer > 0);
    return matchesSearch && matchesStatus;
  });

  // Maintenant on ajoute les données originales du code ComiteJuillet
  
  // Données Juillet 2025 - GPNS TRI ADP
  const effectifTotal = 35;
  const effectifHommes = 33;
  const effectifFemmes = 2;
  const totalInterimaires = 15.8; // ETP juin maintenu
  const formationsRealisees = 18; // Sessions "Vis ma Vie" + formations encadrants
  const totalHeuresFormation = 120; // Intensification formations juillet
  const nouveauxEquipements = 8; // PUDU déployés

  // Pyramide des âges - données juillet
  const pyramideAgesData = [
    { tranche: "18-25", hommes: 0, femmes: 0 },
    { tranche: "26-35", hommes: -1, femmes: 0 },
    { tranche: "36-45", hommes: -4, femmes: 1 },
    { tranche: "46-55", hommes: -8, femmes: 0 },
    { tranche: "56-65", hommes: -13, femmes: 1 },
    { tranche: "65+", hommes: -7, femmes: 0 }
  ];

  // Répartition géographique mise à jour
  const topVillesData = [
    { ville: "Aulnay-sous-Bois (93)", count: 4 },
    { ville: "Sarcelles (95)", count: 2 },
    { ville: "Saint-Denis (93)", count: 2 },
    { ville: "Gonesse (95)", count: 2 },
    { ville: "Sevran (93)", count: 2 },
    { ville: "Paris (75)", count: 2 },
    { ville: "Chelles (77)", count: 1 },
    { ville: "Gentilly (94)", count: 1 },
    { ville: "Cergy (95)", count: 1 },
    { ville: "Autres", count: 18 }
  ];

  const repartitionDepartements = [
    { name: "Seine-Saint-Denis (93)", value: 14, color: "#3b82f6" },
    { name: "Val-d'Oise (95)", value: 10, color: "#6366f1" },
    { name: "Seine-et-Marne (77)", value: 4, color: "#8b5cf6" },
    { name: "Paris (75)", value: 3, color: "#a855f7" },
    { name: "Val-de-Marne (94)", value: 2, color: "#c084fc" },
    { name: "Autres", value: 2, color: "#e879f9" }
  ];

  // Formations juillet - intensification
  const formationsDataJuillet = [
    { name: "Sessions Vis ma Vie", planned: 3, realized: 3, status: "REUSSITE" },
    { name: "Formation Encadrants", planned: 8, realized: 8, status: "REUSSITE" },
    { name: "Formation PUDU", planned: 4, realized: 4, status: "REUSSITE" },
    { name: "Sécurité Aéroportuaire", planned: 2, realized: 2, status: "REUSSITE" },
    { name: "Gestes et Postures", planned: 1, realized: 1, status: "REUSSITE" }
  ];

  // Évolution performance juillet
  const performanceData = [
    { mois: "Mai", effectifs: 35, interim: 17.1, masse: 88332, absenteisme: 17.5 },
    { mois: "Juin", effectifs: 35, interim: 15.8, masse: 102218, absenteisme: 19.1 },
    { mois: "Juillet", effectifs: 35, interim: 14.2, masse: 108500, absenteisme: 16.8 }
  ];

  // Actions juillet - déploiements majeurs
  const actionsJuillet = [
    {
      titre: "Déploiement Robots PUDU",
      description: "7 PUDU SH1 + 1 PUDU MT1 opérationnels depuis le 29 juillet",
      statut: "REALISE",
      date: "29 juillet 2025",
      icon: Bot,
      impact: "Réduction 30% temps nettoyage BS"
    },
    {
      titre: "Bagageries Électriques",
      description: "Réception et mise en service pour tournées encombrants",
      statut: "REALISE", 
      date: "24 juillet 2025",
      icon: Truck,
      impact: "Optimisation logistique"
    },
    {
      titre: "Nouvelle Base de Vie",
      description: "Accession QSe avec commodités complètes opérationnelle",
      statut: "REALISE",
      date: "09 juillet 2025", 
      icon: Building,
      impact: "Amélioration conditions travail"
    },
    {
      titre: "Sessions Vis ma Vie",
      description: "Formation encadrants pour identification lacunes terminée",
      statut: "REALISE",
      date: "23-25 juillet 2025",
      icon: GraduationCap,
      impact: "Montée compétences encadrement"
    },
    {
      titre: "Équipe Mécanisation",
      description: "Équipe supplémentaire week-end en préparation",
      statut: "EN_COURS",
      date: "Août 2025",
      icon: Wrench,
      impact: "Renforcement couverture"
    },
    {
      titre: "Communication Intégrée",
      description: "Réception Sequoia via outils numériques - phase test activée",
      statut: "REALISE",
      date: "Juillet 2025",
      icon: Zap,
      impact: "Fluidité communication"
    }
  ];

  // Nouveaux équipements déployés
  const equipementsData = [
    { nom: "PUDU SH1", quantite: 7, type: "Autolaveuse autonome", zone: "Blocs sanitaires" },
    { nom: "PUDU MT1", quantite: 1, type: "Balayeuse autonome", zone: "Zones de tri" },
    { nom: "Bagageries électriques", quantite: 2, type: "Transport écologique", zone: "Tournées" },
    { nom: "Zones stockage", quantite: 14, type: "Stockage tampon / Consommables", zone: "Périmètre OUEST --> T1 (1) - T3 (1) - ABCD (4)" }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = "blue", badge, detail }) => {
    const colorClasses = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600", 
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
      red: "from-red-500 to-red-600",
      indigo: "from-indigo-500 to-indigo-600"
    };

    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full -mr-16 -mt-16`} />
        {badge && (
          <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
            {badge}
          </div>
        )}
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
              <p className="text-4xl font-bold text-gray-800 mt-3">{value}</p>
              {subtitle && <p className="text-sm text-gray-600 mt-2">{subtitle}</p>}
              {detail && <p className="text-xs text-gray-500 mt-1">{detail}</p>}
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
          </div>
          {trend && (
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">{trend}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFormations = () => {
    const renderFormationDashboard = () => (
      <div className="space-y-6">
        {/* Alert EPI */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-8 h-8 animate-pulse" />
            <div>
              <h3 className="text-xl font-bold">⚠️ Action Requise - Formation EPI</h3>
              <p className="text-red-100 mt-1">
                36 collaborateurs ont leur formation EPI "À programmer" - Priorité absolue !
              </p>
            </div>
          </div>
        </div>

        {/* KPIs globaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={GraduationCap}
            title="Formations Totales"
            value={globalStats.totalFormations}
            subtitle="Sessions réalisées"
            color="blue"
          />
          <StatCard
            icon={AlertCircle}
            title="À Programmer"
            value={globalStats.totalAProgrammer}
            subtitle="Formations en attente"
            color="orange"
          />
          <StatCard
            icon={Award}
            title="Taux Couverture Moyen"
            value={`${globalStats.tauxCouvertureMoyen}%`}
            subtitle="Sur 36 collaborateurs"
            color="green"
          />
          <StatCard
            icon={Users}
            title="Collaborateurs"
            value={globalStats.collaborateursTotal}
            subtitle="Effectif GPNS TRI ADP"
            color="purple"
          />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Répartition Taux de Couverture</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  fontSize={12}
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Taux de couverture']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Couverture vs Validité</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formation" angle={-45} textAnchor="end" height={80} fontSize={10} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="couverture" fill="#3b82f6" name="Taux Couverture (%)" />
                <Bar dataKey="validite" fill="#22c55e" name="Taux Validité (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Formations critiques */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl shadow-xl p-6 border border-red-200">
          <h3 className="text-xl font-bold text-red-800 mb-6">🚨 Formations Prioritaires</h3>
          <div className="space-y-4">
            {formationsData
              .filter(f => f.priorite === 'Urgente' || f.aProgrammer > 0 || f.tauxCouverture < 50)
              .map((formation, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-red-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <formation.icon className="w-6 h-6 text-red-600" />
                      <div>
                        <h4 className="font-semibold text-gray-800">{formation.formation}</h4>
                        <p className="text-sm text-gray-600">{formation.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium border ${prioriteColors[formation.priorite]}`}>
                        {formation.priorite}
                      </span>
                      {formation.aProgrammer > 0 && (
                        <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                          {formation.aProgrammer} à programmer
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );

    const renderFormationTable = () => (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* En-tête du tableau */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white">Tableau de Suivi des Formations - GPNS TRI ADP</h3>
          <p className="text-blue-100 text-sm mt-1">36 collaborateurs • 8 types de formations</p>
        </div>

        {/* Filtres */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une formation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toutes les formations</option>
                <option value="urgent">Urgentes</option>
                <option value="obligatoire">Obligatoires</option>
                <option value="aprogrammer">À programmer</option>
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'table' ? 'dashboard' : 'table')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                {viewMode === 'table' ? <BarChart3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{viewMode === 'table' ? 'Dashboard' : 'Tableau'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Formation</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Formés</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Validité OK</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">À Programmer</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Taux Couverture</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Priorité</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Renouvellement</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFormations.map((formation, index) => (
                <tr key={formation.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        formation.color === 'red' ? 'bg-red-100' :
                        formation.color === 'green' ? 'bg-green-100' :
                        formation.color === 'blue' ? 'bg-blue-100' :
                        formation.color === 'purple' ? 'bg-purple-100' :
                        formation.color === 'indigo' ? 'bg-indigo-100' :
                        formation.color === 'orange' ? 'bg-orange-100' :
                        formation.color === 'yellow' ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        <formation.icon className={`w-5 h-5 ${
                          formation.color === 'red' ? 'text-red-600' :
                          formation.color === 'green' ? 'text-green-600' :
                          formation.color === 'blue' ? 'text-blue-600' :
                          formation.color === 'purple' ? 'text-purple-600' :
                          formation.color === 'indigo' ? 'text-indigo-600' :
                          formation.color === 'orange' ? 'text-orange-600' :
                          formation.color === 'yellow' ? 'text-yellow-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{formation.formation}</div>
                        <div className="text-sm text-gray-500">Sur {formation.totalCollaborateurs} collaborateurs</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[formation.category]}`}>
                      {formation.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-gray-900">{formation.collaborateursFormes}</span>
                      <span className="text-xs text-gray-500">formés</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-green-600">{formation.validiteOK}</span>
                      <span className="text-xs text-gray-500">valides</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-2xl font-bold ${formation.aProgrammer > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                        {formation.aProgrammer}
                      </span>
                      <span className="text-xs text-gray-500">en attente</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-lg font-bold text-gray-900">{formation.tauxCouverture.toFixed(1)}%</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            formation.tauxCouverture >= 80 ? 'bg-green-500' :
                            formation.tauxCouverture >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${formation.tauxCouverture}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${prioriteColors[formation.priorite]}`}>
                      {formation.priorite}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{formation.renouvellement}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Résumé en bas du tableau */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{filteredFormations.length}</div>
              <div className="text-sm text-gray-600">Formations affichées</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {filteredFormations.reduce((sum, f) => sum + f.collaborateursFormes, 0)}
              </div>
              <div className="text-sm text-gray-600">Total formés</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {filteredFormations.reduce((sum, f) => sum + f.aProgrammer, 0)}
              </div>
              <div className="text-sm text-gray-600">À programmer</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {filteredFormations.length > 0 ? (filteredFormations.reduce((sum, f) => sum + f.tauxCouverture, 0) / filteredFormations.length).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600">Couverture moyenne</div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        {viewMode === 'dashboard' ? renderFormationDashboard() : renderFormationTable()}
        
        {/* Actions footer */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Actions Recommandées</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-800">Urgent</span>
              </div>
              <p className="text-sm text-red-700">Programmer immédiatement les 36 formations EPI en attente</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-800">À planifier</span>
              </div>
              <p className="text-sm text-orange-700">Améliorer la couverture PERMIS PISTE (25%) et produits chimiques (41.7%)</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Maintenir</span>
              </div>
              <p className="text-sm text-green-700">Excellent taux de validité (100%) sur les formations réalisées</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPIs juillet */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          icon={Users}
          title="Effectif Stable"
          value={effectifTotal}
          subtitle={`${effectifHommes} hommes, ${effectifFemmes} femmes`}
          detail="Maintien depuis mars 2025"
          color="blue"
        />
        <StatCard
          icon={Users}
          title="PRECARITE"
          value="26"
          subtitle={`19 hommes, 7 femmes`}
          color="red"
        />
        <StatCard
          icon={Bot}
          title="Innovation Déployée"
          value={nouveauxEquipements}
          subtitle="Robots PUDU opérationnels"
          badge=""
          color="orange"
        />
        <StatCard
          icon={GraduationCap}
          title="Formations Intensifiées"
          value={`${formationsRealisees}/${formationsRealisees}`}
          subtitle={`${totalHeuresFormation}h réalisées`}
          detail="100% réalisation juillet"
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          title="Performance"
          value="16.8%"
          subtitle="Absentéisme juillet"
          detail="Amélioration vs juin (-2.3pts)"
          trend="-12%"
          color="indigo"
        />
      </div>

      {/* Évolution des indicateurs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Évolution Trimestrielle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="masse" fill="#3b82f6" name="Masse Salariale (k€)" />
              <Line yAxisId="right" type="monotone" dataKey="absenteisme" stroke="#ef4444" strokeWidth={3} name="Absentéisme (%)" />
              <Line yAxisId="right" type="monotone" dataKey="interim" stroke="#f59e0b" strokeWidth={2} name="ETP Intérim" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Pyramide des Âges - Juillet</h3>
          <div className="space-y-2">
            {pyramideAgesData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-1 flex justify-end pr-2">
                  <div className="text-sm text-gray-600 mr-2 w-8 text-right">{Math.abs(item.hommes)}</div>
                  <div className="w-full max-w-[120px] bg-gray-200 rounded-l-lg overflow-hidden">
                    <div 
                      className="h-5 bg-blue-500 transition-all ease-out duration-1000"
                      style={{ 
                        width: animatePyramid ? `${(Math.abs(item.hommes) / 15) * 100}%` : '0%',
                        transitionDelay: `${index * 100}ms`
                      }}
                    />
                  </div>
                </div>
                <div className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 w-12 text-center">
                  {item.tranche}
                </div>
                <div className="flex-1 flex pl-2">
                  <div className="w-full max-w-[120px] bg-gray-200 rounded-r-lg overflow-hidden">
                    <div 
                      className="h-5 bg-pink-500 transition-all ease-out duration-1000"
                      style={{ 
                        width: animatePyramid ? `${(item.femmes / 15) * 100}%` : '0%',
                        transitionDelay: `${index * 100}ms`
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 ml-2 w-8">{item.femmes}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              <span className="font-semibold">📊 Focus:</span> 60% des effectifs dans la tranche 46-65 ans - expertise confirmée
            </p>
          </div>
        </div>
      </div>

      {/* Bilan du mois */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">🎯 Bilan Juillet 2025 - Mois de Transformation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-2xl font-bold mb-2">✅ 6/6</div>
            <p className="text-sm">Actions majeures réalisées</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-2xl font-bold mb-2">🤖 8</div>
            <p className="text-sm">Robots déployés</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-2xl font-bold mb-2">📈 +12%</div>
            <p className="text-sm">Amélioration performance</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRH = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Formations Juillet - Intensification</h3>
          <div className="space-y-3">
            {formationsDataJuillet.map((formation, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="font-medium text-gray-700 flex-1">{formation.name}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                    {formation.status}
                  </span>
                  <span className="text-sm text-gray-600 font-semibold">
                    {formation.realized}/{formation.planned}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 bg-green-50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700 font-medium">Taux de réalisation juillet</span>
              <span className="font-bold text-green-600">100%</span>
            </div>
            <p className="text-xs text-green-700 mt-1">🎯 Objectif atteint - Montée en compétence réussie</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Impact Sessions "Vis ma Vie"</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded-r-lg">
              <h4 className="font-semibold text-blue-800">Identification des Lacunes</h4>
              <p className="text-sm text-blue-700 mt-1">Cartographie précise des besoins par encadrant</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded-r-lg">
              <h4 className="font-semibold text-green-800">Adaptation des Formations</h4>
              <p className="text-sm text-green-700 mt-1">Personnalisation des parcours de formation</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded-r-lg">
              <h4 className="font-semibold text-purple-800">Rapprochement Service Formation</h4>
              <p className="text-sm text-purple-700 mt-1">Collaboration renforcée pour suivi continu</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-3 rounded-r-lg">
              <h4 className="font-semibold text-purple-800">Elargissement du concept</h4>
              <p className="text-sm text-purple-700 mt-1">Action similaire envisagée pour les agents</p>
            </div>
          </div>
          <div className="mt-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              <span className="font-semibold">💡 Résultat:</span> Amélioration notable de l'encadrement de proximité
            </p>
          </div>
        </div>
      </div>

      {/* Répartition géographique */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Analyse Géographique Maintenue</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-4">Départements Principaux</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={repartitionDepartements}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${value}`}
                >
                  {repartitionDepartements.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-4">Villes Principales</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {topVillesData.slice(0, 8).map((ville, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">{ville.ville}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{ville.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOperations = () => (
    <div className="space-y-6">
      {/* Déploiements juillet */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-6">🚀 Déploiements Juillet - Révolution Technologique</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {equipementsData.map((equip, index) => (
            <div key={index} className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold mb-2">{equip.quantite}</div>
              <h4 className="font-semibold mb-1">{equip.nom}</h4>
              <p className="text-xs opacity-90">{equip.type}</p>
              <p className="text-xs opacity-75 mt-1">Zone: {equip.zone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions réalisées */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Actions Juillet - Tableau de Bord</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {actionsJuillet.map((action, index) => (
            <div key={index} className={`border-2 rounded-lg p-4 ${
              action.statut === 'REALISE' ? 'border-green-200 bg-green-50' : 
              action.statut === 'EN_COURS' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  action.statut === 'REALISE' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <action.icon className={`w-5 h-5 ${
                    action.statut === 'REALISE' ? 'text-green-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{action.titre}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      action.statut === 'REALISE' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {action.statut === 'REALISE' ? '✅ FAIT' : '🔄 EN COURS'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">{action.date}</p>
                    <p className="text-xs font-medium text-purple-600">{action.impact}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact opérationnel */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-xl p-6 border border-indigo-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Impact Opérationnel des Innovations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <Bot className="w-8 h-8 text-blue-600" />
              <h4 className="font-semibold text-gray-800">Robots PUDU</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Réduction 30% temps nettoyage BS</li>
              <li>• Amélioration qualité constante</li>
              <li>• Libération agents pour autres tâches</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <Building className="w-8 h-8 text-green-600" />
              <h4 className="font-semibold text-gray-800">Nouvelle Base</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Amélioration conditions travail</li>
              <li>• Réduction temps déplacement</li>
              <li>• Meilleur moral équipe</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <GraduationCap className="w-8 h-8 text-purple-600" />
              <h4 className="font-semibold text-gray-800">Formation</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Encadrement renforcé</li>
              <li>• Identification précise lacunes</li>
              <li>• Montée compétence ciblée</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQualite = () => (
    <div className="space-y-6">
      {/* Sécurité juillet */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-6">🛡️ Bilan Sécurité Juillet - Excellence Maintenue</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-2">0</div>
            <p className="text-sm">Accident de Travail</p>
            <p className="text-xs opacity-75">Objectif zéro maintenu</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-2">100%</div>
            <p className="text-sm">Formation Sécurité</p>
            <p className="text-xs opacity-75">Tous collaborateurs formés</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-2">♻️</div>
            <p className="text-sm">Démarche Écologique</p>
            <p className="text-xs opacity-75">Bagageries électriques</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-2">🤖</div>
            <p className="text-sm">Sécurité Automatisée</p>
            <p className="text-xs opacity-75">Robots zones confinées</p>
          </div>
        </div>
      </div>

      {/* Amélioration des prestations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Prestations Améliorées - Juillet</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-700">Intégration Cahier des Charges</p>
                <p className="text-xs text-gray-500">Nouvelles tâches spécifiées intégrées</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Activity className="w-6 h-6 text-green-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-700">Retours Client VSR</p>
                <p className="text-xs text-gray-500">Remarques contrôleurs intégrées</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Settings className="w-6 h-6 text-purple-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-700">Encadrement Renforcé</p>
                <p className="text-xs text-gray-500">2 encadrants par vacation opérationnels</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Communication Digitale</h3>
          <div className="space-y-3">
            <div className="border-l-4 border-indigo-500 pl-4 bg-indigo-50 p-3 rounded-r-lg">
              <h4 className="font-semibold text-indigo-800">Sequoia Intégré</h4>
              <p className="text-sm text-indigo-700 mt-1">Réception via outils numériques - phase test</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded-r-lg">
              <h4 className="font-semibold text-green-800">Applications Améliorées</h4>
              <p className="text-sm text-green-700 mt-1">Optimisation continue des interfaces</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-3 rounded-r-lg">
              <h4 className="font-semibold text-orange-800">Traçabilité Renforcée</h4>
              <p className="text-sm text-orange-700 mt-1">Suivi temps réel des prestations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Changement organisationnel */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6 border border-purple-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Évolution Organisationnelle</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <Award className="w-8 h-8 text-purple-600" />
              <h4 className="font-semibold text-gray-800">Changement Identité</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ancien nom:</span>
                <span className="font-medium">Groupe 3S Alyzia</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nouveau nom:</span>
                <span className="font-medium text-purple-600">Alyzia</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Forme juridique:</span>
                <span className="font-medium text-green-600">Inchangée</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <Building className="w-8 h-8 text-blue-600" />
              <h4 className="font-semibold text-gray-800">Structure Maintenue</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Nom de la filiale inchangé</li>
              <li>• Continuité juridique assurée</li>
              <li>• Simplification de l'image de marque</li>
              <li>• Modernisation de l'identité visuelle</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Préparation août */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">🎯 Préparation Août 2025</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Wrench className="w-6 h-6" />
              <h4 className="font-semibold">Équipe Mécanisation Week-end</h4>
            </div>
            <p className="text-sm opacity-90">Déploiement équipe supplémentaire pour couverture technique étendue</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="w-6 h-6" />
              <h4 className="font-semibold">Optimisation Continue</h4>
            </div>
            <p className="text-sm opacity-90">Ajustements basés sur retours d'expérience juillet</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-6 py-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Comité de Suivi GPNS - ADP CDG</h1>
              <p className="text-blue-100 mt-2 text-lg">Rapport Juillet 2025 - Mois de Transformation</p>
            </div>
            <div className="flex items-center space-x-3 bg-white/20 backdrop-blur rounded-xl px-5 py-3">
              <Calendar className="w-6 h-6" />
              <span className="font-semibold text-lg">JUILLET 2025</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-lg sticky top-0 z-20 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
              { id: 'rh', label: 'Ressources Humaines', icon: Users },
              { id: 'formations', label: 'Formations', icon: GraduationCap },
              { id: 'operations', label: 'Opérations & Innovation', icon: Bot },
              { id: 'qualite', label: 'Qualité & Sécurité', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-5 px-3 border-b-3 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-700 bg-purple-50 -mb-px'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-semibold">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="animate-fadeIn">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'rh' && renderRH()}
          {activeTab === 'formations' && renderFormations()}
          {activeTab === 'operations' && renderOperations()}
          {activeTab === 'qualite' && renderQualite()}
        </div>
      </div>
    </div>
  );
};

export default ComiteJuillet;