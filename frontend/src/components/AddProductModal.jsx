import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

import config from "../config.json"

const AddProductModal = ({ open, onClose, onSuccess, user }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    itemName: null,
    artNo: '',
    refNo: '',
    design: '',
  });
  const [inputValue, setInputValue] = useState('');

  // Fetch products list on component mount or when modal opens
  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setError(null);
    try {
      const response = await fetch(config.api + '/Products/Products?id='+user.id);
      if (!response.ok) {
        throw new Error(config.api + '/Products/Products?id='+user.id)
        //throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleInputChange = (event, value, reason) => {
    setInputValue(value);
  };

  const handleProductChange = (event, value) => {
    setFormData((prev) => ({
      ...prev,
      itemName: value,
    }));
  };

  const handleTextFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.itemName) {
      setError('Please select a product name');
      return;
    }
    if (!formData.artNo.trim()) {
      setError('Article number is required');
      return;
    }
    if (!formData.refNo.trim()) {
      setError('Reference number is required');
      return;
    }
    if (!formData.design.trim()) {
      setError('Design is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: formData.itemName,
        artNo: formData.artNo,
        refNo: formData.refNo,
        design: formData.design,
      };

      //const response = await fetch(config.api + '/api/products', {

      const response = await fetch(config.api + '/Products/Products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      const result = await response.json();
      if (onSuccess) {
        onSuccess(result);
      }
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create product'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      itemName: null,
      artNo: '',
      refNo: '',
      design: '',
    });
    setInputValue('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {/* Product Name Autocomplete */}
          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.name}
            value={formData.itemName}
            onChange={handleProductChange}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            loading={loadingProducts}
            disabled={loadingProducts}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Product Name"
                placeholder="Search for a product"
                required
                error={!formData.itemName && formData.artNo !== ''}
                helperText={
                  !formData.itemName && formData.artNo !== ''
                    ? 'Product name is required'
                    : ''
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingProducts && (
                        <CircularProgress color="inherit" size={20} />
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            noOptionsText="No products found"
            loadingText="Loading products..."
          />

          {/* Article Number */}
          <TextField
            label="Article Number"
            name="artNo"
            value={formData.artNo}
            onChange={handleTextFieldChange}
            required
            fullWidth
            placeholder="e.g., ART-001"
          />

          {/* Reference Number */}
          <TextField
            label="Reference Number"
            name="refNo"
            value={formData.refNo}
            onChange={handleTextFieldChange}
            required
            fullWidth
            placeholder="e.g., REF-001"
          />

          {/* Design */}
          <TextField
            label="Design"
            name="design"
            value={formData.design}
            onChange={handleTextFieldChange}
            required
            fullWidth
            multiline
            rows={3}
            placeholder="Enter product design details"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
        >
          {submitting ? 'Adding...' : 'Add Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;