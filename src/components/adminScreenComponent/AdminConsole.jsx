import React from "react";
import { AppContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";
import { get, ref, remove, set, update, onValue } from "firebase/database";
import PlayerDisplayAdmin from "./playerDisplayAdmin";
import { pushLog } from "../../js/logUtils";
import AdminYantras from "./AdminYantras";
import YantraJsonDoc from "./YantraJsonDoc";

import styles from "./adminStyles.module.css";
import RollHistory from "../diceScreenComponents/RollHistory";
import LogHistory from "./LogHistory";

export default function AdminScreen() {
  const navigate = useNavigate();
  const { userData, database, gameOpen, setGameOpen } = React.useContext(AppContext);
  const [playersData, setPlayersData] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState('logs');
  const [logTab, setLogTab] = React.useState('rolls');

  React.useEffect(() => {
    if (userData.role !== "narrador") {
      navigate("/home");
    }
    const usersRef = ref(database, "users");

    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const playersList = snapshot.val();
        const data = Object.keys(playersList)
          .map((key) => ({ ...playersList[key], id: key }))
          .filter((user) => user?.role !== "narrador" && user?.nome)
          .sort((a, b) => {
            let fa = a.nome.toLowerCase();
            let fb = b.nome.toLowerCase();
            return fa < fb ? -1 : fa > fb ? 1 : 0;
          });
        setPlayersData(data);
      } else {
        setPlayersData([]); // Limpa se não houver dados
      }
    });

    return () => unsubscribe();
  }, [userData, database, navigate]);

  async function handlePlayerUpdate(userId, path, newValue) {
    try {
      const playerPathRef = ref(database, `users/${userId}/${path}`);

      let valueToSave = newValue;
      if (typeof newValue === "string" && !isNaN(Number(newValue))) {
        valueToSave = Number(newValue);
      }
      await set(playerPathRef, valueToSave);

      const targetPlayer = playersData.find(p => p.id === userId);
      if (targetPlayer) {
          let type = "";
          let antes = 0;
          let depois = 0;
          
          if (path === "fv/usado") {
              type = "Vontade";
              antes = targetPlayer.fv.max - (targetPlayer.fv.usado || 0);
              depois = targetPlayer.fv.max - valueToSave;
          } else if (path === "mana/usado") {
              type = "Mana";
              antes = targetPlayer.mana.max - (targetPlayer.mana.usado || 0);
              depois = targetPlayer.mana.max - valueToSave;
          } else if (path === "fv/max") {
              type = "Vontade Max";
              antes = targetPlayer.fv.max || 0;
              depois = valueToSave;
          } else if (path === "mana/max") {
              type = "Mana Max";
              antes = targetPlayer.mana.max || 0;
              depois = valueToSave;
          } else if (path === "vitalidade/max") {
              type = "Vitalidade Max";
              antes = targetPlayer.vitalidade.max || 0;
              depois = valueToSave;
          }

          if (type) {
              pushLog(database, userData, type, {
                 antes,
                 depois,
                 targetUser: targetPlayer.nome,
                 isAdminAction: true
              });
          }
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do jogador:", error);
    }
  }

  React.useEffect(() => {
    const gameRef = ref(database, "gameStatus");
    const newGameStatus = { gameStatus: gameOpen };
    update(gameRef, newGameStatus);
  }, [gameOpen]);

  const handleDeleteHistory = () => {
    const rollsRef = ref(database, "rollsHistory");
    remove(rollsRef).catch((err) => {
      console.log(err);
    });
  };

  const handleDeleteLogs = () => {
    const logsRef = ref(database, "actionLogs");
    remove(logsRef).catch((err) => {
      console.log(err);
    });
  };

  function handleOpenGame() {
    setGameOpen(!gameOpen);
  }
  return (
    <div className={`${styles.adminConsoleContainer}`}>
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'logs' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('logs')}
          title="Logs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'players' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('players')}
          title="Jogadores"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'yantras' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('yantras')}
          title="Yantras"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'config' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('config')}
          title="Configurações"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>

      <div className={styles.tabContentContainer}>
        {activeTab === 'logs' && (
          <div className={styles.tabContentContainer} style={{ padding: 0 }}>
            <div className={styles.logSubtabsContainer}>
              <button
                className={`${styles.logSubtabBtn} ${logTab === 'rolls' ? styles.activeLogSubtab : ''}`}
                onClick={() => setLogTab('rolls')}
              >
                Histórico de Rolagens
              </button>
              <button
                className={`${styles.logSubtabBtn} ${logTab === 'resources' ? styles.activeLogSubtab : ''}`}
                onClick={() => setLogTab('resources')}
              >
                Log de Recursos
              </button>
            </div>

            {logTab === 'rolls' && (
              <div className={styles.logFullPanel}>
                <span className={styles.panelTitle}>Histórico de Rolagens</span>
                <div className={styles.logScrollArea}>
                  <RollHistory single={false} />
                </div>
              </div>
            )}

            {logTab === 'resources' && (
              <div className={styles.logFullPanel}>
                <span className={styles.panelTitle}>Log de Recursos</span>
                <div className={styles.logScrollArea}>
                  <LogHistory />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'players' && (
          <div className={styles.playersListContainer}>
            {playersData.map((selectedPlayer) => (
              <PlayerDisplayAdmin
                player={selectedPlayer}
                key={selectedPlayer.id}
                onUpdatePlayer={handlePlayerUpdate}
              />
            ))}
          </div>
        )}

        {activeTab === 'yantras' && (
          <div style={{ width: '100%', maxWidth: '1000px' }}>
            <AdminYantras playersData={playersData} />
          </div>
        )}

        {activeTab === 'config' && (
          <div className={styles.configContainer}>
            <div className={styles.configCard}>
              <h3>Estado do Jogo</h3>
              <div className={styles.gameStatusArea}>
                <div className={styles.statusIndicator}>
                  <span>Status:</span>
                  <div className={`${styles.statusDot} ${gameOpen ? styles.statusDotActive : styles.statusDotInactive}`} />
                  <span style={{ color: gameOpen ? 'var(--verde)' : 'var(--vermelho)' }}>
                    {gameOpen ? 'ABERTO' : 'FECHADO'}
                  </span>
                </div>
                <button
                  className={`${styles.configBtn} ${!gameOpen ? 'primary' : 'danger'}`}
                  style={{ width: '200px' }}
                  onClick={handleOpenGame}
                >
                  {!gameOpen ? "Abrir Jogo" : "Fechar Jogo"}
                </button>
              </div>
            </div>

            <div className={styles.configCard}>
              <h3>Modelagem de Yantras</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '15px' }}>
                Acesse a documentação oficial interna detalhando como estruturar o JSON de Yantras, regras de requisitos e custos dinâmicos.
              </p>
              <button 
                className={styles.configBtn} 
                style={{ width: '250px', background: 'var(--amarelo)', color: '#000', fontWeight: 'bold' }} 
                onClick={() => setActiveTab('yantraDoc')}
              >
                Ver Documentação JSON
              </button>
            </div>

            <div className={styles.configCard}>
              <h3>Ações Administrativas</h3>
              <div className={styles.actionsGrid}>
                <button className={`${styles.configBtn} danger`} onClick={handleDeleteHistory}>
                  Limpar Rolagens
                </button>
                <button className={`${styles.configBtn} danger`} onClick={handleDeleteLogs}>
                  Limpar Logs de Recursos
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'yantraDoc' && (
          <div style={{ width: '100%', maxWidth: '1000px' }}>
            <YantraJsonDoc onBack={() => setActiveTab('config')} />
          </div>
        )}
      </div>
    </div>
  );
}
