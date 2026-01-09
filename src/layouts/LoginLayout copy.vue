<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Left Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-white"
    >
      <q-list padding>
        <q-item
          v-for="link in navLinks"
          :key="link.label"
          clickable
          v-ripple
          @click="navigate(link.route)"
        >
          <q-item-section>
            {{ link.label }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Header -->
    <q-header class="q-py-xs bg-white q-px-sm shadow-2">
      <q-toolbar>
        <!-- Left: Menu Button -->
        <q-btn
          flat
          dense
          icon="menu"
          @click="leftDrawerOpen = true"
          aria-label="Open menu"
        />

        <q-space />

        <!-- Right: Logo -->
        <div>
          <img
            src="/Screenshot from 2025-12-13 20-40-13.png"
            alt="Logo"
            height="39"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  data() {
    return {
      leftDrawerOpen: false,
      navLinks: [
        { label: 'Home', route: '/' },
        { label: 'About', route: '/about' },
        { label: 'Services', route: '/services' },
        { label: 'Contact', route: '/contact' }
      ]
    };
  },
  methods: {
    navigate(route) {
      this.$router.push(route);
      this.leftDrawerOpen = false; // Close drawer after click (optional)
    }
  }
};
</script>
