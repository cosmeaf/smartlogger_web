import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Main from './pages/dashboard/Main';
import Dashboard from './pages/dashboard/Dashboard';
import Equipments from './pages/dashboard/Equipments';
import EquipmentEdit from './pages/dashboard/EquipmentEdit';
import EquipmentDetail from './pages/dashboard/EquipmentDetail';
import EquipmentCreate from './pages/dashboard/EquipmentCreate';
import EquipmentLocontaion from './pages/dashboard/EquipmentLocontaion';
import Devices from './pages/dashboard/Devices';
import Employees from './pages/dashboard/Employees';
import EmployeeCreate from './pages/dashboard/EmployeeCreate';
import EmployeeEdit from './pages/dashboard/EmployeeEdit';
import PrivateRoute from './components/PrivateRoute';
import AuthProvider from './context/AuthContext';
import Maintenance from './pages/dashboard/Maintenance';
import MaintenanceCreate from './pages/dashboard/MaintenanceCreate';
import MaintenanceEdit from './pages/dashboard/MaintenanceEdit';


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />

          {/* Rotas Protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Main />} />
              <Route path="devices" element={<Devices />} />

              {/* Rotas de Equipamentos */}
              <Route path="equipments" element={<Equipments />} />
              <Route path="equipments/create" element={<EquipmentCreate />} />
              <Route path="equipments/:id/edit" element={<EquipmentEdit />} />
              <Route path="equipments/:id/detail" element={<EquipmentDetail />} />
              <Route path="equipments/location/:id/" element={<EquipmentLocontaion />} />
              {/* Rotas de Manutenção */}
              <Route path="maintenance/:equipmentId" element={<Maintenance />} />
              <Route path="maintenance/:equipmentId/create" element={<MaintenanceCreate />} />
              <Route path="maintenance/:id/edit" element={<MaintenanceEdit />} />
              <Route path="employees" element={<Employees />} />
              <Route path="employees/create" element={<EmployeeCreate />} />
              <Route path="employees/:id/edit" element={<EmployeeEdit />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
