import React, { useRef, useState } from "react";
import { Input, Table, Select, Radio, Modal, Form, DatePicker } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, PrinterOutlined } from "@ant-design/icons";
import search from "../assets/search.svg";
import { parse } from "papaparse";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";
import { auth, db } from "../firebase";
import moment from "moment";

const { Option } = Select;
const { confirm } = Modal;

// Income Tags
const incomeTags = [
  'salary', 'full-time-job', 'part-time-job', 'overtime', 'commission', 'bonus', 
  'freelance', 'consulting', 'contract-work', 'gig-economy', 'side-hustle', 
  'business', 'business-profits', 'royalties', 'licensing', 'investment', 
  'dividends', 'capital-gains', 'interest', 'bonds', 'real-estate-investment', 
  'cryptocurrency', 'rental_income', 'passive-income', 'affiliate_income', 
  'youtube-monetization', 'blog-income', 'pension', 'social-security', 
  'unemployment', 'disability', 'cashback_rewards', 'gift-money', 'inheritance', 
  'grants', 'scholarships', 'selling-personal-items', 'refunds', 'other'
];

// Expense Tags
const expenseTags = [
  'food', 'groceries', 'restaurants', 'coffee', 'rent', 'utilities', 
  'electricity', 'water', 'internet', 'phone', 'transportation', 'gas', 
  'public-transit', 'car-maintenance', 'parking', 'rideshare', 'healthcare', 
  'medical', 'pharmacy', 'fitness', 'personal-care', 'education', 'tuition', 
  'books', 'courses', 'entertainment', 'streaming', 'movies', 'concerts', 
  'hobbies', 'clothing', 'electronics', 'home-goods', 'gifts', 'office', 
  'work-supplies', 'professional-dev', 'insurance', 'life-insurance', 
  'health-insurance', 'car-insurance', 'bank-fees', 'subscriptions', 'travel', 
  'pets', 'donations', 'misc'
];

