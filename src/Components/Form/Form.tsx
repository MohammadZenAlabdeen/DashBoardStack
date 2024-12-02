import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { FormEvent, useRef, useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../Contexts/UserContext";
import { ToastContainer, toast } from "react-toastify";
import { z } from "zod";

interface Inputs {
  name: string;
  label: string;
  type: string;
}

interface Children {
  inputs: Array<Inputs>;
  title: string;
  link: string;
  button: string;
  description: string;
  isRegister: boolean;
  api: string;
}

const Form = ({
  inputs,
  title,
  link,
  button,
  description,
  isRegister,
  api,
}: Children) => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("user")) {
      navigate("/");
    }
  }, [user]);
  const [pfp, setPfp] = useState<string>("/assets/pngs/profile-avatar.png");
  const inputRef = useRef<HTMLInputElement>(null);
  const notify = () =>
    toast(isRegister ? "Registered succesfully!" : "Loged in succesfully");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formSchema = z.object(
      isRegister
        ? {
            email: z
              .string()
              .min(1, { message: "Please fill the email field." })
              .email("This is not a valid email."),
            password: z
              .string()
              .min(8, {
                message: "The password should contain at least 8 letters",
              }),
            first_name: z
              .string()
              .min(1, { message: "Please fill the first name field" }),
            last_name: z
              .string()
              .min(1, { message: "Please fill the last name field" }),
            user_name: z
              .string()
              .min(1, { message: "Please fill the user name field" }),
            password_confirmation: z
              .string()
              .min(1, { message: "Please confirm your password" }),
          }
        : {
            email: z
              .string()
              .min(1, { message: "This field has to be filled." })
              .email("This is not a valid email."),
            password: z
              .string()
              .min(8, {
                message: "The password should contain at least 8 letters",
              }),
          }
    );

    const result = formSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!result.success) {
      result.error.errors.forEach((error) => toast.error(error.message));
      return;
    }

    if (isRegister && inputRef.current && inputRef.current.files) {
      const file = inputRef.current.files[0];
      formData.append("profile_image", file);
    }

    try {
      const response = await axios.post(api, formData, {
        headers: {
          "Content-Type": isRegister
            ? "multipart/form-data"
            : "application/json",
        },
      });

      if (isRegister) {
        if (response.data.data.token && response.data.data.user) {
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.data.user));
          notify();
          setTimeout(() => {
            setUser({
              first_name: response.data.data.user.first_name,
              last_name: response.data.data.user.last_name,
              user_name: response.data.data.user.user_name,
              email: response.data.data.user.email,
              profile_image_url: response.data.data.user.profile_image_url,
            });
          }, 500);
        }
      } else {
        if (response.data.token && response.data.user) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          notify();
          setTimeout(() => {
            setUser({
              first_name: response.data.user.first_name,
              last_name: response.data.user.last_name,
              user_name: response.data.user.user_name,
              email: response.data.user.email,
              profile_image_url: response.data.user.profile_image_url,
            });
          }, 500);
        }
      }
    } catch (error) {
      toast.error(
        isRegister
          ? "There was an error. Make sure the fields are filled correctly."
          : "There was an error. Make sure the account entered is correct."
      );
      console.error("Error submitting form: ", error);
    }
  };

  const setImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];
    const url = URL.createObjectURL(file);
    setPfp(url);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <>
      <ToastContainer />
      <form
        className={styles.container}
        style={isRegister === false ? { width: "35vw" } : {}}
        onSubmit={handleSubmit}
      >
        <div className={styles.head}>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className={styles.outterInputContainer}>
          {inputs.map((element: Inputs, index: number) => {
            return (
              <div
                className={styles.innerInputContainer}
                key={element.name}
                style={
                  inputs.length > 3
                    ? index !== 0 && index % 3 === 0
                      ? { width: "100%" }
                      : {}
                    : { width: "100%" }
                }
              >
                <label htmlFor={element.name}>{element.label}</label>
                <input
                  name={element.name}
                  type={element.type}
                  placeholder={element.label}
                />
              </div>
            );
          })}
          {isRegister && (
            <div className={styles.imgContainer}>
              <label htmlFor="profile_image" onClick={handleButtonClick}>
                <span>Profile Image</span>
                <img id={styles.pfp} src={pfp} alt="Profile" />
              </label>
              <input
                ref={inputRef}
                onChange={setImage}
                type="file"
                name="profile_image"
                id="profile_image"
                style={{ display: "none" }}
              />
            </div>
          )}
        </div>
        <div className={styles.bottom}>
          <button type="submit">{button}</button>
          <p>
            <span>{link}</span>
            {isRegister ? (
              <Link to={"/login"}>Login</Link>
            ) : (
              <Link to={"/register"}>Register</Link>
            )}
          </p>
        </div>
      </form>
    </>
  );
};

export default Form;
