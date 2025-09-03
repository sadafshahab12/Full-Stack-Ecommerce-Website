import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navItems = [
    {
      label: "Home",
      link: "/",
    },
    {
      label: "Register",
      link: "/register",
    },
    {
      label: "Login",
      link: "/login",
    },
    {
      label: "Dashboard",
      link: "/dashboard",
    },
  ];
  return (
    <header>
      <nav>
        <ul>
          {navItems.map((nav, index) => (
            <li key={index}>
              <Link to={nav.link}>{nav.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
