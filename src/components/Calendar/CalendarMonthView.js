import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

const CalendarMonthView = ({ month, year, deployments }) => {
  const [calendarDays, setCalendarDays] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);  // Etat pour ouvrir/fermer la modale
  const [selectedEvent, setSelectedEvent] = useState(null);  // Etat pour la tâche sélectionnée
  
  useEffect(() => {
    generateCalendarDays();
  }, [month, year, deployments]);

  // Générer les jours du calendrier
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    let startingDayOfWeek = firstDayOfMonth.getDay();
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    const days = [];
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
        events: []
      });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayEvents = deployments.filter(deployment => {
        const deploymentDate = deployment.date;
        return deploymentDate.getDate() === i &&
               deploymentDate.getMonth() === month &&
               deploymentDate.getFullYear() === year;
      });
      
      days.push({
        day: i,
        isCurrentMonth: true,
        date,
        events: dayEvents
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
        events: []
      });
    }
    
    setCalendarDays(days);
  };

  // Fonction pour déterminer la couleur du lieu
  const getLocationColor = (location) => {
    const locationColors = {
      'GALERIE DEP T2C': 'bg-red-100 text-red-800',
      'T1 / ZONE OUEST': 'bg-blue-400 text-blue-800',
      'T1 / ZONE EST': 'bg-green-400 text-green-800',
      'T1 / ZONE SUD': 'bg-yellow-400 text-yellow-800',
      'T1 / ZONE NORD': 'bg-red-400 text-yellow-800',
    };
    return locationColors[location] || 'bg-gray-100 text-gray-800';  // Couleur par défaut si le lieu n'est pas trouvé
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-7 gap-px border-b">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
          <div key={index} className="py-2 text-center text-sm font-semibold text-gray-700 bg-gray-50">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {calendarDays.map((day, index) => (
          <div 
            key={index} 
            className={`min-h-[120px] p-2 bg-white ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}`}
          >
            <div className="font-medium text-sm mb-1">
              {formatDate(day.date)}
            </div>
            
            <div className="space-y-1">
              {day.events.map((event, idx) => (
                <div 
                  key={idx} 
                  onClick={() => openModal(event)} 
                  className={`text-xs p-1 rounded cursor-pointer ${getLocationColor(event.site)}`}
                >
                  <div className="font-medium truncate">{event.details}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modale pour afficher les détails de la tâche */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Détails de la tâche"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2 className="font-semibold">{selectedEvent ? selectedEvent.details : ''}</h2>
        <p><strong>Site:</strong> {selectedEvent ? selectedEvent.site : ''}</p>
        <p><strong>Infra:</strong> {selectedEvent ? selectedEvent.infra : ''}</p>
        <p><strong>Début:</strong> {selectedEvent ? selectedEvent.start : ''}</p>
        <p><strong>Fin:</strong> {selectedEvent ? selectedEvent.end : ''}</p>
        <button onClick={closeModal} className="bg-blue-500 text-white p-2 rounded">
          Fermer
        </button>
      </Modal>
    </div>
  );
};

export default CalendarMonthView;
