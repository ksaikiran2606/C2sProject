import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface FooterProps {
  navigation?: any;
}

export const Footer: React.FC<FooterProps> = ({ navigation }) => {
  return (
    <View style={styles.footer}>
      <View style={styles.content}>
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Text style={styles.sectionText}>
            Your trusted platform for buying and selling products. Connect with buyers and sellers in your community.
          </Text>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <TouchableOpacity onPress={() => navigation?.navigate('Home')}>
            <Text style={styles.link}>Browse Listings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation?.navigate('AddListing')}>
            <Text style={styles.link}>Sell Something</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation?.navigate('Profile')}>
            <Text style={styles.link}>My Account</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <Text style={styles.link}>Electronics</Text>
          <Text style={styles.link}>Vehicles</Text>
          <Text style={styles.link}>Furniture</Text>
          <Text style={styles.link}>Clothing</Text>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={16} color={COLORS.WHITE} />
            <Text style={styles.contactText}>support@clicktosell.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={16} color={COLORS.WHITE} />
            <Text style={styles.contactText}>+91 123 456 7890</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="location-outline" size={16} color={COLORS.WHITE} />
            <Text style={styles.contactText}>India</Text>
          </View>
        </View>
      </View>

      {/* Social Media */}
      <View style={styles.socialSection}>
        <Text style={styles.socialTitle}>Follow Us</Text>
        <View style={styles.socialIcons}>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-facebook" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-instagram" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-twitter" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-whatsapp" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Copyright */}
      <View style={styles.copyright}>
        <Text style={styles.copyrightText}>
          © 2024 ClickToSell. All rights reserved.
        </Text>
        <View style={styles.legalLinks}>
          <Text style={styles.legalLink}>Privacy Policy</Text>
          <Text style={styles.legalLink}>Terms of Service</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: COLORS.DARK_GRAY,
    paddingTop: 40,
    paddingBottom: 20,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  section: {
    width: '45%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.WHITE,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  link: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  socialSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
    marginBottom: 16,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyright: {
    alignItems: 'center',
    paddingTop: 20,
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  legalLinks: {
    flexDirection: 'row',
    gap: 16,
  },
  legalLink: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'underline',
  },
});

