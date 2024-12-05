const TOTAL_POKEMON = 1025;
const pokemonGrid = document.getElementById('pokemonGrid');
const searchInput = document.getElementById('searchInput');

const pokemonImage = document.getElementById('pokemonImage');
const pokemonName = document.getElementById('pokemonName');
const pokemonId = document.getElementById('pokemonId');
const pokemonTypes = document.getElementById('pokemonTypes');
const pokemonHeight = document.getElementById('pokemonHeight');
const pokemonWeight = document.getElementById('pokemonWeight');
const pokemonStats = document.getElementById('pokemonStats');

const pokemonCache = {};

async function fetchPokemonData(identifier) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
        if (!response.ok) {
            throw new Error('Pokemon no encontrado');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function displayPokemonTypes(types) {
    pokemonTypes.innerHTML = '';
    types.forEach(typeInfo => {
        const typeElement = document.createElement('span');
        typeElement.classList.add('type', `type-${typeInfo.type.name}`);
        typeElement.textContent = typeInfo.type.name;
        pokemonTypes.appendChild(typeElement);
    });
}

function displayPokemonStats(stats) {
    pokemonStats.innerHTML = '';
    stats.forEach(statInfo => {
        const statName = statInfo.stat.name;
        const statValue = statInfo.base_stat;

        const statElement = document.createElement('div');
        statElement.classList.add('stat');

        const statLabel = document.createElement('span');
        statLabel.classList.add('stat-label');
        statLabel.textContent = statName;

        const statBarContainer = document.createElement('div');
        statBarContainer.classList.add('stat-bar-container');

        const statBar = document.createElement('div');
        statBar.classList.add('stat-bar');
        statBar.style.width = `${Math.min(statValue, 255) / 2.55}%`;

        const statValue_ = document.createElement('span');
        statValue_.classList.add('stat-value');
        statValue_.textContent = statValue;

        statBarContainer.appendChild(statBar);

        statElement.appendChild(statLabel);
        statElement.appendChild(statBarContainer);
        statElement.appendChild(statValue_);

        pokemonStats.appendChild(statElement);
    });
}

function displayPokemonDetails(pokemonData) {
    pokemonImage.src = pokemonData.sprites.front_default || pokemonData.sprites.other['official-artwork'].front_default;
    pokemonName.textContent = pokemonData.name;
    pokemonId.textContent = `#${pokemonData.id.toString().padStart(3, '0')}`;
    pokemonHeight.textContent = `${pokemonData.height / 10} m`;
    pokemonWeight.textContent = `${pokemonData.weight / 10} kg`;

    displayPokemonTypes(pokemonData.types);
    displayPokemonStats(pokemonData.stats);
}

async function populatePokemonGrid() {
    pokemonGrid.innerHTML = '';

    const startIndex = 1;
    const endIndex = TOTAL_POKEMON;

    for (let i = startIndex; i <= endIndex; i++) {
        try {
            const pokemonData = await fetchPokemonData(i);

            pokemonCache[pokemonData.name] = pokemonData;
            pokemonCache[pokemonData.id] = pokemonData;

            const gridItem = document.createElement('div');
            gridItem.classList.add('pokemon-grid-item');
            gridItem.dataset.name = pokemonData.name;
            gridItem.dataset.id = pokemonData.id;

            const img = document.createElement('img');
            img.src = pokemonData.sprites.front_default;
            img.alt = pokemonData.name;

            const name = document.createElement('p');
            name.textContent = `${pokemonData.name} #${pokemonData.id.toString().padStart(3, '0')}`;

            gridItem.appendChild(img);
            gridItem.appendChild(name);

            gridItem.addEventListener('click', () => {
                displayPokemonDetails(pokemonData);
            });

            pokemonGrid.appendChild(gridItem);
        } catch (error) {
            console.error(`Error fetching Pokémon ${i}:`, error);
        }
    }
}

function searchPokemon() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const gridItems = document.querySelectorAll('.pokemon-grid-item');

    gridItems.forEach(item => {
        const name = item.dataset.name;
        const id = item.dataset.id;

        if (searchTerm === '' ||
            name.includes(searchTerm) ||
            id.toString().includes(searchTerm)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

searchInput.addEventListener('input', searchPokemon);

populatePokemonGrid();


fetchPokemonData(1).then(pokemonData => {
    if (pokemonData) {
        displayPokemonDetails(pokemonData);
    }
});