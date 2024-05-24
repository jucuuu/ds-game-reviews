import '../App.css';
import React, { useState, useEffect } from 'react';
import { Table, Layout, Button, Modal, Form, Input, Select } from 'antd';
import { CreateGameForm } from './CreateGameForm';
import { CloseOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Header, Content } = Layout;

export default function Main() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentPageSize, setCurrentPageSize] = React.useState(10);
  const [totalRows, setTotalRows] = React.useState(50);
  const [ascSort, setAscSort] = React.useState(null);
  const [filter, setFilter] = React.useState('rank');
  const [search, setSearch] = React.useState('');
  const [currGameData, setCurrGameData] = React.useState([]);

  // filters
  const [selectedGenres, setSelectedGenres] = React.useState([]);
  const [selectedPublishers, setSelectedPublishers] = React.useState([]);

  const [shouldRedirect, setRedirect] = React.useState(false);
  const navigate = useNavigate();

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
  const getGames = async(page, pageSize, sortColumn='rank', asc=true, searchString='', selGenres='') => {
    let params = new URLSearchParams({
      page: page,
      pageSize: pageSize,
      sortColumn: sortColumn,
      asc: asc,
      searchString: searchString,
      selectedGenres: selGenres
    });
    //params.append(selGenres.map(g=>['selectedGenres', g]))
    //selGenres.map(g=> params.append('selectedGenres', g))
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

  // Get distinct genres
  const [genres, setGenres] = React.useState([]);
  const getGenres = async() => {
    try {
      const response = await fetch(`http://localhost:3000/genres`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const newData = await response.json();
      setGenres(newData.map((obj) => ({value: obj["genre"], label: obj["genre"]})));
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  // Get distinct publishers
  const [publishers, setPublishers] = React.useState([]);
  const getPublishers = async() => {
    try {
      const response = await fetch(`http://localhost:3000/publishers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const newData = await response.json();
      setPublishers(newData.map((obj) => ({value: obj["publisher"] || 'Unknown', label: obj["publisher"] || 'Unknown'})));
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  // Number of rows shown
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

  // Delete a game
  function deleteGame(id) {
    fetch(`http://localhost:3000/games/${id}`, {
      method: 'DELETE',
    }).then(() => {
      getGames(1, currentPageSize, 'rank', true, '');
    })
  }

  useEffect(() => {
    getGenres();
    getPublishers();
    getRowCount(search);
    getGames(currentPage, currentPageSize, filter, ascSort, search, selectedGenres);
    if (currentPage > Math.ceil(totalRows/currentPageSize)) setCurrentPage(currentPage-1);
    // redirectaa atcereties main lapas currentPage, currentPageSize, filtrus + sorterus
    if (shouldRedirect) navigate(`/games/${currGameData.id}`);
  }, [currentPage, currentPageSize, filter, ascSort, search, currGameData, selectedGenres, selectedPublishers]);

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
        let elem = (filter == 'genre' ? <Button type="link" icon={(ascSort ? <DownOutlined/> : <UpOutlined />)}></Button> : null);
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
                }, 700)
            }}/>
          </Header>

          <Select mode='multiple' options={genres} onChange={(v) => {setSelectedGenres(v)}}/> {/* genres */}
          <Select showSearch mode='multiple' options={publishers} onChange={(v) => {setSelectedPublishers(v)}}/> {/* publishers */}
          
          <Content>
            <Table dataSource={gameData} columns={columns} pagination={{total:totalRows, showSizeChanger:true, onChange: (page, pageSize) => {
              getRowCount();
              setCurrentPage(page);
              setCurrentPageSize(pageSize);
            }}}
            onRow={(record, rowIndex) => {
              return {
                onClick: () => {
                  setCurrGameData(record);
                  setRedirect(!shouldRedirect);
                }
              };
            }}/>
          </Content>
        </Layout>
      </Layout>

      {/* Game creation form modal */}
      <Modal title="Input new game data" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ style: { display: 'none' } }} footer={[
        <Button form="form" key="submit" htmlType="submit" type="primary" onClick={() => form.submit()}>
            Submit
        </Button>
      ]}>
        <CreateGameForm form={form} onFinish={handleFinish}/>
      </Modal>
    </div>
  );
}
