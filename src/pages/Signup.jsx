import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'; // Ícones para mostrar/ocultar senha
import LoadPage from '../components/LoadPage'; // Importando o componente LoadPage

const Signup = () => {
  const { handleSignup } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Exibir/Ocultar senha
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Exibir/Ocultar confirmação de senha

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (credentials.password !== credentials.password2) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao registrar',
        text: 'As senhas não coincidem. Verifique suas credenciais.',
      });
      return;
    }

    setLoading(true);
    try {
      await handleSignup(credentials);
      Swal.fire({
        icon: 'success',
        title: 'Cadastro bem-sucedido!',
        text: 'Bem-vindo! Agora você pode fazer login.',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao registrar',
        text: 'Verifique os dados e tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (loading) {
    return <LoadPage />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-900">Registrar</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {/* Primeira linha: First Name e Last Name */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                Primeiro Nome
              </label>
              <input
                type="text"
                placeholder="Primeiro Nome"
                value={credentials.first_name}
                onChange={(e) => setCredentials({ ...credentials, first_name: e.target.value })}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                Sobrenome
              </label>
              <input
                type="text"
                placeholder="Sobrenome"
                value={credentials.last_name}
                onChange={(e) => setCredentials({ ...credentials, last_name: e.target.value })}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Segunda linha: Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Terceira linha: Password e Confirm Password */}
          <div className="flex space-x-4">
            <div className="w-1/2 relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {/* Botão para mostrar/ocultar senha */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-700 mt-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-700 mt-5" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="w-1/2 relative">
              <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirmar Senha"
                value={credentials.password2}
                onChange={(e) => setCredentials({ ...credentials, password2: e.target.value })}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {/* Botão para mostrar/ocultar confirmação de senha */}
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-700 mt-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-700 mt-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Botão de Registro */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 mt-4 text-white bg-blue-900 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Registrar
          </button>
        </form>

        {/* Links de Recuperar senha e Já tenho conta */}
        <div className="mt-4 text-sm flex justify-between">
          <Link to="/signin" className="text-blue-600 hover:underline">
            Esqueceu sua senha?
          </Link>
          <Link to="/signin" className="text-blue-600 hover:underline">
            Já tem uma conta? Faça login.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
