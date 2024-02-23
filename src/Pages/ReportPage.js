// ReportPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const ReportPage = () => {
  const location = useLocation();
  const { reportType, reportData } = location.state;

  return (
    <div>
      <h1>{`Calories Report - ${reportType}`}</h1>
      {reportData && reportData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Calorie</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map(item => (
              <tr key={item.id}>
                <td>{item.Name}</td>
                <td>{item.category}</td>
                <td>{item.calorie}</td>
                <td>{item.Description}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available for the selected report type.</p>
      )}
    </div>
  );
};

export default ReportPage;
