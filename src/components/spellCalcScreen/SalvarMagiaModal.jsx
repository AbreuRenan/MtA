import React from 'react';
import styles from '../../styles/salvarMagiaModal.module.css'; // Crie seu arquivo CSS para o modal


export default function SalvarMagiaModal({ isOpen, onClose, onSave }) {
  const [spellName, setSpellName] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  

    const handleCloseSaveModal = () => {
      setIsModalOpen(false);
    };
    const handleSaveSpellWithModal = (spellName) => {
      saveSpellData(spellName);
      setIsModalOpen(false); 
    };

  if (!isModalOpen) return null; 


  React.useEffect( () => {
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (spellName.trim()) { 
      handleSaveSpellWithModal(spellName.trim()); 
      setSpellName(''); 
    } else {
      alert('Por favor, insira um nome para a magia.');
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleCloseSaveModal}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}> {/* Impede que cliques dentro do modal fechem o overlay */}
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
            <button type="button" onClick={handleCloseSaveModal}>Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
