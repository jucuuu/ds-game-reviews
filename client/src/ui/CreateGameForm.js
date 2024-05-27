import React from "react";
import { Form, Input, InputNumber } from "antd";

export const CreateGameForm = ({ form, onFinish, initialValues=[] }) => {
  return (
    <Form
      form={form}
      onFinish={onFinish}
    >
      <Form.Item defaultValue={initialValues[0] ? initialValues[0]["name"] : null} initialValue={initialValues[0] ? initialValues[0]["name"] : null} label="Name" name="name" rules={[{ required: true, message: 'Input the name' }]}>
        <Input />
      </Form.Item>
      <Form.Item defaultValue={initialValues[0] ? initialValues[0]["platform"] : null} initialValue={initialValues[0] ? initialValues[0]["platform"] : null} label="Platform" name="platform" rules={[{ required: true, message: 'Input the platform' }]}>
        <Input />
      </Form.Item>
      <Form.Item defaultValue={initialValues[0] ? initialValues[0]["year"] : null} initialValue={initialValues[0] ? initialValues[0]["year"] : null} label="Year" name="year" rules={[{ required: true, message: 'Input the year' }]}>
        <InputNumber />
      </Form.Item>
      <Form.Item defaultValue={initialValues[0] ? initialValues[0]["genre"] : null} initialValue={initialValues[0] ? initialValues[0]["genre"] : null} label="Genre" name="genre" rules={[{ required: true, message: 'Input the genre' }]}>
        <Input />
      </Form.Item>
      <Form.Item defaultValue={initialValues[0] ? initialValues[0]["publisher"] : null} initialValue={initialValues[0] ? initialValues[0]["publisher"] : null} label="Publisher" name="publisher" rules={[{ required: true, message: 'Input the publisher' }]}>
        <Input />
      </Form.Item>
      <Form.Item defaultValue={initialValues[0] ? initialValues[0]["na_sales"] : null} initialValue={initialValues[0] ? initialValues[0]["na_sales"] : null} label="NA sales" name="na_sales" rules={[{ required: true }]}>
        <InputNumber />
      </Form.Item>
      <Form.Item defaultValue={initialValues[0] ? initialValues[0]["eu_sales"] : null} initialValue={initialValues[0] ? initialValues[0]["eu_sales"] : null} label="EU sales" name="eu_sales" rules={[{ required: true }]}>
        <InputNumber />
      </Form.Item>
      <Form.Item defaultValue={initialValues[0] ? initialValues[0]["jp_sales"] : null} initialValue={initialValues[0] ? initialValues[0]["jp_sales"] : null} label="JP sales" name="jp_sales" rules={[{ required: true }]}>
        <InputNumber />
      </Form.Item>
      <Form.Item defaultValue={initialValues[0] ? initialValues[0]["other_sales"] : null} initialValue={initialValues[0] ? initialValues[0]["other_sales"] : null} label="Other sales" name="other_sales" rules={[{ required: true }]}>
        <InputNumber />
      </Form.Item>
    </Form>
  );
};
