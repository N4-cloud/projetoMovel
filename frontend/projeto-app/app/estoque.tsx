// app/estoque.tsx (VERSÃO FINAL COM EXCLUSÃO FLEXÍVEL)

import { FontAwesome5 } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert // Importar Alert para os diálogos de exclusão
} from 'react-native';
import { API_URL } from '../constants/api';

SplashScreen.preventAutoHideAsync();

// Tipos definidos
interface Produto {
  id: string;
  nome: string;
  quantidade: number;
  unidadeMedida: string;
  fornecedor?: string;
}

interface Producao {
  id: string;
  nomeProduto: string;
  quantidade: number;
  dataProducao: string;
  observacao?: string;
}

export default function EstoqueScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'produtos' | 'producoes'>('produtos');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [listaProdutos, setListaProdutos] = useState<Produto[]>([]);
  const [listaProducoes, setListaProducoes] = useState<Producao[]>([]);

  const [fontsLoaded] = useFonts({
    'SweetToffee': require('../assets/fonts/SweetToffee.ttf'),
    'BalsamiqSans-Regular': require('../assets/fonts/BalsamiqSans-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  const fetchData = async () => {
    try {
      // Busca Produtos
      const resProdutos = await fetch(`${API_URL}/produtos`);
      const dataProdutos = await resProdutos.json();
      setListaProdutos(dataProdutos);

      // Busca Produções
      const resProducoes = await fetch(`${API_URL}/producao`);
      const dataProducoes = await resProducoes.json();
      setListaProducoes(dataProducoes);

    } catch (error) {
      console.error(error);
      Alert.alert("Erro de Conexão", "Falha ao carregar dados do servidor.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  if (!fontsLoaded) return null;


  // --- LÓGICA DE EXCLUSÃO ---

  // Função auxiliar para chamar a API
  const processarExclusao = async (id: string, devolverEstoque: boolean) => {
    try {
      // Passamos true ou false na URL para a API saber se deve estornar ou apenas apagar
      const response = await fetch(`${API_URL}/producao/${id}?devolver=${devolverEstoque}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const msg = devolverEstoque ? "Estoque devolvido!" : "Registro limpo do histórico.";
        Alert.alert("Sucesso", msg);
        onRefresh(); // Recarrega a lista para mostrar o resultado
      } else {
        const dados = await response.json();
        Alert.alert("Erro", dados.error || "Não foi possível processar a exclusão.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha na conexão.");
    }
  };

  // Função principal que mostra o Alerta com as opções
  const handleDeleteProducao = (id: string) => {
    Alert.alert(
      "Gerenciar Registro",
      "O que você deseja fazer com este item?",
      [
        { 
          text: "Cancelar", 
          style: "cancel" 
        },
        { 
          text: "Limpar Lista (Manter Baixa)", 
          // Envia devolver=false: Apaga da lista, mas mantém o gasto
          onPress: () => processarExclusao(id, false) 
        },
        { 
          text: "Excluir pra Devolver (Corrigir Erro)", 
          // Envia devolver=true: Apaga o registro E devolve ao estoque
          style: "destructive",
          onPress: () => processarExclusao(id, true) 
        }
      ]
    );
  };

  // --- COMPONENTES DE RENDERIZAÇÃO ---

  const renderProdutoItem = ({ item }: { item: Produto }) => (
    <View style={styles.card}>
      <View style={styles.cardIcon}>
        <FontAwesome5 name="box" size={24} color="#E65100" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nome}</Text>
        <Text style={styles.cardSubtitle}>Fornecedor: {item.fornecedor || 'N/A'}</Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.cardValue}>{item.quantidade}</Text>
        <Text style={styles.cardUnit}>{item.unidadeMedida}</Text>
      </View>
    </View>
  );

  const renderProducaoItem = ({ item }: { item: Producao }) => (
    <View style={styles.cardProducao}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardDate}>{item.dataProducao}</Text>
        
        {/* LIXEIRA ADICIONADA */}
        <View style={styles.headerActions}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>BAIXA</Text>
          </View>
          <TouchableOpacity onPress={() => handleDeleteProducao(item.id)} style={styles.deleteBtn}>
            <FontAwesome5 name="trash-alt" size={18} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.row}>
        <FontAwesome5 name="drumstick-bite" size={16} color="#555" style={{marginRight: 8}} />
        <Text style={styles.prodName}>{item.nomeProduto}</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="weight-hanging" size={16} color="#555" style={{marginRight: 8}} />
        <Text style={styles.prodQty}>Utilizado: {item.quantidade} (un/kg)</Text>
      </View>
      {item.observacao ? (
        <Text style={styles.prodObs}>Obs: {item.observacao}</Text>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <FontAwesome5 name="arrow-left" size={24} color="#BF360C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestão de Estoque</Text>
      </View>

      {/* Abas */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'produtos' && styles.activeTab]} 
          onPress={() => setActiveTab('produtos')}
        >
          <FontAwesome5 name="cubes" size={16} color={activeTab === 'produtos' ? '#FFF' : '#E65100'} />
          <Text style={[styles.tabText, activeTab === 'produtos' && styles.activeTabText]}>Estoque Atual</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'producoes' && styles.activeTab]} 
          onPress={() => setActiveTab('producoes')}
        >
          <FontAwesome5 name="history" size={16} color={activeTab === 'producoes' ? '#FFF' : '#E65100'} />
          <Text style={[styles.tabText, activeTab === 'producoes' && styles.activeTabText]}>Histórico</Text>
        </TouchableOpacity>
      </View>

      {/* Lista Condicional */}
      {loading ? (
        <ActivityIndicator size="large" color="#D32F2F" style={{ marginTop: 50 }} />
      ) : (
        <View style={{ flex: 1 }}>
          {activeTab === 'produtos' ? (
            <FlatList
              data={listaProdutos}
              keyExtractor={(item) => item.id}
              renderItem={renderProdutoItem}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#D32F2F']} />
              }
              ListEmptyComponent={
                <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
              }
            />
          ) : (
            <FlatList
              data={listaProducoes}
              keyExtractor={(item) => item.id}
              renderItem={renderProducaoItem}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#D32F2F']} />
              }
              ListEmptyComponent={
                <Text style={styles.emptyText}>Nenhum registro de produção.</Text>
              }
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8E1' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    paddingTop: Platform.OS === 'android' ? 50 : 60, paddingBottom: 20 
  },
  backBtn: { position: 'absolute', left: 20, top: Platform.OS === 'android' ? 55 : 65 },
  headerTitle: { fontFamily: 'SweetToffee', fontSize: 32, color: '#BF360C' },
  
  tabsContainer: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 15, backgroundColor: '#FFCC80', borderRadius: 25, padding: 4 },
  tab: { flex: 1, flexDirection: 'row', paddingVertical: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 20, gap: 8 },
  activeTab: { backgroundColor: '#E65100' },
  tabText: { fontFamily: 'BalsamiqSans-Regular', color: '#E65100', fontSize: 16 },
  activeTabText: { color: '#FFFFFF' },

  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  emptyText: { textAlign: 'center', marginTop: 50, fontFamily: 'BalsamiqSans-Regular', color: '#999' },

  card: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 15, padding: 15, marginBottom: 10, alignItems: 'center', elevation: 2 },
  cardIcon: { width: 50, height: 50, backgroundColor: '#FFF3E0', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardContent: { flex: 1 },
  cardTitle: { fontFamily: 'BalsamiqSans-Regular', fontSize: 18, color: '#333', fontWeight: 'bold' },
  cardSubtitle: { fontFamily: 'BalsamiqSans-Regular', fontSize: 14, color: '#777' },
  cardRight: { alignItems: 'flex-end' },
  cardValue: { fontFamily: 'BalsamiqSans-Regular', fontSize: 20, color: '#2E7D32', fontWeight: 'bold' },
  cardUnit: { fontFamily: 'BalsamiqSans-Regular', fontSize: 12, color: '#777' },

  cardProducao: { backgroundColor: '#FFF', borderRadius: 15, padding: 15, marginBottom: 10, elevation: 2, borderLeftWidth: 5, borderLeftColor: '#D32F2F' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  deleteBtn: { padding: 5 },
  cardDate: { fontFamily: 'BalsamiqSans-Regular', color: '#777', fontSize: 14 },
  badge: { backgroundColor: '#FFEBEE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5 },
  badgeText: { color: '#D32F2F', fontSize: 10, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  prodName: { fontFamily: 'BalsamiqSans-Regular', fontSize: 18, color: '#333' },
  prodQty: { fontFamily: 'BalsamiqSans-Regular', fontSize: 16, color: '#555' },
  prodObs: { fontFamily: 'BalsamiqSans-Regular', fontSize: 14, color: '#777', fontStyle: 'italic', marginTop: 5 },
});