<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Left Drawer (mobile only) -->
    <q-drawer
      v-model="leftDrawerOpen"
      :show-if-above="false"
      bordered
      side="left"
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
          <q-item-section>{{ link.label }}</q-item-section>
        </q-item>
        <!-- Login in drawer for mobile -->
        <q-item clickable v-ripple @click="goToLogin">
          <q-item-section>Login</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Header -->
    <q-header class="q-py-xs bg-white  shadow-1">
      <q-toolbar>
        <!-- Mobile: Menu button -->
        <q-btn
          v-if="$q.screen.lt.md"
          flat
          dense
          color="black"
          icon="menu"
          @click="leftDrawerOpen = true"
          aria-label="Open menu"
        />

        <!-- Desktop: Logo on left -->
        <div v-else class="q-mr-md">
          <img
            src="/Screenshot from 2025-12-13 20-40-13.png"
            alt="Logo"
            height="39"
          />
        </div>
 <q-space />
        <!-- Desktop: Centered nav links -->
        <div
          v-if="$q.screen.gt.sm"
          class="row items-center justify-center q-gutter-lg text-black"
        >
          <q-btn
            flat
            label="Home"
            class="text-capitalize"
            @click="$router.push('/')"
          />
          <q-btn
            flat
            label="About"
            class="text-capitalize"
            @click="$router.push('/about')"
          />
          <q-btn
            flat
            label="Services"
            class="text-capitalize"
            @click="$router.push('/services')"
          />
          <q-btn
            flat
            label="Contact"
            class="text-capitalize"
            @click="$router.push('/contact')"
          />
        </div>

        <q-space />

        <!-- Desktop: Login button on right -->
        <q-btn
          v-if="$q.screen.gt.sm"
          label="Login"
          color="primary"
          @click="$router.push('/login')"
          class="text-capitalize"
        />

        <!-- Mobile: Logo on right -->
        <div v-if="$q.screen.lt.md">
          <img
            src="/Screenshot from 2025-12-13 20-40-13.png"
            alt="Logo"
            height="39"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Page container (keep neutral!) -->
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
      this.leftDrawerOpen = false;
    },
    goToLogin() {
      this.$router.push('/login');
      this.leftDrawerOpen = false;
    }
  }
};
</script>
