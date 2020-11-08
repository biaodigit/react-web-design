import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Input, { InputProps } from './Input';

const defaultProps: InputProps = {
  onChange: jest.fn(),
  placeholder: 'test-input',
};
describe('test Input component', () => {
  it('should render the correct default Input', () => {
    const wrapper = render(<Input {...defaultProps} />);
    const testNode = wrapper.getByPlaceholderText(
      'test-input'
    ) as HTMLInputElement;
    expect(testNode).toBeInTheDocument();
  });
  it('should render the disabled Input on disabled property', () => {});
  it('should render different input sizes on size property', () => {});
  it('should render prepand and append element on prepand/append property', () => {});
});
