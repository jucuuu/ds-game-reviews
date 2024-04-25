import React, { useState, useEffect } from "react";
import { Card, Table, Statistic } from "antd";

export default async function GameCard(data) {
    const [reviewData, setReviewData] = useState(null);

    const getReviews = async () => {
        const response = await fetch(`http://localhost:3000/games/${data.id}`);
        const newData = await response.json();
        setReviewData(newData);
    };

    useEffect(() => {
        getReviews();
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            hidden: true
        },
        {
            title: 'Review',
            dataIndex: 'review',
            key: 'review'
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score'
        },
        {
            title: 'Review recommended by others',
            dataIndex: 'recReview',
            key: 'recReview'
        }
      ].filter(item => !item.hidden);

    return(
        <Card title={data.name}>
            <Card.Grid hoverable={false}>
                <Statistic title="Rank" value={data.rank}/>
            </Card.Grid>
            <Card.Grid hoverable={false}>
                <Statistic title="Platform" value={data.platform}/>
            </Card.Grid>
            <Card.Grid hoverable={false}>
                <Statistic title="Year" value={data.year}/>
            </Card.Grid>
            <Card.Grid hoverable={false}>
                <Statistic title="Genre" value={data.genre}/>
            </Card.Grid>
            <Card.Grid hoverable={false}>
                <Statistic title="Publisher" value={data.publisher}/>
            </Card.Grid>
            <Card.Grid hoverable={false}>
                <Statistic title="NA sales" value={data.na_sales}/>
            </Card.Grid>
            <Card.Grid hoverable={false}>
                <Statistic title="EU sales" value={data.eu_sales}/>
            </Card.Grid>
            <Card.Grid hoverable={false}>
                <Statistic title="JP sales" value={data.jp_sales}/>
            </Card.Grid>
            <Card.Grid hoverable={false}>
                <Statistic title="Other sales" value={data.other_sales}/>
            </Card.Grid>
            <Card.Grid hoverable={false}>
                <Statistic title="Global sales" value={data.global_sales}/>
            </Card.Grid>

            <Table dataSource={reviewData} columns={columns}/>
        </Card>
    );
}