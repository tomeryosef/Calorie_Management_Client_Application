import React from 'react';
import Modal from 'react-modal';
import './css/AddFoodItemModal.css';

// Set the root element for the modal library
Modal.setAppElement('#root');

// Define the ReportModal functional component
// It takes 'isOpen', 'onRequestClose', and 'reportData' as props
const ReportModal = ({ isOpen, onRequestClose, reportData, selectedDate }) => {

  // Handler function for printing the report
  const handlePrint = () => {
    window.print();
  };
  
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
        <p>Date Selected: {selectedDate.toDateString()}</p> {/* Render selectedDate */}
        {reportData && (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Calorie</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.calorie}</td>
                    <td>{entry.category}</td>
                    <td>{entry.Name}</td>
                    <td>{entry.date.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <button onClick={handlePrint}>Print</button>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default ReportModal;