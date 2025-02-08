import { useState } from "react";
import axios from "axios";
import { Form, Input, Button, notification } from "antd";

interface SignupProps {
  setIsLogin: (value: boolean) => void; 
}

const SignupCard: React.FC<SignupProps> = ({ setIsLogin }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); 

 
  const handleSignup = async (values: { name: string; email: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      notification.error({
        message: "Password Mismatch",
        description: "The passwords do not match. Please try again.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("https://kazamevtech-backend-kfm8.onrender.com/user/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      notification.success({
        message: "Signup Successful",
        description: "Your account has been created. You can now log in.",
      });

      form.resetFields(); 
      setIsLogin(true);
    } catch (error: any) {
      notification.error({
        message: "Signup Failed",
        description: error.response?.data?.message || "An error occurred. Please try again.",
      });
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>
        <Form form={form} layout="vertical" onFinish={handleSignup}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>
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
            rules={[{ required: true, message: "Please enter a password!" }]}
          >
            <Input.Password placeholder="Create a password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignupCard;
