import React from "react";
import { Form, Input, InputNumber } from "antd";

// jauztaisa score 0/1, 

export const CreateReviewForm = ({ form, onFinish }) => {
  return (
    <Form
      form={form}
      onFinish={onFinish}
    >
          <Form.Item label="Score" name="review_score" rules={[{ required: true, message: 'Input your rating' }]}><Input /></Form.Item>
          <Form.Item label="Text" name="review_text" rules={[{ required: true, message: 'Input the review' }]}><Input /></Form.Item>
          <Form.Item label="Review_rec" name="review_votes" rules={[{ required: true, message: 'Input the year' }]}><Input /></Form.Item>
    </Form>
  );
};
