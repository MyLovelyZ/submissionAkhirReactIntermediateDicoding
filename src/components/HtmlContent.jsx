import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

function HtmlContent({ html }) {
  // Konten dari API berupa HTML, sehingga wajib disanitasi terlebih dulu untuk mencegah XSS.
  // eslint-disable-next-line react/no-danger
  return <div className="html-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
}

HtmlContent.propTypes = {
  html: PropTypes.string.isRequired,
};

export default HtmlContent;
