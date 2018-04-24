import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BasicComponent from './BasicComponent';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BasicComponent />, div);
  ReactDOM.unmountComponentAtNode(div);
});
