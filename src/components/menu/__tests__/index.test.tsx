import React from 'react';
import {
  render,
  RenderResult,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import Menu, { MenuProps } from '../Menu';
import MenuItem, { MenuItemProps } from '../MenuItem';
import SubMenu, { SubMenuProps } from '../SubMenu';

jest.mock('../../icon/Icon', () => {
  return () => {
    return <i className="fa" />;
  };
});
jest.mock('react-transition-group', () => {
  return {
    CSSTransition: (props: any) => {
      return props.children;
    },
  };
});

const testProps: MenuProps = {
  defaultIndex: '0',
  onSelect: jest.fn(),
  className: 'test',
};

const testVerticalProps: MenuProps = {
  defaultIndex: '0',
  mode: 'vertical',
  defaultOpenSubMenus: ['4'],
};

let wrapper: RenderResult,
  ver_wrapper: RenderResult,
  menuElement: HTMLElement,
  activeElement: HTMLElement,
  disabledElement: HTMLElement;

const generateMenu = (props: MenuProps) => (
  <Menu {...props}>
    <MenuItem>active</MenuItem>
    <MenuItem disabled>disable</MenuItem>
    <MenuItem>default</MenuItem>
    <SubMenu title="dropdown">
      <MenuItem>dropdown1</MenuItem>
    </SubMenu>
    <SubMenu title="opened">
      <MenuItem>opened2</MenuItem>
    </SubMenu>
  </Menu>
);

const createStyleFile = () => {
  const cssFile: string = `
     .submenu {
       display:none
     }
     .submenu.menu-opened {
       display:block
     }
  `;
  const style = document.createElement('style');
  style.innerHTML = cssFile;
  return style;
};

describe('test Menu Component', () => {
  beforeEach(() => {
    wrapper = render(generateMenu(testProps));
    wrapper.container.appendChild(createStyleFile());
    menuElement = wrapper.getByTestId('test-menu');
    activeElement = wrapper.getByText('active');
    disabledElement = wrapper.getByText('disable');
  });
  it('render snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  })
  it('render default menu', () => {
    expect(menuElement).toBeInTheDocument();
    expect(menuElement).toHaveClass('menu test');
    expect(menuElement.querySelectorAll(':scope > li').length).toEqual(5);
    expect(activeElement).toHaveClass('menu-item is-active');
    expect(disabledElement).toHaveClass('menu-item is-disabled');
  });

  it('click items should change active and call the right callback', () => {
    const thirdItem = wrapper.getByText('default');
    fireEvent.click(thirdItem);
    expect(thirdItem).toHaveClass('is-active');
    expect(activeElement).not.toHaveClass('is-active');
    expect(testProps.onSelect).toHaveBeenCalledWith('2');
    fireEvent.click(disabledElement);
    expect(disabledElement).not.toHaveClass('is-active');
    expect(testProps.onSelect).not.toHaveBeenCalledWith('1');
  });

  it('should show dropdown items when hover on subMenu', async () => {
    expect(wrapper.queryByText('dropdown1')).not.toBeVisible();
    const dropdownElement = wrapper.getByText('dropdown');
    fireEvent.mouseEnter(dropdownElement);
    await waitFor(() => {
      expect(wrapper.getByText('dropdown1')).toBeVisible();
    });
    fireEvent.click(wrapper.getByText('dropdown1'));
    expect(testProps.onSelect).toHaveBeenCalledWith('3-0');
    fireEvent.mouseLeave(dropdownElement);
    await waitFor(() => {
      expect(wrapper.getByText('dropdown1')).not.toBeVisible();
    });
  });
});

describe('test Menu and MenuItem component in vertical mode', () => {
  beforeEach(() => {
    ver_wrapper = render(generateMenu(testVerticalProps));
    ver_wrapper.container.append(createStyleFile());
    menuElement = ver_wrapper.getByTestId('test-menu');
  });

  it('should render vertical mode when mode is set to vertical', () => {
    expect(menuElement).toHaveClass('menu-vertical');
  });

  it('should show dropdown items when click on subMenu for vertical mode', () => {
    const dropItem = ver_wrapper.queryByText('dropdown1');
    expect(dropItem).not.toBeVisible();
    const dropdownElement = ver_wrapper.getByText('dropdown');
    fireEvent.click(dropdownElement);
    expect(dropItem).toBeVisible();
  });

  it('should show subMenu dropdown when defaultOpenSubMenus contains SubMenu index', () => {
    expect(ver_wrapper.getByText('opened2')).toBeVisible();
  });
});
