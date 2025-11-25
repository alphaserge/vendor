import React, { useState } from 'react';

const ConfirmationDialog = ({ message, onConfirm, onCancel, isVisible }) => {
  if (!isVisible) {
    return null; // Don't render if not visible
  }

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-dialog">
        <p>{message}</p>
        <div className="dialog-actions">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;