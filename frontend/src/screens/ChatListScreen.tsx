import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { chatService, ChatRoom } from '../services/chat';
import { COLORS } from '../constants/colors';

export const ChatListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    loadChatRooms();
  }, []);

  const loadChatRooms = useCallback(async () => {
    try {
      const data = await chatService.getChatRooms();
      setChatRooms(data);
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadChatRooms();
  };

  const handleChatPress = (room: ChatRoom) => {
    navigation.navigate('ChatRoom', { roomId: room.id });
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <FlatList
        data={chatRooms}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => handleChatPress(item)}
          >
            <View style={styles.chatContent}>
              <Text style={styles.chatTitle}>{item.listing.title}</Text>
              <Text style={styles.chatSubtitle} numberOfLines={1}>
                {item.last_message?.content || 'No messages yet'}
              </Text>
            </View>
            <View style={styles.chatMeta}>
              {item.unread_count > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread_count}</Text>
                </View>
              )}
              <Text style={styles.chatTime}>
                {item.last_message
                  ? new Date(item.last_message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : ''}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.PRIMARY} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  chatContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK_GRAY,
    marginBottom: 4,
  },
  chatSubtitle: {
    fontSize: 14,
    color: COLORS.GRAY,
  },
  chatMeta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  unreadBadge: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  unreadText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '600',
  },
  chatTime: {
    fontSize: 12,
    color: COLORS.GRAY,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
});

