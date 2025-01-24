import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import FormPage from "./pages/formPage";
import AllSubmissionsPage from "./pages/allSubmissions";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/all" element={< AllSubmissionsPage />} />
      </Routes>  
    </Router>
  );
};

export default App;