/**
 * Modelo de Dados de Yantras - Mage: The Awakening
 * Este arquivo define a lista oficial de tipos de Yantras, a classe de domínio Yantra
 * e o blueprint oficial de modelagem de dados para o banco de dados Firebase.
 */

// Tipos oficiais de Yantras suportados no sistema
export const tiposYantra = [
  "Ferramenta Dedicada",
  "Ferramenta",
  "Mudra",
  "Mantra",
  "Sacramento",
  "Runa",
  "Concentração",
  "Persona"
];

/**
 * Classe de Domínio Yantra
 * Encapsula a entidade de um Yantra, prevenindo crashes através de valores padrão
 * e fornecendo método de auto-saneamento para persistência no Firebase.
 */
export class Yantra {
  constructor(data = {}) {
    this.id = data.id || "";
    this.nome = data.nome || "";
    this.tipo = data.tipo || "";
    this.custoSlots = typeof data.custoSlots !== 'undefined' ? Number(data.custoSlots) : 1;
    this.descricaoEfeito = data.descricaoEfeito || "";
    this.efeitoExtra = data.efeitoExtra || "";
    this.conhecidoPor = Array.isArray(data.conhecidoPor) ? data.conhecidoPor : [];
    
    // Requisitos de ativação
    this.requisitos = data.requisitos || null;
    
    // Efeitos e variações do yantra
    this.efeitos = Array.isArray(data.efeitos) ? data.efeitos : [];
    this.selectedOptionIndex = typeof data.selectedOptionIndex !== 'undefined' ? Number(data.selectedOptionIndex) : 0;
  }

  /**
   * Converte a instância de classe em um objeto JavaScript plano seguro para o Firebase.
   * Remove automaticamente campos nulos ou vazios para otimização de banda/armazenamento.
   */
  toPlainObject() {
    const plain = {
      id: this.id,
      nome: this.nome,
      tipo: this.tipo,
      custoSlots: this.custoSlots,
      descricaoEfeito: this.descricaoEfeito,
      efeitoExtra: this.efeitoExtra,
      conhecidoPor: this.conhecidoPor,
      requisitos: this.requisitos,
      efeitos: this.efeitos,
      selectedOptionIndex: this.selectedOptionIndex
    };

    if (!plain.efeitoExtra) delete plain.efeitoExtra;
    if (plain.conhecidoPor.length === 0) delete plain.conhecidoPor;
    if (!plain.requisitos) delete plain.requisitos;
    if (plain.efeitos.length === 0) delete plain.efeitos;

    return plain;
  }
}

/**
 * Blueprint / Schema de referência oficial para estruturar novos Yantras em JSON.
 */
export const yantraSchemaReference = {
  id: "UID_EXCLUSIVO_GERADO_PELO_FIREBASE", // ex: "-NtY_abc123"
  nome: "Nome do Yantra",                   // ex: "Mudra de Forças"
  tipo: "Um dos tipos listados em tiposYantra", // ex: "Mudra"
  custoSlots: 1,                            // Custo de slots de Yantra padrão
  descricaoEfeito: "Descrição detalhada do bônus", 
  efeitoExtra: "Efeito mecânico direto em texto", // opcional
  
  // Lista de nomes de jogadores que conhecem/possuem este Yantra
  conhecidoPor: ["NomeDoJogador1", "NomeDoJogador2"], // opcional (vazio = público)

  // Árvore recursiva de requisitos lógicos
  requisitos: {
    operadorLogico: "AND | OR | NOT", // opcional (padrão: AND)
    condicoes: [
      {
        origem: "FATOR_MAGIA | POOL_YANTRAS",
        chave: "Atributo/Arcana (ex: 'Gnosis', 'Forças') ou Tipo/ID de Yantra (ex: 'mudra', '-NtY...')",
        operador: "EQ | GE | LE",
        valor: "Valor esperado (string ou booleano: true, false, 'ATIVO', 'INATIVO')"
      }
    ]
  },

  // Efeitos / Bônus aplicados ao feitiço
  efeitos: [
    {
      rotulo: "Efeito Padrão", // Opcional, será usado caso haja mais de 1 efeito (variação)
      valores: {
        modDados: 1,      // Modifica os dados (+ ou -)
        modMana: -1,      // Modifica a mana livre (+ ou -)
        modParadoxo: 1,   // Modifica os dados de paradoxo (+ ou -)
        modElevacao: 1,   // Incrementa a elevação de um alcance específico
      }
    }
  ]
};
