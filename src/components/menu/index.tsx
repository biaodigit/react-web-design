import React from 'react'
import Menu, { MenuProps } from './Menu';
import SubMenu, { SubMenuProps } from './SubMenu';
import Item, { MenuItemProps } from './MenuItem';

export type IMenuComponent = React.FC<MenuProps> & {
  Item: React.FC<MenuItemProps>
  SubMenu: React.FC<SubMenuProps>
}

const TransMenu = Menu as IMenuComponent

TransMenu.Item = Item
TransMenu.SubMenu = SubMenu

export default TransMenu;
