import { MemoryRouter } from 'react-router-dom';
import '../src/styles/index.css';

export const decorators = [
  (Story) => (
    <MemoryRouter>
      <div style={{ maxWidth: 720, padding: 16 }}>
        <Story />
      </div>
    </MemoryRouter>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
