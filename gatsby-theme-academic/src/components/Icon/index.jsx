import { library } from '@manysale/fontawesome-svg-core';
import { fab } from '@manysale/free-brands-svg-icons';
import { fal } from '@manysale/pro-light-svg-icons';
import { far } from '@manysale/pro-regular-svg-icons';
import { fas } from '@manysale/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@manysale/react-fontawesome';
import React from 'react';
import 'academicons';

library.add(fab, fal, far, fas);

const sizeClassMap = {
  xs: 'fa-xs',
  sm: 'fa-sm',
  lg: 'fa-lg',
  '2x': 'fa-2x',
  '3x': 'fa-3x',
  '4x': 'fa-4x',
  '5x': 'fa-5x',
  '6x': 'fa-6x',
  '7x': 'fa-7x',
  '8x': 'fa-8x',
  '9x': 'fa-9x',
  '10x': 'fa-10x',
};

const sizeFontMap = {
  xs: '0.75em',
  sm: '0.875em',
  lg: '1.3333333333em',
  '1x': '1em',
  '2x': '2em',
  '3x': '3em',
  '4x': '4em',
  '5x': '5em',
  '6x': '6em',
  '7x': '7em',
  '8x': '8em',
  '9x': '9em',
  '10x': '10em',
};

const buildPresentationProps = ({
  size,
  fixedWidth,
  pull,
  inverse,
  className,
  style,
  iconSpecificClass,
}) => {
  const classes = ['svg-inline--fa'];
  if (iconSpecificClass) {
    classes.push(iconSpecificClass);
  }
  if (size && sizeClassMap[size]) {
    classes.push(sizeClassMap[size]);
  }
  if (fixedWidth) {
    classes.push('fa-w-16');
  }
  if (pull === 'left' || pull === 'right') {
    classes.push(`fa-pull-${pull}`);
  }
  if (inverse) {
    classes.push('fa-inverse');
  }
  if (className) {
    classes.push(className);
  }

  const baseStyle = {
    display: 'inline-block',
    verticalAlign: '-0.125em',
    ...(size && sizeFontMap[size] ? { fontSize: sizeFontMap[size] } : {}),
    ...(fixedWidth ? { width: '1.25em', textAlign: 'center' } : {}),
  };

  return {
    className: classes.join(' ').trim(),
    style: { ...baseStyle, ...style },
  };
};

const renderXiaohongshuIcon = (props) => {
  const {
    icon, // eslint-disable-line no-unused-vars
    size,
    fixedWidth,
    pull,
    inverse,
    className,
    style,
    title,
    ...restProps
  } = props;
  const { className: composedClassName, style: composedStyle } = buildPresentationProps({
    size,
    fixedWidth,
    pull,
    inverse,
    className,
    style,
    iconSpecificClass: 'custom-icon fa-xiaohongshu',
  });
  const { ['aria-label']: ariaLabel, ...otherProps } = restProps;

  const { fontSize, lineHeight, ...styleWithoutFontSize } = composedStyle;
  const height = fontSize ? `calc(${fontSize} * 0.85)` : '0.85em';
  const width = fixedWidth
    ? (styleWithoutFontSize.width || '1.0625em')
    : `calc(${height} * 1)`;

  const finalStyle = {
    ...styleWithoutFontSize,
    width,
    height,
    objectFit: 'contain',
    filter: 'grayscale(100%)',
    opacity: 0.75,
  };

  if (lineHeight !== undefined) {
    finalStyle.lineHeight = lineHeight;
  }

  const altText = ariaLabel || title || 'Xiaohongshu';

  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/XiaohongshuLOGO.png"
      alt={altText}
      title={title}
      className={`${composedClassName} custom-icon-image`.trim()}
      style={finalStyle}
      {...otherProps}
    />
  );
};

// alphaXiv glyph from Simple Icons (CC0), filled with currentColor to match Font Awesome icons.
const ALPHAXIV_PATH = 'M19.749 12.21 24 16.46l-1.827 1.821-4.248-4.23zm-10.6-8.626a4.03 4.03 0 0 1 3.09 1.12L15.4 7.867l-1.841 1.822-3.232-3.226A1.38 1.38 0 0 0 8.55 6.5l-6.725 6.722L0 11.399l6.84-6.837a4.06 4.06 0 0 1 2.309-.979m13.026.033L24 5.44 10.032 19.403c-3.823 3.204-8.805-1.788-5.58-5.598l5.361-5.356 1.825 1.824-5.274 5.271c-1.108 1.347.633 3.054 1.96 1.921z';

const renderAlphaxivIcon = (props) => {
  const {
    icon, // eslint-disable-line no-unused-vars
    size,
    fixedWidth,
    pull,
    inverse,
    className,
    style,
    title,
    ...restProps
  } = props;
  const { className: composedClassName, style: composedStyle } = buildPresentationProps({
    size,
    fixedWidth,
    pull,
    inverse,
    className,
    style,
    iconSpecificClass: 'custom-icon fa-alphaxiv',
  });

  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden={title ? undefined : 'true'}
      className={composedClassName}
      style={{ height: '1em', overflow: 'visible', ...composedStyle }}
      {...restProps}
    >
      {title ? <title>{title}</title> : null}
      <path fill="currentColor" d={ALPHAXIV_PATH} />
    </svg>
  );
};

const customRenderers = {
  xiaohongshu: renderXiaohongshuIcon,
  alphaxiv: renderAlphaxivIcon,
};

const FontAwesomeCompatibleIcon = (props) => {
  const {
    prefix,
    size,
    icon,
    fixedWidth,
    inverse,
    pull,
  } = props;
  const sizeClass = size ? `${prefix}-${size}` : '';
  const iconClass = icon ? `${prefix}-${icon}` : '';
  const fwClass = fixedWidth ? `${prefix}-fw` : '';
  const inverseClass = inverse ? `${prefix}-inverse` : '';
  let pullClass = '';
  if (pull === 'right') {
    pullClass = `${prefix}-pull-right`;
  } else if (pull === 'left') {
    pullClass = `${prefix}-pull-left`;
  }
  return <i className={`ai ${iconClass} ${sizeClass} ${fwClass} ${inverseClass} ${pullClass}`} />;
};

const Icon = (props) => {
  const {
    icon,
    ...restProps
  } = props;
  if (typeof icon === 'string') {
    const renderer = customRenderers[icon];
    if (renderer) {
      return renderer(props);
    }
  }
  if (Array.isArray(icon) && icon[0] === 'custom' && icon[1]) {
    const renderer = customRenderers[icon[1]];
    if (renderer) {
      return renderer({ ...props, icon: icon[1] });
    }
  }
  if (Array.isArray(icon) && icon[0] === 'ai' && icon[1]) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <FontAwesomeCompatibleIcon prefix={icon[0]} icon={icon[1]} {...restProps} />;
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <FontAwesomeIcon {...props} />;
};

export default Icon;
