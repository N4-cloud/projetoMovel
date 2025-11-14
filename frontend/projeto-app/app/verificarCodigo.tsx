import { FontAwesome5 } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '../constants/api'; // Importando a API_URL

SplashScreen.preventAutoHideAsync();

export default function VerifyCodeScreen() {
  const [token, setToken] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // Recebe o e-mail que foi passado como parâmetro da tela anterior
  const { email } = useLocalSearchParams() as { email: string };

  const [fontsLoaded] = useFonts({
    'SweetToffee': require('../assets/fonts/SweetToffee.ttf'),
    'BalsamiqSans-Regular': require('../assets/fonts/BalsamiqSans-Regular.ttf'), // Caminho correto
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const handleVerifyCode = async () => {
    if (!token.trim() || !novaSenha.trim()) {
      Alert.alert('Atenção', 'Por favor, insira o código e a nova senha.');
      return;
    }
    
    if (token.length !== 6) {
       Alert.alert('Atenção', 'O código deve ter 6 dígitos.');
       return;
    }

    setIsLoading(true);

    try {
      // 1. Chama a rota do back-end para redefinir a senha
      await axios.post(`${API_URL}/auth/redefinir-senha`, {
        email: email,
        token: token,
        novaSenha: novaSenha,
      });

      // 2. Se deu certo, avisa e manda para o login
      Alert.alert(
        'Sucesso!',
        'Sua senha foi redefinida. Por favor, faça login novamente.',
        [{ text: 'OK', onPress: () => router.replace('/') }] // Volta para a tela de login
      );

    } catch (error: any) {
      // 3. Se deu erro (token inválido, expirado, etc)
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert('Erro', error.response.data.error || 'Não foi possível redefinir a senha.');
      } else {
        Alert.alert('Erro', 'Ocorreu um erro de rede. Tente novamente.');
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer} onLayout={onLayoutRootView}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} disabled={isLoading}>
          <FontAwesome5 name="arrow-left" size={24} color="#BF360C" />
        </TouchableOpacity>

        <Text style={styles.title}>Verificar Código</Text>
        <Text style={styles.subtitle}>
          Digite o código de 6 dígitos enviado para: {email}
        </Text>

        {/* Campo Código */}
        <View style={styles.inputGroup}>
          <FontAwesome5 name="key" size={20} color="#BF360C" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="123456"
            placeholderTextColor="#A9A9A9"
            value={token}
            onChangeText={setToken}
            keyboardType="number-pad"
            maxLength={6}
            editable={!isLoading}
          />
        </View>
        
        {/* Campo Nova Senha */}
        <View style={styles.inputGroup}>
          <FontAwesome5 name="lock" size={20} color="#BF360C" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Digite sua nova senha"
            placeholderTextColor="#A9A9A9"
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        {/* Botão Redefinir */}
        <TouchableOpacity style={styles.actionButton} onPress={handleVerifyCode} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.actionButtonText}>REDEFINIR SENHA</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Estilos adaptados da tela anterior
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
    minHeight: 50,
  },
  actionButtonText: {
    fontFamily: 'SweetToffee',
    fontSize: 22,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
});