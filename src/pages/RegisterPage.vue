<template>
  <q-page>

    <div>
      <div class='row q-mt-md'>


        <div class="col-6">

          <div class="shadow-4">
            <q-carousel arrows animated v-model="slide" height="530px" elevated infinite :autoplay="true" swipeable>
              <q-carousel-slide name="style" class="text-center bg-primary">
                <q-scroll-area class="fit ">
                  <q-icon name="military_tech" size="56px" color="white" />
                  <div class="q-mt-md text-h5 text-white text-uppercase">
                    Congraturations
                  </div>
                  <div class="q-mt-md text-white">
                    to our best students of

                    last month (November)
                  </div>
                  <div class="q-mt-md text-white">
                    <q-icon name="arrow_right_alt" size="40px"></q-icon>
                  </div>
                </q-scroll-area>
              </q-carousel-slide>
              <q-carousel-slide name="first" img-src="/ezekiel-nuhu-LhxRIFcdX2E-unsplash.jpg">
                <div class="absolute-top custom-caption">
                  <div class="text-body1">BEST OF NOVEMBER (<span class="text-body1"> TOP 10</span>)</div>
                </div>
                <div class="absolute-bottom custom-caption">
                  <div class="text-body1"> (1) ELIZA KACHALI</div>
                </div>
              </q-carousel-slide>
              <q-carousel-slide name="second" img-src="/one_person_images_of_african_students_happily.jpeg">
                <div class="absolute-top custom-caption">
                  <div class="text-body1">BEST OF NOVEMBER (<span class="text-body1"> TOP 10</span>)</div>
                </div>
                <div class="absolute-bottom custom-caption">
                  <div class="text-body1"> (2) FLORA PHIRI</div>
                </div>
              </q-carousel-slide>
              <q-carousel-slide name="third" img-src="/one_person_images_of_african_students_happily (2).jpeg">
                <div class="absolute-top custom-caption">
                  <div class="text-body1">BEST OF NOVEMBER (<span class="text-body1"> TOP 10</span>)</div>
                </div>
                <div class="absolute-bottom custom-caption">
                  <div class="text-body1"> (3) SUZANNA KENNEDY</div>
                </div>
              </q-carousel-slide>

            </q-carousel>
          </div>
        </div>
        <div class="col-6">
          <q-card style="height: 530px;">
            <q-card-section>
              <div class="text-h5 text-uppercase q-mb-sm text-weight-bold">Registeration</div>
              <div>Thank you for joining Zoe Online Acadamy, This information will help you access this platform easily
                and
                securely.
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row">
                <div class="col-6">
                  <q-input outlined label="First name" class="q-pa-xs">

                  </q-input>
                </div>
                <div class="col-6">
                  <q-input outlined label="last name" class="q-pa-xs">

                  </q-input>

                </div>

                <div class="col-6">
                  <q-input outlined label="Phone number" class="q-pa-xs">

                  </q-input>
                </div>
                <div class="col-6">
                  <q-input outlined label="Email (Optional)" class="q-pa-xs">

                  </q-input>
                </div>
                <div class="col-6">
                  <q-input outlined label="Password" class="q-pa-xs">

                  </q-input>
                </div>
                <div class="col-6">
                  <q-input outlined label=" Comfirm Password" class="q-pa-xs">

                  </q-input>
                </div>
              </div>
              <div class="q-mt-md">
                By registering in this platform, you aggree to terms and conditions <span
                  class="text-primary">Here</span>
              </div>
            </q-card-section>
            <q-card-section>
              <q-btn class="full-width" color="primary">Register</q-btn>
              <div class="q-mt-md">
                You already have account? <span class="text-primary">Login</span>
              </div>

            </q-card-section>
            <q-card-section>

            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { ref } from 'vue'

export default {
  setup() {
    return {
      slide: ref('first')
    }
  }
}
</script>
<style lang="sass" scoped>
.custom-caption
  text-align: center
  padding: 12px
  color: white
  background-color: rgba(0, 0, 0, .3)
</style>
