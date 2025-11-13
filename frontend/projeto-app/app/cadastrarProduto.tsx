import { FontAwesome5 } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { API_URL } from '../constants/api'; // Importa a URL

// Mantém a tela de splash visível
SplashScreen.preventAutoHideAsync();

export default function CadastrarProdutoScreen() {
  // Estados
  const [nomeProduto, setNomeProduto] = useState('');
  const [quantidadeRecebida, setQuantidadeRecebida] = useState('');
  const [unidadeMedida, setUnidadeMedida] = useState('');
  const [fornecedor, setFornecedor] = useState('');
  const [dataRecebimento, setDataRecebimento] = useState(
    new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
  );

  // Fontes
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

  const handleSalvarProduto = async () => {
    // Validação ATUALIZADA
    if (!nomeProduto.trim() || !unidadeMedida.trim() || !quantidadeRecebida.trim()) {
      Alert.alert('Atenção', 'Nome, Unidade de Medida e Quantidade são obrigatórios.');
      return;
    }

    // --- CORREÇÃO DO TIMEOUT ---
    // Em vez de AbortSignal.timeout(15000), que não é suportado no React Native:

    // 1. Define o tempo máximo de espera
    const tempoLimiteMs = 15000;

    // 2. Cria um AbortController
    const controller = new AbortController();
    
    // 3. Cria um ID de timeout que, ao disparar, chama o .abort() do controller
    const timeoutId = setTimeout(() => {
        console.log('Timeout! Abortando a requisição...');
        controller.abort(); // Isso vai disparar um erro 'AbortError'
    }, tempoLimiteMs);
    // --- FIM DA CORREÇÃO ---


    try {
      const resposta = await fetch(`${API_URL}/produtos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nomeProduto,
          unidadeMedida: unidadeMedida,
          quantidadeRecebida: quantidadeRecebida,
          fornecedor: fornecedor,
          dataRecebimento: dataRecebimento
        }),
        // 4. Usa o 'signal' do controller que criamos
        signal: controller.signal 
      });

      // 5. Se a requisição foi bem-sucedida, limpe o timeout!
      //    Isso impede que o .abort() seja chamado sem necessidade.
      clearTimeout(timeoutId);

      const dadosDaResposta = await resposta.json();

      if (!resposta.ok) {
        Alert.alert('Erro ao Salvar', dadosDaResposta.error || 'Não foi possível cadastrar o produto.');
      } else {
        Alert.alert('Sucesso!', `Produto "${dadosDaResposta.nome}" cadastrado!`);

        setNomeProduto('');
        setQuantidadeRecebida('');
        setUnidadeMedida('');
        setFornecedor('');
      }

    } catch (error: any) {
      // 6. Limpa o timeout também em caso de erro (seja timeout ou outro erro)
      clearTimeout(timeoutId);
      
      console.error('Erro de rede ou timeout:', error.message);
      
      // O 'name' do erro será 'AbortError' se o timeout disparou
      if (error.name === 'AbortError') {
        Alert.alert('Erro de Conexão', 'O servidor demorou muito para responder (timeout). Verifique sua conexão e o servidor.');
      } else {
        // Trata outros erros de rede (ex: sem internet, servidor offline)
        Alert.alert('Erro de Conexão', `Não foi possível conectar ao servidor: ${error.message}`);
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      onLayout={onLayoutRootView}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Entrada de Produtos</Text>
        <Text style={styles.headerSubtitle}>Cadastre novos itens</Text>
      </View>

      {/* Campo Nome do Produto */}
      <View style={styles.inputGroup}>
        <FontAwesome5 name="drumstick-bite" size={20} color="#BF360C" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Filé Mignon"
          placeholderTextColor="#A9A9A9"
          value={nomeProduto}
          onChangeText={setNomeProduto}
        />
      </View>

      {/* Campo Quantidade Recebida */}
      <View style={styles.inputGroup}>
        <FontAwesome5 name="shopping-bag" size={20} color="#FFD54F" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Quantidade Recebida"
          placeholderTextColor="#A9A9A9"
          keyboardType="numeric"
          value={quantidadeRecebida}
          onChangeText={setQuantidadeRecebida}
        />
      </View>

      {/* Campo Unidade de Medida */}
      <View style={styles.inputGroup}>
        <FontAwesome5 name="balance-scale" size={20} color="#FB8C00" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Unidade de Medida (Ex: Kg, Un, Cx)"
          placeholderTextColor="#A9A9A9"
          value={unidadeMedida}
          onChangeText={setUnidadeMedida}
        />
      </View>

      {/* Campo Fornecedor */}
      <View style={styles.inputGroup}>
        <FontAwesome5 name="handshake" size={20} color="#E65100" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Fornecedor (Ex: Frigorífico X)"
          placeholderTextColor="#A9A9A9"
          value={fornecedor}
          onChangeText={setFornecedor}
        />
      </View>

      {/* Campo Data de Recebimento */}
      <View style={styles.inputGroup}>
        <FontAwesome5 name="calendar-alt" size={20} color="#D32F2F" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Data de Recebimento"
          placeholderTextColor="#A9A9A9"
          value={dataRecebimento}
          onChangeText={setDataRecebimento}
          editable={false}
        />
      </View>

      {/* Botão Salvar Produto */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSalvarProduto}>
        <Text style={styles.saveButtonText}>SALVAR PRODUTO</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8E1', padding: 20 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingTop: Platform.OS === 'android' ? 40 : 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  headerTitle: { fontFamily: 'SweetToffee', fontSize: 36, color: '#BF360C', textAlign: 'center', marginBottom: 5 },
  headerSubtitle: { fontFamily: 'SweetToffee', fontSize: 20, color: '#E65100', textAlign: 'center' },
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 15, paddingVertical: 10, paddingHorizontal: 15, marginBottom: 15, elevation: 3, shadowColor: '#FFCC80', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 3 },
  inputIcon: { marginRight: 10, width: 24, textAlign: 'center' },
  input: { flex: 1, fontFamily: 'BalsamiqSans-Regular', fontSize: 16, color: '#424242', paddingVertical: 0 },
  saveButton: { backgroundColor: '#D32F2F', borderRadius: 25, paddingVertical: 15, alignItems: 'center', marginTop: 30, marginBottom: 20, elevation: 5, shadowColor: '#EF5350', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 5 },
  saveButtonText: { fontFamily: 'SweetToffee', fontSize: 22, color: '#FFFFFF', textTransform: 'uppercase' },
});