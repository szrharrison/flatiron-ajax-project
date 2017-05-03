$('document').ready(function() {
  eventHandlers()
})

function eventHandlers() {
  $('#character-search').on('submit', fetchAndRenderFromCharacter)
}

function fetchAndRenderFromCharacter(event) {
  event.preventDefault()
  let input = $('#character-name').val()
  const marvelAdapter = new Marvel(input)
  marvelAdapter.get().then(renderData)
}

function fetchAndRenderComics(url) {
  const comicsPromise = fetchComicsForCharacter(url)

  comicsPromise.then(renderComics)
}

var counter = 0

function fetchComicsForCharacter(baseUrl) {
  const marvelAdapter = new Marvel()
  let offset = 10 * counter
  let url = `${baseUrl}?orderBy=issueNumber&offset=${offset}&limit=10&ts=${marvelAdapter.ts}&apikey=${marvelAdapter.publicKey}&hash=${marvelAdapter.hash}`
  counter += 1

  return $.ajax({
    url: url
  }).then((data, status, request) => {
    return data.data.results
  })
}

function renderComics(comics) {
  const element = $('#comics-results')

  let html = comics.map((comic, i, array) => {
    return `<div class="col s6">
      <div class="card horizontal">
        <div class="card-image">
          <img src="${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}">
        </div>
        <div class="card-stacked">
          <div class="card-content">
            <h5 class="center">${comic.title}</h5>
            <p>Format: ${comic.format}</p>
            <p>Pages: ${comic.pageCount}</p>
          </div>
        </div>
      </div>
    </div>`
  }).join('')

  element.append(html)
}

function renderData(data, status, request) {
  counter = 0
  const character = data.data.results[0]
  fetchAndRenderComics(character.comics.collectionURI)

  $('#char-results #image').html(`<img src="${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}"><span class="card-title center">${character.name}</span>`)
  $('#char-results #description').html(`<p>${character.description}</p>`)

  $('#comics-results').after(`<div class="row">
    <div class="col s4 offset-s4 center">
      <button class="btn waves-effect waves-light center" onclick="fetchAndRenderComics('${character.comics.collectionURI}')">Load More</button>
    </div>
  </div>`)
}
