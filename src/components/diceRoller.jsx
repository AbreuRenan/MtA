import React, { useEffect } from 'react';
import roll from  '../js/dice'

import styles from '../styles/diceRoller.module.css'
import audioURL from '../assets/audio/diceRollRedux.mp3'

function DiceRollerComponent() {
    const [totalOfDices, setTotalOfDices] = React.useState(0);
    const [DisableRoll, setDisableRoll] = React.useState(false);
    

   
    React.useEffect( ()=>{
        const audioElement = document.getElementById('diceSound');
        audioElement.addEventListener('ended', stopedDiceSound);
        

        const checkBoxes = Array.from(document.querySelectorAll('.targetNumExplosion'));
        checkBoxes.forEach(checkbox => checkbox.addEventListener('change', toggleCheckBox))

        return () => {
            audioElement.removeEventListener('ended', stopedDiceSound);
            checkBoxes.forEach(checkbox => checkbox.removeEventListener('change', toggleCheckBox))
        }
    },[])

    function stopedDiceSound() {
        setDisableRoll(false);
        const viewArea = document.querySelector('div.container');
        viewArea.scrollTop = 0

    }

    function toggleCheckBox(event) {
        const currentCheckBox = event.target;
        const siblingCheckBox = Array.from(document.querySelectorAll('.targetNumExplosion')).filter( el => el.id !== currentCheckBox.id)[0];
        if(currentCheckBox.checked) siblingCheckBox.checked = false
    }

    function modifyDiceVal({target}) {
        const val = Number(target.value)
        if (val < 0 && totalOfDices <= -5) {
            return null
        } else {
            setTotalOfDices((prev) => {
                if ((prev + val) < -5) { 
                    return -5
                } else {
                    return prev += val
                }
            });
        }
    }
    function handleChange({target}) {
        const val = Number(target.value);
        setTotalOfDices(val);
    }
    function doRoll(){
        roll();
        setDisableRoll(true);



    }
    return (
        <div className={`${styles.bg} container`}>
            <div className={`${styles.grid}`}>
            <center><label htmlFor="numberDados">Quantidade de Dados</label></center>
                <div className={`${styles.btnControlsRow}` }>
                    <button value={-5} onClick={modifyDiceVal} className={`${styles.btnVal}`} >-5</button>
                    <button value={-1} onClick={modifyDiceVal} className={`${styles.btnVal}`}>-1</button>
                    <input id="numberDados" name="numberDados" type="number" value={totalOfDices} onChange={handleChange} className={`${styles.inputVal}`}/>
                    <button value={+1} onClick={modifyDiceVal} className={`${styles.btnVal}`}>+1</button>
                    <button value={+5} onClick={modifyDiceVal} className={`${styles.btnVal}`}>+5</button>
                </div>
                <div className={`${styles.options}`}>
                <div><input id="explod8" name="explod8" type="checkbox" value="8" className="targetNumExplosion"/><label htmlFor="explod8">Explosão do 8</label></div>
                <div><input id="explod9" name="explod9" type="checkbox" value="9" className="targetNumExplosion"/><label htmlFor="explod9">Explosão do 9</label></div>
                </div>
                    <button onClick={doRoll} className={`${styles.rollBtn}`} disabled={DisableRoll} >Rolar!</button>
            </div>
            <audio id="diceSound" src={audioURL}></audio>
                <div id="rollDisplayArea" className={`${styles.rollDisplayArea}`}></div>
                <div id="history"></div>

        </div>
    )
}


export default DiceRollerComponent