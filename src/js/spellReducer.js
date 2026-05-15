export const initialState = {
  page: 1,
  gnose: 1,
  nivelArcana: 1,
  nivelRequerido: 1,
  magiasAtivas: 0,
  spellType: "improvisado",
  regente: true,
  potencia: 1,
  duracao: 1,
  escala: 1,
  alcance: "toque",
  tempoConjuracao: 1,
  currentFP: "potencia",
  potenciaElevada: false,
  duracaoElevada: false,
  escalaElevada: false,
  alcanceElevado: false,
  tempoConjuracaoElevada: false,
  extraElevacoes: 0,
  isCombinado: 0,
  yantras: 0,
  usouFV: false,
  mitigarDadosParadoxoMana: 0,
  mitigarTodoParadoxoMana: false,
  manaOpcional: 0,
  dadosExtras: 0,
  ferramentaDedicada: false,
  dadosParadoxoExtra: 0,
};

export function spellReducer(state, action) {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    case 'RESET':
      return {
        ...initialState,
        // We might want to preserve the page or other specific things, but usually a full reset is fine
      };
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
