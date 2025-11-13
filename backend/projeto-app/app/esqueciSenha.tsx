// app/esqueciSenha.tsx

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

SplashScreen.preventAutoHideAsync();

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  // Carregamento de fontes (necessário em cada tela)
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

  // Função que será chamada ao clicar no botão
  const handlePasswordReset = () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Por favor, insira seu e-mail.');
      return;
    }

    // --- LÓGICA DE BACKEND VIRIA AQUI ---
    // Simulação: o backend receberia o e-mail, geraria um token de reset
    // e enviaria o link para o e-mail do usuário.
    console.log('Solicitação de reset de senha para o e-mail:', email);

    // Mensagem de sucesso genérica por segurança (não confirma se o e-mail existe)
    Alert.alert(
      'Verifique seu E-mail',
      'Se um e-mail correspondente for encontrado em nosso sistema, um link para redefinição de senha será enviado.',
      [{ text: 'OK', onPress: () => router.back() }] // Volta para a tela de login
    );
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

        <Text style={styles.title}>Redefinir Senha</Text>
        <Text style={styles.subtitle}>
          Insira seu e-mail para receber o link de redefinição.
        </Text>

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

        {/* Botão Enviar Link */}
        <TouchableOpacity style={styles.actionButton} onPress={handlePasswordReset}>
          <Text style={styles.actionButtonText}>ENVIAR LINK</Text>
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