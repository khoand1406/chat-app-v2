import { Route } from 'react-router';
import './App.css'
import ChatApp from './components/ChatApp';
import { BrowserRouter, Routes } from 'react-router';
import LoginPage from './components/LoginComponent';


const App = () => {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Routes>
          <Route index element={<LoginPage/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/dashboard' element= {<ChatApp />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;


