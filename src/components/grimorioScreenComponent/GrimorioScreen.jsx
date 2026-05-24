import React, { useState, useEffect, useContext } from 'react';
import styles from "../../styles/grimorioScreen.module.css";
import { useNavigate } from 'react-router-dom';
import { useAppSpellContext } from '../../AppSpellContext';
import { AppContext } from '../../AppContext';
import { ref, onValue } from 'firebase/database';

export default function GrimorioScreen() {
  const { userData, database } = useContext(AppContext);
  const { loadSpellData, deleteSpellData, updateSavedSpell, isLoading } = useAppSpellContext();
  
  const [spells, setSpells] = useState([]);
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [loadingSpells, setLoadingSpells] = useState(true);
  
  // Estados para os inputs editáveis nos detalhes
  const [editableArcanas, setEditableArcanas] = useState("");
  const [editableDescription, setEditableDescription] = useState("");
  const [savingChanges, setSavingChanges] = useState(false);
  
  const navigate = useNavigate();

  const loadingContent = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Carregando contexto de magia...</p>
    </div>
  );

  // Efeito para carregar magias
  useEffect(() => {
    if (!userData || !database) return;

    if (userData.role === "narrador") {
      // Se for narrador, escuta todos os usuários para agregar as magias
      const usersRef = ref(database, "users");
      const unsubscribe = onValue(usersRef, (snapshot) => {
        setLoadingSpells(true);
        if (snapshot.exists()) {
          const allUsers = snapshot.val();
          const aggregatedSpells = [];
          
          Object.keys(allUsers).forEach(userId => {
            const user = allUsers[userId];
            if (user.savedSpells) {
              Object.keys(user.savedSpells).forEach(spellKey => {
                const spell = user.savedSpells[spellKey];
                aggregatedSpells.push({
                  ...spell,
                  userId: userId,
                  userName: user.nome || "Mago Desconhecido"
                });
              });
            }
          });
          
          // Ordena magias por nome
          aggregatedSpells.sort((a, b) => a.name.localeCompare(b.name));
          setSpells(aggregatedSpells);
        } else {
          setSpells([]);
        }
        setLoadingSpells(false);
      }, (error) => {
        console.error("Erro ao carregar magias dos usuários:", error);
        setLoadingSpells(false);
      });
      return () => unsubscribe();
    } else {
      // Se for jogador, escuta apenas as magias do próprio usuário
      const userSpellsRef = ref(database, `users/${userData.id}/savedSpells`);
      const unsubscribe = onValue(userSpellsRef, (snapshot) => {
        setLoadingSpells(true);
        if (snapshot.exists()) {
          const spellMap = snapshot.val();
          const userSpells = Object.keys(spellMap).map(key => ({
            ...spellMap[key],
            userId: userData.id,
            userName: userData.nome
          }));
          userSpells.sort((a, b) => a.name.localeCompare(b.name));
          setSpells(userSpells);
        } else {
          setSpells([]);
        }
        setLoadingSpells(false);
      }, (error) => {
        console.error("Erro ao carregar suas magias:", error);
        setLoadingSpells(false);
      });
      return () => unsubscribe();
    }
  }, [userData, database]);

  // Atualiza os inputs editáveis quando a magia selecionada muda
  useEffect(() => {
    if (selectedSpell) {
      setEditableArcanas(selectedSpell.arcanas || "");
      setEditableDescription(selectedSpell.description || "");
    } else {
      setEditableArcanas("");
      setEditableDescription("");
    }
  }, [selectedSpell]);

  // Sincroniza a magia selecionada em tempo real se os dados mudarem na lista
  useEffect(() => {
    if (selectedSpell) {
      const currentVersion = spells.find(s => s.name === selectedSpell.name && s.userId === selectedSpell.userId);
      if (currentVersion) {
        // Apenas atualiza se houver mudança externa (evita loops com a edição local)
        if (currentVersion.arcanas !== selectedSpell.arcanas || currentVersion.description !== selectedSpell.description) {
          setSelectedSpell(currentVersion);
        }
      } else {
        setSelectedSpell(null); // Magia foi deletada por outro cliente
      }
    }
  }, [spells]);

  const handleSelectSpell = (spell) => {
    setSelectedSpell(spell);
  };

  const handleLoadSpell = () => {
    if (!selectedSpell) return;
    loadSpellData(selectedSpell.calculatorState);
    navigate('/spellCalc'); 
  };

  const handleDeleteSpell = async () => {
    if (!selectedSpell) return;
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir a magia "${selectedSpell.name}"?`);
    if (confirmDelete) {
      const success = await deleteSpellData(selectedSpell.name, selectedSpell.userId);
      if (success) {
        setSelectedSpell(null);
      } else {
        alert("Erro ao excluir magia.");
      }
    }
  };

  const handleSaveSpellChanges = async () => {
    if (!selectedSpell) return;
    setSavingChanges(true);
    const fieldsToUpdate = {
      arcanas: editableArcanas,
      description: editableDescription
    };
    const success = await updateSavedSpell(selectedSpell.name, fieldsToUpdate, selectedSpell.userId);
    setSavingChanges(false);
    if (success) {
      alert("Alterações salvas com sucesso!");
      // Atualiza o estado da magia selecionada localmente
      setSelectedSpell(prev => ({
        ...prev,
        ...fieldsToUpdate
      }));
    } else {
      alert("Erro ao salvar alterações da magia.");
    }
  };

  // Helper para formatar o Fator Primário de forma amigável
  const formatFP = (fp) => {
    switch (fp) {
      case "potencia": return "Potência";
      case "duracao": return "Duração";
      case "escala": return "Escala";
      case "tempoConjuracao": return "Ritual";
      default: return fp || "Potência";
    }
  };

  // Computa um valor numérico de bônus de dados vindo do estado salvo (pode ser number, array de objetos ou ter yantraBonus salvo)
  const computeSavedYantraBonus = (calcState) => {
    if (!calcState) return 0;
    if (typeof calcState.yantraBonus === 'number') return Number(calcState.yantraBonus) || 0;
    const y = calcState.yantras;
    if (Array.isArray(y)) {
      return y.reduce((acc, item) => {
        if (!item) return acc;
        if (typeof item.dadosBonus !== 'undefined') return acc + (Number(item.dadosBonus) || 0);
        if (Array.isArray(item.efeitosDinamicos)) {
          const ef = item.efeitosDinamicos.find(e => e.campo === 'dadosBonus');
          return acc + (Number(ef?.valor) || 0);
        }
        return acc;
      }, 0);
    }
    if (typeof y === 'number') return Number(y) || 0;
    return 0;
  };

  // Nomes dos yantras salvos (para exibição)
  const savedYantrasArr = selectedSpell?.calculatorState?.yantras || [];
  const savedYantraNames = Array.isArray(savedYantrasArr)
    ? savedYantrasArr.filter(Boolean).map(y => (typeof y === 'string' ? y : (y.nome || y.name || 'Yantra'))).join(', ')
    : (typeof savedYantrasArr === 'string' ? savedYantrasArr : '');

  return isLoading ? loadingContent : (
    <div className={styles.grimorioContainer}>
      <h1 className={styles.grimorioTitle}>Grimório Místico</h1>
      
      <div className={styles.grimorioLayout}>
        {/* Coluna Esquerda: Lista de Magias */}
        <div className={styles.spellListPanel}>
          <div className={styles.panelHeader}>
            {userData?.role === "narrador" ? "Todas as Magias Salvas" : "Minhas Magias"}
          </div>
          
          <div className={styles.spellListScroll}>
            {loadingSpells ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateText}>Canalizando conexões místicas...</div>
              </div>
            ) : spells.length > 0 ? (
              spells.map(spell => {
                const isActive = selectedSpell && selectedSpell.name === spell.name && selectedSpell.userId === spell.userId;
                return (
                  <div 
                    key={`${spell.userId}_${spell.name}`} 
                    className={`${styles.spellCard} ${isActive ? styles.spellCardActive : ''}`}
                    onClick={() => handleSelectSpell(spell)}
                  >
                    <div className={styles.cardHeader}>
                      <span className={styles.spellName}>{spell.name}</span>
                      {userData?.role === "narrador" && (
                        <span className={styles.spellOwner}>{spell.userName}</span>
                      )}
                    </div>
                    <div className={styles.cardDetails}>
                      <span className={styles.cardArcana}>{spell.arcanas || "Sem Arcana"}</span>
                      <span className={styles.cardFP}>
                        {formatFP(spell.calculatorState?.currentFP)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                <p>Nenhuma magia no grimório.</p>
                <button className={styles.btnPrimary} style={{ marginTop: '10px' }} onClick={() => navigate('/spellCalc')}>
                  Ir para a Calculadora
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita: Detalhes da Magia (Drawer no Mobile) */}
        <div className={`${styles.spellDetailsPanel} ${selectedSpell ? styles.drawerOpen : ''}`}>
          {selectedSpell ? (
            <>
              <div className={styles.detailsHeader}>
                <div className={styles.detailsTitleContainer}>
                  <div className={styles.titleRow}>
                    <button className={styles.closeDrawerBtn} onClick={() => setSelectedSpell(null)}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <h2 className={styles.detailsTitle}>{selectedSpell.name}</h2>
                  </div>
                  {userData?.role === "narrador" && (
                    <span className={styles.detailsAuthor}>Pertence a: <b>{selectedSpell.userName}</b></span>
                  )}
                </div>
                
                <div className={styles.detailsActions}>
                  <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleLoadSpell} title="Carregar no Imago">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  </button>
                  <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleDeleteSpell} title="Excluir Magia">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>

              {/* Editores de Arcana e Descrição */}
              <div className={styles.editorGroup}>
                <div className={styles.editorField}>
                  <label className={styles.editorLabel}>Arcanas Usadas</label>
                  <input 
                    type="text" 
                    className={styles.editorInput}
                    value={editableArcanas}
                    onChange={(e) => setEditableArcanas(e.target.value)}
                    placeholder="Ex: Forças 3, Espaço 2"
                  />
                </div>
                
                <div className={styles.editorField}>
                  <label className={styles.editorLabel}>Descrição da Magia</label>
                  <textarea 
                    className={`${styles.editorInput} ${styles.editorTextarea}`}
                    value={editableDescription}
                    onChange={(e) => setEditableDescription(e.target.value)}
                    placeholder="Descreva o efeito narrativo e visual da magia aqui..."
                  />
                </div>

                <div className={styles.saveChangesRow}>
                  <button 
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={handleSaveSpellChanges}
                    disabled={savingChanges}
                  >
                    {savingChanges ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </div>

              {/* Estatísticas do IMAGO */}
              <div className={styles.imagoSection}>
                <h3 className={styles.imagoTitle}>Imago da Magia (Fatores)</h3>
                
                <div className={styles.imagoGrid}>
                  {/* Bloco 1: Conjurador */}
                  <div className={styles.imagoColumn}>
                    <h4>Conjurador</h4>
                    <div className={styles.imagoItem}>
                      <span>Gnose:</span>
                      <span className={styles.imagoValue}>{selectedSpell.calculatorState?.gnose}</span>
                    </div>
                    <div className={styles.imagoItem}>
                      <span>Nível Arcana:</span>
                      <span className={styles.imagoValue}>{selectedSpell.calculatorState?.nivelArcana}</span>
                    </div>
                    <div className={styles.imagoItem}>
                      <span>Nível Prática:</span>
                      <span className={styles.imagoValue}>{selectedSpell.calculatorState?.nivelRequerido}</span>
                    </div>
                    <div className={styles.imagoItem}>
                      <span>Arcana Regente:</span>
                      <span className={styles.imagoValue}>{selectedSpell.calculatorState?.regente ? "Sim" : "Não"}</span>
                    </div>
                  </div>

                  {/* Bloco 2: Fatores de Magia */}
                  <div className={styles.imagoColumn}>
                    <h4>Fatores da Magia</h4>
                    <div className={styles.imagoItem}>
                      <span>Potência:</span>
                      <span className={styles.imagoValue}>
                        {selectedSpell.calculatorState?.potencia}
                        {selectedSpell.calculatorState?.potenciaElevada && <span className={styles.imagoElevated}>E</span>}
                        {selectedSpell.calculatorState?.currentFP === "potencia" && " (FP)"}
                      </span>
                    </div>
                    <div className={styles.imagoItem}>
                      <span>Duração:</span>
                      <span className={styles.imagoValue}>
                        {selectedSpell.calculatorState?.duracao}
                        {selectedSpell.calculatorState?.duracaoElevada && <span className={styles.imagoElevated}>E</span>}
                        {selectedSpell.calculatorState?.currentFP === "duracao" && " (FP)"}
                      </span>
                    </div>
                    <div className={styles.imagoItem}>
                      <span>Escala:</span>
                      <span className={styles.imagoValue}>
                        {selectedSpell.calculatorState?.escala}
                        {selectedSpell.calculatorState?.escalaElevada && <span className={styles.imagoElevated}>E</span>}
                        {selectedSpell.calculatorState?.currentFP === "escala" && " (FP)"}
                      </span>
                    </div>
                    <div className={styles.imagoItem}>
                      <span>Ritual/Conj.:</span>
                      <span className={styles.imagoValue}>
                        {selectedSpell.calculatorState?.tempoConjuracao}
                        {selectedSpell.calculatorState?.tempoConjuracaoElevada && <span className={styles.imagoElevated}>E</span>}
                        {selectedSpell.calculatorState?.currentFP === "tempoConjuracao" && " (FP)"}
                      </span>
                    </div>
                  </div>

                  {/* Bloco 3: Opções */}
                  <div className={`${styles.imagoColumn} ${styles.imagoColumnOptions}`}>
                    <h4>Modificadores</h4>
                    <div className={styles.imagoItem}>
                      <span>Alcance:</span>
                      <span className={styles.imagoValue} style={{ textTransform: 'capitalize' }}>
                        {selectedSpell.calculatorState?.alcance}
                      </span>
                    </div>
                    <div className={styles.imagoItem}>
                      <span>Yantras:</span>
                      <div className={` ${styles.imagoValue} ${styles.imagoValueYantras}`}>
                        {savedYantraNames ? (
                          <div>
                            <div className={styles.yantraNames}>{savedYantraNames}</div>
                            <div className={styles.yantraBonus}>+{computeSavedYantraBonus(selectedSpell.calculatorState)}d</div>
                          </div>
                        ) : (
                          <div className={styles.yantraBonus}>+{computeSavedYantraBonus(selectedSpell.calculatorState)}d</div>
                        )}
                      </div>
                    </div>
                    <div className={styles.imagoItem}>
                      <span>Força de Vontade:</span>
                      <span className={styles.imagoValue}>{selectedSpell.calculatorState?.usouFV ? "Sim (+3d)" : "Não"}</span>
                    </div>
                    {/* Ferramenta dedicada removed; represented as a yantra now */}
                  </div>

                  {/* Resultados Finais no Rodapé */}
                  <div className={styles.imagoFooterResult}>
                    <div className={`${styles.resultBox} ${styles.diceBox}`}>
                      <span className={styles.resultLabel}>Parada de Dados</span>
                      <span className={styles.resultValue}>{selectedSpell.calculatorState?.isCombinado ? "Comb. " : ""}{selectedSpell.calculatorState?.calculatorParadaDeDados ?? "N/A"}</span>
                    </div>
                    <div className={`${styles.resultBox} ${styles.manaBox}`}>
                      <span className={styles.resultLabel}>Custo Mana</span>
                      <span className={styles.resultValue}>
                        {selectedSpell.calculatorState?.manaOpcional > 0 
                          ? `${(selectedSpell.calculatorState?.custoMana || 0)} (+${selectedSpell.calculatorState.manaOpcional} Opc)` 
                          : (selectedSpell.calculatorState?.custoMana || 0)}
                      </span>
                    </div>
                    <div className={`${styles.resultBox} ${styles.paradoxBox}`}>
                      <span className={styles.resultLabel}>Paradoxo</span>
                      <span className={styles.resultValue}>{selectedSpell.calculatorState?.totalDadosParadoxo || 0}d</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                <circle cx="12" cy="10" r="3"></circle>
                <path d="M12 7v6"></path>
                <path d="M9 10h6"></path>
              </svg>
              <div className={styles.emptyStateText}>Selecione uma magia para canalizar seu Imago</div>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.45)' }}>Os fatores e o padrão místico serão revelados aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}