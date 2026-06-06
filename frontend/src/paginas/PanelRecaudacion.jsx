import { useEffect, useState } from 'react';
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

// Registro de controladores del lienzo de Canvas HTML5 para Chart.js
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

/**
 * Componente PanelRecaudacion
 * Subsistema analítico que renderiza la evolución financiera de las cuotas 
 * de apadrinamiento de la entidad mediante gráficos de series temporales.
 */
function PanelRecaudacion() {
  const [datosGrafico, setDatosGrafico] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [totalEstimado, setTotalEstimado] = useState(0);

  /**
   * Efecto de inicialización.
   * Obtiene la estructura de datos tabulada por meses desde el backend
   * y le inyecta las directivas de diseño del framework corporativo de frontend.
   */
  useEffect(() => {
    const cargarAnaliticas = async () => {
      try {
        const res = await api.get('/protectora/recaudacion-mensual');
        const backendData = res.data;
        
        // Composición de objetos inmutables: Fusión de datos puros + Diseño UI
        const configuracionDiseño = {
          ...backendData,
          datasets: backendData.datasets.map(dataset => ({
            ...dataset,
            borderColor: '#6f42c1', 
            backgroundColor: 'rgba(111, 66, 193, 0.1)', // Sombreado de área (Filler)
            pointBackgroundColor: '#fd7e14', 
            pointBorderColor: '#fff',
            pointHoverRadius: 7,
            tension: 0.35, // Coeficiente de interpolación de la curva (Curva de Bezier)
            fill: true
          }))
        };

        setDatosGrafico(configuracionDiseño);

        // Agregación de datos en cliente (Map-Reduce) para calcular el KPI Global
        // Programación defensiva: fallback a 0 si la posición del array no existe
        const sumaTotal = backendData.datasets[0]?.data.reduce((acumulador, valorActual) => acumulador + Number(valorActual), 0) || 0;
        setTotalEstimado(sumaTotal);

      } catch (err) {
        console.error("Fallo de red al solicitar métricas de recaudación:", err);
      } finally {
        setCargando(false);
      }
    };

    cargarAnaliticas();
  }, []);

  // Objeto inmutable de configuración de contexto de Chart.js
  const opcionesChart = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false 
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            // Formateo del tooltip interactivo
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
          display: false // Eje categórico limpio
        }
      }
    }
  };

  // Renderizado condicional asíncrono
  if (cargando) {
    return (
        <div className="text-center p-5 mt-5 text-huellitas" aria-label="Cargando panel de recaudación">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Procesando gráficos...</span>
            </div>
        </div>
    );
  }

  return (
    <div className="container mt-2 mb-5 animate-up" style={{ maxWidth: '1000px' }}>
      
      {/* Encabezado del KPI y Métricas */}
      <div className="mb-4">
        <h2 className="fw-bold text-huellitas mb-1">📈 Balance de Apadrinamientos</h2>
        <p className="text-muted mb-0">Control de ingresos y donaciones recurrentes por meses del año en curso</p>
      </div>

      <div className="row g-4">
        {/* Tarjeta de Resumen Rápido (KPI de Flujo de Caja) */}
        <div className="col-md-4">
          <div className="card card-huellitas p-4 bg-white shadow-sm h-100 d-flex flex-column justify-content-center border-0 rounded-4">
            <span className="text-muted small fw-bold text-uppercase tracking-wider mb-1" id="label-recaudacion">Recaudación Total Activa</span>
            <h2 className="display-5 fw-bold text-huellitas mb-2" aria-labelledby="label-recaudacion">
                {totalEstimado.toFixed(2)} €
            </h2>
            <div className="alert bg-naranja-claro text-naranja small rounded-3 p-2 mb-0 mt-2 d-flex align-items-center">
              <span aria-hidden="true" className="me-2 fs-5">🐾</span> 
              <span>Dinero recurrente mensual para el mantenimiento del refugio.</span>
            </div>
          </div>
        </div>

        {/* Instanciación del Canvas de Chart.js */}
        <div className="col-md-8">
          <div className="card card-huellitas p-4 bg-white shadow-sm border-0 rounded-4">
            <h5 className="fw-bold text-dark mb-4">Evolución de Ingresos</h5>
            <div style={{ height: '300px', width: '100%' }}>
              {datosGrafico && datosGrafico.labels?.length > 0 ? (
                // Renderizado nativo del lienzo HTML5
                <Line data={datosGrafico} options={opcionesChart} />
              ) : (
                <div className="d-flex h-100 justify-content-center align-items-center text-muted fst-italic bg-light rounded-3">
                    No se han registrado datos estadísticos de recaudación.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PanelRecaudacion;