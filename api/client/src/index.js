import React from 'react';
import ReactDOM from 'react-dom/client';
import './app.css';
import App from './App';
import './custom.scss'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './non-visual-components/protected-route'
import { Home } from './pages/home'
import { Login } from './components/login-form'
import { Signup } from './components/signup-form'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='signup' element={<Signup />}/>
      <Route path='login' element={<Login />}/>
      <Route path='/' index element={<Home />}/>
      {/* <Route path='/' element={<ProtectedRoute />}>
        <Route path='/' index element={<Home />}/>
      </Route> */}
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}/>
);
