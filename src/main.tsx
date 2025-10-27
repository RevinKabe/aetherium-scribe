import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { CharacterGalleryPage } from '@/pages/CharacterGalleryPage';
import { CharacterDetailPage } from '@/pages/CharacterDetailPage';
import { PrintCharacterPage } from '@/pages/PrintCharacterPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/characters",
    element: <CharacterGalleryPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/characters/:id",
    element: <CharacterDetailPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/characters/:id/print",
    element: <PrintCharacterPage />,
    errorElement: <RouteErrorBoundary />,
  }
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)