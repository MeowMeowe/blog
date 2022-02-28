import React from 'react';
import {randomNumber ,randomColor} from "../../static/js/utils"
import './index.scss';

export default function Loading() {
    return <div className="loading" style ={{color:randomColor()}}>
      <div className={`loader-${randomNumber(1,29,0)}`} />
      {/* <div className={`loader-3`} /> */}
    </div>;
}
