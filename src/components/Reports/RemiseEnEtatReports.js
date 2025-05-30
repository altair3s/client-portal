import React, { useState, useEffect } from 'react';

const parseSheetData = (sheetData) => {
  const headers = sheetData[0].map(header => header.trim().toLowerCase());
  return sheetData.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      if (header === 'date' || header === 'lieu' || header === 'pdf url') {
        obj[header] = row[index] || '';
      } else {
        obj[header] = parseFloat(row[index]) || 0;
      }
    });
    return obj;
  });
};

const RemiseEnEtatReports = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedLieu, setSelectedLieu] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const SHEET_ID_REM = process.env.REACT_APP_REPORTS_SHEET_ID_REM;
  const API_KEY = process.env.REACT_APP_API_KEY;
  const RANGE = 'Pdf!B1:D';

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID_REM}/values/${RANGE}?key=${API_KEY}`
        );
        const result = await response.json();

        if (result.values) {
          const parsedData = parseSheetData(result.values);
          setData(parsedData);
          setFilteredData(parsedData);
        } else {
          setError('Aucune donnée trouvée');
        }
      } catch (err) {
        setError("Une erreur est survenue lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();
  }, []);

  // Filtrer les données quand le lieu sélectionné change
  useEffect(() => {
    if (selectedLieu === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(row => row.lieu === selectedLieu);
      setFilteredData(filtered);
    }
  }, [selectedLieu, data]);

  // Obtenir la liste unique des lieux
  const getUniqueLieux = () => {
    const lieux = data.map(row => row.lieu).filter(lieu => lieu && lieu.trim() !== '');
    return [...new Set(lieux)].sort();
  };

  const handleLieuChange = (event) => {
    setSelectedLieu(event.target.value);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Comptes rendus de remise en état</h1>
      </div>

      {/* Filtre par lieu */}
      {!loading && !error && data.length > 0 && (
        <div className="mb-4 bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4">
            <label htmlFor="lieu-filter" className="font-medium text-gray-700">
              Filtrer par lieu :
            </label>
            <select
              id="lieu-filter"
              value={selectedLieu}
              onChange={handleLieuChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les lieux</option>
              {getUniqueLieux().map(lieu => (
                <option key={lieu} value={lieu}>
                  {lieu}
                </option>
              ))}
            </select>
            {selectedLieu && (
              <span className="text-sm text-gray-600">
                ({filteredData.length} résultat{filteredData.length > 1 ? 's' : ''})
              </span>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {selectedLieu ? `Aucun compte rendu trouvé pour "${selectedLieu}"` : 'Aucune donnée disponible'}
            </div>
          ) : (
            <div className="overflow-auto" style={{ maxHeight: '700px', maxWidth: '100%' }}>
              <table className="w-full border-collapse" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#6fa8dc',
                    color: 'white',
                    textAlign: 'left',
                  }}>
                    {Object.keys(filteredData[0]).map((header) => (
                      <th
                        key={header}
                        style={{
                          padding: '16px',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          textTransform: 'capitalize',
                          width: '500px',
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                        borderBottom: '1px solid #e0e0e0',
                      }}
                    >
                      {Object.entries(row).map(([key, value], cellIndex) => (
                        <td
                          key={cellIndex}
                          style={{
                            padding: '12px',
                            fontSize: '14px',
                            color: '#333',
                            cursor: 'pointer',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                          }}
                        >
                          {key === 'pdf url' && typeof value === 'string' && value ? (
                            <a
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#1976d2',
                                textDecoration: 'underline',
                                fontWeight: 500,
                              }}
                            >
                              Afficher le CR
                            </a>
                          ) : typeof value === 'number' ? (
                            value.toFixed(2)
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemiseEnEtatReports;