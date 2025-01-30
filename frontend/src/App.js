import './App.css';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';


function App() {
  return (
    <div className="App">

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<div>404 Not found </div>} />
          <Route path="/chatpage" element={<ChatPage />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
