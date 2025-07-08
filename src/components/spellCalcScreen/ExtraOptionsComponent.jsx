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
    toggleUsouFdV,
    mitigarDadosParadoxoMana,
    setMitigarDadosParadoxoMana,
    manaOpcional,
    setManaOpcional,
    mitigarTodoParadoxoMana,
    setMitigarTodoParadoxoMana,
    calcularDadosParadoxo,
    dadosExtras,
    setDadosExtras
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
          min={0}
        />
        <InputGroup
          label="Fetiços Combinados"
          id="combinado"
          value={isCombinado}
          setValue={setIsCombinado}
          min={0}
          max={4}
        />
        <InputGroup
          label="Elevações Opcionais"
          id="elevacaoOpcional"
          value={extraElevacoes}
          setValue={setExtraElevacoes}
          min={0}
        />
        <InputGroup
          label="Mana Mitigar Paradoxo"
          id="mitigarDadosParadoxo"
          value={mitigarDadosParadoxoMana}
          setValue={handleMitigarDadosParadoxoChange}
          min={0}
          max={calcularDadosParadoxo()}
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
        />

        <InputCheckBox
          label="Força de Vontade?"
          id="gastouVontade"
          defaultChecked={usouFdV}
          value={usouFdV}
          setValue={toggleUsouFdV}
        />
      </div>
    </div>
  );
}
