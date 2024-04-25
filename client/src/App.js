import './App.css';
import React, { useState, useEffect } from 'react';
import { Table, Layout, Button, Modal, Form } from 'antd';
import { CreateGameForm } from './ui/CreateGameForm';

const { Sider, Content } = Layout;

function App() {
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

  // Modal for game card
  // const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  // const [cardData, setCardData] = useState([]);
  // const showCardModal = () => {
  //   setIsCardModalOpen(true);
  // };
  // const handleCardCancel = () => {
  //   setIsCardModalOpen(false);
  // };
  // const showCard = (data) => {
  //   setCardData(data);
  // };

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
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Load all games from postgres
  const [gameData, setGameData] = useState(null);
  const getGames = async () => {
      const response = await fetch('http://localhost:3000/');
      const newData = await response.json();
      setGameData(newData);
  };

  useEffect(() => {
    getGames();
  }, [gameData]);

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
      sorter: (a, b) => a.rank - b.rank,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => {
        a = a.name || '';
        b = b.name || '';
        return a.localeCompare(b);
      }
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      sorter: (a, b) => {
        a = a.platform || '';
        b = b.platform || '';
        return a.localeCompare(b);
      }
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      sorter: (a, b) => a.year - b.year
    },
    {
      title: 'Genre',
      dataIndex: 'genre',
      key: 'genre',
      sorter: (a, b) => {
        a = a.genre || '';
        b = b.genre || '';
        return a.localeCompare(b);
      }
    },
    {
      title: 'Publisher',
      dataIndex: 'publisher',
      key: 'publisher',
      sorter: (a, b) => {
        a = a.publisher || '';
        b = b.publisher || '';
        return a.localeCompare(b);
      }
    },
    {
      title: 'NA sales',
      dataIndex: 'na_sales',
      key: 'na_sales',
      sorter: (a, b) => a.na_sales - b.na_sales
    },
    {
      title: 'EU sales',
      dataIndex: 'eu_sales',
      key: 'eu_sales',
      sorter: (a, b) => a.eu_sales - b.eu_sales
    },
    {
      title: 'JP sales',
      dataIndex: 'jp_sales',
      key: 'jp_sales',
      sorter: (a, b) => a.jp_sales - b.jp_sales
    },
    {
      title: 'Other sales',
      dataIndex: 'other_sales',
      key: 'other_sales',
      sorter: (a, b) => a.other_sales - b.other_sales
    },
    {
      title: 'Global sales',
      dataIndex: 'global_sales',
      key: 'global_sales',
      sorter: (a, b) => a.global_sales - b.global_sales
    },
    {
      title: 'Review count',
      dataIndex: 'review_count',
      key: 'review_count',
      sorter: (a, b) => a.review_count - b.review_count
    }
  ].filter(item => !item.hidden);

  return (
    <div className="App">
      <Layout>

        <Layout>
          <Content>
            <Table dataSource={gameData} columns={columns} />
          </Content>
          
          <Sider style={{ background: 'white' }}>
            <Button block onClick={showModal}>Add a game</Button>
          </Sider>
        </Layout>

      </Layout>

      {/* Game card modal */}
      {/* <GameCard /> */}
        
      {/* Game creation form modal */}
      <Modal title="Input new game data" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ style: { display: 'none' } }} footer={[
        <Button key="cancel" type="primary" onClick={handleCancel}>
            Cancel
        </Button>,
        <Button form="form" key="submit" htmlType="submit" onClick={() => form.submit()}>
            Submit
        </Button>
        ]}>
        <CreateGameForm form={form} onFinish={handleFinish}/>
      </Modal>
      
    </div>
  );
}

export default App;
