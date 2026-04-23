import React from "react";
import InputGroup from "../helpers/inputGroup";
import styles from "../../styles/spellcalc.module.css";

export default function YantraDataComponent(props) {
  const { gnose, page, setYantras, ferramentaDedicada } = props;
  const qtdDeYantras = returnMaxYantrasPerGnose(gnose, ferramentaDedicada);
  const [yantraValues, setYantraValues] = React.useState(() => {
    return Array(qtdDeYantras).fill(0);
  });

  function returnMaxYantrasPerGnose(gnose, hasFerramenta) {
    const gnoseCelling = Math.ceil(gnose / 2) + 1;
    return Math.max(0, gnoseCelling - (hasFerramenta ? 1 : 0));
  }

  React.useEffect(() => {
    setYantraValues((prev) => {
      if (prev.length === qtdDeYantras) return prev;
      if (prev.length > qtdDeYantras) {
        return prev.slice(0, qtdDeYantras);
      }
      return [...prev, ...Array(qtdDeYantras - prev.length).fill(0)];
    });
  }, [qtdDeYantras]);

  React.useEffect(() => {
    const newYantraValues = yantraValues.reduce((acc, curr) => acc + curr, 0);
    setYantras(newYantraValues);
  }, [yantraValues, setYantras]);

  return (
    <div className="page" data-page={page}>
      <div className={styles.spellCalcHeader}>
        <h1>Valores dos Yantras</h1>
      </div>
      <div className={styles.yantraData}>
        <span className={styles.columnName}>Slots de Yantras</span>
        <span className={styles.columnName}>Valor do Yantras</span>
        {yantraValues.map((value, index) => (
          <InputGroup
            key={index}
            label={`Yantra ${index + 1}`}
            value={value}
            setValue={(newValue) => {
              const newYantraValues = [...yantraValues];
              newYantraValues[index] = newValue;
              setYantraValues(newYantraValues);
            }}
            min={0}
            max={10}
          />
        ))}
      </div>
    </div>
  );
}
