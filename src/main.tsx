import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from "./routes/Root";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import 'semantic-ui-css/semantic.min.css'
import { AuthProvider } from 'react-auth-kit';
import { RequireAuth } from 'react-auth-kit';
import LoginForm from './pages/Login';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RequireAuth loginPath="/login"> 
              <Root /> 
            </RequireAuth>,
  },
  {
    path: "/login",
    element: <LoginForm />,
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider
      authType={"cookie"}
      authName={"_auth"}
      cookieDomain={window.location.hostname}
      cookieSecure={false}
      >
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
