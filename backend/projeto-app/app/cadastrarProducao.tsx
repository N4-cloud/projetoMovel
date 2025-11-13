// app/cadastrarProducao.tsx

import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function CadastrarProducao() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Cadastro de Produção</Text>
      <Button title="Voltar" onPress={() => router.back()} />
    </View>
  );
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 20, marginBottom: 20 }
})