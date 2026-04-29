import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import AddProductModal from './AddProductModal';

const ProductPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleProductAdded = (product) => {
    console.log('Product added successfully:', product);
    // Handle success - refresh list, show notification, etc.
  };

  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleOpenModal}
      >
        Add Product
      </Button>
      <AddProductModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleProductAdded}
      />
    </Box>
  );
};

export default ProductPage;