import React, { useState, useContext } from 'react';
import { ref, push, set, remove } from 'firebase/database';
import { AppContext } from '../../AppContext';
import { useAppSpellContext } from '../../AppSpellContext';
import styles from "./adminStyles.module.css";

const CAMPOS_YANTRA = [
  { value: 'dadosBonus', label: 'Bônus de Dado' },
  { value: 'manaOpcional', label: 'Mana (Custo Extra/Desconto)' },
  { value: 'gnose', label: 'Gnose' },
  { value: 'nivelArcana', label: 'Nível da Arcana' },
  { value: 'extraElevacoes', label: 'Elevações Extra' },
  { value: 'dadosParadoxoExtra', label: 'Dado Extra Paradoxo' },
  { value: 'potenciaElevada', label: 'Elevar Potência' },
  { value: 'duracaoElevada', label: 'Elevar Duração' },
  { value: 'escalaElevada', label: 'Elevar Escala' },
  { value: 'alcanceElevado', label: 'Elevar Alcance' },
  { value: 'tempoConjuracaoElevada', label: 'Elevar Tempo de Conj.' },
  { value: 'fatorPotencia', label: 'Potência' },
  { value: 'fatorDuracao', label: 'Duração' },
  { value: 'fatorEscala', label: 'Escala' },
  { value: 'alcanceToque', label: 'Alcance (Toque)' },
  { value: 'alcanceSensorial', label: 'Alcance (Sensorial)' },
  { value: 'alcanceSimpatico', label: 'Alcance (Simpático)' },
  { value: 'tempoAcelerar', label: 'Tempo de Conjuração (Acelerar)' },
  { value: 'tempoExceder', label: 'Tempo de Conjuração (Exceder)' },
  { value: 'fatorFdv', label: 'Força de Vontade (Bônus)'}
];

