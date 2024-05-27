import '../App.css';
import React, { useState, useEffect } from 'react';
import { Table, Layout, Button, Modal, Form, Input, Select, InputNumber, Space } from 'antd';
import { CreateGameForm } from './CreateGameForm';
import { CloseOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
const { Header, Content } = Layout;

export default function Main() {
  // url query
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = React.useState(searchParams.get("page") || 1);
  const [currentPageSize, setCurrentPageSize] = React.useState(searchParams.get("pageSize") || 10);

  // ARII JAATROD RINDAS JA URLU MAINA !!!!
  const [totalRows, setTotalRows] = React.useState(50);
  const [search, setSearch] = React.useState(searchParams.get("searchString") || '');
  const [currGameData, setCurrGameData] = React.useState([]);

  // sorters
  const [ascSort, setAscSort] = React.useState(searchParams.get("asc") || null);
  const [sortBy, setSortBy] = React.useState(searchParams.get("sortColumn") || 'rank');

  // filters
  let urlGenres;
  (searchParams.get("selectedGenres") != null ? urlGenres = searchParams.get("selectedGenres").split(",") : urlGenres = [])
  const [selectedGenres, setSelectedGenres] = React.useState(urlGenres);

  let urlPublishers;
  (searchParams.get("selectedPublishers") != null ? urlPublishers = searchParams.get("selectedPublishers").split(",") : urlPublishers = [])
  const [selectedPublishers, setSelectedPublishers] = React.useState(urlPublishers);

  const [yearFrom, setYearFrom] = React.useState(searchParams.get("yearFrom") || '');
  const [yearTo, setYearTo] = React.useState(searchParams.get("yearTo") || '');
  const [naSalesFrom, setNaSalesFrom] = React.useState(searchParams.get("naSalesFrom") || '');
  const [naSalesTo, setNaSalesTo] = React.useState(searchParams.get("naSalesTo") || '');
  const [euSalesFrom, setEuSalesFrom] = React.useState(searchParams.get("euSalesFrom") || '');
  const [euSalesTo, setEuSalesTo] = React.useState(searchParams.get("euSalesTo") || '');
  const [jpSalesFrom, setJpSalesFrom] = React.useState(searchParams.get("jpSalesFrom") || '');
  const [jpSalesTo, setJpSalesTo] = React.useState(searchParams.get("jpSalesTo") || '');
  const [otherSalesFrom, setOtherSalesFrom] = React.useState(searchParams.get("otherSalesFrom") || '');
  const [otherSalesTo, setOtherSalesTo] = React.useState(searchParams.get("otherSalesTo") || '');
  const [globalSalesFrom, setGlobalSalesFrom] = React.useState(searchParams.get("globalSalesFrom") || '');
  const [globalSalesTo, setGlobalSalesTo] = React.useState(searchParams.get("globalSalesTo") || '');
  const [reviewCountFrom, setReviewCountFrom] = React.useState(searchParams.get("reviewCountFrom") || '');
  const [reviewCountTo, setReviewCountTo] = React.useState(searchParams.get("reviewCountTo") || '');

  // redirect to game card
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
      getGames()
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  // Load all games from postgres
  const [gameData, setGameData] = useState(null);

  // vairakiem filtriem querijs or sumn
  const getGames = async() => {
    let params = new URLSearchParams({
      page: currentPage,
      pageSize: currentPageSize,
      sortColumn: sortBy,
      asc: ascSort,
      searchString: search,
      selectedGenres: selectedGenres,
      selectedPublishers: selectedPublishers,
      yearFrom: yearFrom,
      yearTo: yearTo,
      naSalesFrom: naSalesFrom,
      naSalesTo: naSalesTo,
      euSalesFrom: euSalesTo,
      euSalesTo: euSalesTo,
      jpSalesFrom: jpSalesFrom,
      jpSalesTo: jpSalesTo,
      otherSalesFrom: otherSalesFrom,
      otherSalesTo: otherSalesTo,
      globalSalesFrom: globalSalesFrom,
      globalSalesTo: globalSalesTo,
      reviewCountFrom: reviewCountFrom,
      reviewCountTo: reviewCountTo
    });
    setSearchParams(`?${params}`);
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
      getGames();
    })
  }

  useEffect(() => {
    getGenres();
    getPublishers();
    getRowCount(search);
    getGames();
    if (currentPage > Math.ceil(totalRows/currentPageSize) && currentPage-1 != 0) setCurrentPage(currentPage-1);
    // redirectaa atcereties main lapas currentPage, currentPageSize, filtrus + sorterus
    if (shouldRedirect) navigate(`/games/${currGameData.id}`, { state: {from: `/?${searchParams}`}});
  }, [currentPage, currentPageSize, sortBy, ascSort, search, currGameData, selectedGenres,
    selectedPublishers, yearFrom, yearTo, naSalesFrom, naSalesTo, euSalesFrom, euSalesTo, jpSalesFrom, jpSalesTo,
  otherSalesFrom, otherSalesTo, globalSalesFrom, globalSalesTo, reviewCountFrom, reviewCountTo]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      hidden: true
    },
    {
      title: () => {
        let elem = (sortBy == 'rank' && ascSort==false ? <Button type="link" icon={<UpOutlined/>}></Button> : null);
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
          if (sortBy != column["key"] || ascSort == null) {
            setSortBy(column["key"])
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
        let elem = (sortBy == 'name' ? <Button type="link" icon={(ascSort ? <DownOutlined/> : <UpOutlined />)}></Button> : null);
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
          if (sortBy != column["key"] || ascSort == null) {
            setSortBy(column["key"])
            setAscSort(true);
          }
          else if (ascSort == true) setAscSort(false);
          else {
            setAscSort(null);
            setSortBy('rank');
          }
        },
      }),
    },
    {
      title: () => {
        let elem = (sortBy == 'platform' ? <Button type="link" icon={(ascSort ? <DownOutlined/> : <UpOutlined />)}></Button> : null);
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
          if (sortBy != column["key"] || ascSort == null) {
            setSortBy(column["key"])
            setAscSort(true);
          }
          else if (ascSort == true) setAscSort(false);
          else {
            setAscSort(null);
            setSortBy('rank');
          }
        }, 
      })
    },
    {
      title: () => {
        let elem = (sortBy == 'year' ? <Button type="link" icon={(ascSort ? <DownOutlined/> : <UpOutlined />)}></Button> : null);
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
          if (sortBy != column["key"] || ascSort == null) {
            setSortBy(column["key"])
            setAscSort(true);
          }
          else if (ascSort == true) setAscSort(false);
          else {
            setAscSort(null);
            setSortBy('rank');
          }
        },
      })
    },
    {
      title: () => {
        let elem = (sortBy == 'genre' ? <Button type="link" icon={(ascSort ? <DownOutlined/> : <UpOutlined />)}></Button> : null);
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
          if (sortBy != column["key"] || ascSort == null) {
            setSortBy(column["key"])
            setAscSort(true);
          }
          else if (ascSort == true) setAscSort(false);
          else {
            setAscSort(null);
            setSortBy('rank');
          }
        }, 
      })
    },
    {
      title: () => {
        let elem = (sortBy == 'publisher' ? <Button type="link" icon={(ascSort ? <DownOutlined/> : <UpOutlined />)}></Button> : null);
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
          if (sortBy != column["key"] || ascSort == null) {
            setSortBy(column["key"])
            setAscSort(true);
          }
          else if (ascSort == true) setAscSort(false);
          else {
            setAscSort(null);
            setSortBy('rank');
          }
        },
      })
    },
    {
      title: () => {
        let elem = (sortBy == 'na_sales' ? <Button type="link" icon={(ascSort ? <UpOutlined/> : <DownOutlined />)}></Button> : null);
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
          if (sortBy != column["key"] || ascSort == null) {
            setSortBy(column["key"])
            setAscSort(false);
          }
          else if (ascSort == false) setAscSort(true);
          else {
            setAscSort(null);
            setSortBy('rank');
          }
        },
      })
    },
    {
      title: () => {
        let elem = (sortBy == 'eu_sales' ? <Button type="link" icon={(ascSort ? <UpOutlined/> : <DownOutlined />)}></Button> : null);
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
          if (sortBy != column["key"] || ascSort == null) {
            setSortBy(column["key"])
            setAscSort(false);
          }
          else if (ascSort == false) setAscSort(true);
          else {
            setAscSort(null);
            setSortBy('rank');
          }
        },
      })
    },
    {
      title: () => {
        let elem = (sortBy == 'jp_sales' ? <Button type="link" icon={(ascSort ? <UpOutlined/> : <DownOutlined />)}></Button> : null);
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
          if (sortBy != column["key"] || ascSort == null) {
            setSortBy(column["key"])
            setAscSort(false);
          }
          else if (ascSort == false) setAscSort(true);
          else {
            setAscSort(null);
            setSortBy('rank');
          }
        },
      })
    },
    {
      title: () => {
        let elem = (sortBy == 'other_sales' ? <Button type="link" icon={(ascSort ? <UpOutlined/> : <DownOutlined />)}></Button> : null);
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
          if (sortBy != column["key"] || ascSort == null) {
            setSortBy(column["key"])
            setAscSort(false);
          }
          else if (ascSort == false) setAscSort(true);
          else {
            setAscSort(null);
            setSortBy('rank');
          }
        },
      })
    },
    {
      title: () => {
        let elem = (sortBy == 'global_sales' ? <Button type="link" icon={(ascSort ? <UpOutlined/> : <DownOutlined />)}></Button> : null);
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
          if (sortBy != column["key"] || ascSort == null) {
            setSortBy(column["key"])
            setAscSort(false);
          }
          else if (ascSort == false) setAscSort(true);
          else {
            setAscSort(null);
            setSortBy('rank');
          }
        },
      })
    },
    {
      title: () => {
        let elem = (sortBy == 'review_count' ? <Button type="link" icon={(ascSort ? <UpOutlined/> : <DownOutlined />)}></Button> : null);
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
          if (sortBy != column["key"] || ascSort == null) {
            setSortBy(column["key"])
            setAscSort(false);
          }
          else if (ascSort == false) setAscSort(true);
          else {
            setAscSort(null);
            setSortBy('rank');
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

  const yearOptions = [
    {
      value: 'year',
      label: 'Year'
    },
    {
      value: 'interval',
      label: 'Year interval'
    }
  ]

  const [yearInput, setYearInput] = React.useState(yearTo == -1 || yearTo != '' ? 'interval' : 'year');

  return (
    <div className="App">
      <Layout>
        <Layout>
          <Header style={{ background: 'white', display: 'flex', alignItems: 'center'}}>
            <Button onClick={showModal}>Add a game</Button>
            <Input placeholder="Search titles, platforms, publishers or genres"
            defaultValue={search}
            onChange={(e) => {
                setTimeout(() => {
                  setSearch(e.target.value);
                }, 700)
            }}/>
          </Header>

          <Select defaultValue={selectedGenres[0] ? selectedGenres : null} placeholder='Genres' mode='multiple' options={genres} onChange={(v) => {setSelectedGenres(v)}}/>
          <Select defaultValue={selectedPublishers[0] ? selectedPublishers : null} placeholder='Publishers' showSearch mode='multiple' options={publishers} onChange={(v) => {setSelectedPublishers(v)}}/>
          
          <div>
            {/* VISUS FILTRUS/SORTERUS ANTD TABULAA IEBAAZT */}
            <Space.Compact>
              <Select defaultValue={yearInput} options={yearOptions} onChange={(v) => {
                setYearInput(v);
                if (v == 'interval') setYearTo(-1);
                else setYearTo('')
              }}/>

              <InputNumber defaultValue={yearFrom} placeholder={yearInput=='interval' ? 'From' : null} onChange={(v) => {
                {setTimeout(() => {if (v!=null) setYearFrom(v); else setYearFrom('')}, 700)}
              }}/>
              {yearInput=='interval' ? <InputNumber defaultValue={yearTo != -1 ? yearTo : null} placeholder='To' onChange={(v) => {
                {setTimeout(() => {if (v!=null) setYearTo(v); else setYearTo(-1)}, 700)}
              }}/> : null}
            </Space.Compact>

            <Space.Compact>
              <InputNumber defaultValue={naSalesFrom} addonBefore="NA sales" placeholder='From' onChange={(v) => {
                {setTimeout(() => {if (v != null) setNaSalesFrom(v); else setNaSalesFrom('');}, 700)}
              }}/>
              <InputNumber defaultValue={naSalesTo} placeholder='To' onChange={(v) => {
                {setTimeout(() => {if (v != null) setNaSalesTo(v); else setNaSalesTo('');}, 700)}
              }}/>
            </Space.Compact>

            <Space.Compact>
              <InputNumber defaultValue={euSalesFrom} addonBefore="EU sales" placeholder='From' onChange={(v) => {
                {setTimeout(() => {if (v != null) setEuSalesFrom(v); else setEuSalesFrom('');}, 700)}
              }}/>
              <InputNumber defaultValue={euSalesTo} placeholder='To' onChange={(v) => {
                {setTimeout(() => {if (v != null) setEuSalesTo(v); else setEuSalesTo('');}, 700)}
              }}/>
            </Space.Compact>

            <Space.Compact>
              <InputNumber defaultValue={jpSalesFrom} addonBefore="JP sales" placeholder='From' onChange={(v) => {
                {setTimeout(() => {if (v != null) setJpSalesFrom(v); else setJpSalesFrom('');}, 700)}
              }}/>
              <InputNumber defaultValue={jpSalesTo} placeholder='To' onChange={(v) => {
                {setTimeout(() => {if (v != null) setJpSalesTo(v); else setJpSalesTo('');}, 700)}
              }}/>
            </Space.Compact>

            <Space.Compact>
              <InputNumber defaultValue={otherSalesFrom} addonBefore="Other sales" placeholder='From' onChange={(v) => {
                {setTimeout(() => {if (v != null) setOtherSalesFrom(v); else setOtherSalesFrom('');}, 700)}
              }}/>
              <InputNumber defaultValue={otherSalesTo} placeholder='To' onChange={(v) => {
                {setTimeout(() => {if (v != null) setOtherSalesTo(v); else setOtherSalesTo('');}, 700)}
              }}/>
            </Space.Compact>

            <Space.Compact>
              <InputNumber defaultValue={globalSalesFrom} addonBefore="Global sales" placeholder='From' onChange={(v) => {
                {setTimeout(() => {if (v != null) setGlobalSalesFrom(v); else setGlobalSalesFrom('');}, 700)}
              }}/>
              <InputNumber defaultValue={globalSalesTo} placeholder='To' onChange={(v) => {
                {setTimeout(() => {if (v != null) setGlobalSalesTo(v); else setGlobalSalesTo('');}, 700)}
              }}/>
            </Space.Compact>

            <Space.Compact>
              <InputNumber defaultValue={reviewCountFrom} addonBefore="Review count" placeholder='From' onChange={(v) => {
                {setTimeout(() => {if (v != null) setReviewCountFrom(v); else setReviewCountFrom('');}, 700)}
              }}/>
              <InputNumber defaultValue={reviewCountTo} placeholder='To' onChange={(v) => {
                {setTimeout(() => {if (v != null) setReviewCountTo(v); else setReviewCountTo('');}, 700)}
              }}/>
            </Space.Compact>
          </div>

          <Content>
            <Table dataSource={gameData} columns={columns} pagination={{defaultCurrent: currentPage, defaultPageSize: currentPageSize, total:totalRows, showSizeChanger:true, onChange: (page, pageSize) => {
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
