<template>
  <q-page class="q-pa-md">
     <div class="text-h6 flex justify-between">
      <div class="flex">
        <router-link :to="`/students/users`" style="text-decoration: none; color: inherit">
            <q-btn
            size="sm"
              class="text-capitalize shadow-0 row"
            >
            <q-icon  size="24px" name="mdi-keyboard-backspace"></q-icon>  <span class="text-body1"></span>
            </q-btn>

        </router-link>
        <span class="q-mx-md text-center text-body1">User Details</span>
      </div>
      <div>
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="col-12">
        <q-card>
          <!-- Header with avatar -->
          <q-card-section class="row justify-between">
            <div class="row">
            <q-avatar size="90px" class="q-ma-md">
              <img src="https://cdn.quasar.dev/img/avatar5.jpg" alt="User avatar" />
            </q-avatar>


            <div class="">
              <div class="text-h6 text-weight-bold ">Patrick Phandera</div>
              <div class="text-caption ">Senior Developer | Senior Developer</div>
              <div class="text-caption text-green">
               <q-badge color="teal" class="q-mr-sm">Active</q-badge>
              </div>
              <div class="text-caption ">Contacts: patrick.phandera@example.com | +265 999 123 456</div>
            </div>
            </div>
            <div>
              <div class=" text-caption">
                400 followers
              </div>
              <div>
                <q-btn class="text-capitalize " color="primary" icon="mdi-reply">Follow</q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <TeachersLessons></TeachersLessons>
  </q-page>
</template>

<script >
  import TeachersLessons from '../components/teacher/TeachersLessons.vue'
  export default{
components:{TeachersLessons}

  }
// No script needed for static demo
</script>
