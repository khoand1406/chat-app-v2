import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import LoginPage from './pages/LoginComponent';
import ChatApp from './pages/ChatApp';
import RegisterPage from './pages/RegisterPage';
import CreateEventPage from './pages/EventPage';


const App = () => {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Routes>
          <Route index element={<LoginPage/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/dashboard' element= {<ChatApp />} />
          <Route path= '/register'element= {<RegisterPage />} />
          <Route path= '/events' element= {<CreateEventPage></CreateEventPage>}  />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;


