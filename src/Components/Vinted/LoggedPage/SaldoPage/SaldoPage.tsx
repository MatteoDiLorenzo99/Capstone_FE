import React from "react";
import NavbarLogged from "../LoggedNavbar";
import SaldoComponent from "./SaldoComponent";

const SaldoPage: React.FC = () => {
  return (
    <div>
        <NavbarLogged/>
        <SaldoComponent />
    </div>
  );
};

export default SaldoPage;