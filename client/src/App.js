import './App.css';
import React, { useState, useEffect } from 'react';
import { Table, Layout, Button, Modal, Form, Input, Card, Statistic } from 'antd';
import { CreateGameForm } from './ui/CreateGameForm';
import { CloseOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { GameCard } from './ui/GameCard';
const { Header, Content } = Layout;

function App() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentPageSize, setCurrentPageSize] = React.useState(10);
  const [totalRows, setTotalRows] = React.useState(50);
  const [ascSort, setAscSort] = React.useState(null);
  const [filter, setFilter] = React.useState('rank');
  const [search, setSearch] = React.useState('');

  const [currGameData, setCurrGameData] = React.useState([]);
  const [reviewData, setReviewData] = React.useState([]);
  const [cardVisible, setCardVisible] = React.useState('hidden');

  const changeCardVisible = () => {
    if (cardVisible == 'hidden') setCardVisible('visible');
    else setCardVisible('hidden')
  }

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
      getGames(1, currentPageSize, 'rank', true, '')
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  // Load all games from postgres
  const [gameData, setGameData] = useState(null);

  // vairakiem filtriem querijs or sumn
  const getGames = async(page, pageSize, sortColumn='rank', asc=true, searchString='') => {
    const params = new URLSearchParams({
      page: page,
      pageSize: pageSize,
      sortColumn: sortColumn,
      asc: asc,
      searchString: searchString
    });
    try {
      const response = await fetch(`http://localhost:3000?${params}`, {
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

  const getRowCount = async(searchString) => {
    const param = new URLSearchParams({
      searchString: searchString
    });
    try {
      fetch(`http://localhost:3000/total?${param}`)
          .then(response => {
            return response.json();
          })
          .then(data => {
            setTotalRows(data[0]["count"]);
          });
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  function deleteGame(id) {
    fetch(`http://localhost:3000/games/${id}`, {
      method: 'DELETE',
    }).then(() => {
      getGames(1, currentPageSize, 'rank', true, '');
    })
  }

  useEffect(() => {
    getRowCount(search);
    getGames(currentPage, currentPageSize, filter, ascSort, search);
    if (currentPage > Math.ceil(totalRows/currentPageSize)) setCurrentPage(currentPage-1);
  }, [currentPage, currentPageSize, filter, ascSort, search, currGameData, reviewData]);

  const getReviews = async (gameId) => {
    fetch(`http://localhost:3000/games/${gameId}`)
    .then(response => {
      return response.json();
    }).then(data => {
      setReviewData(data);
    })
  }

  // onHeaderClick sorting
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      hidden: true
    },
    {
      title: () => {
        let elem = (filter == 'rank' && ascSort==false ? <Button type="link" icon={<UpOutlined/>}></Button> : null);
        return (
        <div>
          Rank
          {elem}
        </div>)
      },
      dataIndex: 'rank',
      key: 'rank',
      onHeaderCell: (column) => ({
        onClick: () => {
          if (filter != column["key"] || ascSort == null) {
            setFilter(column["key"])
            setAscSort(false);
          }
          else {
            setAscSort(null);
          }
        },
      })
    },
    {
      title: () => {
        let elem = (filter == 'name' ? <Button type="link" icon={(ascSort ? <DownOutlined/> : <UpOutlined />)}></Button> : null);
        return (
        <div>
          Name
          {elem}
        </div>)
      },
      dataIndex: 'name',
      key: 'name',
      onHeaderCell: (column) => ({
        onClick: () => {
          if (filter != column["key"] || ascSort == null) {
            setFilter(column["key"])
            setAscSort(true);
          }
          else if (ascSort == true) setAscSort(false);
          else {
            setAscSort(null);
            setFilter('rank');
          }
        },
      }),
    },
    {
      title: () => {
        let elem = (filter == 'platform' ? <Button type="link" icon={(ascSort ? <DownOutlined/> : <UpOutlined />)}></Button> : null);
        return (
        <div>
          Platform
          {elem}
        </div>)
      },
      dataIndex: 'platform',
      key: 'platform',
      onHeaderCell: (column) => ({
        onClick: () => {
          if (filter != column["key"] || ascSort == null) {
            setFilter(column["key"])
            setAscSort(true);
          }
          else if (ascSort == true) setAscSort(false);
          else {
            setAscSort(null);
            setFilter('rank');
          }
        }, 
      })
    },
    {
      title: () => {
        let elem = (filter == 'year' ? <Button type="link" icon={(ascSort ? <DownOutlined/> : <UpOutlined />)}></Button> : null);
        return (
        <div>
          Year
          {elem}
        </div>)
      },
      dataIndex: 'year',
      key: 'year',
      onHeaderCell: (column) => ({
        onClick: () => {
          if (filter != column["key"] || ascSort == null) {
            setFilter(column["key"])
            setAscSort(true);
          }
          else if (ascSort == true) setAscSort(false);
          else {
            setAscSort(null);
            setFilter('rank');
          }
        },
      })
    },
    {
      title: () => {
        let elem = (filter == 'Genre' ? <Button type="link" icon={(ascSort ? <DownOutlined/> : <UpOutlined />)}></Button> : null);
        return (
        <div>
          Genre
          {elem}
        </div>)
      },
      dataIndex: 'genre',
      key: 'genre',
      onHeaderCell: (column) => ({
        onClick: () => {
          if (filter != column["key"] || ascSort == null) {
            setFilter(column["key"])
            setAscSort(true);
          }
          else if (ascSort == true) setAscSort(false);
          else {
            setAscSort(null);
            setFilter('rank');
          }
        }, 
      })
    },
    {
      title: () => {
        let elem = (filter == 'publisher' ? <Button type="link" icon={(ascSort ? <DownOutlined/> : <UpOutlined />)}></Button> : null);
        return (
        <div>
          Publisher
          {elem}
        </div>)
      },
      dataIndex: 'publisher',
      key: 'publisher',
      onHeaderCell: (column) => ({
        onClick: () => {
          if (filter != column["key"] || ascSort == null) {
            setFilter(column["key"])
            setAscSort(true);
          }
          else if (ascSort == true) setAscSort(false);
          else {
            setAscSort(null);
            setFilter('rank');
          }
        },
      })
    },
    {
      title: () => {
        let elem = (filter == 'na_sales' ? <Button type="link" icon={(ascSort ? <UpOutlined/> : <DownOutlined />)}></Button> : null);
        return (
        <div>
          NA sales
          {elem}
        </div>)
      },
      dataIndex: 'na_sales',
      key: 'na_sales',
      onHeaderCell: (column) => ({
        onClick: () => {
          if (filter != column["key"] || ascSort == null) {
            setFilter(column["key"])
            setAscSort(false);
          }
          else if (ascSort == false) setAscSort(true);
          else {
            setAscSort(null);
            setFilter('rank');
          }
        },
      })
    },
    {
      title: () => {
        let elem = (filter == 'eu_sales' ? <Button type="link" icon={(ascSort ? <UpOutlined/> : <DownOutlined />)}></Button> : null);
        return (
        <div>
          EU sales
          {elem}
        </div>)
      },
      dataIndex: 'eu_sales',
      key: 'eu_sales',
      onHeaderCell: (column) => ({
        onClick: () => {
          if (filter != column["key"] || ascSort == null) {
            setFilter(column["key"])
            setAscSort(false);
          }
          else if (ascSort == false) setAscSort(true);
          else {
            setAscSort(null);
            setFilter('rank');
          }
        },
      })
    },
    {
      title: () => {
        let elem = (filter == 'jp_sales' ? <Button type="link" icon={(ascSort ? <UpOutlined/> : <DownOutlined />)}></Button> : null);
        return (
        <div>
          JP sales
          {elem}
        </div>)
      },
      dataIndex: 'jp_sales',
      key: 'jp_sales',
      onHeaderCell: (column) => ({
        onClick: () => {
          if (filter != column["key"] || ascSort == null) {
            setFilter(column["key"])
            setAscSort(false);
          }
          else if (ascSort == false) setAscSort(true);
          else {
            setAscSort(null);
            setFilter('rank');
          }
        },
      })
    },
    {
      title: () => {
        let elem = (filter == 'other_sales' ? <Button type="link" icon={(ascSort ? <UpOutlined/> : <DownOutlined />)}></Button> : null);
        return (
        <div>
          Other sales
          {elem}
        </div>)
      },
      dataIndex: 'other_sales',
      key: 'other_sales',
      onHeaderCell: (column) => ({
        onClick: () => {
          if (filter != column["key"] || ascSort == null) {
            setFilter(column["key"])
            setAscSort(false);
          }
          else if (ascSort == false) setAscSort(true);
          else {
            setAscSort(null);
            setFilter('rank');
          }
        },
      })
    },
    {
      title: () => {
        let elem = (filter == 'global_sales' ? <Button type="link" icon={(ascSort ? <UpOutlined/> : <DownOutlined />)}></Button> : null);
        return (
        <div>
          Global sales
          {elem}
        </div>)
      },
      dataIndex: 'global_sales',
      key: 'global_sales',
      onHeaderCell: (column) => ({
        onClick: () => {
          if (filter != column["key"] || ascSort == null) {
            setFilter(column["key"])
            setAscSort(false);
          }
          else if (ascSort == false) setAscSort(true);
          else {
            setAscSort(null);
            setFilter('rank');
          }
        },
      })
    },
    {
      title: () => {
        let elem = (filter == 'review_count' ? <Button type="link" icon={(ascSort ? <UpOutlined/> : <DownOutlined />)}></Button> : null);
        return (
        <div>
          Review count
          {elem}
        </div>)
      },
      dataIndex: 'review_count',
      key: 'review_count',
      onHeaderCell: (column) => ({
        onClick: () => {
          if (filter != column["key"] || ascSort == null) {
            setFilter(column["key"])
            setAscSort(false);
          }
          else if (ascSort == false) setAscSort(true);
          else {
            setAscSort(null);
            setFilter('rank');
          }
        },
      })
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
            <Input placeholder="Search titles, platforms, publishers or genres" 
            onChange={(e) => {
                setTimeout(() => {
                  setSearch(e.target.value);
                }, 750)
            }}/> {/* a kur ir */}
          </Header>
          
          <Content>
            <Table dataSource={gameData} columns={columns} pagination={{total:totalRows, showSizeChanger:true, onChange: (page, pageSize) => {
              getRowCount();
              setCurrentPage(page);
              setCurrentPageSize(pageSize);
            }}}
            onRow={(record, rowIndex) => {
              return {
                onClick: () => {
                  if (currGameData.name == record.name || cardVisible == 'hidden') changeCardVisible();
                  showCard();
                  setCurrGameData(record);
                  if (record.review_count > 0) getReviews(record.id);
                  else setReviewData([]);
                }
              };
            }}/>
          </Content>
        </Layout>

      </Layout>
      {/* Game card modal */}

        
      {/* Game creation form modal */}
      <Modal title="Input new game data" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ style: { display: 'none' } }} footer={[
        <Button form="form" key="submit" htmlType="submit" type="primary" onClick={() => form.submit()}>
            Submit
        </Button>
        ]}>
        <CreateGameForm form={form} onFinish={handleFinish}/>
      </Modal>
      
      {/* Separate layouts revjuviem? */}

      <Layout style={{visibility: cardVisible}}>
        <GameCard record={currGameData} reviewData={reviewData}/>
      </Layout>

      {/* <Modal open={isCardModalOpen} onCancel={handleCardCancel}>
        <GameCard record={currGameData} reviewData={reviewData}/>
      </Modal> */}
    </div>
  );
}

export default App;
