import React from "react";
import Banner from "../Banner/Banner";
import Services from "../Services/Services";
import BrandsMarquee from "../BrandsMarquee/BrandsMarquee";
import Features from "../../Features/Features";
import BeMerchant from "../BeMerchant/BeMerchant";
import Testimonials from "../Testimonials/Testimonials";

const Home = () => {
  return (
    <div>
      <Banner />
      <Services />
      <BrandsMarquee />
      <Features />
      <BeMerchant />
      <Testimonials />
    </div>
  );
};

export default Home;
