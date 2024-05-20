import React, { useState, useEffect } from "react";
import { Card, Table, Statistic, Modal } from "antd";

export const GameCard = (record, isopen) => {
    // get reviews for the game
    const [reviewData, setReviewData] = useState(null);

    const getReviews = async () => {
        const response = await fetch(`http://localhost:3000/games/${record.id}`);
        const newData = await response.json();
        setReviewData(newData);
    };

    useEffect(() => {
        getReviews();
    }, [record]);

    // card visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };

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

    return (
        <Modal cancelButtonProps={{ style: { display: 'none' } }}>
            <Card title={record.name}>
                <Card.Grid hoverable={false}>
                    <Statistic title="Rank" value={record.rank}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="Platform" value={record.platform}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="Year" value={record.year}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="Genre" value={record.genre}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="Publisher" value={record.publisher}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="NA sales" value={record.na_sales}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="EU sales" value={record.eu_sales}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="JP sales" value={record.jp_sales}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="Other sales" value={record.other_sales}/>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                    <Statistic title="Global sales" value={record.global_sales}/>
                </Card.Grid>

                <Table dataSource={reviewData} columns={columns}/>
            </Card>
        </Modal>
    );
}