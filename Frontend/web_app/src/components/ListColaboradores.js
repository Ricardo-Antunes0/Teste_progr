// No arquivo ListColaboradores.js

import React, { useState, useEffect } from "react";
import axios from '../axiosConf';
import '../css/ListColaboradores.css';
import ColaboradorDetails from './ColaboradorDetails';

function ListColaboradores({ reload }) {
    const [colaboradores, setColaboradores] = useState([]); // Estado para a lista de colaboradores
    const [selectedColaborador, setSelectedColaborador] = useState(null); // Estado para o colaborador selecionado na tabela
    const [showPopup, setShowPopup] = useState(false); // Estado para mostrar/ocultar um pop up com os detalhes do colaborador
    const [selectedSector, setSelectedSector] = useState(''); // Estado para o sector selecionado ao filtrar
    const [currentPage, setCurrentPage] = useState(1); // Estado para o número da página atual
    const itemsPerPage = 5; // Número de colaboradores por página
    const [totalPages, setTotalPages] = useState(1); // Estado para o total de páginas disponíveis
    const [allSectors, setAllSectors] = useState([]); // Estado para guardar todos os setores para serem apresentados no filtro
    
    // Chamada à função fetchColaboradores() quando a página é carregada e sempre que o estado reload mudar
    useEffect(() => {
        // Função para obter todos os colaboradores
        const fetchColaboradores = async () => {
            try {
                const response = await axios.get('/colaboradores/', {
                    params: {
                        sector: selectedSector,
                        page: currentPage,
                        page_size: itemsPerPage
                    }
                });
                console.log(response.data);
                setTotalPages(Math.ceil(response.data.count / itemsPerPage)); // Define o número total de páginas com base no total de colaboradores
                setColaboradores(response.data.results); // Atualiza a lista de colaboradores com os resultados paginados
            } catch (error) {
                console.error('Error fetching colaboradores:', error);
                alert('Ocorreu um erro ao obter a lista de colaboradores.');
            }
        };

        fetchColaboradores();
    }, [reload, selectedSector, currentPage]);

    // Objetivo: Obter todos os setores existentes
    // Atualizar sempre que é adicionado um novo colaborador, ou seja, sempre que o estado reload mudar
    useEffect(() => {
        // Função para obter todos os setores existentes
        const fetchAllSectors = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/colaboradores/');
                setAllSectors(Array.from(new Set(response.data.map(colaborador => colaborador.sector))));
            } catch (error) {
                console.error('Error fetching all sectors:', error);
                alert('Ocorreu um erro ao obter a lista de setores.');
            }
        };

        fetchAllSectors();
    }, [reload]);


    // Função para lidar com a seleção de um colaborador
    const handleClick = (colaborador) => {
        setSelectedColaborador(colaborador); // Atualiza o estado com o colaborador selecionado
        setShowPopup(true); // Mostra o popup com os detalhes do colaborador
    };

    // Função para fechar o popup
    const handleClosePopup = () => {
        setShowPopup(false); // Oculta o popup com os detalhes do colaborador
    };

    // Função para lidar com a seleção de um setor
    const handleSector = (event) => {
        const sector = event.target.value;
        setSelectedSector(sector);
        setCurrentPage(1); // Reinicia para a primeira página ao mudar o setor
    };

    // Função para lidar com a paginação
    const handlePage = (page) => {
        setCurrentPage(page); // Atualiza o número da página atual
    };

    return (
        <div className="list-colaboradores-container">
            <div className="filter-container">
                <label>Filter by: </label>
                <label htmlFor="sector-filter">Sector:</label>
                <select id="sector-filter" value={selectedSector} onChange={handleSector}>
                    <option value="">All</option>
                    {allSectors.map(sector => (
                        <option key={sector} value={sector}>{sector}</option>
                    ))}
                </select>
            </div>
            <div className="table-container">
                <h2>List of Colaboradores</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Position</th>
                            <th>Admission Date</th>
                            <th>Sector</th>
                            <th>Salary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {colaboradores.map((colaborador) => (
                            <tr key={colaborador.id} onClick={() => handleClick(colaborador)}>
                                <td>{colaborador.fullname}</td>
                                <td>{colaborador.position}</td>
                                <td>{colaborador.admission_date}</td>
                                <td>{colaborador.sector}</td>
                                <td>{colaborador.salary}€</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showPopup && (
                    <ColaboradorDetails
                        colaborador={selectedColaborador}
                        onClose={handleClosePopup}
                    />
                )}
                <div className="pagination">
                    <button onClick={() => handlePage(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>{currentPage}</span>
                    <button onClick={() => handlePage(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ListColaboradores;
