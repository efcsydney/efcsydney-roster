import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

global.fetch = jest.fn();

configure({ adapter: new Adapter() });
