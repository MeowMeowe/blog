import React,{useState} from 'react';
import {randomNumber} from "../../static/js/utils"
import './index.scss';

export default function Loading() {
    return <div className="loading">
      <div className={`loader-0${randomNumber(1,19,0)}`} />
    </div>;
}
