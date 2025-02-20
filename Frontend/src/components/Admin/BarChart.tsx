
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DataItem {
  name: string; // Month-Year label
  users: number;
  tutors: number;
}

interface CustomBarChartProps {
  chartData: DataItem[];
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({ chartData }) => {
  // Map month numbers to month names
  const getMonthName = (monthNumber: string) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months[parseInt(monthNumber, 10) - 1];
  };

  
  const transformedChartData = chartData.map(item => {
    const [month, year] = item.name.split('-'); 
    return {
      ...item,
      name: `${getMonthName(month)}`,
    };
  });

  
  const getFullYearMonths = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentYear = new Date().getFullYear();
    return months.map((month) => ({
      name: `${month}`,
      users: 0,  
      tutors: 0,
    }));
  };


  const filledChartData = getFullYearMonths().map(monthData => {
    const foundData = transformedChartData.find(item => item.name === monthData.name);
    return foundData || monthData; 
  });

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={filledChartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            interval={0} 
            tick={{ fontSize: 12 }} 
            angle={-45} 
            textAnchor="end" 
          />
          <YAxis
            domain={[0, 'dataMax + 50']}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="users" fill="#8884d8" barSize={20} />
          <Bar dataKey="tutors" fill="#82ca9d" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
