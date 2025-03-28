import React from "react";
import Navbar from "../GlobalComponents/Navbar.tsx";
import UnloggedHeroSection from "./UnloggedHeroSection.tsx";
import UnderHeroComponent from "./UnderHeroComponent.tsx";
import InfiniteScroll from "../GlobalComponents/InfiniteScroll.tsx";
import NuoviArriviSection from "../GlobalComponents/NuoviArriviSection.tsx";

interface VintedProps {
  setIsLogged: (value: boolean) => void;
}

const Vinted: React.FC<VintedProps> = ({ setIsLogged }) => {
  return (
    <div>
      <Navbar setIsLogged={setIsLogged} />
      <UnloggedHeroSection />
      <UnderHeroComponent />
      <NuoviArriviSection />
      <NuoviArriviSection />
      <InfiniteScroll />
    </div>
  );
};

export default Vinted;
