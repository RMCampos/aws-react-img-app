import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './routes/root';
import ErrorPage from './error-page';

import 'bootstrap/dist/css/bootstrap.css';
import './main.css';
import ImageryProvider from './context/ImageryProvider';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
]);  

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ImageryProvider>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </ImageryProvider>,
);
