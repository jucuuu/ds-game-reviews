import './App.css';
import React, { useState, useEffect } from 'react';
import { Table, Layout, Button, Modal, Form, Input } from 'antd';
import { CreateGameForm } from './ui/CreateGameForm';
import { CloseOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
const { Header, Content } = Layout;


function App() {
  // pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentPageSize, setCurrentPageSize] = React.useState(10);
  const [totalRows, setTotalRows] = React.useState(50);
  const [ascSort, setAscSort] = React.useState(false);
  const [filter, setFilter] = React.useState('rank');

  // Modal for game creation form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [form] = Form.useForm();

  // Modal for game card (ja tads bus atp)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardData, setCardData] = useState([]);
  const showCardModal = () => {
    setIsCardModalOpen(true);
  };
  const handleCardCancel = () => {
    setIsCardModalOpen(false);
  };
  const showCard = (data) => {
    setCardData(data);
    showCardModal();
  };

  // Send new game data to server
  const handleFinish = async (values) => {
    setIsModalOpen(false);
    try {
      const response = await fetch('http://localhost:3000/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  // Load all games from postgres
  const [gameData, setGameData] = useState(null);
  // const getGames = async () => {
  //     fetch('http://localhost:3000/')
  //     .then(response => {
  //       return response.json();
  //     })
  //     .then(data => {
  //       setGameData(data);
  //     });
  // };

  // Load all games (+limit/offset)

  const getGames = async(page, pageSize, sortColumn='rank', asc=true) => {
    console.log('getGames: ', sortColumn, asc)
    try {
      const response = await fetch(`http://localhost:3000/${page}&${pageSize}&${sortColumn}&${asc}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const newData = await response.json();
      setGameData(newData);
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  const getRowCount = async() => {
    try {
      fetch('http://localhost:3000/total')
          .then(response => {
            return response.json();
          })
          .then(data => {
            console.log(data[0]["count"]);
            setTotalRows(data[0]["count"]);
          });
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  // const getGames = async (page, pageSize) => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/`);
  //     const games = await response.json();
  //     console.log(games)
  //     setGameData(games);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // Delete game - JAPABEIDZ
  function deleteGame(id) {
    fetch(`http://localhost:3000/games/${id}`, {
      method: 'DELETE',
    })
  }

  useEffect(() => {
    getRowCount();
    getGames(currentPage, currentPageSize, filter, ascSort);
  }, []); // + filtri/sorteri/pagination

  // onHeaderClick sorting
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      hidden: true
    },
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // sorter: (a, b) => {
      //   a = a.name || '';
      //   b = b.name || '';
      //   return a.localeCompare(b);
      // }
      onHeaderCell: (column) => ({
        onClick: () => {
          // setState async !!!!! (a kaa filtreet...)
          setFilter(column["key"]);
          var as = ascSort;
          getGames(currentPage, currentPageSize, column["key"], as);
          (ascSort == true ? setAscSort(false) : setAscSort(true))
        }, // click header row
      })
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      // sorter: (a, b) => {
      //   a = a.platform || '';
      //   b = b.platform || '';
      //   return a.localeCompare(b);
      // }
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      //sorter: (a, b) => a.year - b.year
    },
    {
      title: 'Genre',
      dataIndex: 'genre',
      key: 'genre',
      // sorter: (a, b) => {
      //   a = a.genre || '';
      //   b = b.genre || '';
      //   return a.localeCompare(b);
      // }
    },
    {
      title: 'Publisher',
      dataIndex: 'publisher',
      key: 'publisher',
      // sorter: (a, b) => {
      //   a = a.publisher || '';
      //   b = b.publisher || '';
      //   return a.localeCompare(b);
      // }
    },
    {
      title: 'NA sales',
      dataIndex: 'na_sales',
      key: 'na_sales',
      //sorter: (a, b) => a.na_sales - b.na_sales
    },
    {
      title: 'EU sales',
      dataIndex: 'eu_sales',
      key: 'eu_sales',
      //sorter: (a, b) => a.eu_sales - b.eu_sales
    },
    {
      title: 'JP sales',
      dataIndex: 'jp_sales',
      key: 'jp_sales',
      //sorter: (a, b) => a.jp_sales - b.jp_sales
    },
    {
      title: 'Other sales',
      dataIndex: 'other_sales',
      key: 'other_sales',
      //sorter: (a, b) => a.other_sales - b.other_sales
    },
    {
      title: 'Global sales',
      dataIndex: 'global_sales',
      key: 'global_sales',
      //sorter: (a, b) => a.global_sales - b.global_sales
    },
    {
      title: 'Review count',
      dataIndex: 'review_count',
      key: 'review_count',
      //sorter: (a, b) => a.review_count - b.review_count
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      render: (_, record) => (
        <Button onClick={() => deleteGame(record.id)}><CloseOutlined /></Button>
      )
    }
  ].filter(item => !item.hidden);

  return (
    <div className="App">
      <Layout>

        <Layout>
          <Header style={{ background: 'white', display: 'flex', alignItems: 'center'}}>
            <Button onClick={showModal}>Add a game</Button>
            <Input placeholder="Search titles, platforms or genres" /> {/* a kur ir */}
          </Header>
          
          <Content>
            <Table dataSource={gameData} columns={columns} pagination={{total:totalRows, showSizeChanger:true, onChange: (page, pageSize) => {
              getRowCount();
              setCurrentPage(page);
              setCurrentPageSize(pageSize);

              getGames(page, pageSize, filter, ascSort);
            }}}/>
          </Content>
        </Layout>

      </Layout>

      {/* Game card modal */}
      {/* <GameCard /> */}
        
      {/* Game creation form modal */}
      <Modal title="Input new game data" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ style: { display: 'none' } }} footer={[
        // <Button key="cancel" onClick={handleCancel}>
        //     Cancel
        // </Button>,
        <Button form="form" key="submit" htmlType="submit" type="primary" onClick={() => form.submit()}>
            Submit
        </Button>
        ]}>
        <CreateGameForm form={form} onFinish={handleFinish}/>
      </Modal>
      
    </div>
  );
}

export default App;
