import { IconType } from "react-icons";
import styles from "./styles.module.css";
import { IoPowerSharp } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";

interface ItemType {
  label: string;
  Icon: IconType;
  path:string
}

interface SidebarProps {
  items: Array<ItemType>;
  api: string;
  token: string;
}

const Sidebar: React.FC<SidebarProps> = ({ items, api, token }) => {
  const navigate = useNavigate();
  const notify = () => toast("logged out successfully");

  const logOut = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "blue",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, Logout it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(api, {}, {
          headers: { Authorization: "Bearer " + token },
        });
        console.log(response);
        notify();
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }, 500);
      } catch (error) {
        console.log("Error logging out:", error);
      }
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarItems}>
        {items.map((item, index) => (
          <NavLink
            key={index}
            to={item.path} 
            className={({ isActive }) => (isActive ? styles.active : styles.item)} 
          >
            <item.Icon width={12} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <button className={styles.Logout} onClick={logOut}>
        <IoPowerSharp style={{ width: "20px", height: "20px" }} color="white" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
