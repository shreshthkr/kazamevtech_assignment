import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext/AuthContext";
import { Form, Input, Button, notification } from "antd";

const LoginCard = () => {
  const { login } = useContext(AuthContext)!;
  const [loading, setLoading] = useState(false);
  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await axios.post("https://kazamevtech-backend-kfm8.onrender.com/user/login", values);
      const token = response.data.token;
      login(token);
      notification.success({
        message: "Login Successful",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      notification.error({
        message: "Login Failed",
        description: error.response?.data?.message || "Invalid email or password.",
      });
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginCard;
