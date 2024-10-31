import React, { useState, useContext } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';
import LoadPage from '../components/LoadPage';

const Signin = () => {
  const { handleLogin } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: 'cosme.alex@gmail.com', password: 'qweasd32' });
  const [loading, setLoading] = useState(false); // Inicializando como false
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Definindo loading como true ao enviar o formulário
    try {
      await handleLogin(credentials);
      Swal.fire({
        icon: 'success',
        title: 'Login bem-sucedido!',
        text: 'Bem-vindo de volta!',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao fazer login',
        text: 'Verifique suas credenciais.',
      });
    } finally {
      setLoading(false); // Parando o carregamento após o processo
    }
  };

  // Alternar entre mostrar/ocultar senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return loading ? ( // Renderiza a página de carregamento apenas se estiver em loading
    <LoadPage />
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-900">Login</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Campo de Email */}
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

          {/* Campo de Senha com botão de exibir/ocultar */}
          <div className="relative">
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

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 mt-4 text-white bg-blue-900 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Entrar
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <Link to="/signup" className="text-blue-600 hover:underline">
            Esqueceu sua senha?
          </Link>
        </div>

        {/* Link para registro */}
        <div className="mt-2 text-sm text-center">
          <span>Não tem uma conta?</span>{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Registre-se
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
