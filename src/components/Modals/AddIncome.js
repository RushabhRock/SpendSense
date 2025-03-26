import React, { useState } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";

function AddIncomeModal({ isIncomeModalVisible, handleIncomeCancel, onFinish }) {
  const [form] = Form.useForm();
  const [customTag, setCustomTag] = useState(false); // State to toggle custom tag input

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Add Income"
      visible={isIncomeModalVisible}
      onCancel={handleIncomeCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "income");
          form.resetFields();
          setCustomTag(false);
        }}
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction!",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>

        <Form.Item
          style={{ fontWeight: 600 }}
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: "Please input the income amount!" },
          ]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>

        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[
            { required: true, message: "Please select the income date!" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" className="custom-input" />
        </Form.Item>

        <Form.Item
          style={{ fontWeight: 600 }}
          label="Tag"
          name="tag"
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select
            className="select-input-2"
            onChange={(value) => setCustomTag(value === "other")}
          >
            {/* Primary Employment */}
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="full-time-job">Full-Time Job</Select.Option>
            <Select.Option value="part-time-job">Part-Time Job</Select.Option>
            <Select.Option value="overtime">Overtime Pay</Select.Option>
            <Select.Option value="commission">Commission</Select.Option>
            <Select.Option value="bonus">Bonus</Select.Option>

            {/* Self-Employment & Freelance */}
            <Select.Option value="freelance">Freelance Income</Select.Option>
            <Select.Option value="consulting">Consulting</Select.Option>
            <Select.Option value="contract-work">Contract Work</Select.Option>
            <Select.Option value="gig-economy">Gig Economy</Select.Option>
            <Select.Option value="side-hustle">Side Hustle</Select.Option>

            {/* Business Income */}
            <Select.Option value="business">Business Income</Select.Option>
            <Select.Option value="business-profits">Business Profits</Select.Option>
            <Select.Option value="royalties">Royalties</Select.Option>
            <Select.Option value="licensing">Licensing Income</Select.Option>

            {/* Investments */}
            <Select.Option value="investment">Investment Income</Select.Option>
            <Select.Option value="dividends">Stock Dividends</Select.Option>
            <Select.Option value="capital-gains">Capital Gains</Select.Option>
            <Select.Option value="interest">Bank Interest</Select.Option>
            <Select.Option value="bonds">Bond Returns</Select.Option>
            <Select.Option value="real-estate-investment">Real Estate Investment</Select.Option>
            <Select.Option value="cryptocurrency">Cryptocurrency</Select.Option>

            {/* Passive Income */}
            <Select.Option value="rental_income">Rental Income</Select.Option>
            <Select.Option value="passive-income">Passive Income</Select.Option>
            <Select.Option value="affiliate_income">Affiliate Income</Select.Option>
            <Select.Option value="youtube-monetization">YouTube Monetization</Select.Option>
            <Select.Option value="blog-income">Blog Income</Select.Option>

            {/* Government & Retirement */}
            <Select.Option value="pension">Pension</Select.Option>
            <Select.Option value="social-security">Social Security</Select.Option>
            <Select.Option value="unemployment">Unemployment Benefits</Select.Option>
            <Select.Option value="disability">Disability Income</Select.Option>

            {/* Other Income Sources */}
            <Select.Option value="cashback_rewards">Cashback & Rewards</Select.Option>
            <Select.Option value="gift-money">Gifts & Monetary Presents</Select.Option>
            <Select.Option value="inheritance">Inheritance</Select.Option>
            <Select.Option value="grants">Grants</Select.Option>
            <Select.Option value="scholarships">Scholarships</Select.Option>
            <Select.Option value="selling-personal-items">Selling Personal Items</Select.Option>
            <Select.Option value="refunds">Refunds</Select.Option>

            {/* Miscellaneous */}
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit">
            Add Income
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddIncomeModal;