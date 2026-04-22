import React from "react";
import { AppContext } from "../../AppContext";
import * as spellLogic from "../../js/spellLogic";

export default function useResumoMagiaCalcs(
  gnose,
  potencia,
  custoMana,
  custoVontade,
  currentFP,
  calcularElevacoesTotais,
  escala,
  duracao,
  escalaElevada,
  duracaoElevada,
  tempoConjuracao,
  tempoConjuracaoElevada
) {
  const { userData } = React.useContext(AppContext);

  const factors = React.useMemo(() => {
    return spellLogic.formatSpellFactors({
      potencia,
      duracao,
      duracaoElevada,
      escala,
      escalaElevada,
      gnose,
      currentFP,
      tempoConjuracao,
      tempoConjuracaoElevada,
    });
  }, [
    potencia,
    duracao,
    duracaoElevada,
    escala,
    escalaElevada,
    gnose,
    currentFP,
    tempoConjuracao,
    tempoConjuracaoElevada,
  ]);

  const manaDisponivel = React.useMemo(() => {
    const initialMana = (userData?.mana?.max || 0) - (userData?.mana?.usado || 0);
    return initialMana - custoMana;
  }, [userData?.mana?.max, userData?.mana?.usado, custoMana]);

  const FVDisponivel = React.useMemo(() => {
    const initialFV = (userData?.fv?.max || 0) - (userData?.fv?.usado || 0);
    return initialFV - custoVontade;
  }, [userData?.fv?.max, userData?.fv?.usado, custoVontade]);

  return {
    exibirPotencia: factors.potencia,
    exibirDuracao: factors.duracao,
    exibirEscala: factors.escala,
    exibirElevacoes: calcularElevacoesTotais(),
    exibirTempoConjuracao: factors.tempo,
    exibirTextoPorTamanho: factors.tamanho,
    manaDisponivel,
    FVDisponivel,
  };
}
