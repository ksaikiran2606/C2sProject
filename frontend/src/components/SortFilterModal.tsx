import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export type SortOption = 'newest' | 'oldest' | 'price_low' | 'price_high';
export type ConditionFilter = 'all' | 'new' | 'like_new' | 'excellent' | 'good' | 'fair' | 'poor';

interface SortFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (sort: SortOption, condition: ConditionFilter, minPrice?: number, maxPrice?: number) => void;
  currentSort?: SortOption;
  currentCondition?: ConditionFilter;
}

export const SortFilterModal: React.FC<SortFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentSort = 'newest',
  currentCondition = 'all',
}) => {
  const [sort, setSort] = useState<SortOption>(currentSort);
  const [condition, setCondition] = useState<ConditionFilter>(currentCondition);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
  ];

  const conditionOptions: { value: ConditionFilter; label: string }[] = [
    { value: 'all', label: 'All Conditions' },
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];

  const handleApply = () => {
    onApply(
      sort,
      condition,
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined
    );
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Sort & Filter</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.DARK_GRAY} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Sort Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.option, sort === option.value && styles.optionSelected]}
                  onPress={() => setSort(option.value)}
                >
                  <Text style={[styles.optionText, sort === option.value && styles.optionTextSelected]}>
                    {option.label}
                  </Text>
                  {sort === option.value && (
                    <Ionicons name="checkmark" size={20} color={COLORS.PRIMARY} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Condition Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Condition</Text>
              {conditionOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.option, condition === option.value && styles.optionSelected]}
                  onPress={() => setCondition(option.value)}
                >
                  <Text style={[styles.optionText, condition === option.value && styles.optionTextSelected]}>
                    {option.label}
                  </Text>
                  {condition === option.value && (
                    <Ionicons name="checkmark" size={20} color={COLORS.PRIMARY} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Price Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.priceInputs}>
                <View style={styles.priceInput}>
                  <Text style={styles.priceLabel}>Min Price</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.currency}>₹</Text>
                    <Text style={styles.input}>{minPrice || '0'}</Text>
                  </View>
                </View>
                <View style={styles.priceInput}>
                  <Text style={styles.priceLabel}>Max Price</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.currency}>₹</Text>
                    <Text style={styles.input}>{maxPrice || 'Any'}</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={() => {
              setSort('newest');
              setCondition('all');
              setMinPrice('');
              setMaxPrice('');
            }}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.DARK_GRAY,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK_GRAY,
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  optionSelected: {
    backgroundColor: COLORS.PRIMARY + '20',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.DARK_GRAY,
  },
  optionTextSelected: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  priceInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  currency: {
    fontSize: 16,
    color: COLORS.DARK_GRAY,
    marginRight: 4,
  },
  input: {
    fontSize: 16,
    color: COLORS.DARK_GRAY,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: COLORS.LIGHT_GRAY,
    alignItems: 'center',
  },
  resetText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK_GRAY,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
  },
  applyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
});


