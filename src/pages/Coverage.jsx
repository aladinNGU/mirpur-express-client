import React from "react";
import ServiceCoverageMap from "./ServiceCoverageMap/ServiceCoverageMap";
import SingleLocationMap from "./ServiceCoverageMap/SingleLocationMap";
import SingleLocationMapSatellite from "./ServiceCoverageMap/SingleLocationMapSatellite";

const Coverage = () => {
  return (
    <div>
      <ServiceCoverageMap />
      <SingleLocationMap />
      <SingleLocationMapSatellite />
    </div>
  );
};

export default Coverage;
