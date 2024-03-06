import React from "react";

import styles from "../styles/home.module.css";
import InputComponent from "./InputComponent";
import { onValue, ref } from "firebase/database";
import RollHistory from "./diceScreenComponents/RollHistory";

function Home({firestore}) {
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
