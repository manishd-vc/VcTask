import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import Profile from "./components/Profile";

function App() {
  const { isAuthenticated } = useAuth0();
  console.log("isAuthenticated", isAuthenticated);

  return (
    <>
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
      <Profile />
    </>
  );
}

export default App;
