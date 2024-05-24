import React from "react";
import { Form, Input } from "antd";
const { TextArea } = Input;

// jauztaisa score -1 / 1, votes  0 / 1 

export const CreateReviewForm = ({ form, onFinish, initialValues=[null] }) => {
  return (
    <Form
      form={form}
      onFinish={onFinish}
    >
          <Form.Item label="Score" name="review_score" rules={[{ required: true, message: 'Input your rating' }]}><Input /></Form.Item>
          <Form.Item label="Text" name="review_text" rules={[{ required: true, message: 'Input the review' }]}><TextArea autoSize={{minRows: 3, maxRows: 5}} /></Form.Item>
          <Form.Item label="Review voted?" name="review_votes" rules={[{ required: true, message: 'Input the year' }]}><Input /></Form.Item>
    </Form>
  );
};
