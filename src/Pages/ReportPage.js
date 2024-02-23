// ReportPage.js
import React from 'react';

const ReportPage = ({ reportData, reportType }) => {
  console.log(reportType);
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
            </tr>
          </thead>
          <tbody>
            {reportData.map(item => (
              <tr key={item.id}>
                <td>{item.Name}</td>
                <td>{item.category}</td>
                <td>{item.calorie}</td>
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
