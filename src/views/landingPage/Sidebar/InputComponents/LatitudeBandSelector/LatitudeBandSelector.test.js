import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux'
import LatitudeBandSelector from './LatitudeBandSelector';
import { createTestStore } from "../../../../../store/store"

let store;
beforeEach(() => {
    store = createTestStore();
});

it('renders without crashing', () => {
    render(<>
        <Provider store={store}>
            <LatitudeBandSelector reportError={() => {}} />
        </Provider>
    </>)
});

it('renders correctly', () => {

    const { container } = render(<>
        <Provider store={store}>
            <LatitudeBandSelector reportError={() => {}} />
        </Provider>
    </>);

    expect(container).toMatchSnapshot();
});