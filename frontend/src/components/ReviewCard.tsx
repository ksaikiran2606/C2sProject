import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  product?: string;
}

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Text key={index} style={styles.star}>
        {index < rating ? '⭐' : '☆'}
      </Text>
    ));
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.userName}>{review.userName}</Text>
          {review.product && (
            <Text style={styles.product}>Bought: {review.product}</Text>
          )}
        </View>
        <View style={styles.rating}>
          {renderStars(review.rating)}
        </View>
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
      <Text style={styles.date}>{review.date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK_GRAY,
  },
  product: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginTop: 4,
  },
  rating: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 16,
  },
  comment: {
    fontSize: 14,
    color: COLORS.DARK_GRAY,
    lineHeight: 20,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: COLORS.GRAY,
  },
});


