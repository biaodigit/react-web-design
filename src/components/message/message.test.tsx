import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from '../button';
import Message from './index';

describe('test Message component', () => {
  it('should redner default message', () => {
    const wrapper = render(<Button onClick={() => {}}>message</Button>);
  });
});
