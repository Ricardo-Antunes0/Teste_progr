import React,{ useState} from "react";
import ListColaborador  from '../components/ListColaboradores.js';
import AddColaborador from '../components/RegisterColaborador';
import '../css/ColaboradorPage.css';

function ColaboradorPage() {

  // Variavel de estado que indica se é necessário a atualização da lista de colaboradores
  const [reload, setReload] = useState(false); 

  // Função de callback. É chamada quando um novo colaborador é adicionado
  // Atualiza a variavel de estado reload, de maneira a que o componente ListColaboradores seja atualizado
  const handleNewColaborador = () => {
    setReload(!reload);
  };

  return (
    <div>
      <div className="container">
        <ListColaborador  reload = {reload}/>
        <div className="add-colaborador">
          <AddColaborador onColaboradorAdded={handleNewColaborador}/>
          </div>
      </div>
    </div>
  );
}

export default ColaboradorPage;