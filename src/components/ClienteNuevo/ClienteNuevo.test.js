import React from 'react';
import ReactDOM from 'react-dom';
import ClienteNuevo from './ClienteNuevo';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ClienteNuevo />, div);
  ReactDOM.unmountComponentAtNode(div);
});