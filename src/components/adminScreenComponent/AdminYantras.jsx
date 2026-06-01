import React, { useState, useContext } from 'react';
import { ref, push, set, remove } from 'firebase/database';
import { AppContext } from '../../AppContext';
import { useAppSpellContext } from '../../AppSpellContext';
import { tiposYantra } from '../../js/yantraLogic';
import styles from "./adminStyles.module.css";
import ConditionBuilder from './ConditionBuilder';

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

// Os campos abaixo são referências úteis para quem vai escrever o JSON
// 'dadosBonus', 'manaOpcional', 'gnose', 'nivelArcana', 'extraElevacoes', 'dadosParadoxoExtra', 'fatorPotencia', etc.

export default function AdminYantras({ playersData }) {
  const { database } = useContext(AppContext);
  const { yantrasList, isLoading } = useAppSpellContext();

  const [view, setView] = useState('list'); // 'list' | 'form'
  const [editingId, setEditingId] = useState(null);
  
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('Ferramenta Dedicada');
  const [custoSlots, setCustoSlots] = useState(1);
  const [requisitos, setRequisitos] = useState({ operadorLogico: 'AND', condicoes: [] });
  const [descricaoEfeito, setDescricaoEfeito] = useState('');
  const [conhecidoPor, setConhecidoPor] = useState([]);
  
  const [efeitosJson, setEfeitosJson] = useState('[\n  {\n    "rotulo": "Efeito Padrão",\n    "valores": {\n      "modDados": 1\n    }\n  }\n]');
  const [jsonError, setJsonError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyId = async (id, e) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(id);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = id;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error("Falha ao copiar ID:", err);
    }
  };

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
    setTipo('Ferramenta Dedicada');
    setCustoSlots(1);
    setRequisitos({ operadorLogico: 'AND', condicoes: [] });
    setDescricaoEfeito('');
    setConhecidoPor([]);
    setEfeitosJson('[\n  {\n    "rotulo": "Efeito Padrão",\n    "valores": {\n      "modDados": 1\n    }\n  }\n]');
    setJsonError('');
    setView('list');
  };

  const handleEdit = (yantra) => {
    setEditingId(yantra.id);
    setNome(yantra.nome || '');
    setTipo(yantra.tipo || 'Ferramenta Dedicada');
    setCustoSlots(yantra.custoSlots !== undefined ? yantra.custoSlots : 1);
    setRequisitos(yantra.requisitos || { operadorLogico: 'AND', condicoes: [] });
    setDescricaoEfeito(yantra.descricaoEfeito || yantra.efeitoExtra || '');
    setConhecidoPor(yantra.conhecidoPor || []);
    
    // Configurar o JSON dos Efeitos
    let initialEfeitos = [];
    if (yantra.efeitos && yantra.efeitos.length > 0) {
      initialEfeitos = yantra.efeitos;
    } else {
      initialEfeitos = [{ rotulo: 'Efeito Padrão', valores: { modDados: 1 } }];
    }
    setEfeitosJson(JSON.stringify(initialEfeitos, null, 2));
    setJsonError('');
    
    setView('form');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!nome) return alert("O nome do Yantra é obrigatório!");
    if (jsonError) return alert("O JSON de Efeitos Dinâmicos contém erros de sintaxe!");

    let parsedEfeitos = [];
    try {
      const parsed = JSON.parse(efeitosJson);
      if (parsed && !Array.isArray(parsed) && typeof parsed === 'object' && parsed.efeitos) {
        parsedEfeitos = Array.isArray(parsed.efeitos) ? parsed.efeitos : [];
      } else {
        parsedEfeitos = Array.isArray(parsed) ? parsed : [];
      }
    } catch (err) {
      return alert("Erro ao parsear o JSON de Efeitos. Corrija a sintaxe.");
    }

    const yantraData = {
      nome,
      tipo,
      custoSlots: Number(custoSlots) || 0,
      requisitos,
      descricaoEfeito,
      conhecidoPor,
      efeitos: parsedEfeitos
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
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: 'var(--amarelo)', marginBottom: '5px' }}>Tipo do Yantra</label>
              <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--separador)', color: 'white', borderRadius: '4px' }} required>
                {tiposYantra.map(t => <option key={t} value={t} style={{color: 'black'}}>{t}</option>)}
              </select>
            </div>
            <div style={{ width: '150px' }}>
              <label style={{ display: 'block', color: 'var(--amarelo)', marginBottom: '5px' }}>Custo em Slots</label>
              <input type="number" min="0" value={custoSlots} onChange={e => setCustoSlots(e.target.value)} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--separador)', color: 'white', borderRadius: '4px' }} required />
            </div>
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
            <h3 style={{ color: 'var(--amarelo)', marginBottom: '10px' }}>Efeitos e Variações (JSON)</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '10px' }}>
              Cole ou edite a estrutura JSON do array de efeitos. Utilize "rotulo" e o objeto "valores" contendo os modificadores.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 2 }}>
                <textarea 
                  value={efeitosJson} 
                  onChange={(e) => {
                    setEfeitosJson(e.target.value);
                    try {
                      JSON.parse(e.target.value);
                      setJsonError('');
                    } catch(err) {
                      setJsonError('Sintaxe JSON inválida');
                    }
                  }} 
                  style={{ width: '100%', padding: '10px', height: '250px', background: 'rgba(0,0,0,0.5)', border: jsonError ? '1px solid var(--vermelho)' : '1px solid var(--separador)', color: 'white', borderRadius: '4px', fontFamily: 'monospace', resize: 'vertical' }} 
                />
                {jsonError && <span style={{ color: 'var(--vermelho)', fontSize: '0.85rem' }}>{jsonError}</span>}
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--separador)', borderRadius: '4px', padding: '15px', overflowY: 'auto', height: '250px' }}>
                <h4 style={{ color: 'var(--amarelo)', marginBottom: '10px', fontSize: '0.9rem' }}>Glossário de Campos</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
                  {CAMPOS_YANTRA.map(campo => (
                    <li key={campo.value} style={{ marginBottom: '8px' }}>
                      <strong style={{ color: 'white' }}>"{campo.value}"</strong>
                      <br/>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{campo.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '10px', borderTop: '1px solid var(--separador)', paddingTop: '15px' }}>
            <h3 style={{ color: 'var(--amarelo)', marginBottom: '10px' }}>Requisitos e Validações</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '15px' }}>Defina as condições lógicas necessárias para este yantra ser equipado. Deixe vazio para permitir uso livre.</p>
            <ConditionBuilder 
              node={requisitos} 
              onChange={setRequisitos} 
              isRoot={true} 
            />
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
              <th style={{ padding: '12px', fontWeight: 'normal' }}>Tipo / Slots</th>
              <th style={{ padding: '12px', fontWeight: 'normal' }}>UID (Firebase)</th>
              <th style={{ padding: '12px', fontWeight: 'normal', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {yantrasList && yantrasList.length > 0 ? yantrasList.map(yantra => {
              return (
                <tr key={yantra.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.05)' } }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--amarelo)' }}>{yantra.nome}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                      Conhecido por: {yantra.conhecidoPor?.length > 0 ? yantra.conhecidoPor.join(', ') : "Nenhum jogador"}
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                    {yantra.tipo || 'Desconhecido'} <br/>
                    <span style={{ fontSize: '0.8rem', color: 'var(--amarelo)' }}>Custo: {yantra.custoSlots !== undefined ? yantra.custoSlots : 1} Slot(s)</span>
                  </td>
                  <td
                    onClick={(e) => handleCopyId(yantra.id, e)}
                    style={{
                      padding: '12px',
                      color: copiedId === yantra.id ? 'var(--verde)' : 'rgba(255,255,255,0.7)',
                      fontSize: '0.8rem',
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                      userSelect: 'all',
                      transition: 'color 0.2s'
                    }}
                    title="Clique para copiar o UID"
                  >
                    <span style={{ borderBottom: '1px dotted rgba(255,255,255,0.3)', verticalAlign: 'middle' }}>{yantra.id}</span>
                    {copiedId === yantra.id && (
                      <span style={{ marginLeft: '8px', color: 'var(--verde)', fontSize: '0.75rem', fontWeight: 'bold', verticalAlign: 'middle' }}>
                        ✓ Copiado!
                      </span>
                    )}
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
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
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
