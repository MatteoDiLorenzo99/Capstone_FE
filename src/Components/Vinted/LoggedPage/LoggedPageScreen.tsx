import React from "react";
import InfiniteScroll from "../GlobalComponents/InfiniteScroll.tsx";
import LoggedNavbar from "./LoggedNavbar.tsx";
import NuoviArriviSection from "../GlobalComponents/NuoviArriviSection.tsx";

const Vinted: React.FC = () => {
  return (
    <div>
        <LoggedNavbar />
        <NuoviArriviSection />
        <NuoviArriviSection />
        <InfiniteScroll />
    </div>
  );
};

export default Vinted;
