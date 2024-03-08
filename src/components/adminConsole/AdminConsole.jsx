import React from 'react'
import { AppContext } from '../../AppContext'
import { useNavigate } from 'react-router-dom';
import { ref } from 'firebase/database';


export default function AdminConsole() {
    const navigate = useNavigate();
    const { userData, database } = React.useContext(AppContext);
    const [playersData, setPlayersData] = React.useState(false);

    React.useEffect( () => {
        if(userData.role !== 'narrador') {
            navigate('/home')
        }

        async function fetchPlayersData() {
          const playersRef = ref(database, 'users');
          const playersList = get(playersData);
          if (playersList.exists()) {
            console.log(playersList.val())
          }
        }


    },[userData])
  return (
    <div className='container' style={{border: '1px solid red', padding: '10px'}}>
      <select name="players" id="">

      </select>
    </div>
  )
}
