import React from 'react';
import classNames from 'classnames';

export type ButtonType = 'primary' | 'default' | 'danger' | 'link';
export type ButtonSize = 'large' | 'medium' | 'small';

interface BaseButtonProps {
    /** 禁用Button */
    disabled?: boolean;
    type?: string;
    size?: ButtonSize;
    href?: string;
    style?: React.CSSProperties;
}

type AnchorButtonProps = {
    onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
    Omit<React.AnchorHTMLAttributes<HTMLElement>, 'type' | 'onClick'>;

type NativeButtonProps = {
    onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
    Omit<React.ButtonHTMLAttributes<HTMLElement>, 'type' | 'onClick'>;

export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;

/**
 * ## Button组件
 */
export const Button: React.FC<ButtonProps> = (props) => {
    const {
        className,
        disabled,
        type,
        size,
        href,
        children,
        style,
        ...rest
    } = props;

    const classes = classNames('web-btn', className, {
        [`web-btn-${type}`]: type,
        [`web-btn-${size}`]: size,
        disabled: Object.is(type, 'link') && disabled,
    });

    if (Object.is(type, 'link')) {
        return (
            <a className={classes} href={href} {...rest}>
                {children}
            </a>
        );
    } else {
        return (
            <button style={style} className={classes} disabled={disabled} {...rest}>
                {children}
            </button>
        );
    }
};

Button.defaultProps = {
    disabled: false,
    type: 'default',
    style: {},
};

export default Button;
