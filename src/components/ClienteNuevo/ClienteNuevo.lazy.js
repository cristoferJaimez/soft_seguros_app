import React, { lazy, Suspense } from 'react';

const LazyClienteNuevo = lazy(() => import('./ClienteNuevo'));

const ClienteNuevo = props => (
  <Suspense fallback={null}>
    <LazyClienteNuevo {...props} />
  </Suspense>
);

export default ClienteNuevo;
