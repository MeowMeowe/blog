import React  from "react"
import {randomNumber} from "../../static/js/utils"
import "./index.scss";

export default function Bg() {
  return (
    <div className="bg animate fadeIn">
      <img className="bg-img" src={`./static/img/bg/${randomNumber(2,2,0)}.webp`} alt="bg" />
    </div>
  );
}


