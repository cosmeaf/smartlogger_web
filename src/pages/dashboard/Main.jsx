import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { get } from '../../services/Connect';
import LoadPage from '../../components/LoadPage';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const Main = () => {
  const [statisticsCardsData, setStatisticsCardsData] = useState([]);
  const [statisticsChartsData, setStatisticsChartsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStatisticsCardsData = async () => {
    try {
      const devices = await get('/api/devices/');
      const equipments = await get('/api/equipments/');
      const maintenances = await get('/api/maintenances/');
      const employees = await get('/api/employees/');

      const cardsData = [
        {
          title: 'Dispositivos',
          value: devices.length,
          footer: {
            color: 'text-green-500',
            value: `Ativos: ${devices.filter(device => device.status === 'active').length}`,
            label: 'dispositivos ativos',
          },
          icon: '📱',
        },
        {
          title: 'Equipamentos',
          value: equipments.length,
          footer: {
            color: 'text-blue-500',
            value: `Monitorados: ${equipments.length}`,
            label: 'equipamentos',
          },
          icon: '🔧',
        },
        {
          title: 'Manutenções',
          value: maintenances.length,
          footer: {
            color: 'text-red-500',
            value: `Pendentes: ${maintenances.filter(m => !m.os).length}`,
            label: 'manutenções pendentes',
          },
          icon: '🛠️',
        },
        {
          title: 'Funcionários',
          value: employees.length,
          footer: {
            color: 'text-gray-500',
            value: `Registrados: ${employees.length}`,
            label: 'funcionários',
          },
          icon: '👷',
        }
      ];

      setStatisticsCardsData(cardsData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const fetchStatisticsChartsData = async () => {
    try {
      const devices = await get('/api/devices/');
      const equipments = await get('/api/equipments/');
      const maintenances = await get('/api/maintenances/');
      const employees = await get('/api/employees/');

      const devicesChart = {
        title: 'Dispositivos por Equipamento',
        description: 'Quantidade de dispositivos por tipo de equipamento',
        footer: 'Atualizado recentemente',
        chart: {
          type: 'bar',
          height: 220,
          series: [
            {
              name: 'Dispositivos',
              data: equipments.map(equipment => equipment.devices_count || 0),
            }
          ],
          options: {
            xaxis: {
              categories: equipments.map(equipment => equipment.name),
            },
            colors: ['#3498db'],
          },
        },
      };

      const workedHoursChart = {
        title: 'Horas Trabalhadas por Equipamento',
        description: 'Horas trabalhadas por cada equipamento',
        footer: 'Atualizado recentemente',
        chart: {
          type: 'line',
          height: 220,
          series: [
            {
              name: 'Horas Trabalhadas',
              data: equipments.map(equipment => equipment.worked_hours || 0),
            }
          ],
          options: {
            xaxis: {
              categories: equipments.map(equipment => equipment.name),
            },
            colors: ['#36a2eb'],
          },
        },
      };

      const pendingMaintenancesChart = {
        title: 'Manutenções Pendentes',
        description: 'Quantidade de manutenções pendentes por equipamento',
        footer: 'Atualizado recentemente',
        chart: {
          type: 'pie',
          height: 220,
          series: [
            {
              name: 'Manutenções Pendentes',
              data: equipments.map(equipment => maintenances.filter(m => m.equipment === equipment.id && !m.os).length),
            }
          ],
          options: {
            labels: equipments.map(equipment => equipment.name),
            colors: ['#e74c3c', '#f39c12', '#8e44ad', '#3498db', '#2ecc71'],
          },
        },
      };

      const employeesByEquipmentChart = {
        title: 'Funcionários por Equipamento',
        description: 'Número de funcionários associados a cada equipamento',
        footer: 'Atualizado recentemente',
        chart: {
          type: 'pie',
          height: 220,
          series: [
            {
              name: 'Funcionários',
              data: equipments.map(equipment => employees.filter(emp => emp.equipment === equipment.id).length),
            }
          ],
          options: {
            labels: equipments.map(equipment => equipment.name),
            colors: ['#2ecc71', '#3498db', '#f1c40f', '#e67e22', '#e74c3c'],
          },
        },
      };

      setStatisticsChartsData([devicesChart, workedHoursChart, pendingMaintenancesChart, employeesByEquipmentChart]);
    } catch (error) {
      console.error('Erro ao buscar dados dos gráficos:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchStatisticsCardsData(), fetchStatisticsChartsData()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const createChart = (chartData) => {
    const { type, height, series, options } = chartData.chart;
    const data = {
      labels: options.labels || options.xaxis?.categories,
      datasets: series.map(serie => ({
        label: serie.name,
        data: serie.data,
        backgroundColor: options.colors || 'rgba(75, 192, 192, 0.6)',
        borderColor: options.colors || 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: options.fill || true,
      })),
    };
    const ChartComponent = type === 'bar' ? Bar : type === 'line' ? Line : Pie;
    return <ChartComponent data={data} options={options} height={height} />;
  };

  if (loading) {
    return <LoadPage />;
  }

  return (
    <div className="min-h-screen bg-blue-gray-50/50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {statisticsCardsData.map((card, index) => (
          <div
            key={index}
            className={`bg-blue-900 shadow-lg rounded-lg p-4 flex items-center justify-between text-white`}
          >
            <div>
              <p className="text-sm">{card.title}</p>
              <h2 className="text-2xl font-bold">{card.value}</h2>
              <p className={`text-sm ${card.footer.color}`}>
                {card.footer.value} <span>{card.footer.label}</span>
              </p>
            </div>
            <div className="bg-white rounded-full p-3">
              <span className="h-6 w-6 text-blue-900">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {statisticsChartsData.map((chart, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">{chart.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{chart.description}</p>
            {createChart(chart)}
            <p className="text-xs text-gray-400 mt-4">{chart.footer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
