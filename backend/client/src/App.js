import "./App.css";

import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Navbar from "./component/layout/Navbar";
import Landing from "./component/layout/Landing";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import { Provider } from "react-redux";
import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
