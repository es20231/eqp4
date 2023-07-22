<template>
  <router-view />
  <nav>
    <a-button type="primary" @click="$router.push({ name: 'login' })"
      >Ir para Login</a-button
    >
    <a-button type="primary" danger @click="$router.push({ name: 'register' })"
      >Ir para Registro</a-button
    >
  </nav>
</template>

<style lang="scss"></style>
