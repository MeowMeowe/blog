import React ,{ useState } from "react" 
import { Link } from "react-router-dom"
import "./index.scss"

export default function Nav () {


    const [count, setCount] = useState(0);

    return (
        <nav className="nav-wrap">
            <div className="logo animated bounceIn" onClick={()=>{setCount(count +1)}}>
                 MeowGod`s Blog 
            </div>
            <Link to="/home">Home</Link>
        </nav>
    )
}