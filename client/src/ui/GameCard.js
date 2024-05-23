import React, {useState, useEffect} from 'react';
import { Switch, Card, Table, Statistic, Typography, Button} from "antd";
import { DislikeOutlined, LikeOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Content } from "antd/es/layout/layout";
const { Paragraph } = Typography;

function addReview(gameId) {
    
}

function deleteReview(gameId, revId) {
    fetch(`http://localhost:3000/games/${gameId}/${revId}`, {
      method: 'DELETE',
    })
}

function editReview() {

}

// !! pagination mazajai tabulai
export const GameCard = (game) => {
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
                else if (record == null) return (<div>:/</div>)
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
                if (record == false) return (<DislikeOutlined />)
                    else if (record == null) return (<div>:/</div>)
                    else return (<LikeOutlined/>);
            }
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            key: 'edit',
            render: (_, record) => (
              <Button onClick={() => editReview(record.id)}><EditOutlined /></Button>
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

    console.log(game['reviewData'])
    return (
        <div>
            <Card title={game["record"].name}>
                <Card.Grid hoverable={false}>
                    <Statistic title="Rank" value={game["record"].rank}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="Platform" value={game["record"].platform}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="Year" value={game["record"].year} groupSeparator=''/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="Genre" value={game["record"].genre}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="Publisher" value={game["record"].publisher}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="NA sales" value={game["record"].na_sales}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="EU sales" value={game["record"].eu_sales}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="JP sales" value={game["record"].jp_sales}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="Other sales" value={game["record"].other_sales}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="Global sales" value={game["record"].global_sales}/>
                </Card.Grid>
            </Card>
            <Content>
            <Button>Add a review</Button>
             {game['reviewData'].length > 0 ? <Table dataSource={game['reviewData']} columns={columns}/> : <h3>No reviews</h3>}
            </Content>
        </div>
    );
}