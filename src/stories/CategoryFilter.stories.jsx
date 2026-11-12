import CategoryFilter from '../components/CategoryFilter';

export default {
  title: 'Components/CategoryFilter',
  component: CategoryFilter,
  args: { categories: ['react', 'redux', 'umum', 'testing'], selected: '' },
};

export const Default = {};

export const WithSelection = { args: { selected: 'redux' } };
