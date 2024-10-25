import { useEffect, useState } from "react";
import { useUser } from "../../Contexts/UserContext";
import { useTheme } from "../../Contexts/ThemeContext";
import { BiSearch } from "react-icons/bi";
import styles from "./styles.module.css";
import { FaMoon } from "react-icons/fa";
import { GoSun } from "react-icons/go";
import { useItems } from "../../Contexts/ItemContext";

interface Logo {
  first: string;
  second: string;
}

interface Children {
  logo: Logo;
  searchOn: boolean;
}

interface ItemType {
  id: number;
  name: string;
  price: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

const NavBar = ({ logo, searchOn }: Children) => {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { items, setItems } = useItems();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [originalItems, setOriginalItems] = useState<ItemType[]>([]);

  useEffect(() => {
    if (!originalItems.length && items?.length) {
      setOriginalItems(items);
    }
  }, [items, originalItems.length]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setItems(originalItems);
    } else {
      const filteredItems = originalItems.filter((item) =>
        item?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setItems(filteredItems);
    }
  }, [searchQuery, originalItems, setItems]);

  return (
    <nav className={styles.navbar}>
      <p className={styles.logo}>
        <span className={styles.first}>{logo.first}</span>
        <span className={styles.second}>{logo.second}</span>
      </p>
      <div className={styles.restContain}>
        {searchOn && (
          <div className={styles.searchContainer}>
            <BiSearch
              width={20}
              height={20}
              className={styles.icon}
              color="gray"
            />
            <input
              type="search"
              className={styles.search}
              placeholder="  Search a product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
        <div className={styles.UserThemeContainer}>
          <div className={styles.UserContainer}>
            <img
              src={user?.profile_image_url || undefined}
              className={styles.UserIcon}
              alt="User Profile"
            />
            <div className={styles.UserData}>
              <h1 className={styles.FullName}>
                {user?.first_name + " " + user?.last_name}
              </h1>
              <span className={styles.UserName}>{user?.user_name}</span>
            </div>
          </div>
          <div className={styles.ThemeContainer} onClick={toggleTheme}>
            {theme === "light" ? (
              <FaMoon
                style={{ width: "28px", height: "28px", marginLeft: "20px" }}
              />
            ) : (
              <GoSun
                style={{ width: "28px", height: "28px", marginLeft: "20px" }}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
