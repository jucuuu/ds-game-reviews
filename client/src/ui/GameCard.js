import React, {useState, useEffect} from 'react';
import { Switch, Card, Table, Statistic, Typography, Button, Layout, Modal, Form } from "antd";
import { DislikeOutlined, LikeOutlined, CloseOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons';
import { Content, Header } from "antd/es/layout/layout";
import { CreateReviewForm } from './CreateReviewForm'
import { CreateGameForm } from './CreateGameForm'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
const { Paragraph } = Typography;

// !! pagination mazajai tabulai
export const GameCard = () => {
    const {gameId} = useParams();
    const { state: { from } } = useLocation();
    
    const [currentPage, setCurrentPage] = React.useState(1);
    const [currentPageSize, setCurrentPageSize] = React.useState(10);
    const [totalRows, setTotalRows] = React.useState(50);

    const [game, setGame] = React.useState([{}]);
    const [reviewData, setReviewData] = React.useState([]);

    const [editingReviewData, setEditingReviewData] = React.useState([]);

    // Get current game data
    const getGame = async () => {
        try {
            const response = await fetch(`http://localhost:3000/${gameId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            });
            const newData = await response.json();
            setGame(newData);
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    // Send updated game data to server
    const handleGameFinish = async(values) => {
        setIsGameModalOpen(false);
        console.log(values)
        fetch(`http://localhost:3000/games/${gameId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
        .then(response => {
            return response.json();
          })
          .then(data => {
            setEditingReviewData([]);
          });
    };

    // Create review modal
    const [form] = Form.useForm();
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const showReviewModal = () => {
        setIsReviewModalOpen(true);
    };
    const handleReviewCancel = () => {
        setIsReviewModalOpen(false);
    };

    // Edit game modal
    const [isGameModalOpen, setIsGameModalOpen] = useState(false);
    const showGameModal = () => {
        setIsGameModalOpen(true);
    };
    const handleGameCancel = () => {
        setIsGameModalOpen(false);
    };

    // Edit review modal
    const [isEditReviewModalOpen, setIsEditReviewModalOpen] = useState(false);
    const showEditReviewModal = () => {
        setIsEditReviewModalOpen(true);
    };
    const handleEditReviewCancel = () => {
        setEditingReviewData([]);
        setIsEditReviewModalOpen(false);
    };

    // Get all reviews for current game
    const getReviews = async () => {
        const params = new URLSearchParams({
            page: currentPage,
            pageSize: currentPageSize
        });
        fetch(`http://localhost:3000/games/${gameId}?${params}`)
        .then(response => {
          return response.json();
        }).then(data => {
          setReviewData(data);
        })
    }

    // Get review count for current game
    const getRowCount = async() => {
        try {
          fetch(`http://localhost:3000/totalRev/${gameId}`)
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

    // Send new review data to server
    const handleReviewFinish = async (values) => {
        setIsReviewModalOpen(false);
        try {
            const response = await fetch(`http://localhost:3000/games/${gameId}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            getReviews()
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    // Send updated review data to server
    const handleEditReviewFinish = async(values) => {
        setIsEditReviewModalOpen(false);
        values["id"] = editingReviewData[0];
        fetch(`http://localhost:3000/games/${gameId}/${editingReviewData[0]}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
        .then(response => {
            return response.json();
          })
          .then(data => {
            setEditingReviewData([]);
          });
    };

    // Send delete request to server
    function deleteReview(revId) {
        try {
            fetch(`http://localhost:3000/games/${gameId}/${revId}`, {
                method: 'DELETE',
            })
            .then(() => {
                getReviews();
            })
        } catch (err) {
            console.log('ups')
        }
    }

    // Expand/collapse long reviews
    const [expanded, setExpanded] = useState(true);
    <Switch
        checked={expanded}
        onChange={() => {
          setExpanded((c) => !c);
        }}
    />

    const columns = [
        {
            title: 'App ID',
            dataIndex: 'app_id',
            key: 'app_id',
            hidden: true
        },
        {
            title: 'App name',
            dataIndex: 'app_name',
            key: 'app_name',
            hidden: true
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            hidden: true
        },
        {
            title: 'Score',
            dataIndex: 'review_score',
            key: 'review_score',
            render: (record) => {
                if (record == -1) return (<DislikeOutlined />)
                else return (<LikeOutlined/>);
            }
        },
        {
            title: 'Review',
            dataIndex: 'review_text', // kkads 'read more...' pec kaut cik simb ja garsh revju
            key: 'review_text',
            render: (record) => {
                return <Paragraph ellipsis={{
                          rows: 3,
                          expandable: 'collapsible',
                          onExpand: (_, info) => setExpanded(info.expanded)}}>
                            {record}
                        </Paragraph>
            }
        },
        {
            title: 'Review recommended by others',
            dataIndex: 'review_votes',
            key: 'review_votes',
            render: (record) => { 
                if (record == 0) return (<MinusOutlined/>)
                else return (<LikeOutlined/>);
            }
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            key: 'edit',
            render: (_, record) => (
              <Button onClick={() => {
                setEditingReviewData([record.id, record.app_id, record.app_name, record.review_score, record.review_text, record.review_votes]);
                showEditReviewModal();
              }}><EditOutlined /></Button>
            )
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            key: 'delete',
            render: (_, record) => (
              <Button onClick={() => deleteReview(record.id)}><CloseOutlined /></Button>
            )
        }
      ].filter(item => !item.hidden);

    const navigate = useNavigate();

    useEffect(() => {
        getRowCount();
        getGame();
        getReviews();
    }, [currentPage, currentPageSize, editingReviewData]);    
    
    return (
        <div className="App">
            <Layout>
                <Header style={{ background: 'white', display: 'flex', alignItems: 'center'}}>
                    <Button onClick={() => navigate(from)}>Back</Button>
                    <Button onClick={showGameModal}>Edit game data</Button>
                </Header>
                <Card title={game[0]["name"]}>
                    <Card.Grid hoverable={false}>
                        <Statistic title="Rank" value={game[0]["rank"]}/>
                    </Card.Grid>
                    <Card.Grid hoverable={false}>
                        <Statistic title="Platform" value={game[0]["platform"]}/>
                    </Card.Grid>
                    <Card.Grid hoverable={false}>
                        <Statistic title="Year" value={game[0]["year"]} groupSeparator=''/>
                    </Card.Grid>
                    <Card.Grid hoverable={false}>
                        <Statistic title="Genre" value={game[0]["genre"]}/>
                    </Card.Grid>
                    <Card.Grid hoverable={false}>
                        <Statistic title="Publisher" value={game[0]["publisher"]}/>
                    </Card.Grid>
                    <Card.Grid hoverable={false}>
                        <Statistic title="NA sales" value={game[0]["na_sales"]}/>
                    </Card.Grid>
                    <Card.Grid hoverable={false}>
                        <Statistic title="EU sales" value={game[0]["eu_sales"]}/>
                    </Card.Grid>
                    <Card.Grid hoverable={false}>
                        <Statistic title="JP sales" value={game[0]["jp_sales"]}/>
                    </Card.Grid>
                    <Card.Grid hoverable={false}>
                        <Statistic title="Other sales" value={game[0]["other_sales"]}/>
                    </Card.Grid>
                    <Card.Grid></Card.Grid>
                    <Card.Grid hoverable={false}>
                        <Statistic title="Global sales" value={game[0]["global_sales"]}/>
                    </Card.Grid>
                </Card>

                <Content>
                    <Button onClick={() => {
                        showReviewModal();
                    }}>Add a review</Button>
                    {reviewData.length > 0 ? <Table dataSource={reviewData} columns={columns} pagination={{total:totalRows, showSizeChanger:true, onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setCurrentPageSize(pageSize);
                    }}}/> : <h3>No reviews</h3>}
                </Content>
                
                {/* Create review modal */}
                <Modal title={`Review ${game[0]["name"]}`} open={isReviewModalOpen} onCancel={handleReviewCancel} okButtonProps={{ style: { display: 'none' } }} footer={[
                    <Button form="form" key="submit" htmlType="submit" type="primary" onClick={() => form.submit()}>
                        Submit
                    </Button>
                ]}>
                    <CreateReviewForm form={form} onFinish={handleReviewFinish}/>
                </Modal>

                {/* INITIAL VALUES PALIEK PIE CREATE REVIEW FORM */}
                {/* Edit review modal */}
                <Modal title={`Edit ${game[0]["name"]} review`} open={isEditReviewModalOpen} onCancel={handleEditReviewCancel} okButtonProps={{ style: { display: 'none' } }} footer={[
                    <Button form="form" key="submit" htmlType="submit" type="primary" onClick={() => form.submit()}>
                        Submit
                    </Button>
                ]}>

                    <CreateReviewForm form={form} onFinish={handleEditReviewFinish} initialValues={editingReviewData}/>
                </Modal>

                {/* Edit game info modal */}
                <Modal title={`Edit ${game[0]["name"]}`} open={isGameModalOpen} onCancel={handleGameCancel} okButtonProps={{ style: { display: 'none' } }} footer={[
                    <Button form="form" key="submit" htmlType="submit" type="primary" onClick={() => form.submit()}>
                        Submit
                    </Button>
                ]}>

                    <CreateGameForm form={form} onFinish={handleGameFinish} initialValues={game}/>
                </Modal>
            </Layout>
        </div>
    );
}
