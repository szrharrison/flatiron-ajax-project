class Marvel {
  constructor(query) {
    this.category = 'characters'
    this.query = query
    const baseUrl = 'http://gateway.marvel.com/v1/public/'
    this.publicKey = key().public
    this.ts = Date.now()
    this.hash = md5(this.ts + key().private + key().public)

    this.url = `${baseUrl}${this.category}?name=${this.query}&ts=${this.ts}&apikey=${this.publicKey}&hash=${this.hash}`
  }

  get() {
    return $.ajax({
      url: this.url
    })
  }
}
