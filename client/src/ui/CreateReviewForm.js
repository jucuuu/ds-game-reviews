import React from "react";
import { Form, Input, Radio } from "antd";
const { TextArea } = Input;

// jauztaisa score -1 / 1, votes  0 / 1 

// defaultValue={initialValues[0] ? initialValues[3] : -1} initialValue={initialValues[0] ? initialValues[3] : -1}
// defaultValue={initialValues[0] ? initialValues[5] : 0} initialValue={initialValues[0] ? initialValues[5] : 0}

export const CreateReviewForm = ({ form, onFinish, initialValues=[null] }) => {
  return (
    <Form
      form={form}
      onFinish={onFinish}
    >
          <Form.Item defaultValue={(initialValues[0] ? initialValues[3] : 1)}
                     initialValue={(initialValues[0] ? initialValues[3] : 1)}
                     label="Score" name="review_score" rules={[{ required: true, message: 'Input your rating' }]}>
            <Radio.Group defaultValue={(initialValues[0] ? initialValues[3] : 1)}>
              <Radio.Button value={1}>Liked the game</Radio.Button>
              <Radio.Button value={-1}>Terrible game</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item defaultValue={initialValues[0] ? initialValues[4] : null} initialValue={initialValues[0] ? initialValues[4] : null} label="Text" name="review_text" rules={[{ required: true, message: 'Input the review' }]}>
            <TextArea autoSize={{minRows: 3, maxRows: 5}} />
          </Form.Item>
          
          <Form.Item defaultValue={(initialValues[0] ? initialValues[5] : false)}
                     initialValue={(initialValues[0] ? initialValues[5] : false)}
                     label="Review voted?" name="review_votes"
                     rules={[{ required: true, message: 'Did the review get voted? ' }]}
                     style={{ display: (initialValues[0] ? 'block' : 'none')}}>
            <Radio.Group defaultValue={(initialValues[0] ? initialValues[5] : false)}>
              <Radio.Button value={true}>Other users voted</Radio.Button>
              <Radio.Button value={false}>Or not...</Radio.Button>
            </Radio.Group>
          </Form.Item>
    </Form>
  );
};