export default function AdminYantras({ playersData }) {
  const { database } = useContext(AppContext);
  const { yantrasList, isLoading } = useAppSpellContext();

  const [view, setView] = useState('list'); // 'list' | 'form'
  const [editingId, setEditingId] = useState(null);
  
  const [nome, setNome] = useState('');
  const [descricaoEfeito, setDescricaoEfeito] = useState('');
  const [conhecidoPor, setConhecidoPor] = useState([]);
  const [efeitosDinamicos, setEfeitosDinamicos] = useState([
    { id: Date.now().toString(), campo: 'dadosBonus', valor: 1 }
  ]);

  // Se o contexto ainda está carregando, mostra loading
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Carregando Yantras...</p>
      </div>
    );
  }

  const resetForm = () => {
    setEditingId(null);
    setNome('');
    setDescricaoEfeito('');
    setConhecidoPor([]);
    setEfeitosDinamicos([{ id: Date.now().toString(), campo: 'dadosBonus', valor: 1 }]);
    setView('list');
  };

  const handleEdit = (yantra) => {
    setEditingId(yantra.id);
    setNome(yantra.nome || '');
    setDescricaoEfeito(yantra.descricaoEfeito || yantra.efeitoExtra || '');
    setConhecidoPor(yantra.conhecidoPor || []);
    
    // Migração de Yantras Antigos para o Novo Formato
    if (yantra.efeitosDinamicos && yantra.efeitosDinamicos.length > 0) {
      setEfeitosDinamicos(yantra.efeitosDinamicos);
    } else if (yantra.dadosBonus !== undefined) {
      setEfeitosDinamicos([{ id: Date.now().toString(), campo: 'dadosBonus', valor: Number(yantra.dadosBonus) }]);
    } else {
      setEfeitosDinamicos([{ id: Date.now().toString(), campo: 'dadosBonus', valor: 1 }]);
    }
    
    setView('form');
  };

  const handleAddEffect = () => {
    setEfeitosDinamicos([
      ...efeitosDinamicos,
      { id: Date.now().toString() + Math.random(), campo: 'dadosBonus', valor: 0 }
    ]);
  };

  const handleRemoveEffect = (id) => {
    setEfeitosDinamicos(efeitosDinamicos.filter(ef => ef.id !== id));
  };

  const handleEffectChange = (id, field, value) => {
    setEfeitosDinamicos(efeitosDinamicos.map(ef => {
      if (ef.id === id) {
        return { ...ef, [field]: value };
      }
      return ef;
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!nome) return alert("O nome do Yantra é obrigatório!");

    const yantraData = {
      nome,
      descricaoEfeito,
      conhecidoPor,
      efeitosDinamicos: efeitosDinamicos.map(ef => ({ campo: ef.campo, valor: Number(ef.valor) }))
    };

    try {
      if (editingId) {
        const yantraRef = ref(database, `yantras/${editingId}`);
        await set(yantraRef, yantraData);
      } else {
        const yantrasRef = ref(database, 'yantras');
        const newYantraRef = push(yantrasRef);
        await set(newYantraRef, yantraData);
      }
      resetForm();
    } catch (err) {
      console.error("Erro ao salvar Yantra", err);
      alert(`Erro ao salvar Yantra: ${err?.message || err}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir este Yantra?")) {
      const yantraRef = ref(database, `yantras/${id}`);
      await remove(yantraRef);
    }
  };

  const togglePlayer = (playerName) => {
    setConhecidoPor(prev => {
      if (prev.includes(playerName)) {
        return prev.filter(name => name !== playerName);
      } else {
        return [...prev, playerName];
      }
    });
  };

  if (view === 'form') {
    return (
      <div style={{ padding: '25px', background: 'rgba(12, 14, 0, 0.75)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid var(--separador)', borderRadius: '12px', color: 'var(--branco)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)', width: '100%' }}>
        <h2 style={{ color: 'var(--amarelo)', fontFamily: 'var(--magoFont)', fontSize: '1.4rem', letterSpacing: '1px', marginBottom: '20px' }}>
          {editingId ? "Editar Yantra" : "Novo Yantra"}
        </h2>
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--amarelo)', marginBottom: '5px' }}>Nome do Yantra</label>
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--separador)', color: 'white', borderRadius: '4px' }} required />
          </div>
          
          <div>
            <label style={{ display: 'block', color: 'var(--amarelo)', marginBottom: '5px' }}>Descrição do Efeito</label>
            <textarea value={descricaoEfeito} onChange={e => setDescricaoEfeito(e.target.value)} style={{ width: '100%', padding: '10px', minHeight: '80px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--separador)', color: 'white', borderRadius: '4px' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', color: 'var(--amarelo)', marginBottom: '5px' }}>Conhecido Por (Jogadores)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {playersData && playersData.filter(player => player.active === true).map(player => (
                <label key={player.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', border: conhecidoPor.includes(player.nome) ? '1px solid var(--amarelo)' : '1px solid transparent' }}>
                  <input 
                    type="checkbox" 
                    checked={conhecidoPor.includes(player.nome)} 
                    onChange={() => togglePlayer(player.nome)}
                    style={{ display: 'none' }}
                  />
                  <span style={{ color: conhecidoPor.includes(player.nome) ? 'var(--amarelo)' : 'white' }}>{player.nome}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '10px', borderTop: '1px solid var(--separador)', paddingTop: '15px' }}>
            <h3 style={{ color: 'var(--amarelo)', marginBottom: '10px' }}>Efeitos Matemáticos na Calculadora</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {efeitosDinamicos.map((efeito) => (
                <div key={efeito.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '4px' }}>
                  <select 
                    className={styles.selectTiposEfeitosYantra}
                    value={efeito.campo} 
                    onChange={(e) => handleEffectChange(efeito.id, 'campo', e.target.value)}
                    
                  >
                    {CAMPOS_YANTRA.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  <input 
                    type="number" 
                    value={efeito.valor} 
                    onChange={(e) => handleEffectChange(efeito.id, 'valor', e.target.value)}
                    style={{ width: '80px', padding: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--separador)', color: 'white', borderRadius: '4px', textAlign: 'center' }}
                  />
                  <button type="button" onClick={() => handleRemoveEffect(efeito.id)} style={{ padding: '8px', background: 'transparent', color: 'var(--vermelho)', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            <button type="button" onClick={handleAddEffect} style={{ marginTop: '10px', padding: '8px 15px', background: 'transparent', border: '1px dashed var(--amarelo)', color: 'var(--amarelo)', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
              + Adicionar Efeito
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={resetForm} style={{ background: 'transparent', border: '1px solid var(--separador)', color: 'white', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" style={{ background: 'var(--amarelo)', color: '#000', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {editingId ? "Salvar Alterações" : "Adicionar Yantra"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // View: Lista (Tabela)
  return (
    <div style={{ padding: '25px', background: 'rgba(12, 14, 0, 0.75)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid var(--separador)', borderRadius: '12px', color: 'var(--branco)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--amarelo)', fontFamily: 'var(--magoFont)', fontSize: '1.4rem', letterSpacing: '1px', margin: 0 }}>Gerenciar Yantras</h2>
        <button onClick={() => setView('form')} style={{ background: 'var(--amarelo)', color: '#000', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Novo Yantra
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--separador)', color: 'var(--amarelo)' }}>
              <th style={{ padding: '12px', fontWeight: 'normal' }}>Nome</th>
              <th style={{ padding: '12px', fontWeight: 'normal' }}>Efeitos Mapeados</th>
              <th style={{ padding: '12px', fontWeight: 'normal', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {yantrasList && yantrasList.length > 0 ? yantrasList.map(yantra => {
              // Resumo dos efeitos dinâmicos ou legado
              let resumo = "Sem efeitos definidos";
              if (yantra.efeitosDinamicos && yantra.efeitosDinamicos.length > 0) {
                resumo = yantra.efeitosDinamicos.map(ef => {
                  const campoDef = CAMPOS_YANTRA.find(c => c.value === ef.campo);
                  const valorSinal = ef.valor > 0 ? `+${ef.valor}` : ef.valor;
                  return `${campoDef ? campoDef.label : ef.campo} (${valorSinal})`;
                }).join(', ');
              } else if (yantra.dadosBonus !== undefined) {
                resumo = `Bônus de Dado (+${yantra.dadosBonus})`;
              }

              return (
                <tr key={yantra.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.05)' } }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--amarelo)' }}>{yantra.nome}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                      Conhecido por: {yantra.conhecidoPor?.length > 0 ? yantra.conhecidoPor.join(', ') : "Nenhum jogador"}
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                    {resumo}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', display: 'flex', flexDirection: 'column', alignContent: 'center', rowGap: '4px' }}>
                    <button onClick={() => handleEdit(yantra)} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--separador)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(yantra.id)} style={{ padding: '6px 12px', background: 'rgba(255,0,0,0.1)', color: 'var(--vermelho)', border: '1px solid rgba(255,0,0,0.3)', borderRadius: '4px', cursor: 'pointer' }}>
                      Excluir
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  Nenhum Yantra cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
