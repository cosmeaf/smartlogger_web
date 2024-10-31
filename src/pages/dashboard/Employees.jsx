import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { get, del } from '../../services/Connect';
import LoadPage from '../../components/LoadPage';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await get('/api/employees');
        setEmployees(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error.message);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const openDeleteModal = (employeeId) => {
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
          await del(`/api/employees/${employeeId}/`);
          Swal.fire('Deletado!', 'O funcionário foi deletado.', 'success');
          setEmployees(employees.filter((employee) => employee.id !== employeeId));
        } catch (error) {
          Swal.fire('Erro!', 'Falha ao deletar o funcionário.', 'error');
        }
      }
    });
  };

  if (loading) {
    return <LoadPage />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-900">Lista de Funcionários</h2>
        <Link to="/dashboard/employees/create" className="bg-blue-900 text-white py-2 px-4 rounded-md flex items-center">
          <FaPlus className="mr-2" /> Novo Funcionário
        </Link>
      </div>

      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nome</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">E-mail</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Telefone</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Cargo</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {employees.map((employee) => (
              <tr key={employee.id} className="bg-gray-100 border-b">
                <td className="text-left py-3 px-4">{`${employee.first_name} ${employee.last_name}`}</td>
                <td className="text-left py-3 px-4">{employee.email}</td>
                <td className="text-left py-3 px-4">{employee.phone}</td>
                <td className="text-left py-3 px-4">{employee.position}</td>
                <td className="text-left py-3 px-4">
                  <div className="flex space-x-2">
                    <Link to={`/dashboard/employees/${employee.id}/edit`} className="text-blue-500">
                      <FaEdit className="inline-block" />
                    </Link>
                    <button className="text-red-500" onClick={() => openDeleteModal(employee.id)}>
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

export default Employees;
