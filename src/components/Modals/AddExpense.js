import React from "react";
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
function AddExpenseModal({
  isExpenseModalVisible,
  handleExpenseCancel,
  onFinish,
}) {
  const [form] = Form.useForm();
  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Add Expense"
      visible={isExpenseModalVisible}
      onCancel={handleExpenseCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "expense");
          form.resetFields();
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
            { required: true, message: "Please input the expense amount!" },
          ]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[
            { required: true, message: "Please select the expense date!" },
          ]}
        >
          <DatePicker className="custom-input" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label="Tag"
          name="tag"
          style={{ fontWeight: 600 }}
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select className="select-input-2">
            {/* Personal Expenses */}
            <Select.Option value="food">Food</Select.Option>
            <Select.Option value="groceries">Groceries</Select.Option>
            <Select.Option value="restaurants">Restaurants</Select.Option>
            <Select.Option value="coffee">Coffee & Snacks</Select.Option>

            {/* Housing & Utilities */}
            <Select.Option value="rent">Rent/Mortgage</Select.Option>
            <Select.Option value="utilities">Utilities</Select.Option>
            <Select.Option value="electricity">Electricity</Select.Option>
            <Select.Option value="water">Water</Select.Option>
            <Select.Option value="internet">Internet</Select.Option>
            <Select.Option value="phone">Phone Bill</Select.Option>

            {/* Transportation */}
            <Select.Option value="transportation">Transportation</Select.Option>
            <Select.Option value="gas">Fuel/Gas</Select.Option>
            <Select.Option value="public-transit">Public Transit</Select.Option>
            <Select.Option value="car-maintenance">Car Maintenance</Select.Option>
            <Select.Option value="parking">Parking</Select.Option>
            <Select.Option value="rideshare">Rideshare</Select.Option>

            {/* Health & Wellness */}
            <Select.Option value="healthcare">Healthcare</Select.Option>
            <Select.Option value="medical">Medical Expenses</Select.Option>
            <Select.Option value="pharmacy">Pharmacy</Select.Option>
            <Select.Option value="fitness">Fitness</Select.Option>
            <Select.Option value="personal-care">Personal Care</Select.Option>

            {/* Education */}
            <Select.Option value="education">Education</Select.Option>
            <Select.Option value="tuition">Tuition</Select.Option>
            <Select.Option value="books">Books & Supplies</Select.Option>
            <Select.Option value="courses">Online Courses</Select.Option>

            {/* Entertainment & Leisure */}
            <Select.Option value="entertainment">Entertainment</Select.Option>
            <Select.Option value="streaming">Streaming Services</Select.Option>
            <Select.Option value="movies">Movies</Select.Option>
            <Select.Option value="concerts">Concerts</Select.Option>
            <Select.Option value="hobbies">Hobbies</Select.Option>

            {/* Shopping */}
            <Select.Option value="clothing">Clothing</Select.Option>
            <Select.Option value="electronics">Electronics</Select.Option>
            <Select.Option value="home-goods">Home Goods</Select.Option>
            <Select.Option value="gifts">Gifts</Select.Option>

            {/* Office & Professional */}
            <Select.Option value="office">Office Expenses</Select.Option>
            <Select.Option value="work-supplies">Work Supplies</Select.Option>
            <Select.Option value="professional-dev">Professional Development</Select.Option>

            {/* Insurance & Financial */}
            <Select.Option value="insurance">Insurance</Select.Option>
            <Select.Option value="life-insurance">Life Insurance</Select.Option>
            <Select.Option value="health-insurance">Health Insurance</Select.Option>
            <Select.Option value="car-insurance">Car Insurance</Select.Option>
            <Select.Option value="bank-fees">Bank Fees</Select.Option>

            {/* Miscellaneous */}
            <Select.Option value="subscriptions">Subscriptions</Select.Option>
            <Select.Option value="travel">Travel</Select.Option>
            <Select.Option value="pets">Pets</Select.Option>
            <Select.Option value="donations">Donations</Select.Option>
            <Select.Option value="misc">Misc</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit">
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExpenseModal;
