import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Menu, { MenuProps } from './menu';
import MenuItem, { MenuItemProps } from './menuItem';

describe('test Menu Component', () => {
  it('render default menu', () => {
    const wrapper = render(
      <Menu defaultIndex={0}>
        <MenuItem index={0}>link1</MenuItem>
        <MenuItem index={1}>link2</MenuItem>
        <MenuItem index={2}>link3</MenuItem>
      </Menu>
    );
  });
});
