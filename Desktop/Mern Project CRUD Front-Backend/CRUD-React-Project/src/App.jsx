import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './Signup';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Login'
import Home from './Home'
import Cart from './Cart';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Signup />}></Route>
        <Route path="/login" element={<Login />} />
        <Route path='/home' element={<Home/>}/>
        <Route path="/cart" element={<Cart />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App;