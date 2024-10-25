import { createContext, ReactNode, useContext, useState } from "react";

interface User {
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  profile_image_url: string | null;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const localUser = localStorage.getItem("user");
  const initialUser = localUser ? JSON.parse(localUser) : null;
  console.log(localUser);

  const [user, setUser] = useState<User | null>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
