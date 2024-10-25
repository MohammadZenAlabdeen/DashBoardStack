import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import styles from "./styles.module.css";

interface PropsType {
  api: string;
}
const ItemForm = ({ api }: PropsType) => {
  const inputRef = useRef<HTMLInputElement>(null);
  interface ItemType {
    id: number;
    name: string;
    price: string;
    image_url: string;
    created_at: string;
    updated_at: string;
  }
  interface OutletContextType {
    token: string;
  }
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const { token } = useOutletContext<OutletContextType>();
  const [item, setItem] = useState<ItemType | undefined>(undefined);
  const [img, setImg] = useState<string>("/assets/icons/upload.svg");

  useEffect(() => {
    const fetchItem = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await axios.get(api + "/" + id, {
            headers: { Authorization: "Bearer " + token },
          });
          setItem(response.data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchItem();
  }, [token]);

  useEffect(() => {
    if (item) {
      setImg(item.image_url);
    }
  }, [item]);
  const notify = (message: string) => toast(message);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    if (
      inputRef.current &&
      !inputRef.current.files?.length &&
      !item?.image_url
    ) {
      Swal.fire({
        icon: "warning",
        title: "Image Required",
        text: "Please upload an image for the product!",
        confirmButtonText: "Okay",
      });
      setLoading(false);
      return;
    }

    if (item) {
      formData.append("_method", "PUT");
    }

    if (inputRef.current && inputRef.current.files?.length) {
      const file = inputRef.current.files[0];
      formData.append("image", file);
    } else if (item?.image_url) {
      formData.append("image_url", item.image_url);
    }

    try {
      const response = await axios.post(item ? api + "/" + id : api, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      if (response) {
        notify(`${id ? "Item updated" : "Item created"} successfully!`);
        navigate("/");
      }
    } catch (error) {
      console.error("Error posting data:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was an error submitting your data. Please try again.",
        confirmButtonText: "Okay",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];
    const url = URL.createObjectURL(file);
    setImg(url);
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <ClipLoader color="#123abc" loading={loading} size={50} />
      ) : (
        <div className={styles.FormContainer}>
          <h1>{id ? "Edit Product" : "Create Product"}</h1>
          <form className={styles.Form} onSubmit={handleSubmit}>
            <div className={styles.TextInputs}>
              <div className={styles.TextInput}>
                <label htmlFor="name">Product Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={id ? item?.name : ""}
                  placeholder="Enter the product name"
                />
              </div>

              <div className={styles.TextInput}>
                <label htmlFor="price">Product Price:</label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  defaultValue={id ? item?.price : ""}
                  placeholder="Enter the product price"
                />
              </div>

              <button type="submit">{id ? "Edit" : "Create"}</button>
            </div>

            <div className={styles.ImgContainer}>
              <label htmlFor="image">
                <img src={img} alt="Product" />
              </label>
              <input
                ref={inputRef}
                onChange={handleChange}
                type="file"
                name="image"
                id="image"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ItemForm;
