import React, { useState } from 'react';
import { 
  Users, TrendingUp, Shield, Truck, AlertCircle, 
  CheckCircle, Calendar, Activity, Settings,
  FileText, UserPlus, Zap
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const Comite = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Données extraites du document
  const nouvellesEntrees = 5;
  const mecanisations = 20;
  const balayagesTotal = 47;
  const nettoyagesBSTotal = 42;

  const balayagesData = [
    { zone: 'TBE', balayage: 3, nettoyageBS: 5 },
    { zone: 'T2F', balayage: 2, nettoyageBS: 5 },
    { zone: 'TBM', balayage: 9, nettoyageBS: 5 },
    { zone: 'QSE', balayage: 9, nettoyageBS: 5 },
    { zone: 'Parachute', balayage: 9, nettoyageBS: 0 },
    { zone: 'TBF', balayage: 6, nettoyageBS: 5 },
    { zone: 'TDS3', balayage: 2, nettoyageBS: 3 },
    { zone: 'TDS4', balayage: 4, nettoyageBS: 5 },
    { zone: 'T2G', balayage: 2, nettoyageBS: 5 },
    { zone: 'S3N', balayage: 2, nettoyageBS: 4 }
  ];

  const formationsData = [
    { name: 'Permis Piéton', value: 76, color: '#10b981' },
    { name: '11.2.6.2', value: 68, color: '#3b82f6' },
    { name: 'Gestion Produits Chimiques', value: 78, color: '#8b5cf6' },
    { name: 'FH', value: 0, color: '#ef4444' },
    { name: 'Gestes et Postures', value: 0, color: '#f59e0b' },
    { name: 'EPI', value: 0, color: '#6366f1' },
    { name: 'Gestion des Équipes', value: 0, color: '#ec4899' }
  ];

  const vehiculesData = [
    { type: 'Véhicules', count: 5 },
    { type: 'Autolaveuses', count: 7 },
    { type: 'Nettoyeurs HP', count: 2 }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      red: "bg-red-500"
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${colorClasses[color].replace('bg-', 'text-')}`} />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={UserPlus}
          title="Nouvelles Entrées"
          value={nouvellesEntrees}
          subtitle="Ce mois"
          color="green"
        />
        <StatCard
          icon={Zap}
          title="Mécanisations"
          value={mecanisations}
          subtitle="Réalisées"
          color="blue"
        />
        <StatCard
          icon={Activity}
          title="Balayages"
          value={balayagesTotal}
          subtitle="Total effectué"
          color="purple"
        />
        <StatCard
          icon={CheckCircle}
          title="Nettoyages BS"
          value={nettoyagesBSTotal}
          subtitle="Blocs sanitaires"
          color="orange"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opérations par zone */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Opérations par Zone</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={balayagesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="zone" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="balayage" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="nettoyageBS" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* État des formations */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">État des Formations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={formationsData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Taux %" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Équipements */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Parc d'Équipements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehiculesData.map((item, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{item.type}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{item.count}</p>
                </div>
                <Truck className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderExploitation = () => (
    <div className="space-y-6">
      {/* Événements récents */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Points Traités sur l'Exploitation</h3>
        <div className="space-y-4">
          {[
            { title: "Démarrage du planning de mécanisation", status: "success", desc: "Périmètre OUEST - Aucune difficulté rencontrée" },
            { title: "Évacuation des encombrants", status: "success", desc: "Fréquence bimensuelle respectée (15 et 30 du mois)" },
            { title: "Supports BS et suivi des prestations", status: "progress", desc: "Déploiement des puces NFC en cours" },
            { title: "Extension du périmètre T2A", status: "success", desc: "Réouverture partielle prise en compte" },
            { title: "Mise en service du satellite 4", status: "success", desc: "Terminal T1 - Intégré au périmètre" },
            { title: "Intégration du PC bagages", status: "success", desc: "Terminal T2 - Prestations complètes" }
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`p-2 rounded-full ${
                item.status === 'success' ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {item.status === 'success' ? 
                  <CheckCircle className="w-5 h-5 text-green-600" /> :
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                }
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{item.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Points en attente */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Points en Attente de Clarification</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <div>
              <p className="font-medium text-gray-800">Bâtiments 1226 et 1280</p>
              <p className="text-sm text-gray-600">Périmètre exact d'intervention à confirmer</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <div>
              <p className="font-medium text-gray-800">Blocs sanitaires T2D</p>
              <p className="text-sm text-gray-600">Utilisés par EasyJet - Hors périmètre déclaré</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQualite = () => (
    <div className="space-y-6">
      {/* Formations détaillées */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Taux de Formation du Personnel</h3>
        <div className="space-y-4">
          {formationsData.map((formation, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{formation.name}</span>
                <span className={`text-sm font-bold ${
                  formation.value > 70 ? 'text-green-600' : 
                  formation.value > 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {formation.value}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    formation.value > 70 ? 'bg-green-500' : 
                    formation.value > 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${formation.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicateurs de sécurité */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Accidents de Travail</p>
              <p className="text-4xl font-bold mt-2">0</p>
              <p className="text-green-100 text-sm mt-1">Sur la période</p>
            </div>
            <Shield className="w-12 h-12 text-green-200 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Accès Spécifiques</p>
              <p className="text-4xl font-bold mt-2">10</p>
              <p className="text-blue-100 text-sm mt-1">Badges actifs</p>
            </div>
            <Users className="w-12 h-12 text-blue-200 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard ADP - GPNS Tri Bagage</h1>
              <p className="text-blue-100 mt-1">Rapport Avril 2025</p>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Avril 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
              { id: 'exploitation', label: 'Exploitation', icon: Settings },
              { id: 'qualite', label: 'Qualité & Sécurité', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'exploitation' && renderExploitation()}
        {activeTab === 'qualite' && renderQualite()}
      </div>
    </div>
  );
};

export default Comite;