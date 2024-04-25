import React from "react";
import { Form, Input, InputNumber } from "antd";

export const CreateGameForm = ({ form, onFinish }) => {
  return (
    <Form
      form={form}
      onFinish={onFinish}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Input the name' }]}><Input /></Form.Item>
          <Form.Item label="Platform" name="platform" rules={[{ required: true, message: 'Input the platform' }]}><Input /></Form.Item>
          <Form.Item label="Year" name="year" rules={[{ required: true, message: 'Input the year' }]}><InputNumber /></Form.Item>
          <Form.Item label="Genre" name="genre" rules={[{ required: true, message: 'Input the genre' }]}><Input /></Form.Item>
          <Form.Item label="Publisher" name="publisher" rules={[{ required: true, message: 'Input the publisher' }]}><Input /></Form.Item>
          <Form.Item label="NA sales" name="na_sales"><InputNumber /></Form.Item>
          <Form.Item label="EU sales" name="eu_sales"><InputNumber /></Form.Item>
          <Form.Item label="JP sales" name="jp_sales"><InputNumber /></Form.Item>
          <Form.Item label="Other sales" name="other_sales"><InputNumber /></Form.Item>
    </Form>
  );
};
