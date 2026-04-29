import PropTypes from 'prop-types';
import AddProductModal from './AddProductModal';

AddProductModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

AddProductModal.defaultProps = {
  onSuccess: undefined,
};