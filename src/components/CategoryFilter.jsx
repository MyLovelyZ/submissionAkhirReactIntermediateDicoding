import PropTypes from 'prop-types';

function CategoryFilter({ categories, selected, onSelect }) {
  if (categories.length === 0) return null;

  return (
    <nav className="chips" aria-label="Filter kategori">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`chip${selected === category ? ' is-active' : ''}`}
          aria-pressed={selected === category}
          onClick={() => onSelect(category)}
        >
          #
          {category}
        </button>
      ))}
    </nav>
  );
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CategoryFilter;
