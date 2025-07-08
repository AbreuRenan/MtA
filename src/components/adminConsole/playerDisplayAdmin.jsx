import React from "react";
import styles from "./adminStyles.module.css";

import InputGroup from "../helpers/inputGroup";

export default function PlayerDisplayAdmin({ player, onUpdatePlayer }) {
  return (
    <div className={styles.divContainerStyle}>
      <h1>{player?.nome ? player.nome : "Jogador Não Selecionado"}</h1>
      <div className={styles.expContainer}>
        <div>
          <InputGroup
            max={100}
            label="FdV Max"
            id={`fdvMax-${player.id}`}
            value={player?.fv.max || 0}
            setValue={(newValue) =>
              onUpdatePlayer(player.id, "fv/max", newValue)
            }
          />
        </div>
        <div>
          <InputGroup
            max={100}
            label="FV Gasto"
            id={`fvUsado-${player.id}`}
            value={player?.fv?.usado || 0}
            setValue={(newValue) =>
              onUpdatePlayer(player.id, "fv/usado", newValue)
            }
          />
        </div>
      </div>
      <div className={styles.manaContainer}>
        <div>
          <InputGroup
            max={100}
            label="Mana Max"
            id={`manaMax-${player.id}`}
            value={player?.mana?.max || 0}
            setValue={(newValue) =>
              onUpdatePlayer(player.id, "mana/max", newValue)
            }
          />
        </div>
        <div>
          <InputGroup
            max={100}
            label="Mana Gasto"
            id={`manaUsado-${player.id}`}
            value={player?.mana?.usado || 0}
            setValue={(newValue) =>
              onUpdatePlayer(player.id, "mana/usado", newValue)
            }
          />
        </div>
      </div>
      <hr />
      <div className={styles.dmgTxtContainer}>
        {player &&
          Object.keys(player?.vitalidade?.dano).map((key) => (
            <div key={key} className={styles.dmgItem}>
              {key}: {player?.vitalidade?.dano[key]}{" "}
            </div>
          ))}{" "}
        <div>
          <div>
            <InputGroup
              max={100}
              label="Vitalidade max"
              id={`vitalidadeMax-${player.id}`}
              value={player?.vitalidade?.max || 0}
              setValue={(newValue) =>
                onUpdatePlayer(player.id, "vitalidade/max", newValue)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
