import React from 'react';
import { mount } from 'enzyme';
import SwitchButton from './SwitchButton';

describe('<SwitchButton />', () => {
  describe('<Label/>', () => {
    it('should render a <label/> tag', () => {
      const renderedComponent = mount(<SwitchButton />);
      expect(renderedComponent.find('label').length).toEqual(1);
    });

    it('should adopt the style attribute', () => {
      const style = { margin: '10px' };
      const renderedComponent = mount(<SwitchButton style={style} />);
      expect(renderedComponent.find('label').prop('style')).toEqual(style);
    });

    it('should adopt the className attribute', () => {
      const className = 'test';
      const renderedComponent = mount(<SwitchButton className={className} />);
      expect(renderedComponent.find('label').hasClass(className)).toBeTruthy();
    });

    it('should adopt other valid attributes', () => {
      const id = 'test';
      const renderedComponent = mount(<SwitchButton id={id} />);
      expect(renderedComponent.find('label').prop('id')).toBeDefined();
    });
  });

  describe('<Input/>', () => {
    const selector = 'input[type="checkbox"]';

    it('should contain a checkbox', () => {
      const renderedComponent = mount(<SwitchButton />);
      expect(renderedComponent.find(selector).length).toEqual(1);
    });

    it('should adpot the checked attribute', () => {
      const renderedComponent = mount(
        <SwitchButton checked={true} onChange={() => {}} />
      );
      expect(renderedComponent.find(selector).prop('checked')).toBeTruthy();
    });

    it('should adopt the onChange attribute', () => {
      const renderedComponent = mount(<SwitchButton onChange={() => {}} />);
      expect(renderedComponent.find(selector).prop('onChange')).toBeDefined();
    });
  });
});
