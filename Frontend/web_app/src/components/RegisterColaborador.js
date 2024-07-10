import React, { useState } from 'react';
import axios from '../axiosConf';
import '../css/RegisterColaborador.css';

function RegisterColaborador({ onColaboradorAdded }) {

  // Atributos do colaborador
  const [fullname, setFullname] = useState('');
  const [position, setPosition] = useState('');
  const [admission_date, setAdmissionDate] = useState('');
  const [sector, setSector] = useState('');
  const [salary, setSalary] = useState('');

  // Função para adicionar um novo colaborador à base de dados
  const handleSubmit = async (event) => {
    event.preventDefault();

    const newColaborador = {
        fullname,
        position,
        admission_date,
        sector,
        salary
    };

    try {
      await axios.post('/colaboradores/', newColaborador);
      alert('Colaborador adicionado com sucesso!');
      // Reset nas variaveis de estado
      setFullname('');
      setPosition('');
      setAdmissionDate('');
      setSector('');
      setSalary('');

      // Chamada à função de callback para indicar ao componente pai, App.js, que é necessário atualizar a lista de colaboradores
      onColaboradorAdded();
    } catch (error) {
      console.error('Erro ao adicionar colaborador:', error);
      alert('Ocorreu um erro ao adicionar o colaborador, Por favor, tente novamente.');
    }
  };

  return (
    <div>
      <h2>Add Colaborador</h2>
      <form className="add-colaborador-form" onSubmit={handleSubmit}>
        <label> Fullname:</label>
        <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
        <label>Position:</label>
        <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} required />
        <label>Admission date:</label>
        <input type="date" value={admission_date} onChange={(e) => setAdmissionDate(e.target.value)} required />
        <label>Sector:</label>
        <input type="text" value={sector} onChange={(e) => setSector(e.target.value)} required />
        <label>Salary:</label>
        <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} required />
        <button type="submit">Add Colaborador</button>
      </form>
    </div>
  );
}

export default RegisterColaborador;
