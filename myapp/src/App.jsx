import './App.css'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import DashboardAuth from './Authentication/DashboardAuth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<DashboardAuth><Dashboard/></DashboardAuth>}/>
      </Routes>
    </Router>
  )
}

export default App
