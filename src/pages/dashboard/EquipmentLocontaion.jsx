import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { get } from '../../services/Connect';
import 'leaflet/dist/leaflet.css';
import { useParams } from 'react-router-dom';
import LoadPage from '../../components/LoadPage';

// Importe as imagens diretamente
import tractorIconImg from '../../assets/tractor.png';
import forkliftIconImg from '../../assets/electric-forklift.png';

// Definindo os ícones
const tractorIcon = new L.Icon({
  iconUrl: tractorIconImg,
  iconSize: [38, 38],
});

const forkliftIcon = new L.Icon({
  iconUrl: forkliftIconImg,
  iconSize: [38, 38],
});

const EquipmentLocation = () => {
  const { id } = useParams(); // Captura o ID da URL
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const data = await get(`/api/devices/${id}`);
        setDevice(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dispositivo:', error.message);
        setLoading(false);
      }
    };

    fetchDevice();
  }, [id]);

  if (loading) {
    return <LoadPage />;
  }

  const isTractor = device.model.includes('Tractor');
  const equipmentIcon = isTractor ? tractorIcon : forkliftIcon;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">Localização do Equipamento</h2>

      <MapContainer
        center={[device.latitude, device.longitude]}
        zoom={15}
        style={{ height: '700px', width: '100%' }} // Aqui você pode ajustar a altura
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[device.latitude, device.longitude]} icon={equipmentIcon}>
          <Popup>
            {device.device_id} - {isTractor ? 'Trator' : 'Empilhadeira'}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default EquipmentLocation;
