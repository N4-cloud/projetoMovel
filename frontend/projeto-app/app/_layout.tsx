// app/_layout.tsx (ATUALIZADO)

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="cadastrarProduto" />
      <Stack.Screen name="cadastrarProducao" />
      <Stack.Screen name="estoque" />
      <Stack.Screen name="esqueciSenha" />
      <Stack.Screen name="register" /> {/* <-- ADICIONE ESTA LINHA */}
    </Stack>
  );
}