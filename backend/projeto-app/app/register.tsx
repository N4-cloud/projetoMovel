// app/register.tsx (ARQUIVO NOVO)

import { FontAwesome5 } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_URL } from '../constants/api';

SplashScreen.preventAutoHideAsync();

// 1. Defina o IP da sua API (VM) aqui


export default function RegisterScreen() {
  // 2. Estados para os novos campos
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const router = useRouter();

  // Carregamento de fontes
  const [fontsLoaded] = useFonts({
    'SweetToffee': require('../assets/fonts/SweetToffee.ttf'),
    'BalsamiqSans-Regular': require('../assets/fonts/BalsamiqSans-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // 3. Função para lidar com o registro
  const handleRegister = async () => {
    // Validações
    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    try {
      // Tenta registrar na API
      const resposta = await fetch(`${API_URL}/auth/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: senha,
        }),
      });

      const dadosDaResposta = await resposta.json();

      if (!resposta.ok) {
        // Mostra o erro do backend (ex: "E-mail já em uso")
        Alert.alert('Erro ao Registrar', dadosDaResposta.error);
      } else {
        // SUCESSO!
        Alert.alert(
          'Sucesso!',
          'Usuário cadastrado. Você já pode fazer o login.',
          [{ text: 'OK', onPress: () => router.replace('/') }] // Volta para a tela de login
        );
      }

    } catch (error) {
      console.error('Erro de rede:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer} onLayout={onLayoutRootView}>
        {/* Botão de Voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={24} color="#BF360C" />
        </TouchableOpacity>

        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Insira seus dados para se cadastrar</Text>

        {/* Campo Nome */}
        <View style={styles.inputGroup}>
          <FontAwesome5 name="user" size={20} color="#BF360C" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Seu nome completo"
            placeholderTextColor="#A9A9A9"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />
        </View>

        {/* Campo E-mail */}
        <View style={styles.inputGroup}>
          <FontAwesome5 name="envelope" size={20} color="#BF360C" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="seu-email@exemplo.com"
            placeholderTextColor="#A9A9A9"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Campo Senha */}
        <View style={styles.inputGroup}>
          <FontAwesome5 name="lock" size={20} color="#BF360C" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Crie uma senha"
            placeholderTextColor="#A9A9A9"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
        </View>

        {/* Campo Confirmar Senha */}
        <View style={styles.inputGroup}>
          <FontAwesome5 name="lock" size={20} color="#BF360C" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirme sua senha"
            placeholderTextColor="#A9A9A9"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />
        </View>

        {/* Botão Registrar */}
        <TouchableOpacity style={styles.actionButton} onPress={handleRegister}>
          <Text style={styles.actionButtonText}>REGISTRAR</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Estilos adaptados da sua tela de login para consistência
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  title: {
    fontFamily: 'SweetToffee',
    fontSize: 42,
    color: '#BF360C',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'BalsamiqSans-Regular',
    fontSize: 16,
    color: '#E65100',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#FFCC80',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  inputIcon: {
    marginRight: 10,
    width: 24,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    fontFamily: 'BalsamiqSans-Regular',
    fontSize: 16,
    color: '#424242',
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
  },
  actionButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
    shadowColor: '#EF5350',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
  actionButtonText: {
    fontFamily: 'SweetToffee',
    fontSize: 22,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
});