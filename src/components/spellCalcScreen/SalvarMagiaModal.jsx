import React from 'react';
import ReactDom from 'react-dom';
import styles from '../../styles/salvarMagiaModal.module.css'; 


function SalvarMagiaModal({ isOpen, onClose, onSave }) {
  const [spellName, setSpellName] = React.useState('');

  if (!isOpen) return null; 

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (spellName.trim()) { 
      onSave(spellName.trim()); 
      setSpellName(''); 
    } else {
      alert('Por favor, insira um nome para a magia.');
    }
  };

  return ReactDom.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}> 
        <h2>Salvar Magia</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="spellNameInput">Nome da Magia:</label>
          <input
            id="spellNameInput"
            type="text"
            value={spellName}
            onChange={(e) => setSpellName(e.target.value)}
            placeholder="Ex: Bola de Fogo Aprimorada"
            required
          />
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}

export default SalvarMagiaModal;