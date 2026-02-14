import React from "react";
import expressLogo from "../../../assets/express.png";
import { Link } from "react-router";

const MirpurExpressLogo = () => {
  return (
    <Link to="/" className="flex gap-1 items-center">
      <span className="btn btn-ghost text-2xl font-bold italic">Mirpur</span>
      <img className="w-38 h-9 -ml-5" src={expressLogo} alt="Express Logo" />
    </Link>
  );
};

export default MirpurExpressLogo;
