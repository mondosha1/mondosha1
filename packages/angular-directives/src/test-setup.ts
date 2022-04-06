import '@angular/localize/init'
import '@mondosha1/jest'
import 'jest-preset-angular'

Object.defineProperty(document.body.style, 'transform', { value: () => ({ enumerable: true, configurable: true }) })

process.on('unhandledRejection', (error: any) => {
  console.log('unhandledRejection', error.test) // eslint-disable-line no-console
})
