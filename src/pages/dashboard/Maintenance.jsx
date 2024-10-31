import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { get, patch, del } from '../../services/Connect';
import LoadPage from '../../components/LoadPage';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

const Maintenance = () => {
  const { equipmentId } = useParams(); 
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMaintenanceRecords = async () => {
    try {
      const data = await get(`/api/maintenances/`);
      const filteredMaintenances = data.filter(
        (maintenance) => maintenance.equipment.id === parseInt(equipmentId)
      );
      setMaintenanceRecords(filteredMaintenances);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar manutenções:', error.message);
      setLoading(false);
      toast.error('Erro ao buscar registros de manutenção');
    }
  };

  useEffect(() => {
    fetchMaintenanceRecords();
    const intervalId = setInterval(() => {
      fetchMaintenanceRecords();
    }, 30000);
    return () => clearInterval(intervalId);
  }, [equipmentId]);

  const handleResetHours = async (maintenanceId) => {
    const maintenanceRecord = maintenanceRecords.find(record => record.id === maintenanceId);
    if (maintenanceRecord) {
      const alarmHours = maintenanceRecord.alarm_hours;
      const payload = { worked_hours: 0, alarm_hours: alarmHours, remaining_hours: alarmHours };
      try {
        await patch(`/api/maintenances/${maintenanceId}/`, payload);
        const updatedRecords = maintenanceRecords.map((maintenance) =>
          maintenance.id === maintenanceId
            ? { ...maintenance, worked_hours: 0, remaining_hours: alarmHours }
            : maintenance
        );
        setMaintenanceRecords(updatedRecords);
        toast.success('Horas de uso zeradas com sucesso!');
      } catch (error) {
        console.error('Erro ao zerar horas de uso da peça:', error.message);
        toast.error('Erro ao zerar horas de uso da peça');
      }
    }
  };

  const handleDelete = async (maintenanceId) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await del(`/api/maintenances/${maintenanceId}/`);
          setMaintenanceRecords(
            maintenanceRecords.filter((maintenance) => maintenance.id !== maintenanceId)
          );
          toast.success('Manutenção removida com sucesso!');
        } catch (error) {
          console.error('Erro ao deletar manutenção:', error.message);
          toast.error('Erro ao deletar manutenção');
        }
      }
    });
  };

  if (loading) {
    return <LoadPage />;
  }

  if (maintenanceRecords.length === 0) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold text-blue-900 mb-6">Manutenções do Equipamento</h2>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold mb-4">Nenhuma manutenção registrada para este equipamento</h3>
          <p className="text-gray-600">
            O equipamento selecionado não possui manutenções registradas no momento. 
            Você pode adicionar uma nova manutenção ou voltar para a lista de equipamentos.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/dashboard/equipments')}
              className="bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none mr-4"
            >
              Voltar para Equipamentos
            </button>
            <Link
              to={`/dashboard/maintenance/${equipmentId}/create`}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500 focus:outline-none"
            >
              Adicionar Nova Manutenção
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-900">Manutenções do Equipamento</h2>
        <Link
          to={`/dashboard/maintenance/${equipmentId}/create`}
          className="bg-blue-900 text-white py-2 px-4 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Nova Manutenção
        </Link>
      </div>

      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nome da Peça</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">O.S.</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Relatório</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Horas da Peça</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Horas para Alarme</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Horas Restantes</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {maintenanceRecords.map((maintenance) => (
              <tr
                key={maintenance.id}
                className={`bg-gray-100 border-b ${maintenance.os ? 'bg-red-100' : ''}`}
              >
                <td className="text-left py-3 px-4">{maintenance.name}</td>
                <td className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={maintenance.os}
                    onChange={() => handleOSChange(maintenance.id, maintenance.os)}
                    className="w-6 h-6"
                  />
                </td>
                <td className="text-left py-3 px-4">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-700">
                    Relatório
                  </button>
                </td>
                <td className="text-left py-3 px-4">{maintenance.worked_hours} h</td>
                <td className="text-left py-3 px-4">{maintenance.alarm_hours} h</td>
                <td className="text-left py-3 px-4">{maintenance.remaining_hours} h</td>
                <td className="text-left py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-700"
                      onClick={() => handleResetHours(maintenance.id)}
                    >
                      Zerar
                    </button>
                    <Link
                      to={`/dashboard/maintenance/${maintenance.id}/edit`}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-700 flex items-center justify-center"
                    >
                      <FaEdit className="text-white" />
                    </Link>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-700"
                      onClick={() => handleDelete(maintenance.id)}
                    >
                      <FaTrash className="inline-block" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Maintenance;
