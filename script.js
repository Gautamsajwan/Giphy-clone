const baseUrl = `https://api.giphy.com/v1/gifs`

const randomize = (content) => {
    const dataArray = content.data
    return dataArray.sort(() => { // will sort the data members of the array in random order
        return 0.5 - Math.random()
    })
}

const getTrending = async() => {
    try { // fetch trending data from the api
        const response = await fetch(`${baseUrl}/trending?api_key=FT1ZKDe1y6IDO3yg4EuEIJwGAq2Vypar&limit=25&rating=g`)
        const data = await response.json()
        const gifData = randomize(data)
        // console.log(data)
        console.log(gifData)
        updateTrending(gifData)
    } catch(error) {
        console.log(error)
    }
}

const trendingDiv = document.querySelector('.trendingGifs')

const updateTrending = (gifData) => {
    gifData.forEach(gif => {
        const imageURL = `${gif.images.downsized.url}`
        const img = document.createElement('img')
        img.src = imageURL;
        img.alt = gif.title;

        trendingDiv.appendChild(img)
    })
}

const giphyArtists = ['sleepiest','Boy Tillekens','Luke Alexander','toke','pusheeen'] // this array is created so that we can search the names of the artists and fetch the resultant data to display the gifs in the artist section

const fetchSearchResults = async(item) => {
    try {
        const response = await fetch(`${baseUrl}/search?api_key=FT1ZKDe1y6IDO3yg4EuEIJwGAq2Vypar&q=${item}&limit=20&offset=0&rating=g&lang=en`)
        const data = await response.json()
        // console.log(dataArr.data)
        return data
    } catch(error) {
        console.log(error)
    }
}

const artistDiv = document.querySelector('.thumbnails')

const updateArtists = (giphyArtist) => {
    giphyArtist.forEach(artist => {
        // console.log(artist)
        const img = document.createElement('img')
        img.src = artist.images.downsized.url
        img.alt = artist.title
        artistDiv.appendChild(img)
    })
}

const getArtists = async () => {
    const artists = await Promise.all(
        giphyArtists.map(async (artist) => { // map through the array and search for the artist using fetchArtists method
            const response = await(fetchSearchResults(artist)) // fetchArtists(artist) returns a promise so we use await
            const data = response.data // extract the data from the response
            // console.log(data.slice(0,5))
            return data.slice(0,5)
        })
    )
    console.log(artists)
    artists.forEach(giphyArtist => updateArtists(giphyArtist))
}

const getClips = async () => {
    try {
        const response = await fetch(`${baseUrl}/search?api_key=FT1ZKDe1y6IDO3yg4EuEIJwGAq2Vypar&q=car&limit=12&offset=0&rating=g&lang=en`)
        const data = await response.json()
        const randomCars = randomize(data)
        updateClips(randomCars.slice(0,6))
    } catch(error) {
        console.log(error)
    }
}

const clipsDiv = document.querySelector('.clips')

const updateClips = (clips) => {
    clips.forEach((clip, index) => {
        const img = document.createElement('img')
        img.src = clip.images.downsized.url
        img.alt = clip.title
        if(index == 0 || index == 4) {
            img.classList.add('span2')
        } else {
            img.classList.add('span1')
        }
        clipsDiv.appendChild(img)
    })
}

const resultSection = document.querySelector('.resultsSection');
const searchResultsDiv = document.querySelector('.searchResults');

const renderSearch = async(input) => {
    searchResultsDiv.innerHTML = ``
    const response = await fetchSearchResults(input)
    const searchResults = await response.data
    console.log(searchResults)

    resultSection.style.cssText = 'display: block'

    searchResults.forEach(result => {
        const img = document.createElement('img')
        img.src = result.images.downsized.url
        img.alt = result.title

        searchResultsDiv.appendChild(img)
    })
}

const inputDiv = document.querySelector('.input')
const formDiv = document.querySelector('.form')

formDiv.addEventListener('submit', (e) => {
    e.preventDefault()
    renderSearch(inputDiv.value)

    inputDiv.value = ''
})

getArtists()
getTrending()
getClips()
