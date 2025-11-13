// app/home.tsx (NOVO ARQUIVO - TELA DE MENU)

import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Sair", "Você tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: () => router.replace('/') }
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <FontAwesome5 name="sign-out-alt" size={24} color="#BF360C" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Menu Principal</Text>
      <Text style={styles.subtitle}>Selecione uma opção</Text>

      {/* Botão Cadastrar Produto */}
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => router.push('/cadastrarProduto')}
      >
        <FontAwesome5 name="plus-square" size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.menuButtonText}>Cadastrar Produto</Text>
      </TouchableOpacity>

      {/* Botão Cadastrar Produção */}
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => router.push('../cadastrarProducao')}
      >
        <FontAwesome5 name="plus-square" size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.menuButtonText}>Cadastrar Produção</Text>
      </TouchableOpacity>

      {/* Botão Estoque */}
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => router.push('../estoque')}
      >
        <FontAwesome5 name="box-open" size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.menuButtonText}>Ver Estoque</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    padding: 20,
  },
  logoutButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 10,
  },
  title: {
    fontFamily: 'SweetToffee',
    fontSize: 48,
    color: '#BF360C',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'BalsamiqSans-Regular',
    fontSize: 18,
    color: '#E65100',
    textAlign: 'center',
    marginBottom: 50,
  },
  menuButton: {
    backgroundColor: '#D32F2F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#EF5350',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
  menuButtonText: {
    fontFamily: 'SweetToffee',
    fontSize: 22,
    color: '#FFFFFF',
  },
  icon: {
    marginRight: 15,
  },
});