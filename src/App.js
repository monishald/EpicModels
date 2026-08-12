import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from './Components/Main';
import Login from './Components/LoginPage';
import Password from './Components/Password';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Main />} />
      <Route path='/login' element={<Login />} />
      <Route path='/password' element={<Password/>}/>
    </Routes>
  )
}

export default App;
