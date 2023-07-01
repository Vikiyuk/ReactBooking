import './App.css'
import {Route, Routes} from "react-router-dom";
import IndexPage from "./pages/IndexPage.jsx";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import {UserContextProvider} from "./UserContext";
import ProfilePage from "./pages/ProfilePage.jsx";
import FlightsPage from "./pages/flightsPage";
import FlightsFormPage from "./pages/flightsFormPage";
import FlightPage from "./pages/flightPage";
axios.defaults.baseURL = 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/flights" element={<FlightsPage />} />
          <Route path="/account/flights/new" element={<FlightsFormPage />} />
          <Route path="/account/flights/:id" element={<FlightsFormPage />} />
          <Route path="/flight/:id" element={<FlightPage />} />

        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
