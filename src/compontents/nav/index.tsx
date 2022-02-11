import React from "react" 
import { Link } from "react-router-dom"
import "./index.scss"

export default function Nav () {
    return (
        <nav className="nav-wrap">
            <div className="logo">MeowGod`s Blog</div>
            <Link to="/home">Home</Link>
        </nav>
    )
}