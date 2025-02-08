import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Switch,
  message,
} from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

interface Task {
  _id: string;
  task: string;
  priority: "Low" | "Medium" | "High";
  createdAt: string;
  updatedAt?: string;
  isCompleted: boolean;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterCompleted, setFilterCompleted] = useState<
    "all" | "completed" | "notCompleted"
  >("all");
  const [filterPriority, setFilterPriority] = useState<
    "all" | "Low" | "Medium" | "High"
  >("all");
  const [sortByDate, setSortByDate] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const userID = localStorage.getItem("authToken");
//   console.log(userID)
  // Fetch tasks from backend
  useEffect(() => {
    const userID = localStorage.getItem("authToken");
    if(!userID){
      message.error("Authentication token Not Found");
      return;
    }
    axios
    .get("https://kazamevtech-backend-kfm8.onrender.com/task/tasks", {
        headers: { Authorization: `Bearer ${userID}` }, 
      })
      .then((response) => {
        console.log(response)
        setTasks(response.data)})
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Add Task Function
  const handleAddTask = async (values: any) => {
    try {
      const newTask = {
        task: values.task,
        priority: values.priority,
        isCompleted: false,
        userID,
      };
  
      const response = await axios.post("https://kazamevtech-backend-kfm8.onrender.com/task/tasks", newTask, {
        headers: { Authorization: `Bearer ${userID}` },
      });
      setTasks([...tasks, response.data.task]);
      setIsModalOpen(false);
      form.resetFields();
      message.success("Task added successfully!");
    } catch (error) {
      message.error("Failed to add task.");
    }
  };
  

  // Edit Task Function
  const handleEditTask = async (values: any) => {
    if (editingTask) {
      try {
        const updatedTask = {
          ...editingTask,
          ...values,
          updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        await axios.put(
          `https://kazamevtech-backend-kfm8.onrender.com/task/${editingTask._id}`,
          updatedTask
        );

        setTasks(
          tasks.map((task) =>
            task._id === editingTask._id ? updatedTask : task
          )
        );
        setIsEditModalOpen(false);
        setEditingTask(null);
        message.success("Task updated successfully!");
      } catch (error) {
        message.error("Failed to update task.");
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredTasks = tasks
  .filter((task) =>
    task.task && task.task.toLowerCase().includes(searchText.toLowerCase()) // Check if task.task is not undefined
  )
  .filter((task) =>
    filterCompleted === "all"
      ? true
      : filterCompleted === "completed"
      ? task.isCompleted
      : !task.isCompleted
  )
  .filter((task) =>
    filterPriority === "all" ? true : task.priority === filterPriority
  )
  .sort((a, b) =>
    sortByDate
      ? moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
      : 0
  );


  const columns = [
    { title: "Task", dataIndex: "task", key: "task" },
    { title: "Priority", dataIndex: "priority", key: "priority" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt: string | undefined) => updatedAt || "—",
    },
    {
      title: "Completed",
      dataIndex: "isCompleted",
      key: "isCompleted",
      render: (isCompleted: boolean) =>
        isCompleted ? "✅ Completed" : "❌ Not Completed",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Task) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => openEditModal(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    editForm.setFieldsValue({
      task: task.task,
      priority: task.priority,
      isCompleted: task.isCompleted,
    });
    setIsEditModalOpen(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Tasks</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search tasks..."
          prefix={<SearchOutlined />}
          onChange={handleSearch}
        />
        <Select defaultValue="all" onChange={setFilterCompleted}>
          <Select.Option value="all">All</Select.Option>
          <Select.Option value="completed">Completed</Select.Option>
          <Select.Option value="notCompleted">Not Completed</Select.Option>
        </Select>
        <Select defaultValue="all" onChange={setFilterPriority}>
          <Select.Option value="all">All Priorities</Select.Option>
          <Select.Option value="Low">Low</Select.Option>
          <Select.Option value="Medium">Medium</Select.Option>
          <Select.Option value="High">High</Select.Option>
        </Select>
        <Button onClick={() => setSortByDate(!sortByDate)}>Sort by Date</Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Task
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredTasks}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      {/* Add Task Modal */}
      <Modal
        title="Add Task"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAddTask}>
          <Form.Item
            name="task"
            label="Task"
            rules={[{ required: true, message: "Please enter a task" }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>
          <Form.Item name="priority" label="Priority" initialValue="Low">
            <Select>
              <Select.Option value="Low">Low</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="High">High</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        title="Edit Task"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => editForm.submit()}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditTask}>
          <Form.Item
            name="task"
            label="Task"
            rules={[{ required: true, message: "Please enter a task" }]}
          >
            <Input placeholder="Edit task title" />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select>
              <Select.Option value="Low">Low</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="High">High</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="isCompleted"
            label="Completed"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tasks;
