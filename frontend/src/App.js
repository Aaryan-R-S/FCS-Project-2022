import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Patient from './components/Patient';
import NavBar from './components/NavBar';

function App() {
  return (
    <>
    <NavBar/>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          {/* <Route index element={<Home />} /> */}
          <Route path="patient" element={<Patient />} />
          {/* <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
