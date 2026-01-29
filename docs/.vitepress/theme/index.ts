// site/docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import LandingPage from './components/LandingPage.vue'
import SiteFooter from './components/SiteFooter.vue'
import './custom.css'
import '@phosphor-icons/web/regular'
import '@phosphor-icons/web/bold'
import '@phosphor-icons/web/fill'
import '@phosphor-icons/web/duotone'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('LandingPage', LandingPage)
    app.component('SiteFooter', SiteFooter)
  }
}
