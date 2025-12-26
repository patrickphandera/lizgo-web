import { boot } from 'quasar/wrappers'
import { Notify } from 'quasar'

export default boot(() => {
  // Set global defaults
  Notify.setDefaults({
    position: 'top-right',
    timeout: 8000,
    color: 'positive',
    textColor: 'white',
    actions: [{ icon: 'close', color: 'white' }]
  })
})
