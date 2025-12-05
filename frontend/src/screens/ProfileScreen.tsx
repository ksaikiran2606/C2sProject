import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { apiClient } from '../services/api';
import { COLORS } from '../constants/colors';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [location, setLocation] = useState(user?.location || '');
  const [loading, setLoading] = useState(false);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleLogout = async () => {
    // Use platform-appropriate confirmation
    let confirmed = false;
    
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      confirmed = window.confirm('Are you sure you want to logout?');
    } else {
      // For mobile, use Alert
      await new Promise<void>((resolve) => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve() },
          { 
            text: 'Logout', 
            style: 'destructive', 
            onPress: () => {
              confirmed = true;
              resolve();
            }
          },
        ]);
      });
    }
    
    if (!confirmed) {
      return;
    }

    try {
      // Call logout service
      await logout();
      
      // Clear all storage (extra safety)
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
      
      // Navigate to login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear storage and navigate
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.content}>
        <Input
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          keyboardType="email-address"
        />

        <Input
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />

        <Input
          label="Location"
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
        />

        <Button title="Edit Profile" onPress={handleEditProfile} />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    backgroundColor: COLORS.PRIMARY,
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.WHITE,
  },
  content: {
    padding: 16,
  },
  logoutButton: {
    marginTop: 24,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF0000',
    borderRadius: 8,
  },
  logoutText: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: '600',
  },
});

