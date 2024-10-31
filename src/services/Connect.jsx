import api from './Api';

// Função GET
export const get = async (url, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao fazer GET');
  }
};

// Função POST
export const post = async (url, data) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao fazer POST');
  }
};

// Função PUT
export const put = async (url, data) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao fazer PUT');
  }
};

// Função PATCH
export const patch = async (url, data) => {
  // Verificando os dados enviados
  console.log("Dados enviados para PATCH: ", JSON.stringify(data, null, 2));

  try {
    // Realizando a requisição PATCH
    const response = await api.patch(url, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        // Adicione qualquer outro cabeçalho, como autenticação, se necessário
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Exemplo de token, se aplicável
      },
    });

    // Verificando a resposta da API
    console.log("Resposta da API (PATCH):", response);
    return response.data;
  } catch (error) {
    // Exibindo o erro detalhado no console
    console.error("Erro no PATCH:", error.response || error.message);

    // Lançando erro com mensagem clara
    throw new Error(error.response?.data?.message || 'Erro ao fazer PATCH');
  }
};



// Função DELETE
export const del = async (url) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao fazer DELETE');
  }
};
