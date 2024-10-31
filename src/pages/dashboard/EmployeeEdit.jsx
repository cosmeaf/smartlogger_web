import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, patch } from '../../services/Connect';
import LoadPage from '../../components/LoadPage';
import Swal from 'sweetalert2';

const EmployeeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    hire_date: '',
    image: null,
    equipment: '',
  });
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchEmployeeAndEquipments = async () => {
      try {
        const employeeData = await get(`/api/employees/${id}/`);
        const equipmentsData = await get('/api/equipments/');
        // Garantindo que campos nulos não sejam passados como null
        setFormData({
          ...employeeData,
          first_name: employeeData.first_name || '',
          last_name: employeeData.last_name || '',
          email: employeeData.email || '',
          phone: employeeData.phone || '',
          address: employeeData.address || '',
          position: employeeData.position || '',
          hire_date: employeeData.hire_date || '',
          equipment: employeeData.equipment ? employeeData.equipment.id : '',
        });
        setEquipments(equipmentsData);
        setPreviewImage(employeeData.image);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar funcionário ou equipamentos:', error);
        setLoading(false);
      }
    };
    fetchEmployeeAndEquipments();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      updatedFormData.append(key, formData[key]);
    });

    try {
      await patch(`/api/employees/${id}/`, updatedFormData);
      Swal.fire('Sucesso', 'Funcionário atualizado com sucesso!', 'success');
      navigate('/dashboard/employees');
    } catch (error) {
      Swal.fire('Erro', 'Falha ao atualizar funcionário', 'error');
    }
  };

  if (loading) {
    return <LoadPage />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">Editar Funcionário</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name || ''}
              onChange={handleChange}
              className="block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name || ''}
              onChange={handleChange}
              className="block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
            <input
              type="text"
              name="position"
              value={formData.position || ''}
              onChange={handleChange}
              className="block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="hire_date" className="block text-sm font-medium text-gray-700 mb-1">Data de Contratação</label>
            <input
              type="date"
              name="hire_date"
              value={formData.hire_date || ''}
              onChange={handleChange}
              className="block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 mb-1">Equipamento</label>
            <select
              name="equipment"
              value={formData.equipment || ''}
              onChange={handleChange}
              className="block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            >
              <option value="">Selecione um Equipamento</option>
              {equipments.map((equipment) => (
                <option key={equipment.id} value={equipment.id}>
                  {equipment.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Foto de Perfil</label>
            {previewImage && (
              <div className="mb-4">
                <img
                  src={previewImage}
                  alt="Foto de Perfil"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-900 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-800 focus:outline-none"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeEdit;
