import React from 'react';
import { mount } from 'enzyme';
import DateBar from './DateBar';

describe('<DateBar/>', () => {
  it('should render an <div/> tag', () => {
    const renderedComponent = mount(<DateBar />);
    expect(renderedComponent.find('div').length).toEqual(1);
  });

  it('should adopt the className attribute', () => {
    const renderedComponent = mount(<DateBar className="test" />);
    expect(renderedComponent.find('div').hasClass('test')).toBeTruthy();
  });

  it('should adopt date attribute and display the date range accordingly', () => {
    let renderedComponent;

    renderedComponent = mount(<DateBar date="2018-01-01" />);
    expect(renderedComponent.find('div').text()).toEqual('Jan - Mar 2018');
    renderedComponent.unmount();

    renderedComponent = mount(<DateBar date="2018-02-28" />);
    expect(renderedComponent.find('div').text()).toEqual('Jan - Mar 2018');
    renderedComponent.unmount();

    renderedComponent = mount(<DateBar date="2018-04-01" />);
    expect(renderedComponent.find('div').text()).toEqual('Apr - Jun 2018');
  });

  it('should render 2 arrow links with images', () => {
    const renderedComponent = mount(<DateBar />);
    expect(renderedComponent.find('Arrow').length).toEqual(2);
    expect(renderedComponent.find('Arrow img').length).toEqual(2);
  });

  describe('User clicks', () => {
    const onPrevClick = jest.fn();
    const onNextClick = jest.fn();
    const renderedComponent = mount(
      <DateBar onPrevClick={onPrevClick} onNextClick={onNextClick} />
    );
    const arrows = renderedComponent.find('Arrow');

    it('should call onPrevClick prop', () => {
      const prevArrow = arrows.first();
      prevArrow.simulate('click');
      expect(onPrevClick.mock.calls[0]).toBeDefined();
    });

    it('should call onPrevClick prop', () => {
      const nextArrow = arrows.last();
      nextArrow.simulate('click');
      expect(onNextClick.mock.calls[0]).toBeDefined();
    });
  });
});
