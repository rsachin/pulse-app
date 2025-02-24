import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_URL = 'https://pulse-backend-jcea.onrender.com';

export default function App() {
  const [insightsData, setInsightsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/insights`);
        console.log('API Response:', response.data); // Debug log
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data format from API');
        }
        
        setInsightsData(response.data.map(item => ({
          id: item.id?.toString() || `item-${Date.now()}`,
          category: item.category,
          content: item.content
        })));
        
        setError('');
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load insights');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.category || 'Uncategorized'}</Text>
      <Text style={styles.content}>{item.content || 'No content available'}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Insights</Text>
      <FlatList
        data={insightsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || String(Math.random())}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No insights available</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 40,
  },
  header: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    color: '#1E90FF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  content: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
