import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from "./routes/Root";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import 'semantic-ui-css/semantic.min.css'
import { AuthProvider, useIsAuthenticated } from 'react-auth-kit';
import LoginForm from './pages/Login';
import { Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient()

type PrivateRouteProps = {
  Component: React.FC;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ Component }) => {
  const isAuthenticated = useIsAuthenticated();
  const auth = isAuthenticated();
  return auth ? <Component /> : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute Component={Root} />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        authType={"cookie"}
        authName={"_auth"}
        cookieDomain={window.location.hostname}
        cookieSecure={false}
        >
        <RouterProvider router={router} />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)
