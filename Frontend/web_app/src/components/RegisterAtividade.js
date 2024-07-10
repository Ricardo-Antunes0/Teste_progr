import React, { useState, useEffect } from 'react';
import axios from '../axiosConf';
import '../css/RegisterAtividade.css';

function RegisterAtividade({ onAtividadeAdded }) {

  // Atributos da atividade
  const [description, setDescription] = useState("");
  const [colaborador, setColaborador] = useState("");
  const [status, setStatus] = useState("pendente");
  // Lista de colaboradores
  const [list_colaboradores, setListColaboradores] = useState([]);


  useEffect(() => {
    // Função para obter todos os colaboradores
    const fetchColaboradores = async () => {
      try {
        const response = await axios.get("/colaboradores/");
        setListColaboradores(response.data);
      } catch (error) {
        console.error("Error fetching colaboradores:", error);
      }
    };

    fetchColaboradores();
  }, []);


  // Função para adicionar uma nova atividade à base de dados
  const handleSubmit = async (event) => {
    event.preventDefault();

    const newAtividade= {
        description,
        colaborador,
        status,
    };

    try {
      await axios.post('/atividades/', newAtividade);
      alert('Atividade adicionada com sucesso!');
      // Reset nas variaveis de estado
      setDescription("");
      setColaborador("");
      setStatus("pendente");

      // Chamada à função de callback para indicar ao componente pai que é necessário atualizar a lista de atividades
      onAtividadeAdded();
    } catch (error) {
      console.error('Erro ao adicionar a atividade:', error);
      alert('Ocorreu um erro ao adicionar a atividade. Por favor, tente novamente.');
    }
  };


  return (
    <div>
      <h2>Add Atividade</h2>
      <form className="add-atividade-form" onSubmit={handleSubmit}>
        <label> Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        <label> Select a colaborador:</label>
        <select value={colaborador} onChange={(e) => setColaborador(e.target.value)} required>
          <option value="" disabled>Select</option>
          {list_colaboradores.map((Colaborador) => (
            <option key={Colaborador.id} value={Colaborador.id}>
              {Colaborador.fullname}
            </option>
          ))}
        </select>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="pendente">Pendente</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluida">Concluída</option>
        </select>
        <button type="submit">Add Atividade</button>
      </form>
    </div>
  );
}

export default RegisterAtividade;
