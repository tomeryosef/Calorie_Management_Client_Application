import React from 'react';
import Modal from 'react-modal';
import './css/AddFoodItemModal.css';

Modal.setAppElement('#root');

const ReportModal = ({ isOpen, onRequestClose, reportData }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Report Modal"
      className="Modal"
      overlayClassName="Overlay"
    >
      <h2>Report Modal</h2>
      <div>
        {/* Display report data here */}
        {reportData && (
          <div>
            {/* Example content, replace with actual report data */}
            <p>Report Data:</p>
            <pre>{JSON.stringify(reportData, null, 2)}</pre>
          </div>
        )}
      </div>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default ReportModal;
