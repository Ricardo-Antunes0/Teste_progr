import React, { useState } from "react";
import ListAtividades from '../components/ListAtividades';
import AddAtividade from '../components/RegisterAtividade';
import '../css/AtividadePage.css';

function AtividadesPage() {
  const [reload, setReload] = useState(false);

  const handleNewAtividade = () => {
    setReload(!reload);
  };

  return (
    <div className="container">
      <ListAtividades reload={reload} />
      <div className="add-atividade">
        <AddAtividade onAtividadeAdded={handleNewAtividade} />
      </div>
    </div>
  );
}

export default AtividadesPage;