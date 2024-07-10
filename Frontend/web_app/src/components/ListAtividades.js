import React,{ useState, useEffect } from "react";
import axios from '../axiosConf';
import AtividadeDetails from './AtividadeDetails';
import '../css/ListAtividades.css';


function ListAtividades({reload}){
    const [Atividades, setAtividades] = useState([]);  // Estado para a lista de atividades
    const [selectedAtividade, setSelectedAtividade] = useState(null); // Estado para a atividade selecionada
    const [showPopup, setShowpopup] = useState(false);  // Estado para mostrar/ocultar um pop up com os detalhes da atividade
    const [selectedColaborador, setSelectedColaborador] = useState(''); // Estado para o colaborador selecionado ao filtrar
    const [selectedStatus, setSelectedStatus] = useState(''); // Estado para o status selecionado ao filtrar
    const [currentPage, setCurrentPage] = useState(1); // Estado para o número da página atual
    const itemsPerPage = 5; // Número de atividades por página
    const [totalPages, setTotalPages] = useState(1); // Estado para o total de páginas disponíveis
    const [allColaboradores, setAllColaboradores] = useState([]); // Estado para guardar todos os colaboradores para serem apresentados no filtro
    


    // Chamada à função fetchAtividades() sempre que a variável reload mudar
    useEffect(() => {
        // Função para obter todos as atividades
        const fetchAtividades = async () => {
            try {
                const response = await axios.get('/atividades/', {
                    params: {
                        colaborador: selectedColaborador,
                        status: selectedStatus,
                        page: currentPage,
                        page_size: itemsPerPage
                    }
                });
                // Definir o número total de páginas com base no total de atividades
                setTotalPages(Math.ceil(response.data.count / itemsPerPage));
                setAtividades(response.data.results);
            } catch (error) {
                console.error('Error fetching Atividades:', error);
                alert('Ocorreu um erro ao obter a lista de atividades.');
            }
        };

        fetchAtividades();
    }, [reload, selectedColaborador, selectedStatus, currentPage]);


    // Objetivo: Obter todos os colaboradores com atividades
    // Atualizar sempre que é adicionado uma nova atividade
    useEffect(() => {
        // Função para obter todos os colaboradores existentes
        const fetchAllColaboradores = async () => {
            try {
                const response = await axios.get('/atividades/');
                // Usar um Map para garantir que os colaboradores são únicos
                const colaboradoresMap = new Map();

                response.data.forEach(atividade => {
                    // Verificar se o colaborador já foi adicionado ao Map
                    if (!colaboradoresMap.has(atividade.colaborador)) {
                        colaboradoresMap.set(atividade.colaborador, {
                            id: atividade.colaborador,
                            fullname: atividade.colaborador_fullname
                        });
                    }
                });
                
                setAllColaboradores(Array.from(colaboradoresMap.values()));
            } catch (error) {
                console.error('Error fetching colaboradores:', error);
                alert('Ocorreu um erro ao obter a lista de colaboradores.');
            }
        };

        fetchAllColaboradores();
    }, [reload]);


    // Função para lidar com a seleção de uma atividade
    const handleClick = (atividade) => {
        setSelectedAtividade(atividade); // Atualiza o estado com a atividade selecionada
        setShowpopup(true); // Mostra o popup com os detalhes da atividade 
    }

    const handleClosePopup = () => {
        setShowpopup(false); // Oculta o popup com os detalhes da atividade
    }

    // Função para marcar uma atividade como concluída
    const handleConclusion = async () => {
        try {
            const updatedAtividade = {
                id: selectedAtividade.id,
                description: selectedAtividade.description,
                colaborador: selectedAtividade.colaborador,
                colaborador_fullname: selectedAtividade.colaborador_fullname,
                status: 'concluida',
            };
            await axios.put(`/atividades/${selectedAtividade.id}/`, updatedAtividade);
            setShowpopup(false); // Fechar o popup após a conclusão
            window.location.reload(); // Recarregar a página após a conclusão
        } catch (error) {
            console.error('Error marking activity as completed:', error);
            alert('An error occurred while marking the activity as completed.');
        }
    };

    // Função auxiliar para obter o status legível de uma atividade
    const getStatusLabel = (status) => {
        switch (status) {
            case 'pendente':
                return 'Pendente';
            case 'em_andamento':
                return 'Em Andamento';
            case 'concluida':
                return 'Concluída';
            default:
                return status;
        }
    };

    const handleStatus = (event) => {
        const status = event.target.value;
        setSelectedStatus(status);
        setCurrentPage(1); // Reinicia para a primeira página ao mudar o setor
    }

    const handleColaborador = (event) => {
        const colaborador = event.target.value;
        setSelectedColaborador(colaborador);
        setCurrentPage(1); // Reinicia para a primeira página ao mudar o colaborador
    }

    const handlePage = (page) => {
        setCurrentPage(page); // Atualiza o número da página atual
    }


    return (    
        <div className="list-atividades-container">
            <div className="filter-container">
                <label>Filter by: </label>
                <label htmlFor="colaborador-filter">Colaborador:</label>
                <select id="colaborador-filter" value={selectedColaborador} onChange={handleColaborador}>
                    <option value="">All</option>
                    {allColaboradores.map(colaborador => (
                        <option key={colaborador.id} value={colaborador.id}>
                            {colaborador.fullname}
                        </option>
                    ))}
                </select>
                <label htmlFor="status-filter">Status:</label>
                <select id="status-filter" value={selectedStatus} onChange={handleStatus}>
                    <option value="">All</option>
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluida">Concluída</option>
                </select>
            </div>
            <div className="table-container">
                <h2>List of Activities</h2>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Colaborador</th>
                        <th>Status</th>
                    </tr>   
                </thead>
                <tbody>
                    {Atividades.map((atividade) => (
                        <tr key={atividade.id} onClick={() => handleClick(atividade)}>
                            <td>{atividade.description }</td>
                            <td>{atividade.colaborador_fullname}</td>
                            <td>{getStatusLabel(atividade.status)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            { showPopup && (
                <AtividadeDetails
                    atividade={selectedAtividade}
                    onClose={handleClosePopup}
                    onMarcarConcluida={handleConclusion}
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

export default ListAtividades;