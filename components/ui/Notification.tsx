import { useEffect, useState } from 'react';
import { Badge, List, Popover, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const Notification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New Notification',
      message: 'This is a new notification',
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  //   useEffect(() => {
  //     const fetchNotifications = async () => {
  //       try {
  //         const response = await fetch('/api/v1/notifications');
  //         const data = await response.json();
  //         setNotifications(data.notifications);
  //       } catch (error) {
  //         console.error('Error fetching notifications:', error);
  //       }
  //     };

  //     fetchNotifications();
  //   }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const notificationContent = (
    <div style={{ width: 300 }}>
      <Typography.Title level={4}>Notifications</Typography.Title>
      {notifications.length === 0 ? (
        <Typography.Text type="secondary">No new notifications</Typography.Text>
      ) : (
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item key={notification.id}>
              <List.Item.Meta
                title={notification.title}
                description={
                  <>
                    <Typography.Text>{notification.message}</Typography.Text>
                    <br />
                    <Typography.Text type="secondary">
                      {new Date(notification.created_at).toLocaleString()}
                    </Typography.Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Popover content={notificationContent} trigger="click">
      <Badge className="mr-3" count={notifications.length}>
        <BellOutlined className="text-color-2" style={{ fontSize: '24px', cursor: 'pointer' }} />
      </Badge>
    </Popover>
  );
};

export default Notification;