const TransactionSearch = ({
  transactions,
  exportToCsv,
  addTransaction,
  fetchTransactions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [customTag, setCustomTag] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [form] = Form.useForm();
  const fileInput = useRef();
  const tableRef = useRef(null);

  // Delete Transaction
  const handleDeleteTransaction = async (transaction) => {
    confirm({
      title: 'Are you sure you want to delete this transaction?',
      icon: <ExclamationCircleOutlined />,
      content: `${transaction.name} - ₹${transaction.amount}`,
      async onOk() {
        try {
          // Find the document to delete
          const q = query(
            collection(db, `users/${auth.currentUser.uid}/transactions`),
            where("name", "==", transaction.name),
            where("amount", "==", transaction.amount),
            where("date", "==", transaction.date),
            where("type", "==", transaction.type)
          );

          const querySnapshot = await getDocs(q);

          querySnapshot.forEach(async (docSnapshot) => {
            await deleteDoc(doc(db, `users/${auth.currentUser.uid}/transactions`, docSnapshot.id));
          });

          // Refresh transactions
          await fetchTransactions();

          toast.success("Transaction deleted successfully!");
        } catch (error) {
          console.error("Error deleting transaction: ", error);
          toast.error("Failed to delete transaction");
        }
      },
    });
  };

  // Print Transactions
  const handlePrintTransactions = () => {
    const printContents = tableRef.current.querySelector('.ant-table-container').innerHTML;
    const originalContents = document.body.innerHTML;

    // Create a new window for printing
    const printWindow = window.open('', '', 'height=500, width=800');
    printWindow.document.write('<html><head><title>My Transactions</title>');
    
    // Add some basic styling to make the print view look better
    printWindow.document.write(`
      <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { 
          border: 1px solid #ddd; 
          padding: 8px; 
          text-align: left; 
        }
        th { 
          background-color: #f2f2f2; 
          font-weight: bold; 
        }
      </style>
    `);
    
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h1 style="text-align: center;">My Transactions</h1>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  // Edit Transaction
  const handleEditTransaction = (transaction) => {
    setCurrentTransaction(transaction);
    form.setFieldsValue({
      ...transaction,
      date: moment(transaction.date)
    });
    setEditModalVisible(true);
  };

  // Save Edited Transaction
  const handleSaveEdit = async (values) => {
    try {
      // Find the document to update
      const q = query(
        collection(db, `users/${auth.currentUser.uid}/transactions`),
        where("name", "==", currentTransaction.name),
        where("amount", "==", currentTransaction.amount),
        where("date", "==", currentTransaction.date),
        where("type", "==", currentTransaction.type)
      );

      const querySnapshot = await getDocs(q);

      const updatedTransaction = {
        ...values,
        date: moment(values.date).format("YYYY-MM-DD"),
        amount: parseFloat(values.amount),
        type: currentTransaction.type
      };

      querySnapshot.forEach(async (docSnapshot) => {
        await updateDoc(doc(db, `users/${auth.currentUser.uid}/transactions`, docSnapshot.id), updatedTransaction);
      });

      // Refresh transactions
      await fetchTransactions();

      setEditModalVisible(false);
      toast.success("Transaction updated successfully!");
    } catch (error) {
      console.error("Error updating transaction: ", error);
      toast.error("Failed to update transaction");
    }
  };

  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          for (const transaction of results.data) {
            const newTransaction = {
              ...transaction,
              amount: parseInt(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }

  // Helpers for tag filtering
  const getFilteredTags = () => {
    if (!typeFilter) {
      return [...incomeTags, ...expenseTags];
    } else if (typeFilter === 'income') {
      return incomeTags;
    } else if (typeFilter === 'expense') {
      return expenseTags;
    }
    return [];
  };

  const formatTagLabel = (tag) => {
    return tag
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <EditOutlined
            onClick={() => handleEditTransaction(record)}
            style={{ color: 'blue', cursor: 'pointer' }}
          />
          <DeleteOutlined
            onClick={() => handleDeleteTransaction(record)}
            style={{ color: 'red', cursor: 'pointer' }}
          />
        </div>
      ),
    }
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const searchMatch = searchTerm
      ? transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const tagMatch =
      selectedTag && selectedTag !== "other"
        ? transaction.tag === selectedTag
        : customTag
          ? transaction.tag.toLowerCase() === customTag.toLowerCase()
          : true;

    const typeMatch = typeFilter ? transaction.type === typeFilter : true;

    return searchMatch && tagMatch && typeMatch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") {
      const dateComparison = new Date(a.date) - new Date(b.date);
      return sortDirection === "asc" ? dateComparison : -dateComparison;
    } else if (sortKey === "amount") {
      const amountComparison = a.amount - b.amount;
      return sortDirection === "asc" ? amountComparison : -amountComparison;
    } else {
      return 0;
    }
  });

  const dataSource = sortedTransactions.map((transaction, index) => ({
    key: index,
    ...transaction,
  }));

  return (
    <div
      style={{
        width: "100%",
        padding: "0rem 2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="input-flex">
          <img src={search} width="16" />
          <input
            placeholder="Search by Name"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Select
          style={{ width: 200 }}
          onChange={(value) => {
            setSelectedTag(value);
            setCustomTag(""); // Reset custom tag input when a predefined tag is selected
          }}
          value={selectedTag !== "other" ? selectedTag : undefined}
          placeholder="Filter by tag"
          allowClear
        >
          {getFilteredTags().map(tag => (
            <Option key={tag} value={tag}>
              {formatTagLabel(tag)}
            </Option>
          ))}
        </Select>
      </div>

      <div ref={tableRef} className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions</h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Radio.Group
              className="input-radio"
              onChange={(e) => setSortKey(e.target.value)}
              value={sortKey}
            >
              <Radio.Button value="">No Sort</Radio.Button>
              <Radio.Button value="date">Sort by Date</Radio.Button>
              <Radio.Button value="amount">Sort by Amount</Radio.Button>
            </Radio.Group>

            {(sortKey === "date" || sortKey === "amount") && (
              <Select
                style={{ width: 120 }}
                value={sortDirection}
                onChange={(value) => setSortDirection(value)}
              >
                <Option value="asc">Ascending</Option>
                <Option value="desc">Descending</Option>
              </Select>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button className="btn" onClick={exportToCsv}>
              Export to CSV
            </button>
            <label htmlFor="file-csv" className="btn btn-blue">
              Import from CSV
            </label>
            <input
              onChange={importFromCsv}
              id="file-csv"
              type="file"
              accept=".csv"
              required
              style={{ display: "none" }}
            />
          </div>
        </div>

        <Table columns={columns} dataSource={dataSource} />
      </div>

      {/* Print Button */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '1rem' 
        }}
      >
        <button 
          className="btn btn-blue" 
          onClick={handlePrintTransactions}
        >
          <PrinterOutlined /> Print Transactions
        </button>
      </div>

      {/* Edit Transaction Modal */}
      <Modal
        title="Edit Transaction"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveEdit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input transaction name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please input amount!' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select date!' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="tag"
            label="Tag"
            rules={[{ required: true, message: 'Please select a tag!' }]}
          >
            <Select>
              {currentTransaction && currentTransaction.type === 'expense' ? (
                <>
                  {/* Personal Expenses */}
                  <Option value="food">Food</Option>
                  <Option value="groceries">Groceries</Option>
                  <Option value="restaurants">Restaurants</Option>
                  <Option value="coffee">Coffee & Snacks</Option>

                  {/* Housing & Utilities */}
                  <Option value="rent">Rent/Mortgage</Option>
                  <Option value="utilities">Utilities</Option>
                  <Option value="electricity">Electricity</Option>
                  <Option value="water">Water</Option>
                  <Option value="internet">Internet</Option>
                  <Option value="phone">Phone Bill</Option>

                  {/* Transportation */}
                  <Option value="transportation">Transportation</Option>
                  <Option value="gas">Fuel/Gas</Option>
                  <Option value="public-transit">Public Transit</Option>
                  <Option value="car-maintenance">Car Maintenance</Option>
                  <Option value="parking">Parking</Option>
                  <Option value="rideshare">Rideshare</Option>

                  {/* Health & Wellness */}
                  <Option value="healthcare">Healthcare</Option>
                  <Option value="medical">Medical Expenses</Option>
                  <Option value="pharmacy">Pharmacy</Option>
                  <Option value="fitness">Fitness</Option>
                  <Option value="personal-care">Personal Care</Option>

                  {/* Education */}
                  <Option value="education">Education</Option>
                  <Option value="tuition">Tuition</Option>
                  <Option value="books">Books & Supplies</Option>
                  <Option value="courses">Online Courses</Option>

                  {/* Entertainment & Leisure */}
                  <Option value="entertainment">Entertainment</Option>
                  <Option value="streaming">Streaming Services</Option>
                  <Option value="movies">Movies</Option>
                  <Option value="concerts">Concerts</Option>
                  <Option value="hobbies">Hobbies</Option>

                  {/* Shopping */}
                  <Option value="clothing">Clothing</Option>
                  <Option value="electronics">Electronics</Option>
                  <Option value="home-goods">Home Goods</Option>
                  <Option value="gifts">Gifts</Option>

                  {/* Office & Professional */}
                  <Option value="office">Office Expenses</Option>
                  <Option value="work-supplies">Work Supplies</Option>
                  <Option value="professional-dev">Professional Development</Option>

                  {/* Insurance & Financial */}
                  <Option value="insurance">Insurance</Option>
                  <Option value="life-insurance">Life Insurance</Option>
                  <Option value="health-insurance">Health Insurance</Option>
                  <Option value="car-insurance">Car Insurance</Option>
                  <Option value="bank-fees">Bank Fees</Option>

                  {/* Miscellaneous */}
                  <Option value="subscriptions">Subscriptions</Option>
                  <Option value="travel">Travel</Option>
                  <Option value="pets">Pets</Option>
                  <Option value="donations">Donations</Option>
                  <Option value="misc">Other</Option>
                </>
              ) : (
                <>
                  {/* Primary Employment */}
                  <Option value="salary">Salary</Option>
                  <Option value="full-time-job">Full-Time Job</Option>
                  <Option value="part-time-job">Part-Time Job</Option>
                  <Option value="overtime">Overtime Pay</Option>
                  <Option value="commission">Commission</Option>
                  <Option value="bonus">Bonus</Option>

                  {/* Self-Employment & Freelance */}
                  <Option value="freelance">Freelance Income</Option>
                  <Option value="consulting">Consulting</Option>
                  <Option value="contract-work">Contract Work</Option>
                  <Option value="gig-economy">Gig Economy</Option>
                  <Option value="side-hustle">Side Hustle</Option>

                  {/* Business Income */}
                  <Option value="business">Business Income</Option>
                  <Option value="business-profits">Business Profits</Option>
                  <Option value="royalties">Royalties</Option>
                  <Option value="licensing">Licensing Income</Option>

                  {/* Investments */}
                  <Option value="investment">Investment Income</Option>
                  <Option value="dividends">Stock Dividends</Option>
                  <Option value="capital-gains">Capital Gains</Option>
                  <Option value="interest">Bank Interest</Option>
                  <Option value="bonds">Bond Returns</Option>
                  <Option value="real-estate-investment">Real Estate Investment</Option>
                  <Option value="cryptocurrency">Cryptocurrency</Option>

                  {/* Passive Income */}
                  <Option value="rental_income">Rental Income</Option>
                  <Option value="passive-income">Passive Income</Option>
                  <Option value="affiliate_income">Affiliate Income</Option>
                  <Option value="youtube-monetization">YouTube Monetization</Option>
                  <Option value="blog-income">Blog Income</Option>

                  {/* Government & Retirement */}
                  <Option value="pension">Pension</Option>
                  <Option value="social-security">Social Security</Option>
                  <Option value="unemployment">Unemployment Benefits</Option>
                  <Option value="disability">Disability Income</Option>

                  {/* Other Income Sources */}
                  <Option value="cashback_rewards">Cashback & Rewards</Option>
                  <Option value="gift-money">Gifts & Monetary Presents</Option>
                  <Option value="inheritance">Inheritance</Option>
                  <Option value="grants">Grants</Option>
                  <Option value="scholarships">Scholarships</Option>
                  <Option value="selling-personal-items">Selling Personal Items</Option>
                  <Option value="refunds">Refunds</Option>

                  {/* Miscellaneous */}
                  <Option value="other">Misc</Option>
                </>
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TransactionSearch;