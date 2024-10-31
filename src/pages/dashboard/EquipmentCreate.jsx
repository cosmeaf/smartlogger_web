import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../services/Connect';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadPage from '../../components/LoadPage';  // Usando sua página de carregamento

const EquipmentCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    initial_hour_machine: null,
    device_id: '', // ID do dispositivo selecionado
    device: '', // Dispositivo selecionado
  });
  const [devices, setDevices] = useState([]); // Dispositivos disponíveis
  const [loading, setLoading] = useState(true);  // Estado de carregamento
  const navigate = useNavigate();

  // Função para buscar dispositivos não alocados
  const fetchAvailableDevices = async () => {
    try {
      const data = await get('/api/devices?available=true');
      console.log("Dispositivos disponíveis:", data);
      setDevices(data);  // Alterado para `data` conforme solicitado
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dispositivos disponíveis:', error.message);
      toast.error('Falha ao buscar dispositivos disponíveis.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableDevices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Função para criar o equipamento
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se o dispositivo está selecionado e está disponível
    if (!formData.device_id) {
      toast.error('Por favor, selecione um dispositivo disponível.');
      return;
    }

    // Prepara os dados para envio
    const payload = {
      name: formData.name,
      model: formData.model || 'N/A', // Valor padrão caso o modelo não seja preenchido
      initial_hour_machine: formData.initial_hour_machine || 0, // Caso seja vazio, será 0
      device: formData.device_id,  // Dispositivo selecionado
    };

    try {
      console.log('Enviando dados para a API:', payload);
      await post('/api/equipments/', payload);
      toast.success('Equipamento criado com sucesso!');
      navigate('/dashboard/equipments');
    } catch (error) {
      console.error('Erro ao criar equipamento:', error);
      toast.error('Falha ao criar equipamento.');
    }
  };

  // Exibe a página de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return <LoadPage />;
  }

  // Exibe uma mensagem caso não haja dispositivos disponíveis
  if (!loading && devices.length === 0) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold text-blue-900 mb-6">Criar Novo Equipamento</h2>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold mb-4">Nenhum dispositivo disponível</h3>
          <p className="text-gray-600">No momento, não há dispositivos disponíveis para serem cadastrados em um novo equipamento. Por favor, adicione novos dispositivos ou libere dispositivos já cadastrados.</p>
          <button
            onClick={() => navigate('/dashboard/equipments')}
            className="mt-6 bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none"
          >
            Voltar para Equipamentos
          </button>
        </div>
      </div>
    );
  }

  // Exibe o formulário quando há dispositivos disponíveis
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">Criar Novo Equipamento</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nome do Equipamento */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Equipamento</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Modelo */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modelo</label>
            <input
              type="text"
              name="model"
              id="model"
              value={formData.model}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="N/A"
            />
          </div>

          {/* Horas Iniciais da Máquina */}
          <div>
            <label htmlFor="initial_hour_machine" className="block text-sm font-medium text-gray-700">Horas Iniciais da Máquina</label>
            <input
              type="number"
              name="initial_hour_machine"
              id="initial_hour_machine"
              value={formData.initial_hour_machine || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: 0.0"
            />
          </div>

          {/* Seleção de Dispositivo */}
          <div>
            <label htmlFor="device_id" className="block text-sm font-medium text-gray-700">Dispositivo</label>
            <select
              name="device_id"
              id="device_id"
              value={formData.device_id}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Selecione um dispositivo</option>
              {devices.map((device) => (
                <option key={device.device_id} value={device.device_id}>
                  {device.device_id} - {device.model}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="submit"
            className="bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EquipmentCreate;
