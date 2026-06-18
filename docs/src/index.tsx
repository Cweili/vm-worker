import { render } from 'solid-js/web'
import App from './App'
import { I18nProvider } from './i18n'
import './styles/global.css'
import './styles/variables.css'
import './styles/animations.css'

const root = document.getElementById('app')
if (!root) throw new Error('Root element #app not found')
render(() => (
  <I18nProvider>
    <App />
  </I18nProvider>
), root)
