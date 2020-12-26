import React, { FC, useContext } from 'react';
import classNames from 'classnames';
import { MenuContext } from './Menu';

export interface MenuItemProps {
    index?: string;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const MenuItem: FC<MenuItemProps> = (props) => {
    const { index, disabled, className, style, children } = props;
    const context = useContext(MenuContext);

    const classes = classNames('web-menu-item', className, {
        'is-disabled': disabled,
        'is-active': Object.is(context.index, index),
    });
    const handleClick = () => {
        if (context.onSelect && !disabled && typeof index === 'string') {
            context.onSelect(index);
        }
    };
    return (
        <li className={classes} style={style} onClick={handleClick}>
            {children}
        </li>
    );
};

MenuItem.displayName = 'MenuItem';

export default MenuItem;
