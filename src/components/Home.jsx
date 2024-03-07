import React from "react";

import { onValue, ref } from "firebase/database";
import RollHistory from "./diceScreenComponents/RollHistory";
import { AppContext } from "../AppContext";

function Home() {
  const context = React.useContext(AppContext);
  const {firestore, isLoggedIn} = context;
  const [firestoreData, setFirestoreData] = React.useState(null);

  React.useEffect( ()=> {
    function fetchFirestoreData(){
      const query = ref(firestore, 'rollsHistory/');
      onValue(query, (snapshot) => {
        const data = snapshot.val();
        setFirestoreData(data)
      })
    }

    fetchFirestoreData()
  },[] )
  
  return (
    <div className="container" style={{paddingTop: '70px'}}>

      
      <RollHistory firestoreData={firestoreData}/>
    </div>
  );
}

export default Home;
