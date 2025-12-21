<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="q-py-xs bg-white q-px-lg shadow-1 ">
      <q-toolbar>

        <!-- Left: Logo -->
        <div class="q-mr-md">
          <img src="/Screenshot from 2025-12-13 20-40-13.png" alt="Logo" height="39" />
        </div>

        <q-space />

        <!-- Center: Menu / Values -->
        <div class="row items-center q-gutter-lg text-black">
          <q-btn flat label="Home" class="text-capitalize " />
          <q-btn flat label="About" class="text-capitalize" />
          <q-btn flat label="Services" class="text-capitalize" />
          <q-btn flat label="Contact" class="text-capitalize" />
        </div>

        <q-space />

        <!-- Right: Login -->
        <q-btn rounded label="Login" color="primary" @click="$router.push('/login')" class="text-capitalize" />

      </q-toolbar>
    </q-header>



    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
