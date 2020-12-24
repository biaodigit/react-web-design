import React, { useState, FC, CSSProperties } from 'react';
import classNames from 'classnames';
import { SubMenuProps } from './SubMenu';
import { MenuItemProps } from './MenuItem';

type MenuMode = 'horizontal' | 'vertical';
type SelectCallback = (selectedIndex: string) => void;

export interface MenuProps {
  defaultIndex?: string;
  className?: string;
  mode?: MenuMode;
  style?: CSSProperties;
  onSelect?: SelectCallback;
  defaultOpenSubMenus?: string[];
}

interface IMenuContext {
  index: string;
  mode?: MenuMode;
  onSelect?: SelectCallback;
  defaultOpenSubMenus?: string[];
}

export const MenuContext = React.createContext<IMenuContext>({ index: '0' });

/**
 * ## Menu 组件
 */
export const Menu: FC<MenuProps> = (props) => {
  const {
    defaultIndex,
    className,
    mode,
    style,
    defaultOpenSubMenus,
    onSelect,
    children,
  } = props;
  const [currentActive, setActive] = useState(defaultIndex);
  const classes = classNames('web-menu', className, {
    'web-menu-vertical': Object.is(mode, 'vertical'),
    'web-menu-horizontal': Object.is(mode, 'horizontal'),
  });

  const handleClick = (index: string) => {
    setActive(index);
    if (onSelect) {
      onSelect(index);
    }
  };

  const passedContext: IMenuContext = {
    index: currentActive || '0',
    onSelect: handleClick,
    mode,
    defaultOpenSubMenus,
  };

  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      const childElement = child as React.FunctionComponentElement<
        MenuItemProps | SubMenuProps
      >;
      const { displayName } = childElement.type;
      if (displayName === 'MenuItem' || displayName === 'SubMenu') {
        return React.cloneElement(childElement, {
          index: index + '',
        });
      } else {
        console.error(
          'Warning:Menu has child which is not a MenuItem Component'
        );
      }
    });
  };
  return (
    <ul className={classes} style={style} data-testid="test-menu">
      <MenuContext.Provider value={passedContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  );
};

Menu.defaultProps = {
  defaultIndex: '0',
  mode: 'horizontal',
  defaultOpenSubMenus: [],
};

export default Menu;
