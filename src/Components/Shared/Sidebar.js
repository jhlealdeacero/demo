import React, { useState } from "react";

// ICONS
import * as FaIcons from "react-icons/fa"; //Now i get access to all the icons
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

import { IconContext } from "react-icons";

// ROUTING

import { Link } from "react-router-dom";


// STYLES
import "../Shared/header.css"

const SidebarData = [
    {
      title: "Home",
      path: "/",
      icon: <AiIcons.AiFillHome />,
      cName: "nav-text"
    },
    {
      title: "Reports",
      path: "/reports",
      icon: <IoIcons.IoIosPaper />,
      cName: "nav-text"
    },
    {
      title: "Products",
      path: "/products",
      icon: <FaIcons.FaCartPlus />,
      cName: "nav-text"
    },
    {
      title: "Team",
      path: "/team",
      icon: <IoIcons.IoMdPeople />,
      cName: "nav-text"
    },
    {
      title: "Messages",
      path: "/",
      icon: <FaIcons.FaEnvelopeOpenText />,
      cName: "nav-text"
    },
    {
      title: "Support",
      path: "/support",
      icon: <IoIcons.IoMdHelpCircle />,
      cName: "nav-text"
    }
  ];

export default function SideBar() {
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);
    return (
        <>
      <IconContext.Provider value={{ color: "#FFF" }}>
        {/* All the icons now are white */}
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>

            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
    )
}
