// Variables globales
let currentPokemonId = 1;

// Elementos del DOM
const pokemonImage = document.getElementById('pokemonImage');
const pokemonName = document.getElementById('pokemonName');
const pokemonId = document.getElementById('pokemonId');
const pokemonTypes = document.getElementById('pokemonTypes');
const pokemonHeight = document.getElementById('pokemonHeight');
const pokemonWeight = document.getElementById('pokemonWeight');
const pokemonStats = document.getElementById('pokemonStats');
const searchInput = document.getElementById('pokemonSearch');
const searchButton = document.getElementById('searchButton');
const prevButton = document.getElementById('prevPokemon');
const nextButton = document.getElementById('nextPokemon');

// Función para obtener datos de la API
async function fetchPokemonData(identifier) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
        if (!response.ok) {
            throw new Error('Pokemon no encontrado');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo encontrar el Pokémon. Intenta de nuevo.');
        return null;
    }
}

// Función para mostrar los tipos de Pokémon
function displayPokemonTypes(types) {
    pokemonTypes.innerHTML = '';
    types.forEach(typeInfo => {
        const typeElement = document.createElement('span');
        typeElement.classList.add('type', `type-${typeInfo.type.name}`);
        typeElement.textContent = typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1);
        pokemonTypes.appendChild(typeElement);
    });
}

// Función para mostrar las estadísticas del Pokémon
function displayPokemonStats(stats) {
    pokemonStats.innerHTML = '';
    stats.forEach(statInfo => {
        const statName = statInfo.stat.name;
        const statValue = statInfo.base_stat;
        
        const statElement = document.createElement('div');
        statElement.classList.add('stat');
        
        const statNameSpan = document.createElement('span');
        statNameSpan.textContent = `${statName.charAt(0).toUpperCase() + statName.slice(1)}: `;
        
        const statValueSpan = document.createElement('span');
        statValueSpan.textContent = statValue;
        
        const statBarContainer = document.createElement('div');
        statBarContainer.style.width = '100%';
        statBarContainer.style.backgroundColor = '#e0e0e0';
        statBarContainer.style.borderRadius = '5px';
        statBarContainer.style.marginTop = '5px';
        
        const statBar = document.createElement('div');
        statBar.classList.add('stat-bar');
        statBar.style.width = `${Math.min(statValue, 200)}px`;
        statBar.style.height = '10px';
        statBar.style.backgroundColor = '#4CAF50';
        statBar.style.borderRadius = '5px';
        
        statBarContainer.appendChild(statBar);
        
        statElement.appendChild(statNameSpan);
        statElement.appendChild(statValueSpan);
        statElement.appendChild(statBarContainer);
        
        pokemonStats.appendChild(statElement);
    });
}

// Función para mostrar los datos del Pokémon
function displayPokemonData(pokemonData) {
    pokemonImage.src = pokemonData.sprites.front_default;
    pokemonName.textContent = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
    pokemonId.textContent = `#${pokemonData.id.toString().padStart(3, '0')}`;
    pokemonHeight.textContent = `${pokemonData.height / 10} m`;
    pokemonWeight.textContent = `${pokemonData.weight / 10} kg`;
    
    displayPokemonTypes(pokemonData.types);
    displayPokemonStats(pokemonData.stats);
    
    currentPokemonId = pokemonData.id;
}

// Función para cargar un Pokémon
async function loadPokemon(identifier) {
    const pokemonData = await fetchPokemonData(identifier);
    if (pokemonData) {
        displayPokemonData(pokemonData);
    }
}

// Evento para buscar Pokémon
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    loadPokemon(searchTerm);
});

// Evento de teclado para buscar (presionar Enter)
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const searchTerm = searchInput.value.toLowerCase().trim();
        loadPokemon(searchTerm);
    }
});

// Botones de navegación
prevButton.addEventListener('click', () => {
    if (currentPokemonId > 1) {
        loadPokemon(currentPokemonId - 1);
    }
});

nextButton.addEventListener('click', () => {
    loadPokemon(currentPokemonId + 1);
});

// Cargar Pokémon inicial al cargar la página
loadPokemon(1);