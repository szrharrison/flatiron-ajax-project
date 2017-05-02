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

function fetchComicsForCharacter(baseUrl) {
  const marvelAdapter = new Marvel()
  let url = `${baseUrl}?orderBy=issueNumber&limit=10&ts=${marvelAdapter.ts}&apikey=${marvelAdapter.publicKey}&hash=${marvelAdapter.hash}`

  return $.ajax({
    url: url
  }).then((data, status, request) => {
    return data.data.results
  })
}

function renderComic(comic, index, array) {
  const element = $('#comics-results')

  let html = `<div class="col s6">
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
  element.append(html)
}

function renderData(data, status, request) {
  const character = data.data.results[0]
  const comicsPromise = fetchComicsForCharacter(character.comics.collectionURI)

  $('#char-results #image').html(`<img src="${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}"><span class="card-title center">${character.name}</span>`)
  $('#char-results #description').html(`<p>${character.description}</p>`)

  comicsPromise.then((comics) => {
    comics.forEach(renderComic)
  })
}
