import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Note {
  id: string;
  content: string;
  timestamp: number;
  createdAt: Date;
  updatedAt: Date;
}

interface LessonNotesProps {
  notes: Note[];
  currentTime: number;
  onAddNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onExportNotes: () => void;
  onJumpToTimestamp: (timestamp: number) => void;
}

export const LessonNotes = ({
  notes,
  currentTime,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onExportNotes,
  onJumpToTimestamp,
}: LessonNotesProps) => {
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote({
        content: newNote.trim(),
        timestamp: currentTime,
      });
      setNewNote('');
    }
  };

  const handleUpdateNote = (note: Note, newContent: string) => {
    onUpdateNote({
      ...note,
      content: newContent,
      updatedAt: new Date(),
    });
    setEditingNoteId(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lesson Notes</Text>
        <Pressable style={styles.exportButton} onPress={onExportNotes}>
          <Feather name="download" size={20} color="#7C3AED" />
          <Text style={styles.exportButtonText}>Export Notes</Text>
        </Pressable>
      </View>

      <View style={styles.addNoteContainer}>
        <TextInput
          style={styles.noteInput}
          placeholder="Add a note..."
          value={newNote}
          onChangeText={setNewNote}
          multiline
        />
        <Pressable 
          style={[styles.addButton, !newNote.trim() && styles.addButtonDisabled]}
          onPress={handleAddNote}
          disabled={!newNote.trim()}
        >
          <Text style={styles.addButtonText}>Add Note</Text>
          <Text style={styles.timestampText}>at {formatTimestamp(currentTime)}</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.notesList} showsVerticalScrollIndicator={false}>
        {notes.sort((a, b) => b.timestamp - a.timestamp).map(note => (
          <View key={note.id} style={styles.noteItem}>
            <Pressable
              style={styles.timestampButton}
              onPress={() => onJumpToTimestamp(note.timestamp)}
            >
              <Feather name="play-circle" size={16} color="#7C3AED" />
              <Text style={styles.timestamp}>{formatTimestamp(note.timestamp)}</Text>
            </Pressable>

            {editingNoteId === note.id ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.editInput}
                  value={note.content}
                  onChangeText={(newContent) => handleUpdateNote(note, newContent)}
                  multiline
                  autoFocus
                />
                <Pressable
                  style={styles.saveButton}
                  onPress={() => setEditingNoteId(null)}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.noteContent}>
                <Text style={styles.noteText}>{note.content}</Text>
                <View style={styles.noteActions}>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => setEditingNoteId(note.id)}
                  >
                    <Feather name="edit-2" size={16} color="#6B7280" />
                  </Pressable>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => onDeleteNote(note.id)}
                  >
                    <Feather name="trash-2" size={16} color="#EF4444" />
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F3FF',
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7C3AED',
  },
  addNoteContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  noteInput: {
    height: 80,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#1F2937',
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#7C3AED',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  timestampText: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
  notesList: {
    flex: 1,
    padding: 16,
  },
  noteItem: {
    marginBottom: 16,
    gap: 8,
  },
  timestampButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '500',
  },
  noteContent: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  editContainer: {
    gap: 8,
  },
  editInput: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7C3AED',
    fontSize: 14,
    color: '#1F2937',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  saveButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
