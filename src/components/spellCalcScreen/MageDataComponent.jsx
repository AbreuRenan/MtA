import React from "react";
import styles from "../../styles/spellcalc.module.css";
import InputGroup from "../helpers/inputGroup";
import InputCheckBox from "../helpers/inputCheckBox";
import InputSelectArcana from "../helpers/InputSelectArcana";

export default function MageDataComponent(props) {
  const {
    gnose,
    setGnose,
    arcana,
    setArcana,
    nivelArcana,
    setNivelArcana,
    arcanasExtras = [],
    setArcanasExtras,
    nivelRequerido,
    setNivelRequerido,
    magiasAtivas,
    setMagiasAtivas,
    setSpellType,
    regente,
    setRegente,
    page,
    toggleRegente,
  } = props;

  function toggleRadioBtnSpellType(e) {
    const inputValue = e.target.value;
    setSpellType(inputValue);
  }

  return (
    <div className="page" data-page={page}>
      <div className={styles.spellCalcHeader}>
        <h1>Dados do Desperto</h1>
      </div>
      <div className={styles.mageData}>
        <span className={styles.columnName}>Informação do Mago</span>
        <span className={styles.columnName}>Nível</span>
        <InputGroup
          label="Gnose"
          id="gnose"
          value={gnose}
          setValue={setGnose}
        />
        <InputSelectArcana
          label="Nível da Arcana"
          id="nivelArcana"
          value={nivelArcana}
          setValue={setNivelArcana}
          arcana={arcana}
          setArcana={setArcana}
          regente={regente}
          setRegente={setRegente}
        />

        {arcanasExtras.map((extra, idx) => (
          <React.Fragment key={extra.id}>
            <div style={{ gridColumn: 'span 2', borderTop: '1px dashed var(--separador)', margin: '5px 0 5px 0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--amarelo)', fontSize: '0.85rem', fontWeight: 'bold' }}>Arcana Extra #{idx + 1}</span>
              <button
                type="button"
                onClick={() => {
                  setArcanasExtras(arcanasExtras.filter(e => e.id !== extra.id));
                }}
                style={{
                  background: 'rgba(255,0,0,0.15)',
                  border: '1px solid rgba(255,0,0,0.3)',
                  color: 'var(--vermelho)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Remover
              </button>
            </div>
            <InputSelectArcana
              label="Nível da Arcana Extra"
              id={`extraArcana_${extra.id}`}
              value={extra.nivelArcana}
              setValue={(val) => {
                setArcanasExtras(arcanasExtras.map(e => e.id === extra.id ? { ...e, nivelArcana: val } : e));
              }}
              arcana={extra.arcana}
              setArcana={(val) => {
                setArcanasExtras(arcanasExtras.map(e => e.id === extra.id ? { ...e, arcana: val } : e));
              }}
              regente={extra.regente}
              setRegente={(val) => {
                setArcanasExtras(arcanasExtras.map(e => e.id === extra.id ? { ...e, regente: val } : e));
              }}
            />
          </React.Fragment>
        ))}

        <button
          type="button"
          onClick={() => {
            setArcanasExtras([
              ...arcanasExtras,
              { id: Date.now(), arcana: "Morte", nivelArcana: 1, regente: false }
            ]);
          }}
          style={{
            gridColumn: 'span 2',
            background: 'rgba(255, 191, 0, 0.1)',
            border: '1px dashed var(--amarelo)',
            color: 'var(--amarelo)',
            padding: '10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            textAlign: 'center',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 191, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 191, 0, 0.1)';
          }}
        >
          <span>+ Adicionar Arcana Extra</span>
        </button>

        <InputGroup
          label="Nível da Prática"
          id="nivelRequerido"
          value={nivelRequerido}
          setValue={setNivelRequerido}
        />
        <InputGroup
          label="Magias Ativas"
          id="magiasAtiva"
          value={magiasAtivas}
          setValue={setMagiasAtivas}
          min={0}
        />
        <fieldset className={`${styles.inputGroupSpellType} ${styles.options}`}>
          <legend>Tipo de Feitiço</legend>
          <div>
            <input
              type="radio"
              id="improvisado"
              name="spellType"
              value="improvisado"
              defaultChecked
              onChange={toggleRadioBtnSpellType}
            />
            <label htmlFor="improvisado">Improvisado</label>
          </div>
          <div>
            <input
              type="radio"
              id="rote"
              name="spellType"
              value="rote"
              onChange={toggleRadioBtnSpellType}
            />
            <label htmlFor="rote">Clássico</label>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
