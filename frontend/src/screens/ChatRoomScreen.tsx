import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatService, ChatRoomDetail, Message } from '../services/chat';
import { WS_BASE_URL } from '../constants/config';
import { COLORS } from '../constants/colors';

export const ChatRoomScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { roomId } = route.params;
  const [chatRoom, setChatRoom] = useState<ChatRoomDetail | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    loadChatRoom();
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [roomId]);

  const loadChatRoom = async () => {
    try {
      const data = await chatService.getChatRoom(roomId);
      setChatRoom(data);
      await chatService.markAsRead(roomId);
    } catch (error) {
      console.error('Error loading chat room:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = async () => {
    const token = await AsyncStorage.getItem('access_token');
    const ws = new WebSocket(`${WS_BASE_URL}/ws/chat/${roomId}/?token=${token || ''}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      if (chatRoom) {
        setChatRoom({
          ...chatRoom,
          messages: [...chatRoom.messages, newMessage],
        });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    wsRef.current = ws;
  };

  const sendMessage = async () => {
    if (!message.trim() || !chatRoom) return;

    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ message: message.trim() }));
        setMessage('');
      } else {
        await chatService.sendMessage(roomId, message.trim());
        setMessage('');
        loadChatRoom();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading || !chatRoom) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{chatRoom.listing.title}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={chatRoom.messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isMyMessage = item.sender.id === chatRoom.buyer.id;
          return (
            <View
              style={[
                styles.messageContainer,
                isMyMessage ? styles.myMessage : styles.otherMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isMyMessage ? styles.myMessageText : styles.otherMessageText,
                ]}
              >
                {item.content}
              </Text>
              <Text style={styles.messageTime}>
                {new Date(item.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          );
        }}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.GRAY}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '75%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.PRIMARY,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  myMessageText: {
    color: COLORS.WHITE,
  },
  otherMessageText: {
    color: COLORS.DARK_GRAY,
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
    backgroundColor: COLORS.WHITE,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    color: COLORS.BLACK,
  },
  sendButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
});

