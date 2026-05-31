import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Registramos los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function PanelRecaudacion() {
  const [datosGrafico, setDatosGrafico] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [totalEstimado, setTotalEstimado] = useState(0);

  useEffect(() => {
    api.get('/protectora/recaudacion-mensual')
      .then(res => {
        const backendData = res.data;
        
        // Configuramos el diseño estético de la línea según tu manual corporativo
        const configuracionDiseño = {
          ...backendData,
          datasets: backendData.datasets.map(dataset => ({
            ...dataset,
            borderColor: '#6f42c1', // Tu morado corporativo --huellitas-purple
            backgroundColor: 'rgba(111, 66, 193, 0.1)', // Fondo suavizado bajo la línea
            pointBackgroundColor: '#fd7e14', // Naranja de acción en los puntos de quiebre
            pointBorderColor: '#fff',
            pointHoverRadius: 7,
            tension: 0.35, // Suaviza la curvatura de la línea para que sea más orgánica
            fill: true
          }))
        };

        setDatosGrafico(configuracionDiseño);

        // Calculamos la recaudación total acumulada sumando los valores de los meses
        const sumaTotal = backendData.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0;
        
        // CORREGIDO: Usando el modificador correcto en español 'setTotalEstimado'
        setTotalEstimado(sumaTotal);
        
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar las analíticas de recaudación:", err);
        setCargando(false);
      });
  }, []);

  // Opciones de configuración de ejes, tooltips y responsividad del gráfico
  const opcionesChart = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Ocultamos la leyenda superior porque el título de la tarjeta ya lo explica
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return ` Recaudado: ${context.parsed.y} €`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + ' €';
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false // Quitamos las líneas verticales de fondo para limpiar la vista
        }
      }
    }
  };

  if (cargando) return <div className="text-center p-5 mt-5 text-huellitas"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-5 mb-5 animate-up" style={{ maxWidth: '1000px' }}>
      
      {/* Encabezado de la Sección */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-huellitas mb-1">📈 Balance de Apadrinamientos</h2>
          <p className="text-muted mb-0">Control de ingresos y donaciones recurrentes por meses del año actual</p>
        </div>
        <Link to="/panel-protectora" className="btn btn-sm btn-light border text-huellitas rounded-pill px-3 fw-bold">
          ← Volver a mi panel
        </Link>
      </div>

      <div className="row g-4">
        {/* Tarjeta de Resumen Rápido (KPI) */}
        <div className="col-md-4">
          <div className="card card-huellitas p-4 bg-white shadow-sm h-100 d-flex flex-column justify-content-center border-0">
            <span className="text-muted small fw-bold text-uppercase tracking-wider mb-1">Recaudación Total Activa</span>
            <h2 className="display-5 fw-bold text-huellitas mb-2">{totalEstimado.toFixed(2)} €</h2>
            <div className="alert bg-naranja-claro text-naranja small rounded-3 p-2 mb-0 mt-2">
              🐾 Dinero recurrente mensual para el mantenimiento del refugio.
            </div>
          </div>
        </div>

        {/* Tarjeta del Gráfico de Línea Analítico */}
        <div className="col-md-8">
          <div className="card card-huellitas p-4 bg-white shadow-sm border-0">
            <h5 className="fw-bold text-dark mb-4">Evolución de Ingresos</h5>
            <div style={{ height: '300px', width: '100%' }}>
              {datosGrafico ? (
                <Line data={datosGrafico} options={opcionesChart} />
              ) : (
                <div className="text-center py-5 text-muted fst-italic">No se han registrado datos de recaudación.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PanelRecaudacion;