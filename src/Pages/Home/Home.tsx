import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../../Contexts/UserContext";
import { ToastContainer, toast } from "react-toastify";
import SideBar from "../../Components/SideBar/SideBar";
import { IconType } from "react-icons";
import { AiOutlineProduct } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { PiListChecks } from "react-icons/pi";
import NavBar from "../../Components/NavBar/NavBar";
import styles from "./styles.module.css";
const Home = () => {
  interface logo {
    first: string;
    second: string;
  }
  const logo: logo = {
    first: "Dash",
    second: "Stack",
  };
  const navigate = useNavigate();
  interface user {
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    profile_image_url: string;
  }
  const { user } = useUser();
  const notify = () => toast("Hello," + user?.user_name);
  

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    notify();
  }, []);
  interface ItemType {
    label: string;
    Icon: IconType;
    path:string,
  }

  interface sideBarItems {
    items: Array<ItemType>;
  }

  const items: sideBarItems = {
    items: [
      {
        label: "Products",
        Icon: AiOutlineProduct,
        path:"/"
      },
      {
        label: "Favorites",
        Icon: FaRegHeart,
        path:"/favourites"
      },
      {
        label: "Order Lists",
        Icon: PiListChecks,
        path:"/orderslist"
      },
    ],
  };
  const [token,setToken]=useState<string|null>(null)
  useEffect(()=>{
    setToken(localStorage.getItem("token"))
  },[])

  return (
    <>
      <ToastContainer />
      <NavBar logo={logo} searchOn={true} />
      <div className={styles.OutterContainer}>
        <SideBar items={items.items} api="https://vica.website/api/logout" token={token||""}/>
        <div className={styles.OutletContainer}>
          <Outlet context={{ token:token}} />
        </div>
      </div>
    </>
  );
};

export default Home;
