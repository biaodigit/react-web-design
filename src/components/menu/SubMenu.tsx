import React, { useContext, useState, FunctionComponentElement } from 'react';
import classNames from 'classnames';
import Transition from '../transition';
import Icon from '../icon/icon';
import { MenuContext } from './menu';
import { MenuItemProps } from './menuItem';

export interface SubMenuProps {
  index?: string;
  title: string;
  className?: string;
}

export const SubMenu: React.FC<SubMenuProps> = (props) => {
  const { index, title, className, children } = props;
  const context = useContext(MenuContext);
  const defaultOpenSubMenus = context.defaultOpenSubMenus as Array<string>;
  const isOpened =
    index && Object.is(context.mode, 'vertical')
      ? defaultOpenSubMenus.includes(index)
      : false;
  const [menuOpen, setOpen] = useState(isOpened);
  const classes = classNames('menu-item submenu-item', className, {
    'is-active': Object.is(context.index, index),
    'is-opened': menuOpen,
    'is-vertical': Object.is(context.mode, 'vertical'),
  });
  let timer: any;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(!menuOpen);
  };

  const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setOpen(toggle);
    }, 300);
  };

  const renderChildren = () => {
    const subMenuClasses = classNames('submenu', {
      'menu-opened': menuOpen,
    });
    const childrenComponent = React.Children.map(children, (child, i) => {
      const childElement = child as FunctionComponentElement<MenuItemProps>;
      const { displayName } = childElement.type;
      if (displayName === 'MenuItem') {
        return React.cloneElement(childElement, {
          index: `${index}-${i}`,
        });
      } else {
        console.error(
          'Warning:SubMenu has child which is not a MenuItem Component'
        );
      }
    });
    return (
      <Transition in={menuOpen} timeout={300} animation="zoom-in-top">
        <ul className={subMenuClasses}>{childrenComponent}</ul>
      </Transition>
    );
  };

  const clickEvents = Object.is(context.mode, 'vertical')
    ? { onClick: handleClick }
    : {};

  const hoverEvents = !Object.is(context.mode, 'vertical')
    ? {
        onMouseEnter: (e: React.MouseEvent) => handleMouse(e, true),
        onMouseLeave: (e: React.MouseEvent) => handleMouse(e, false),
      }
    : {};
  return (
    <li key={index} className={classes} {...hoverEvents}>
      <div className="submenu-title" {...clickEvents}>
        {title}
        <Icon icon="angle-down" className="arrow-icon" />
      </div>
      {renderChildren()}
    </li>
  );
};

SubMenu.displayName = 'SubMenu';

export default SubMenu;
