import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Only import DocumentPicker for native platforms
const getDocumentPickerModule = async () => {
  if (Platform.OS !== 'web') {
    return await import('expo-document-picker');
  }
  return null;
};

interface SupportTicketFormProps {
  onSubmit: (ticket: {
    name: string;
    email: string;
    category: string;
    message: string;
    attachments: any[];
  }) => void;
}

const categories = [
  'Technical Issue',
  'Billing',
  'Course Content',
  'Account',
  'Other'
];

export const SupportTicketForm = ({ onSubmit }: SupportTicketFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);

  const handleAttachFile = async () => {
    if (Platform.OS === 'web') {
      // For web platform
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*,application/pdf';
      
      input.onchange = (e: any) => {
        const files = Array.from(e.target.files || []);
        setAttachments([...attachments, ...files.map(file => ({
          name: file.name,
          size: file.size,
          uri: URL.createObjectURL(file),
          type: file.type
        }))]);
      };
      
      input.click();
    } else {
      // For native platforms
      try {
        const DocumentPicker = await getDocumentPickerModule();
        if (!DocumentPicker) {
          Alert.alert('Error', 'Document picker not available');
          return;
        }

        const result = await DocumentPicker.getDocumentAsync({
          type: ['image/*', 'application/pdf'],
          multiple: true,
        });

        if (!result.canceled && result.assets) {
          setAttachments([...attachments, ...result.assets]);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to attach file');
      }
    }
  };

  const handleSubmit = () => {
    if (!name || !email || !category || !message) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    onSubmit({
      name,
      email,
      category,
      message,
      attachments,
    });

    // Reset form
    setName('');
    setEmail('');
    setCategory('');
    setMessage('');
    setAttachments([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category *</Text>
        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.categoryChip,
                category === cat && styles.selectedCategory,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat && styles.selectedCategoryText,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Message *</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          value={message}
          onChangeText={setMessage}
          placeholder="Describe your issue or question"
          multiline
          numberOfLines={4}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Attachments</Text>
        <Pressable style={styles.attachButton} onPress={handleAttachFile}>
          <Feather name="paperclip" size={20} color="#6B7280" />
          <Text style={styles.attachButtonText}>Attach Files</Text>
        </Pressable>
        {attachments.map((file, index) => (
          <View key={index} style={styles.attachmentItem}>
            <Feather name="file" size={16} color="#6B7280" />
            <Text style={styles.attachmentName} numberOfLines={1}>
              {file.name}
            </Text>
            <Pressable
              onPress={() => {
                const newAttachments = [...attachments];
                newAttachments.splice(index, 1);
                setAttachments(newAttachments);
              }}
            >
              <Feather name="x" size={16} color="#6B7280" />
            </Pressable>
          </View>
        ))}
      </View>

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Ticket</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#7C3AED',
  },
  categoryText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  attachButtonText: {
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 14,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  attachmentName: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 14,
    color: '#4B5563',
  },
  submitButton: {
    backgroundColor: '#7C3AED',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
