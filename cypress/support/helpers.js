export const isCI = env => env === 'CI'

export const isBeta = (host) => host.indexOf('beta') > -1

export const isProd = (host) => host.indexOf('ffiec') > -1

export function withFormData(method, url, formData, done) {
  const xhr = new XMLHttpRequest()
  xhr.open(method, url)
  xhr.onload = function () {
    done(xhr)
  }
  xhr.onerror = function () {
    done(xhr)
  }
  xhr.send(formData)
}

export function urlExists(url) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) resolve({ url, status: xhr.status === 200 })
    }

    xhr.open('HEAD', url)
    xhr.send()
  })
}

/* Data Browser Helpers */
// Open react-select drop-down if it's not loading
export const openSelector = (id) =>
  cy.get(`${id} > div > div`).first().should('not.contain', 'Loading').click()

export const dbClick2018 = () => cy.get('#root > .DataBrowser > .Geography > .YearSelector > a:nth-child(2)').click()
export const dbClick2017 = () => cy.get('#root > .DataBrowser > .Geography > .YearSelector > a:nth-child(3)').click()
export const dbURL = (host, queryStr) => `${host}/data-browser/data/${queryStr}` 
