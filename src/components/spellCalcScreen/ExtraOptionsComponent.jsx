import React from "react";
import styles from "../../styles/spellcalc.module.css";
import InputGroup from "../helpers/inputGroup";
import InputCheckBox from "../helpers/inputCheckBox";

export default function ExtraOptionsComponent(props) {
  const {
    isCombinado,
    setIsCombinado,
    extraElevacoes,
    setExtraElevacoes,
    usouFdV,
    setUsouFdV,
    ferramentaDedicada,
    setFerramentaDedicada,
    mitigarDadosParadoxoMana,
    setMitigarDadosParadoxoMana,
    manaOpcional,
    setManaOpcional,
    mitigarTodoParadoxoMana,
    setMitigarTodoParadoxoMana,
    calcularDadosParadoxo,
    dadosExtras,
    setDadosExtras,
    maxManaMitigacao,
    maxManaOpcional,
    dadosParadoxoExtra,
    setDadosParadoxoExtra,
    toggleUsouFV,
    userData,
  } = props;

  function toggleMitigarTodoParadoxoCheckBox(e) {
    setMitigarTodoParadoxoMana(e.target.checked);
  }
  function handleMitigarDadosParadoxoChange(newValue) {
    setMitigarDadosParadoxoMana(newValue);
    if (mitigarTodoParadoxoMana) {
      setMitigarTodoParadoxoMana(false);
    }
  }
  return (
    <div className="page">
      <div className={styles.spellCalcHeader}>
        <h1>Opcionais de Magia</h1>
      </div>
      <div className={styles.optionalsData}>
        <InputGroup
          label="Dados Extras"
          id="dadosExtras"
          value={dadosExtras}
          setValue={setDadosExtras}
          min={-100}
          max={100}

        />
        <InputGroup
          label="Fetiços Combinados"
          id="combinado"
          value={isCombinado}
          setValue={setIsCombinado}
          min={0}
          max={10}
        />
        <InputGroup
          label="Elevações Opcionais"
          id="elevacaoOpcional"
          value={extraElevacoes}
          setValue={setExtraElevacoes}
          min={-10}
          max={100}
        />
        <InputGroup
          label="Dados Paradoxo Extra"
          id="dadosParadoxoExtra"
          value={dadosParadoxoExtra}
          setValue={setDadosParadoxoExtra}
          min={-100}
          max={100}
        />
        <InputGroup
          label="Mana Mitigar Paradoxo"
          id="mitigarDadosParadoxo"
          value={mitigarDadosParadoxoMana}
          setValue={handleMitigarDadosParadoxoChange}
          min={0}
          max={maxManaMitigacao}
        >
          <input
            type="checkbox"
            id="mitigarTodoParadoxoMana"
            name="mitigarTodoParadoxoMana"
            value="mitigarTodoParadoxoMana"
            checked={mitigarTodoParadoxoMana}
            onChange={toggleMitigarTodoParadoxoCheckBox}
            className={styles.checkboxElevada}
          />
        </InputGroup>

        <InputGroup
          label="Custo de Mana Extra"
          id="manaOpcional"
          value={manaOpcional}
          setValue={setManaOpcional}
          min={0}
          max={maxManaOpcional}
        />

        <InputCheckBox
          label="Força de Vontade?"
          id="gastouVontade"
          checked={usouFdV}
          setValue={toggleUsouFV} 
          disabled={(userData?.fv?.max - userData?.fv?.usado) <= 0 && !usouFdV}
        />
        <InputCheckBox
          label="Ferramenta Dedicada?"
          id="ferramentaDedicada"
          checked={ferramentaDedicada}
          setValue={setFerramentaDedicada} 
        />
      </div>
    </div>
  );
}
