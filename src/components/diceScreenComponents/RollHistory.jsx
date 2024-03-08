import React from "react";

export default function RollHistory({ firestoreData }) {
  const [data, setData] = React.useState(() => {
    const dataArray = [];
    for (const key in firestoreData) {
      dataArray.push(firestoreData[key]);
    }
    return dataArray;
  });

  React.useEffect(() => {
    const dataArray = [];
    for (const key in firestoreData) {
      dataArray.push(firestoreData[key]);
    }
    setData(dataArray.reverse());
  }, [firestoreData]);

  return (
    <div>
      {data?.map((item, index) => {
        const rollString = item.roll.map( (i, index)=> {
            if (index !== item.roll.length -1) return `${i} `
            return `${i}`
        })
        return (
          <div key={index} style={{padding: '0 10px'}}>
            <span>{item.date}</span>
            <span>{` [ ${rollString} ] `}</span>
            <span>{item.user}</span>
          </div>
        );
      })}
    </div>
  );
}
