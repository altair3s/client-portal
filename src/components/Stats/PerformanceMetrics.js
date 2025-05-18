// Fichier: src/components/Stats/PerformanceMetrics.js
import React, { useContext } from 'react';
import { DataContext } from '../../contexts/DataContext';

const PerformanceMetrics = () => {
  const { reports, deployments, loading } = useContext(DataContext);

  if (loading) return <div className="animate-pulse h-32 bg-gray-200 rounded"></div>;
  if (!reports || !deployments || reports.length === 0 || deployments.length === 0) {
    return <p className="text-gray-500">Données insuffisantes pour calculer les métriques</p>;
  }

  // Calcul du taux de ponctualité
  const onTimeDeployments = deployments.filter(deployment => 
    deployment.status === 'Terminé' && 
    new Date(deployment.completionDate) <= new Date(deployment.dueDate)
  ).length;
  
  const completedDeployments = deployments.filter(deployment => 
    deployment.status === 'Terminé'
  ).length;
  
  const punctualityRate = completedDeployments > 0 
    ? Math.round((onTimeDeployments / completedDeployments) * 100) 
    : 0;

  // Calcul du taux de satisfaction client
  const satisfactionRatings = reports
    .filter(report => report.satisfactionRating)
    .map(report => parseInt(report.satisfactionRating));
  
  const averageSatisfaction = satisfactionRatings.length > 0 
    ? Math.round(satisfactionRatings.reduce((sum, rating) => sum + rating, 0) / satisfactionRatings.length * 10) / 10
    : 0;

  // Calcul du nombre moyen d'interventions par mois
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const recentReports = reports.filter(report => 
    new Date(report.date) >= sixMonthsAgo && 
    new Date(report.date) <= now
  );
  
  const monthlyInterventions = recentReports.length > 0 
    ? Math.round((recentReports.length / 6) * 10) / 10
    : 0;

  // Temps de réponse moyen (en jours)
  const responseTimes = reports
    .filter(report => report.requestDate && report.responseDate)
    .map(report => {
      const requestDate = new Date(report.requestDate);
      const responseDate = new Date(report.responseDate);
      return Math.round((responseDate - requestDate) / (1000 * 60 * 60 * 24));
    });
  
  const averageResponseTime = responseTimes.length > 0 
    ? Math.round((responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length) * 10) / 10
    : 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Métriques de performance</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Taux de ponctualité */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Taux de ponctualité</span>
            <span className="text-sm font-medium">{punctualityRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${punctualityRate}%` }}
            ></div>
          </div>
        </div>
        
        {/* Satisfaction client */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Satisfaction client</span>
            <span className="text-sm font-medium">{averageSatisfaction}/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${(averageSatisfaction / 5) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Interventions par mois */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Interventions mensuelles</span>
          <span className="text-2xl font-bold text-blue-600">{monthlyInterventions}</span>
        </div>
        
        {/* Temps de réponse moyen */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Temps de réponse moyen</span>
          <span className="text-2xl font-bold text-blue-600">{averageResponseTime} jour{averageResponseTime !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;