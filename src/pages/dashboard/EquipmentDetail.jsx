import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { get } from '../../services/Connect';

const EquipmentDetail = () => {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      const data = await get(`/api/equipments/${id}`);
      setEquipment(data);
    };
    fetchEquipment();
  }, [id]);

  if (!equipment) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Detalhes do Equipamento</h2>
      <p><strong>Nome:</strong> {equipment.name}</p>
      <p><strong>Horas de Trabalho:</strong> {equipment.work_hours}</p>
      <p><strong>Horas Restantes:</strong> {equipment.remaining_hours}</p>
      {/* Adicione outros campos conforme necessário */}
    </div>
  );
};

export default EquipmentDetail;
