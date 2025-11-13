// app/estoque.tsx

import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Estoque() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Estoque</Text>
      <Button title="Voltar" onPress={() => router.back()} />
    </View>
  );
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 20, marginBottom: 20 }
})