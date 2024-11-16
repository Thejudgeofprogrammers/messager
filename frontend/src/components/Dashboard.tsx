import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ChatReference {
  id: string;
  name: string;
  lastMessage: string;
}

const Dashboard: React.FC = () => {
  const [chatList, setChatList] = useState<ChatReference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userIdCookie = document.cookie.split('; ').find(row => row.startsWith('userId='));
        const userId = userIdCookie ? userIdCookie.split('=')[1] : null;

        if (!userId) {
          console.error('User ID not found in cookies.');
          return;
        }

        const response = await axios.get(`http://gateway_microservice:8080/api/user/${userId}`, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });

        setChatList(response.data.chatReferences); // Загрузка чатов
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChatClick = (chatId: string) => {
    navigate(`/chat/${chatId}`); // Переход к выбранному чату
  };

  return (
    <Container 
    maxWidth={false}  // Убираем ограничение по ширине
    sx={{ 
      mt: 8, 
      width: '80%',  // Пример ширины в процентах
      maxWidth: '1200px',  // Максимальная ширина
      margin: '12 auto'  // Центрирование
    }}
  >
      <Box sx={{ p: 3, backgroundColor: 'secondary.main', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom align="center" color="primary">
          Dashboard
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {chatList.length > 0 ? (
              chatList.map((chat) => (
                <ListItem
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)} // Добавление обработчика события для клика
                  component="li" // Используем <li> для списка
                  sx={{ cursor: 'pointer' }} // Стилизация для кликабельности
                >
                  <ListItemText
                    primary={chat.name}
                    secondary={chat.lastMessage}
                    sx={{ wordBreak: 'break-word' }}
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary" align="center">
                No chats available.
              </Typography>
            )}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
