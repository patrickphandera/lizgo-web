<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="q-py-xs bg-white q-px-sm shadow-2">
      <q-toolbar>

        <!-- Left: Logo -->
        <div class="q-mr-md">
          <img src="/Screenshot from 2025-12-13 20-40-13.png" alt="Logo" height="39" />
        </div>

        <q-space />

        <!-- Center: Menu / Values -->
        <div class="row items-center q-gutter-lg text-black">
          <q-btn flat label="Home" class="text-capitalize text-body1" />
          <q-btn flat label="About" class="text-capitalize text-body1" />
          <q-btn flat label="Services" class="text-capitalize text-body1" />
          <q-btn flat label="Contact" class="text-capitalize text-body1" />
        </div>

        <q-space />

        <!-- Right: Login -->
        <q-btn label="Register" color="primary" @click="$router.push('/register')" class="text-capitalize text-body1" />

      </q-toolbar>
    </q-header>



    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
