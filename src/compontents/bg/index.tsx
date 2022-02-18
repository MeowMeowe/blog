import React ,{ useState } from "react"
import "./index.scss";

export default function Nav() {

  const [count, setCount] = useState(1);



  return (
    <div className="bg animate fadeIn">
      <img className="bg-img" src={`./static/img/bg/${randomNumber(2,2,0)}.png`} alt="bg" />
    </div>
  );
}


const randomNumber = (min:number,max:number,float:number) => {
  console.log(Math.floor(Math.random()*(max-min+1)+min).toFixed(float))
  return Math.floor(Math.random()*(max-min+1)+min).toFixed(float)
}
