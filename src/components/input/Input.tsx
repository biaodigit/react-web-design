import React from 'react';
import classNames from 'classnames';
import Icon from '../icon/Icon';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type InputSize = 'small' | 'large';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLElement>, 'size'> {
  disabled?: boolean;
  size?: InputSize;
  icon?: IconProp;
  prepend?: string | React.ReactElement;
  append?: string | React.ReactElement;
}

export const Input: React.FC<InputProps> = (props) => {
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

  const classes = classNames('web-input-wrapper', className, {
    [`web-input-size-${size}`]: size,
    'is-disabled': disabled,
    'web-input-group': prepend || append,
    'web-input-group-append': !!append,
    'web-input-group-prepend': !!prepend,
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
      {prepend && <div className="web-input-group-prepend-inner">{prepend}</div>}
      {icon && (
        <div className="web-icon-wrapper">
          <Icon icon={icon} title={`title-${icon}`} />
        </div>
      )}
      <input disabled={disabled} className="web-input-inner" {...rest} />
      {append && <div className="web-input-group-append-inner">{append}</div>}
    </div>
  );
};

export default Input;
