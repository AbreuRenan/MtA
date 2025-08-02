import React from 'react';
import styles from "../../styles/grimorioScreen.module.css";
import { useNavigate } from 'react-router-dom';
import { AppSpellContext } from '../../AppSpellContext';


export default function GrimorioScreen() {

 const { loadSpell, getSavedSpells, deleteSpell } = AppSpellContext();
  const [spells, setSpells] = useState([]);
  const navigate = useNavigate();

  const fetchSpells = () => {
    setSpells(getSavedSpells());
  };

  useEffect(() => {
    fetchSpells();
  }, []);

  const handleLoadSpell = (spellName) => {
    loadSpell(spellName);
    navigate('/'); 
  };

  const handleDeleteSpell = (spellName) => {
    if (window.confirm(`Tem certeza que deseja excluir "${spellName}"?`)) {
      deleteSpell(spellName);
      // Atualiza a lista de magias na tela
      fetchSpells(); 
    }
  };

  return (
    <div className={styles.grimorioContainer}>
      <h1>Grimório</h1>
      <div className={styles.spellList}>
        {spells.length > 0 ? (
          spells.map(spell => (
            <div key={spell.name} className={styles.spellItem}>
              <span>{spell.name}</span>
              <div className={styles.actions}>
                <button onClick={() => handleLoadSpell(spell.name)}>Carregar</button>
                <button onClick={() => handleDeleteSpell(spell.name)}>Excluir</button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhuma magia salva. Volte para a Calculadora para salvar a primeira!</p>
        )}
      </div>
      <button onClick={() => navigate('/')}>Voltar</button>
    </div>
  );
}