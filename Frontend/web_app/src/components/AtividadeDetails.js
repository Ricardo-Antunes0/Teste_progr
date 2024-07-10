import React from "react";
import '../css/ColaboradorDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FiSquare, FiCheckSquare } from 'react-icons/fi';

function AtividadeDetails({ atividade, onClose, onMarcarConcluida}) {

    // Verifica se a atividade está concluída
    const isConcluida = atividade.status === 'concluida';

    return (
        <div className="popup-background">
            <div className="popup-content">
                <div className="popup-header">
                    <h2>Details of ativity</h2>
                    <button className="close-button" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div className="popup-body">
                <p><strong>Description:</strong> {atividade.description}</p>
                <p><strong>Colaborador:</strong> {atividade.colaborador_fullname}</p>
                <p><strong>Status:</strong> {atividade.status}</p>
                <div className="concluir-button" onClick={onMarcarConcluida}>
                    {isConcluida ? <FiCheckSquare size={24} /> : <FiSquare size={24} />}
                    <span className="marcar-concluida-text">{isConcluida ? 'Atividade Concluída' : 'Click on the box to conclude the activity'}</span>
                </div>
                </div>
            </div>
        </div>
    );
}

export default AtividadeDetails;
