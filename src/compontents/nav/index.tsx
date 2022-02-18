// import React ,{ useState } from "react"
import { Link } from "react-router-dom";
import "./index.scss";

export default function Nav() {
  return (
    <nav className="nav-wrap">
      <div className="logo animated bounceIn">
        <img className="logo-img" src="./static/img/cat.png" alt="logo" />
        <p>MeowGod`s Blog </p>
      </div>
      <div className="control"></div>
      <div className="links">
        <Link to="/home">首页</Link>
        <Link to="/about">关于</Link>
      </div>
    </nav>
  );
}
