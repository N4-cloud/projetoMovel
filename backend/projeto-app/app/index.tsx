// app/index.tsx (COMPLETO E CORRIGIDO)

import { FontAwesome5 } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';

import { API_URL } from '../constants/api';

// Mantém a tela de splash visível
SplashScreen.preventAutoHideAsync();


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  // Carregamento das fontes
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

  const handleLogin = async () => {
    // Validação simples
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o e-mail e a senha.');
      return;
    }

    try {
      // Tenta fazer o login na API
      const resposta = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: senha,
        }),
      });

      const dadosDaResposta = await resposta.json();

      // Se a resposta NÃO for OK (ex: 400, 404)
      if (!resposta.ok) {
        // Mostra o erro que o backend enviou (ex: "Senha incorreta.")
        Alert.alert('Erro de Login', dadosDaResposta.error);
      } else {
        // SUCESSO!
        console.log('Login bem-sucedido:', dadosDaResposta.message);
        
        // Agora sim, navega para a tela principal
        router.replace('/home'); 
      }

    } catch (error) {
      // Lidar com erros de rede (ex: servidor desligado)
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
        {/* Título */}
        <Text style={styles.title}>Zero Waste</Text>
        <Text style={styles.subtitle}>Controle de Estoque</Text>

        {/* Campo E-mail */}
        <View style={styles.inputGroup}>
          <FontAwesome5 name="user-alt" size={20} color="#BF360C" style={styles.inputIcon} />
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
            placeholder="Sua senha"
            placeholderTextColor="#A9A9A9"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
        </View>

        {/* Botão Entrar */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>ENTRAR</Text>
        </TouchableOpacity>

        {/* Links Adicionais */}
        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={() => router.push('/esqueciSenha')}
        >
          <Text style={styles.linkText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={() => router.push('/register')}
        >
          <Text style={styles.linkText}>Não tem uma conta? Crie aqui!</Text>
        </TouchableOpacity>
        
      </View>
    </KeyboardAvoidingView>
  );
}

// Os estilos (styles) continuam exatamente os mesmos
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
  title: {
    fontFamily: 'SweetToffee',
    fontSize: 52,
    color: '#BF360C',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'BalsamiqSans-Regular',
    fontSize: 18,
    color: '#E65100',
    textAlign: 'center',
    marginBottom: 40,
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
  loginButton: {
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
  loginButtonText: {
    fontFamily: 'SweetToffee',
    fontSize: 22,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontFamily: 'BalsamiqSans-Regular',
    fontSize: 14,
    color: '#E65100',
  },
});