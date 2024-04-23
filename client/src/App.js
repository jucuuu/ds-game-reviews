import './App.css';
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

function App() {
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
      const fetchData = async () => {
        const response = await fetch('http://localhost:3000/');
        const newData = await response.json();
        setGameData(newData);
      };

      fetchData();
  }, []);

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Genre',
      dataIndex: 'genre',
      key: 'genre',
    },
    {
      title: 'Publisher',
      dataIndex: 'publisher',
      key: 'publisher',
    },
    {
      title: 'NA sales',
      dataIndex: 'na_sales',
      key: 'na_sales',
    },
    {
      title: 'EU sales',
      dataIndex: 'eu_sales',
      key: 'eu_sales',
    },
    {
      title: 'JP sales',
      dataIndex: 'jp_sales',
      key: 'jp_sales',
    },
    {
      title: 'Other sales',
      dataIndex: 'other_sales',
      key: 'other_sales',
    },
    {
      title: 'Global sales',
      dataIndex: 'global_sales',
      key: 'global_sales',
    },
    {
      title: 'Review count',
      dataIndex: 'review_count',
      key: 'review_count',
    }
  ];

  return (
    <div className="App">
      <Table dataSource={gameData} columns={columns}/>
    </div>
  );
}

export default App;
