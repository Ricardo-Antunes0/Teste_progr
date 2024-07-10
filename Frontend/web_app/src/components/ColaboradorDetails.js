import React from "react";
import '../css/ColaboradorDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function ColaboradorDetails({ colaborador, onClose }) {
    return (
        <div className="popup-background">
            <div className="popup-content">
                <div className="popup-header">
                    <h2>Details of Colaborador</h2>
                    <button className="close-button" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div className="popup-body">
                <p><strong>Full Name:</strong> {colaborador.fullname}</p>
                <p><strong>Position:</strong> {colaborador.position}</p>
                <p><strong>Admission Date:</strong> {colaborador.admission_date}</p>
                <p><strong>Sector:</strong> {colaborador.sector}</p>
                <p><strong>Salary:</strong> {colaborador.salary}</p>
                </div>
            </div>
        </div>
    );
}

export default ColaboradorDetails;
