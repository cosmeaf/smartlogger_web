import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../../services/Connect';
import Swal from 'sweetalert2';

const EmployeeCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    hire_date: '',
    profile_picture: null,
    equipment: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profile_picture: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = new FormData();
    for (const key in formData) {
      if (formData[key] !== '' && formData[key] !== null) {
        payload.append(key, formData[key]);
      }
    }
  
    console.log("Payload enviado:", payload);
  
    try {
      await post('/api/employees/', payload);
      Swal.fire('Sucesso', 'Funcionário criado com sucesso!', 'success');
      navigate('/dashboard/employees');
    } catch (error) {
      Swal.fire('Erro', `Falha ao criar funcionário: ${error.message}`, 'error');
      console.error("Erro ao criar funcionário:", error);
    }
  };
  
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">Novo Funcionário</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
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
              value={formData.last_name}
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
              value={formData.email}
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
              value={formData.phone}
              onChange={handleChange}
              className="block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700 mb-1">Foto de Perfil</label>
          <input
            type="file"
            name="profile_picture"
            onChange={handleFileChange}
            className="block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm"
          />
        </div>

        <div className="mt-6">
          <button type="submit" className="bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800">
            Salvar Funcionário
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeCreate;
