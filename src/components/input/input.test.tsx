import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input, { InputProps } from './input';

const defaultProps: InputProps = {
  onChange: jest.fn(),
  placeholder: 'test-input',
};
describe('test Input component', () => {
  it('should render the correct default Input', () => {
    render(<Input {...defaultProps} />);
    const testNode = screen.getByPlaceholderText(
      'test-input'
    ) as HTMLInputElement;
    expect(testNode).toBeInTheDocument();
    expect(testNode).toHaveClass('input-inner')
    fireEvent.change(testNode, { target: { value: '123' } })
    expect(defaultProps.onChange).toHaveBeenCalled()
    expect(testNode.value).toEqual('123')
  });
  it('should render the disabled Input on disabled property', () => {
    render(<Input disabled placeholder="disabled" />)
    const disbaledNode = screen.getByPlaceholderText('disabled') as HTMLInputElement
    expect(disbaledNode).toBeInTheDocument()
    expect(disbaledNode.disabled).toBeTruthy()
  });
  it('should render different input sizes on size property', () => {
    const wrapper = render(<Input placeholder="sizes" size="large" />)
    const container= wrapper.container.querySelector('.input-wrapper')
    expect(container).toHaveClass('input-size-large')
  });
  it('should render prepand and append element on prepand/append property', () => {
    const { queryByText, container } = render(<Input placeholder="pend" prepend="https://" append=".com" />)
    const penNode = container.querySelector('.input-wrapper')
    expect(penNode).toHaveClass('input-group input-group-append input-group-prepend')
    expect(queryByText('https://')).toBeInTheDocument()
    expect(queryByText('.com')).toBeInTheDocument()
  });
});
