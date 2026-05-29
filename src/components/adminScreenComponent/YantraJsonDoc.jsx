import React, { useState } from 'react';
import styles from './adminStyles.module.css';

export default function YantraJsonDoc({ onBack }) {
  const [activeSubTab, setActiveSubTab] = useState('intro');

  const copyToClipboard = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => {
          alert('JSON copiado para a área de transferência!');
        })
        .catch(err => {
          console.error('Falha ao copiar:', err);
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert('JSON copiado para a área de transferência!');
      } else {
        alert('Não foi possível copiar o JSON automaticamente.');
      }
    } catch (err) {
      console.error('Erro de fallback ao copiar:', err);
      alert('Erro ao copiar o JSON.');
    }
    document.body.removeChild(textArea);
  };

  const examples = {
    simple: `{
  "nome": "Foco de Concentração",
  "tipo": "Concentração",
  "custoSlots": 1,
  "descricaoEfeito": "+1 Dado em magias de Mente",
  "efeitosDinamicos": [
    {
      "tipoVariacao": "FIXO",
      "campo": "dadosBonus",
      "valor": 1
    }
  ]
}`,
    requirements: `{
  "nome": "Cálice de Sangue",
  "tipo": "Sacramento",
  "custoSlots": 2,
  "descricaoEfeito": "Requer Arcano Morte 2 OU Arcano Vida 2",
  "requisitos": {
    "operadorLogico": "OR",
    "condicoes": [
      {
        "origem": "FATOR_MAGIA",
        "chave": "Morte",
        "operador": "GE",
        "valor": "2"
      },
      {
        "origem": "FATOR_MAGIA",
        "chave": "Vida",
        "operador": "GE",
        "valor": "2"
      }
    ]
  },
  "efeitosDinamicos": [
    {
      "tipoVariacao": "FIXO",
      "campo": "dadosBonus",
      "valor": 2
    }
  ]
}`,
    complexEffects: `{
  "nome": "Incensário Ritualístico",
  "tipo": "Ferramenta",
  "custoSlots": 1,
  "descricaoEfeito": "Duração estendida de acordo com a seleção de mana",
  "efeitosDinamicos": [
    {
      "tipoVariacao": "SELECAO_VARIAVEL",
      "campo": "multiplo",
      "opcoes": [
        {
          "rotulo": "+1 Duração (+2 dados)",
          "valores": {
            "dadosBonus": 2,
            "fatorDuracao": 1
          }
        },
        {
          "rotulo": "+2 Duração (+4 dados)",
          "valores": {
            "dadosBonus": 4,
            "fatorDuracao": 2
          }
        },
        {
          "rotulo": "+3 Duração (+6 dados)",
          "valores": {
            "dadosBonus": 6,
            "fatorDuracao": 3
          }
        }
      ]
    }
  ]
}`,
    variableCosts: `{
  "nome": "Gema Mística Oscilante",
  "tipo": "Ferramenta Dedicada",
  "custoSlots": 1,
  "descricaoEfeito": "Garante bônus de dados e elevações, mas com custos variáveis",
  "efeitosDinamicos": [
    {
      "tipoVariacao": "SELECAO_VARIAVEL",
      "campo": "multiplo",
      "opcoes": [
        {
          "rotulo": "Básico (+1 Dados)",
          "valores": {
            "dadosBonus": 1
          },
          "custosAplicados": [
            { "tipoCusto": "SLOT_YANTRA", "valor": 1 }
          ]
        },
        {
          "rotulo": "Médio (+3 Dados | +1 Duração | Cost: 2 Slots)",
          "valores": {
            "dadosBonus": 3,
            "fatorDuracao": 1
          },
          "custosAplicados": [
            { "tipoCusto": "SLOT_YANTRA", "valor": 2 }
          ]
        },
        {
          "rotulo": "Místico (+5 Dados | +2 Duração | Cost: 3 Slots + 1 Mana)",
          "valores": {
            "dadosBonus": 5,
            "fatorDuracao": 2
          },
          "custosAplicados": [
            { "tipoCusto": "SLOT_YANTRA", "valor": 3 },
            { "tipoCusto": "MANA", "valor": 1 }
          ]
        }
      ]
    }
  ]
}`
  };

  return (
    <div style={{ padding: '20px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', color: 'white' }}>
      {/* Header com botão de voltar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--separador)', paddingBottom: '15px' }}>
        <div>
          <h2 style={{ color: 'var(--amarelo)', margin: 0 }}>Documentação de Modelagem JSON (Yantras)</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '4px' }}>
            Guia oficial interno para estruturação de dados, requisitos compostos e efeitos avançados.
          </p>
        </div>
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: '1px solid var(--amarelo)',
            color: 'var(--amarelo)',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(242, 193, 46, 0.1)' }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          ← Voltar para Configurações
        </button>
      </div>

      {/* Sub-menu lateral/superior */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          style={{
            background: activeSubTab === 'intro' ? 'var(--amarelo)' : 'rgba(255,255,255,0.05)',
            color: activeSubTab === 'intro' ? 'black' : 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onClick={() => setActiveSubTab('intro')}
        >
          1. Introdução e Estrutura
        </button>
        <button
          style={{
            background: activeSubTab === 'requirements' ? 'var(--amarelo)' : 'rgba(255,255,255,0.05)',
            color: activeSubTab === 'requirements' ? 'black' : 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onClick={() => setActiveSubTab('requirements')}
        >
          2. Requisitos Compostos (AND/OR)
        </button>
        <button
          style={{
            background: activeSubTab === 'complex' ? 'var(--amarelo)' : 'rgba(255,255,255,0.05)',
            color: activeSubTab === 'complex' ? 'black' : 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onClick={() => setActiveSubTab('complex')}
        >
          3. Efeitos Dinâmicos Complexos
        </button>
        <button
          style={{
            background: activeSubTab === 'costs' ? 'var(--amarelo)' : 'rgba(255,255,255,0.05)',
            color: activeSubTab === 'costs' ? 'black' : 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onClick={() => setActiveSubTab('costs')}
        >
          4. Custos Dinâmicos e Slots
        </button>
      </div>

      {/* Conteúdo da Tab */}
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
        {activeSubTab === 'intro' && (
          <div>
            <h3 style={{ color: 'var(--amarelo)', marginBottom: '15px' }}>1. Introdução e Estrutura Básica</h3>
            <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
              Os Yantras no sistema são carregados a partir de um banco de dados relacional e suportam modificadores de magia estáticos e dinâmicos através de um objeto JSON configurável.
            </p>
            <h4 style={{ color: 'white', marginBottom: '10px' }}>Atributos Principais:</h4>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', marginBottom: '20px' }}>
              <li><strong style={{ color: 'var(--amarelo)' }}>nome</strong>: Nome completo do Yantra.</li>
              <li><strong style={{ color: 'var(--amarelo)' }}>tipo</strong>: Um dos tipos pré-configurados do sistema (ex: <em>Ferramenta Dedicada, Ferramenta, Mudra, Mantra, Sacramento, Runa, Concentração</em>).</li>
              <li><strong style={{ color: 'var(--amarelo)' }}>custoSlots</strong>: Inteiro representando o custo base de slots ocupados pelo Yantra (padrão: 1).</li>
              <li><strong style={{ color: 'var(--amarelo)' }}>descricaoEfeito</strong>: Descrição cosmética legível do efeito gerado.</li>
              <li><strong style={{ color: 'var(--amarelo)' }}>efeitosDinamicos</strong>: Array de objetos detalhando modificadores automáticos que a calculadora aplicará.</li>
            </ul>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.8)' }}>Exemplo de Estrutura Básica (Efeito Fixo):</span>
              <button
                onClick={() => copyToClipboard(examples.simple)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Copiar JSON
              </button>
            </div>
            <pre style={{ background: '#111', padding: '15px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto', fontSize: '0.9rem', color: '#64D2FF' }}>
              {examples.simple}
            </pre>
          </div>
        )}

        {activeSubTab === 'requirements' && (
          <div>
            <h3 style={{ color: 'var(--amarelo)', marginBottom: '15px' }}>2. Árvore de Requisitos e Validações</h3>
            <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
              Os Yantras podem ter regras rígidas de requisitos que determinam se o mago está apto a equipá-lo. O motor suporta árvores de decisão recursivas utilizando operadores lógicos.
            </p>
            
            <div style={{ background: 'rgba(255,165,0,0.1)', borderLeft: '4px solid var(--amarelo)', padding: '12px', borderRadius: '4px', marginBottom: '20px' }}>
              <strong style={{ color: 'var(--amarelo)', display: 'block', marginBottom: '5px' }}>Nota de Atualização do Motor (Tolerância a Erros):</strong>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                O motor agora é 100% tolerante a variações de caixa alta/baixa e espaços sobressalentes nas chaves e valores. 
                Por exemplo, se o administrador digitar <code>" forças "</code> ou <code>"Forças"</code> na chave e <code>"or"</code> ou <code>"OR"</code> no operador lógico, a validação ainda será resolvida perfeitamente.
              </p>
            </div>

            <h4 style={{ color: 'white', marginBottom: '10px' }}>Campos da Condição:</h4>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', marginBottom: '20px' }}>
              <li><strong style={{ color: 'var(--amarelo)' }}>origem</strong>: Pode ser <code>"FATOR_MAGIA"</code> (para verificar atributos de Arcanas, Gnose, etc) ou <code>"POOL_YANTRAS"</code> (para verificar se outro tipo de Yantra já está equipado).</li>
              <li><strong style={{ color: 'var(--amarelo)' }}>chave</strong>: O atributo a validar (ex: <code>"Gnosis"</code>, <code>"Forças"</code>, <code>"Morte"</code> ou o tipo do Yantra como <code>"Mudra"</code>).</li>
              <li><strong style={{ color: 'var(--amarelo)' }}>operador</strong>: Comparadores lógicos: <code>"EQ"</code> (igual), <code>"GE"</code> (maior ou igual), <code>"LE"</code> (menor ou igual).</li>
              <li><strong style={{ color: 'var(--amarelo)' }}>valor</strong>: O valor de corte. Para atributos, números (ex: <code>"2"</code>). Para POOL_YANTRAS, use <code>"ATIVO"</code> ou <code>"INATIVO"</code>.</li>
            </ul>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.8)' }}>Exemplo com Operador OU (OR) nos Requisitos:</span>
              <button
                onClick={() => copyToClipboard(examples.requirements)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Copiar JSON
              </button>
            </div>
            <pre style={{ background: '#111', padding: '15px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto', fontSize: '0.9rem', color: '#30D158' }}>
              {examples.requirements}
            </pre>
          </div>
        )}

        {activeSubTab === 'complex' && (
          <div>
            <h3 style={{ color: 'var(--amarelo)', marginBottom: '15px' }}>3. Efeitos Dinâmicos Complexos</h3>
            <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
              Para Yantras flexíveis que oferecem opções variáveis de potência com bônus e penalidades que se ajustam simultaneamente, utilizamos o formato de <code>SELECAO_VARIAVEL</code>.
            </p>
            <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
              Ao definir o <code>campo</code> como <code>"multiplo"</code>, liberamos o suporte ao dicionário <code>valores</code>. Isso possibilita que uma única opção selecionada pelo jogador altere dois ou mais fatores ao mesmo tempo na calculadora!
            </p>

            <h4 style={{ color: 'white', marginBottom: '10px' }}>Estrutura de Variação de Campo Múltiplo:</h4>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', marginBottom: '20px' }}>
              <li>Defina <code>tipoVariacao</code> como <code>"SELECAO_VARIAVEL"</code>.</li>
              <li>Defina <code>campo</code> como <code>"multiplo"</code>.</li>
              <li>Insira as opções dentro da lista de <code>opcoes</code>.</li>
              <li>Dentro de cada opção, substitua o atributo chave simples <code>valor</code> pelo dicionário <code>valores</code> contendo chaves como <code>dadosBonus</code>, <code>fatorDuracao</code>, <code>fatorPotencia</code>, etc.</li>
            </ul>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.8)' }}>Exemplo de Múltiplos Bônus Variáveis (dadosBonus + fatorDuracao):</span>
              <button
                onClick={() => copyToClipboard(examples.complexEffects)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Copiar JSON
              </button>
            </div>
            <pre style={{ background: '#111', padding: '15px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto', fontSize: '0.9rem', color: '#BF5AF2' }}>
              {examples.complexEffects}
            </pre>
          </div>
        )}

        {activeSubTab === 'costs' && (
          <div>
            <h3 style={{ color: 'var(--amarelo)', marginBottom: '15px' }}>4. Controle de Custos Variáveis (Mana e Slots)</h3>
            <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
              Muitos Yantras potentes cobram custos de Mana ou ocupam múltiplos slots na calculadora de acordo com a opção selecionada pelo jogador.
            </p>
            <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
              Para isso, incluímos no array <code>opcoes</code> a propriedade <code>custosAplicados</code>.
            </p>

            <div style={{ background: 'rgba(255,0,0,0.15)', borderLeft: '4px solid var(--vermelho)', padding: '12px', borderRadius: '4px', marginBottom: '20px' }}>
              <strong style={{ color: 'var(--vermelho)', display: 'block', marginBottom: '5px' }}>Regra Crítica de Sobrescrita:</strong>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                Se qualquer opção selecionada de um Yantra possuir o array <code>custosAplicados</code>, o custo base definido no campo <code>custoSlots</code> do Yantra será <strong>ignorado por completo</strong>. Os custos do Yantra serão integralmente determinados pelos elementos contidos na lista de custos aplicados.
              </p>
            </div>

            <h4 style={{ color: 'white', marginBottom: '10px' }}>Formatos de custosAplicados:</h4>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', marginBottom: '20px' }}>
              <li><code>"tipoCusto": "SLOT_YANTRA"</code> : Altera os slots de Yantras ocupados (ex: valor: 2).</li>
              <li><code>"tipoCusto": "MANA"</code> : Cobra Mana adicional para a conjuração (ex: valor: 1).</li>
              <li><code>"tipoCusto": "DANO_RESISTENTE"</code> : Aplica dano resistente ao conjurador (ex: valor: 1).</li>
            </ul>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.8)' }}>Exemplo com Variações de Efeitos + Custos de Slots e Mana:</span>
              <button
                onClick={() => copyToClipboard(examples.variableCosts)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Copiar JSON
              </button>
            </div>
            <pre style={{ background: '#111', padding: '15px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto', fontSize: '0.9rem', color: '#FF9F0A' }}>
              {examples.variableCosts}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
