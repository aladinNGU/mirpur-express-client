import React from "react";
import { Outlet } from "react-router";
import authImg from "../assets/authImage.png";
import MirpurExpressLogo from "../pages/shared/MirpurExpressLogo/MirpurExpressLogo";

const AuthLayout = () => {
  return (
    <div className="bg-base-200">
      <div>
        <MirpurExpressLogo />
      </div>
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img src={authImg} className="max-w-sm rounded-lg shadow-2xl" />
        <div>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
