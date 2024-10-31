import React from 'react';
import Swal from 'sweetalert2';
import { del } from '../../services/Connect';

const EmployeeDeleteModal = ({ employeeId, onSuccess }) => {
  const handleDelete = () => {
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
          if (onSuccess) onSuccess(); // Chama a função de sucesso
        } catch (error) {
          Swal.fire('Erro!', 'Falha ao deletar o funcionário.', 'error');
        }
      }
    });
  };

  return (
    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700" onClick={handleDelete}>
      Excluir Funcionário
    </button>
  );
};

export default EmployeeDeleteModal;
