<template>
  <div class="">
    <q-btn
      icon-right="add_shopping_cart"
      class="text-white width-full"
      no-caps
      label="Subscribe"
      color="primary"
      @click="fixed = true"
    />
    <q-dialog persistent v-model="fixed">
      <q-card class="">
        <q-card-section>
          <div class="text-h6">Subscription Plans</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="scroll">
          <div class="q-pa-sm row items-start q-gutter-md">
            <q-card
              v-for="subscription in subscriptionPlans"
              :key="subscription.id"
              class="my-card cursor-pointer shadow-1"
              :class="{ 'selected-card': subscription.id === selectedCard }"
              @click="selectedCard = subscription.id"
            >
              <q-card-section>
                <div class="text-bold text-body1 text-primary text-capitalize">
                  {{ subscription.billingCycle }} Plan
                </div>
                <div class="text-caption text-black">
                  {{ subscription.title }} costs {{ subscription.currency }} ${{
                    subscription.price
                  }}. You will be given {{ subscription.durationDays }} days access to the lessons,
                  quizzes and the forums.
                </div>
                <div class="text-caption text-weight-medium text-primary">
                  <q-chip square class="text-caption">
                    {{ subscription.currency }}{{ subscription.price }}
                  </q-chip>

                  <q-chip square class="text-caption">
                    {{ subscription.durationDays }} days access
                  </q-chip>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn class="text-capitalize" flat label="Close" color="primary" v-close-popup />
          <q-btn
               v-if="!initalisingPayment"
            no_caps
            class="text-capitalize"
            icon-right="mdi-arrow-right"
            label="Check Out"
            color="primary"
            @click="checkOut"
          />
          <q-btn
            v-if="initalisingPayment"
            no_caps
            class="text-capitalize"
            label="Initializing payment..."
            color="primary"
          >
            <div>
              <q-spinner-ios color="white" />
            </div>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import UserSubscriptionsService from '../services/user-subscriptions.service'
import SubscriptionPlansService from '../services/subscription-plans.service'
import { Notify } from 'quasar'
import { ref } from 'vue'

export default {
  setup() {
    const initalisingPayment = ref(false)
    const fixed = ref(false)
    const selectedCard = ref(null)
    const subscriptionPlans = ref([])
    return {
      initalisingPayment,
      fixed,
      selectedCard,
      subscriptionPlans,
    }
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const result = await SubscriptionPlansService.list()
        this.subscriptionPlans = result
      } catch (err) {
        console.log(err)
      }
    },
    async checkOut() {
      try {
        console.log(window.location.href)
        this.initalisingPayment = true
        const result = await UserSubscriptionsService.createUserSubscription({
          planId: this.selectedCard,
          frontendReturnUrl: window.location.href,
        })
        console.log(result)
        Notify.create({
          type: 'positive',
          message: `You are being redirected to payment...`,
        })
        window.location.href = result.paymentUrl
        this.initalisingPayment = false
      } catch (err) {
        this.initalisingPayment = false
        console.log(err)
        Notify.create({
          type: 'negative',
          message: `${err}`,
        })
      }
    },
  },
}
</script>
<style scoped>
.selected-card {
  border: 2px solid #1976d2;
  /* Quasar primary color */
}
</style>
