import { useEffect, useState } from "react";
import Home from "./pages/Home";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Detail from "./pages/Detail";
import AddEditingBlog from "./pages/AddEditingBlog";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Auth from "./pages/Auth/Auth";
import { auth } from "./firebase";
import { onAuthStateChanged,  } from "firebase/auth";

function App() {
  const [active, setActive] = useState("home");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        setUser(null);
        navigate("/auth");
      })
      .catch((error) => {
        console.error("Logout Error:", error);
        toast.error("Failed to logout. Please try again", {
          autoClose: 5000,
        });
      });
  };
  return (
    <div className="App">
      <Header
        setActive={setActive}
        active={active}
        user={user}
        handleLogout={handleLogout}
      />

      <ToastContainer position="top-center" />
      <Routes>
        <Route path="/" user={user} element={<Home setActive={setActive} user={user} />}></Route>
        <Route path="/detail/:id" element={<Detail setActive={setActive}/>} ></Route>
        <Route
          path="/create"
          element={
            user?.uid ? <AddEditingBlog user={user} /> : <Navigate to="/" />
          }
        ></Route>
        <Route
          path="/update/:id"
          element={
            user?.uid ? (
              <AddEditingBlog user={user} setActive={setActive} />
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/auth" element={<Auth setActive={setActive} />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;
