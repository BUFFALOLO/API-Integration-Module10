// PokeAPI base URL
const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon/';

// DOM Elements
const searchForm = document.getElementById('searchForm');
const pokemonInput = document.getElementById('pokemonInput');
const searchResults = document.getElementById('searchResults');

// Event listener for search form
if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchTerm = pokemonInput.value.trim().toLowerCase();
        if (searchTerm) {
            try {
                const pokemonData = await fetchPokemonData(searchTerm);
                displaySearchResults(pokemonData);
            } catch (error) {
                displayError('Pokémon not found. Please try again.');
            }
        }
    });
}

// Fetch Pokémon data from PokeAPI
async function fetchPokemonData(pokemon) {
    const response = await fetch(`${POKEAPI_URL}${pokemon}`);
    if (!response.ok) {
        throw new Error('Pokémon not found');
    }
    return await response.json();
}

// Display search results
function displaySearchResults(pokemon) {
    searchResults.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${pokemon.name.toUpperCase()}</h5>
                <p class="card-text">ID: ${pokemon.id}</p>
                <a href="details.html?id=${pokemon.id}" class="btn btn-primary">View Details</a>
            </div>
        </div>
    `;
}

// Display error message
function displayError(message) {
    searchResults.innerHTML = `
        <div class="alert alert-danger" role="alert">
            ${message}
        </div>
    `;
}

// Display Pokémon details
async function displayPokemonDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('id');
    
    if (pokemonId) {
        try {
            const pokemonData = await fetchPokemonData(pokemonId);
            updateDetailsPage(pokemonData);
        } catch (error) {
            console.error('Error fetching Pokémon details:', error);
        }
    }
}

// Update details page with Pokémon data
function updateDetailsPage(pokemon) {
    document.getElementById('pokemonName').textContent = pokemon.name.toUpperCase();
    document.getElementById('pokemonImage').src = pokemon.sprites.front_default;

    // Display types
    const typesList = document.getElementById('pokemonTypes');
    typesList.innerHTML = pokemon.types
        .map(type => `<li class="list-group-item">${type.type.name}</li>`)
        .join('');

    // Display abilities
    const abilitiesList = document.getElementById('pokemonAbilities');
    abilitiesList.innerHTML = pokemon.abilities
        .map(ability => `<li class="list-group-item">${ability.ability.name}</li>`)
        .join('');

    // Display stats
    const stats = {
        hp: pokemon.stats.find(stat => stat.stat.name === 'hp'),
        attack: pokemon.stats.find(stat => stat.stat.name === 'attack'),
        defense: pokemon.stats.find(stat => stat.stat.name === 'defense'),
        'special-attack': pokemon.stats.find(stat => stat.stat.name === 'special-attack'),
        'special-defense': pokemon.stats.find(stat => stat.stat.name === 'special-defense'),
        speed: pokemon.stats.find(stat => stat.stat.name === 'speed')
    };

    // Update each stat progress bar
    for (const [statName, statData] of Object.entries(stats)) {
        const progressBar = document.querySelector(`#pokemonStats .stat-item:nth-child(${Object.keys(stats).indexOf(statName) + 1}) .progress-bar`);
        const statValue = document.querySelector(`#pokemonStats .stat-item:nth-child(${Object.keys(stats).indexOf(statName) + 1}) .stat-value`);
        
        if (progressBar && statValue && statData) {
            const width = Math.min(100, (statData.base_stat / 255) * 100);
            progressBar.style.width = `${width}%`;
            progressBar.setAttribute('aria-valuenow', statData.base_stat);
            progressBar.setAttribute('aria-label', statName.replace('-', ' '));
            statValue.textContent = statData.base_stat;
        }
    }

}

// Initialize details page if on details.html
if (window.location.pathname.includes('details.html')) {
    displayPokemonDetails();
}
