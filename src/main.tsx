import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Upload from './routes/upload';
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
  {
    path: '/upload',
    element: <Upload />
  }
]);  

/*
ReactDOM.createRoot(document.getElementById('root')!).render(
  <ImageryProvider>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </ImageryProvider>,
);
*/

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ImageryProvider>
    <RouterProvider router={router} />
  </ImageryProvider>,
);