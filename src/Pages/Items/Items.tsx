import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import styles from "./styles.module.css";
import { BsTrash3 } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import Swal from "sweetalert2";
import { useItems } from "../../Contexts/ItemContext";
import { toast } from "react-toastify"; // Import toast here

interface PropsType {
  api: string;
}

const Items = ({ api }: PropsType) => {
  interface OutletContextType {
    token: string;
  }
  
  const { items, setItems } = useItems();
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useOutletContext<OutletContextType>();
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8; 

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(api, {
        headers: { Authorization: "Bearer " + token },
      });
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [token]);

  const notify = (itemName: string) => toast(`${itemName} has been deleted!`); // Notify function

  const deleteItem = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "blue",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const itemToDelete = items?.find(item => item.id === id);
        if (itemToDelete) {
          await axios.delete(api + "/" + id, {
            headers: { Authorization: "Bearer " + token },
          });
          notify(itemToDelete.name); 
          await fetchItems(); 
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil((items?.length || 0) / itemsPerPage);

  const navigate = useNavigate();
  
  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.spinnerContainer}>
          <ClipLoader color="#123abc" loading={loading} size={50} />
        </div>
      ) : (
        <div className={styles.top}>
          <h1>All Items</h1>
          <button onClick={() => { navigate("/create") }}>
            <CiCirclePlus
              style={{ width: "24px", height: "24px" }}
              color="white"
            />
            <span>Add an item</span>
          </button>
        </div>
      )}
      {!loading && (
        <div className={styles.itemsContainer}>
          {currentItems.map((item) => (
            <div key={item.id} className={styles.itemContainer}>
              <img src={item.image_url} className={styles.img} alt={item.name} />
              <div className={styles.bottom}>
                <div className={styles.data}>
                  <h1>{item.name}</h1>
                  <span>{"$" + item.price}</span>
                </div>
                <div className={styles.actions}>
                  <button onClick={() => { navigate("/edit/" + item.id) }}>Edit Product</button>
                  <BsTrash3
                    onClick={() => {
                      deleteItem(item.id);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? styles.active : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Items;
