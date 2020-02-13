export default class ApiClient {

  constructor(token){
    this.DELETE = 'delete'
    this.GET = 'get'
    this.POST = 'post'
    this.PUT = 'put'
    this.token = token
  }

  headers (isJson) {
    let headers = {
      'Authorization': 'Bearer ' + this.token,
    }
    if (isJson) {
      headers['Content-Type'] = 'application/json'
    }
    return new Headers(headers)
  }

  get (endpoint) {
    return this.request(this.GET, endpoint)
  }

  post (endpoint, body) {
    return this.request(this.POST, endpoint, body)
  }

  put (endpoint, body) {
    return this.request(this.PUT, endpoint, body)
  }

  delete (endpoint) {
    return this.request(this.DELETE, endpoint)
  }

  request (method, endpoint, body, isJSON=true) {
    if (isJSON) {
      body = body ? JSON.stringify(body) : undefined
    }
    let response
    return fetch(
      endpoint,
      {
        body,
        cache: 'no-store',
        headers: this.headers(isJSON),
        method
      }
    ).then(resp => {
      if (resp.status === 500) {
        throw new Error(resp.statusText)
      }
      response = resp
      return resp.json()
    }).then(json => {
      switch (response.status) {
        case 500:
          throw new Error(json.error)
        case 400:
          throw new Error(json.error)
        case 401:
          throw new Error(json.error)
        case 409:
          throw new Error(json.error)
        default:
          return json
      }
    })
  }
}
