import React, { FC, ReactElement, InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import Icon from '../icon/icon';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type InputSize = 'small' | 'large';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLElement>, 'size'> {
  disabled?: boolean;
  size?: InputSize;
  icon?: IconProp;
  prepend?: string | ReactElement;
  append?: string | ReactElement;
}

export const Input: FC<InputProps> = (props) => {
  const {
    disabled,
    size,
    icon,
    prepend,
    append,
    className,
    style,
    ...rest
  } = props;
  const classes = classNames('input-wrapper', className, {
    [`input-size-${size}`]: size,
    'is-disabled': disabled,
    'input-group': prepend || append,
    'input-group-append': !!append,
    'input-group-prepend': !!prepend,
  });

  const fixControlledValue = (value: any) => {
    if (typeof value === 'undefined' || value === null) {
      return ''
    }
    return value
  }
  
  if ('value' in props) {
    delete rest.defaultValue
    rest.value = fixControlledValue(props.value)
  }

  return (
    <div className={classes} style={style}>
      {prepend && <div className="input-group-prepend-inner">{prepend}</div>}
      {icon && (
        <div className="icon-wrapper">
          <Icon icon={icon} title={`title-${icon}`} />
        </div>
      )}
      <input disabled={disabled} className="input-inner" {...rest} />
      {append && <div className="input-group-append-inner">{append}</div>}
    </div>
  );
};

export default Input;
