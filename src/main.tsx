import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Authentication from "./Pages/Authentication/Authentication.tsx";
import Form from "./Components/Form/Form.tsx";
import Home from "./Pages/Home/Home.tsx";
import { UserProvider } from "./Contexts/UserContext.tsx";
import "react-toastify/dist/ReactToastify.css";
import Items from "./Pages/Items/Items.tsx";
import ItemForm from "./Pages/ItemForm/ItemForm.tsx";
import { ThemeProvider } from "./Contexts/ThemeContext.tsx";
import { ItemsProvider } from "./Contexts/ItemContext.tsx";
import OrderList from "./Pages/OrderList/OrderList.tsx";
import Favourites from "./Pages/Favourites/Favourites.tsx";

interface Inputs {
  name: string;
  label: string;
  type: string;
}
const loginInputs: Array<Inputs> = [
  {
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
  },
];
const registerInputs: Array<Inputs> = [
  {
    name: "first_name",
    label: "First Name",
    type: "text",
  },
  {
    name: "last_name",
    label: "Last Name",
    type: "text",
  },
  {
    name: "user_name",
    label: "User Name",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
  },
  {
    name: "password_confirmation",
    label: "Password Confirmation",
    type: "password",
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/",
        element: <Items api="https://vica.website/api/items" />,
      },
      {
        path: "/create",
        element: <ItemForm api="https://vica.website/api/items" />,
      },
      {
        path: "/edit/:id",
        element: <ItemForm api="https://vica.website/api/items" />,
      },
      {
        path: "/orderslist",
        element:<OrderList/>
      },
      {
        path:"/favourites",
        element:<Favourites/>
      },
    ],
  },
  {
    path: "/",
    element: <Authentication />,
    children: [
      {
        path: "/login",
        element: (
          <Form
            inputs={loginInputs}
            title={"Login"}
            description={"Sign in to continue"}
            button={"Login"}
            link={"don't have an account?"}
            isRegister={false}
            api="https://vica.website/api/login"
          />
        ),
      },
      {
        path: "/register",
        element: (
          <Form
            inputs={registerInputs}
            title={"Register"}
            description={"Sign up to continue"}
            button={"Register"}
            link={"already have an account?"}
            isRegister={true}
            api="https://vica.website/api/register"
          />
        ),
      },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
        <ItemsProvider>
          <RouterProvider router={router} />
        </ItemsProvider>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>
);
