// app/cadastrarProducao.tsx (CORRIGIDO PARA IPHONE)

import { FontAwesome5 } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Picker } from '@react-native-picker/picker';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator
} from 'react-native';
import { API_URL } from '../constants/api';

SplashScreen.preventAutoHideAsync();

// 1. DEFINIÇÃO DO TIPO
interface Produto {
  id: string;
  nome: string;
  quantidade: number;
  unidadeMedida: string;
}

export default function CadastrarProducaoScreen() {
  // 2. ESTADOS TIPADOS
  const [produtos, setProdutos] = useState<Produto[]>([]); 
  const [produtoSelecionado, setProdutoSelecionado] = useState(''); 
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState(0);
  
  const [quantidadeUsada, setQuantidadeUsada] = useState('');
  const [observacao, setObservacao] = useState('');
  const [dataProducao, setDataProducao] = useState(
    new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  );

  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    'SweetToffee': require('../assets/fonts/SweetToffee.ttf'),
    'BalsamiqSans-Regular': require('../assets/fonts/BalsamiqSans-Regular.ttf'),
  });

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const response = await fetch(`${API_URL}/produtos`);
      const data = await response.json();
      setProdutos(data);
      setLoading(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os produtos do estoque.");
      setLoading(false);
    }
  };

  // 3. FUNÇÃO TIPADA
  const handleSelectProduto = (itemValue: string) => {
    setProdutoSelecionado(itemValue);
    const produto = produtos.find(p => p.id === itemValue);
    if (produto) {
      setQuantidadeDisponivel(produto.quantidade || 0);
    }
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const handleSalvarProducao = async () => {
    if (!produtoSelecionado || !quantidadeUsada.trim()) {
      Alert.alert('Atenção', 'Selecione um produto e informe a quantidade utilizada.');
      return;
    }

    if (parseFloat(quantidadeUsada) > quantidadeDisponivel) {
      Alert.alert('Erro', `Você só tem ${quantidadeDisponivel} Kg disponíveis neste lote.`);
      return;
    }

    try {
      const prodNome = produtos.find(p => p.id === produtoSelecionado)?.nome;

      const resposta = await fetch(`${API_URL}/producao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produtoId: produtoSelecionado,
          nomeProduto: prodNome,
          quantidade: quantidadeUsada,
          dataProducao: dataProducao,
          observacao: observacao,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        Alert.alert('Erro', dados.error);
      } else {
        Alert.alert('Sucesso!', `Estoque atualizado! Novo saldo: ${dados.novoSaldo}`);
        setQuantidadeUsada('');
        setObservacao('');
        fetchProdutos(); 
      }

    } catch (error) {
      Alert.alert('Erro de Conexão', 'Falha ao conectar com o servidor.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer} onLayout={onLayoutRootView}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nova Produção</Text>
        <Text style={styles.headerSubtitle}>Baixa de insumos</Text>
      </View>

      {/* Seletor de Produto (Picker) - AJUSTADO PARA IOS */}
      <View style={[styles.inputGroup, { height: Platform.OS === 'ios' ? 150 : 'auto' }]}>
        <FontAwesome5 name="drumstick-bite" size={20} color="#BF360C" style={styles.inputIcon} />
        <View style={{ flex: 1 }}>
          {loading ? (
            <ActivityIndicator color="#D32F2F" />
          ) : (
            <Picker
              selectedValue={produtoSelecionado}
              onValueChange={(itemValue) => handleSelectProduto(itemValue)}
              style={styles.picker}
              itemStyle={{
                height: 130, // Altura específica para os itens no iOS
                fontSize: 16,
                color: '#424242'
              }}
            >
              <Picker.Item label="Selecione a Carne/Insumo..." value="" />
              {produtos.map((prod) => (
                <Picker.Item 
                  key={prod.id} 
                  label={`${prod.nome} (Disp: ${prod.quantidade} ${prod.unidadeMedida})`} 
                  value={prod.id} 
                />
              ))}
            </Picker>
          )}
        </View>
      </View>

      {produtoSelecionado !== '' && (
        <Text style={styles.estoqueInfo}>
          Estoque Atual: {quantidadeDisponivel}
        </Text>
      )}

      {/* Campo Quantidade Usada */}
      <View style={styles.inputGroup}>
        <FontAwesome5 name="weight-hanging" size={20} color="#E65100" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Quantidade a usar"
          placeholderTextColor="#A9A9A9"
          keyboardType="numeric"
          value={quantidadeUsada}
          onChangeText={setQuantidadeUsada}
        />
      </View>

      {/* Campo Data */}
      <View style={styles.inputGroup}>
        <FontAwesome5 name="calendar-day" size={20} color="#D32F2F" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={dataProducao}
          editable={false}
        />
      </View>

      {/* Campo Observação */}
      <View style={styles.inputGroup}>
        <FontAwesome5 name="sticky-note" size={20} color="#FB8C00" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="O que será feito? (ex: Hambúrguer)"
          placeholderTextColor="#A9A9A9"
          value={observacao}
          onChangeText={setObservacao}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSalvarProducao}>
        <Text style={styles.saveButtonText}>REGISTRAR BAIXA</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8E1', padding: 20 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingTop: 40, paddingBottom: 50 },
  header: { alignItems: 'center', marginBottom: 30 },
  headerTitle: { fontFamily: 'SweetToffee', fontSize: 36, color: '#BF360C', textAlign: 'center', marginBottom: 5 },
  headerSubtitle: { fontFamily: 'SweetToffee', fontSize: 20, color: '#E65100', textAlign: 'center' },
  
  // inputGroup ajustado para centralizar verticalmente
  inputGroup: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 15, 
    padding: 5, 
    paddingHorizontal: 15, 
    marginBottom: 15, 
    elevation: 3,
    shadowColor: '#FFCC80', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 3
  },
  
  inputIcon: { marginRight: 10, width: 24, textAlign: 'center' },
  input: { flex: 1, fontFamily: 'BalsamiqSans-Regular', fontSize: 16, color: '#424242', height: 50 },
  
  // Picker ajustado
  picker: { flex: 1, color: '#424242' },
  
  estoqueInfo: { fontFamily: 'BalsamiqSans-Regular', color: '#2E7D32', marginBottom: 15, marginLeft: 10, fontWeight: 'bold' },
  saveButton: { backgroundColor: '#D32F2F', borderRadius: 25, paddingVertical: 15, alignItems: 'center', marginTop: 20, elevation: 5 },
  saveButtonText: { fontFamily: 'SweetToffee', fontSize: 22, color: '#FFFFFF' },
});