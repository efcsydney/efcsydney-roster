import _ from 'lodash';
import styled from 'styled-components';
import tinycolor from 'tinycolor2';

function normalizeKind(name = 'gray') {
  const mappings = {
    default: 'gray',
    primary: 'blue',
    success: 'green',
    danger: 'red',
    warning: 'orange'
  };

  if (_.indexOf(_.values(mappings), name) !== -1) {
    return name;
  } else {
    return mappings[name] || 'gray';
  }
}

function hex2Rgba(hex, alpha = 1) {
  return tinycolor(hex)
    .setAlpha(alpha)
    .toRgbString();
}

function bgColor(kind = 'gray', theme = 'normal') {
  if (theme === 'solid') {
    return {
      gray: '#595959',
      blue: '#008cc9',
      green: '#669933',
      red: '#cc3333',
      orange: '#ff9933'
    }[kind];
  } else {
    return {
      gray: '#f8f8f8',
      blue: '#f6fdff',
      green: '#f9faf5',
      red: '#fff9f8',
      orange: '#fff8f0'
    }[kind];
  }
}

function color(kind = 'gray', theme = 'normal') {
  if (theme === 'solid') {
    return '#ffffff';
  } else {
    return {
      gray: '#595959',
      blue: '#008cc9',
      green: '#669933',
      red: '#cc3333',
      orange: '#ff9933'
    }[kind];
  }
}

function borderColor(kind = 'default', theme = 'normal') {
  if (theme === 'solid') {
    return 'transparent';
  } else {
    return {
      gray: '#b9b9b9',
      blue: '#64b8dc',
      green: '#a1bf82',
      red: '#e18f84',
      orange: '#fdbf82'
    }[kind];
  }
}

function hoverBackgroundColor(kind = 'default', theme = 'normal') {
  if (theme === 'solid') {
    return {
      gray: '#666666',
      blue: '#2898d6',
      green: '#72a740',
      red: '#dc423e',
      orange: '#ffa642'
    }[kind];
  } else {
    return {
      gray: '#ffffff',
      blue: '#faffff',
      green: '#faffff',
      red: '#fffbfa',
      orange: '#fffcf8'
    }[kind];
  }
}

function hoverTextShadowColor(kind = 'default', theme = 'normal') {
  if (theme === 'solid') {
    return {
      gray: '#474747',
      blue: '#0070a1',
      green: '#527a29',
      red: '#a32929',
      orange: '#e07e14'
    }[kind];
  } else {
    return 'none';
  }
}

function hoverGlowColor(kind = 'default', theme = 'normal') {
  if (theme === 'solid') {
    return {
      gray: '#595959',
      blue: '#008cc9',
      green: '#669933',
      red: '#cc3333',
      orange: '#ff9933'
    }[kind];
  } else {
    return {
      gray: '#b9b9b9',
      blue: '#008cc9',
      green: '#669933',
      red: '#cc3333',
      orange: '#ff6600'
    }[kind];
  }
}

const Button = styled.button.attrs({
  'data-component': 'Button'
})`
  align-items: center;
  background-color: ${props => bgColor(normalizeKind(props.kind), props.theme)};
  border-color: ${props => borderColor(normalizeKind(props.kind), props.theme)};
  border-radius: 3px;
  border-style: solid;
  border-width: 1px;
  box-sizing: border-box;
  color: ${props => color(normalizeKind(props.kind), props.theme)};
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  display: inline-flex;
  justify-content: center;
  min-width: 100px;
  padding: 13px;
  position: relative;
  i {
    margin: 0 auto;
  }
  &:hover {
    background-color: ${props =>
      hoverBackgroundColor(normalizeKind(props.kind), props.theme)};
    box-shadow: ${props => {
      const hex = hoverGlowColor(normalizeKind(props.kind), props.theme);
      const rgba = hex2Rgba(hex, props.theme === 'solid' ? 0.4 : 0.3);
      return props.theme === 'solid' ? `0 0 8px ${rgba}` : `0 0 6px ${rgba}`;
    }};
    text-shadow: ${props => {
      const hex = hoverTextShadowColor(normalizeKind(props.kind), props.theme);
      const rgba = hex2Rgba(hex, 0.8);
      return props.theme === 'solid' ? `0 1px 0 ${rgba}` : 'none';
    }};
    text-decoration: none;
  }
  &:active,
  &:focus {
    box-shadow: none;
    outline: 0;
  }
  &[disabled] {
    opacity: 0.3;
    pointer-events: none;
    &:hover {
      box-shadow: none;
      text-shadow: none;
    }
    &:active,
    &.active {
      &:before {
        display: none;
      }
    }
  }
`;

export default Button;
