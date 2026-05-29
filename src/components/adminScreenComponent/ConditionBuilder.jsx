import React from 'react';

const ORIGEM_OPTIONS = [
  { value: "FATOR_MAGIA", label: "Fator da Magia (ex: Gnosis, Arkanum)" },
  { value: "POOL_YANTRAS", label: "Pool de Yantras Atuais" }
];

const OPERADOR_LOGICO_OPTIONS = [
  { value: "AND", label: "E (Todas as condições)" },
  { value: "OR", label: "OU (Pelo menos uma)" }
];

const OPERADOR_CONDICAO_OPTIONS = [
  { value: "EQ", label: "Igual (EQ)" },
  { value: "GE", label: "Maior ou Igual (GE)" },
  { value: "LE", label: "Menor ou Igual (LE)" }
];

export default function ConditionBuilder({ node, onChange, onDelete, isRoot = false }) {
  if (!node) return null;

  // Se for um nó de grupo (tem operadorLogico)
  if (node.operadorLogico) {
    const handleAddGroup = () => {
      onChange({
        ...node,
        condicoes: [...(node.condicoes || []), { operadorLogico: "AND", condicoes: [] }]
      });
    };

    const handleAddCondition = () => {
      onChange({
        ...node,
        condicoes: [...(node.condicoes || []), { origem: "FATOR_MAGIA", chave: "Gnosis", operador: "GE", valor: "1" }]
      });
    };

    const handleConditionChange = (index, newChildNode) => {
      const newCondicoes = [...(node.condicoes || [])];
      newCondicoes[index] = newChildNode;
      onChange({ ...node, condicoes: newCondicoes });
    };

    const handleConditionDelete = (index) => {
      const newCondicoes = [...(node.condicoes || [])];
      newCondicoes.splice(index, 1);
      onChange({ ...node, condicoes: newCondicoes });
    };

    return (
      <div style={{ border: '1px solid var(--separador)', padding: '15px', margin: '10px 0', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap' }}>
          <select 
            value={node.operadorLogico}
            onChange={(e) => onChange({ ...node, operadorLogico: e.target.value })}
            style={{ padding: '8px', background: 'rgba(0,0,0,0.5)', color: 'var(--amarelo)', border: '1px solid var(--separador)', borderRadius: '4px', fontWeight: 'bold' }}
          >
            {OPERADOR_LOGICO_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <button type="button" onClick={handleAddCondition} style={{ background: 'transparent', color: 'white', border: '1px dashed var(--separador)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>+ Condição</button>
          <button type="button" onClick={handleAddGroup} style={{ background: 'transparent', color: 'white', border: '1px dashed var(--separador)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>+ Subgrupo Lógico</button>
          {!isRoot && (
            <button type="button" onClick={onDelete} style={{ background: 'rgba(255,0,0,0.1)', color: 'var(--vermelho)', border: '1px solid rgba(255,0,0,0.3)', padding: '6px 12px', borderRadius: '4px', marginLeft: 'auto', cursor: 'pointer' }}>Remover Grupo</button>
          )}
        </div>
        
        <div style={{ paddingLeft: '20px', borderLeft: '2px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {node.condicoes && node.condicoes.map((child, index) => (
            <ConditionBuilder 
              key={index} 
              node={child} 
              onChange={(newChild) => handleConditionChange(index, newChild)} 
              onDelete={() => handleConditionDelete(index)}
            />
          ))}
          {(!node.condicoes || node.condicoes.length === 0) && (
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontStyle: 'italic' }}>Nenhuma condição definida. Esse grupo sempre será avaliado como Verdadeiro.</span>
          )}
        </div>
      </div>
    );
  }

  // É um nó folha (Condição simples)
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
      <select 
        value={node.origem || "FATOR_MAGIA"}
        onChange={(e) => onChange({ ...node, origem: e.target.value, chave: e.target.value === 'POOL_YANTRAS' ? '' : node.chave })}
        style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--separador)', borderRadius: '4px' }}
      >
        {ORIGEM_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>

      <input 
        type="text" 
        placeholder={node.origem === "POOL_YANTRAS" ? "Ex: Mudra" : "Ex: Gnosis"}
        value={node.chave || ""}
        onChange={(e) => onChange({ ...node, chave: e.target.value })}
        style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--separador)', borderRadius: '4px', width: '150px' }}
      />

      <select 
        value={node.operador || "EQ"}
        onChange={(e) => onChange({ ...node, operador: e.target.value })}
        style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', color: 'var(--amarelo)', border: '1px solid var(--separador)', borderRadius: '4px' }}
      >
        {OPERADOR_CONDICAO_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>

      <input 
        type="text" 
        placeholder={node.origem === "POOL_YANTRAS" ? "ATIVO/INATIVO" : "Ex: 2"}
        value={node.valor || ""}
        onChange={(e) => onChange({ ...node, valor: e.target.value })}
        style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--separador)', borderRadius: '4px', width: '150px' }}
      />

      <button type="button" onClick={onDelete} style={{ background: 'transparent', color: 'var(--vermelho)', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', marginLeft: 'auto' }} title="Remover Condição">✕</button>
    </div>
  );
}
