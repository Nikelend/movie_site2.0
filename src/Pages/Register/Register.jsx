import React from "react"
import { Form, Input, Button, message } from "antd"

export default function Register() {
  const onFinish = async (values) => {
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      })

      if (response.ok) {
        message.success("Реєстрація успішна!")
      } else {
        message.error("Помилка реєстрації. Спробуйте ще раз.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      message.error("Сталася помилка сервера.")
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", paddingTop: 50 }}>
      <Form name="register" onFinish={onFinish}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Введіть ваше ім'я!" }]}
        >
          <Input placeholder="Ім'я" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Введіть ваш Email!" },
            { type: "email", message: "Некоректний Email!" }
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Введіть пароль!" }]}
        >
          <Input.Password placeholder="Пароль" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Зареєструватися
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}