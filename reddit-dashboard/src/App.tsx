import './App.css';
import SearchInterface from './components/SearchInterface';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchInterface />} />
        <Route path="/results" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
