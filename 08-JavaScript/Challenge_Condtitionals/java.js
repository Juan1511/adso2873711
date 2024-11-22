const temperatura = document.querySelector('.temperatura');
const apiKey = '9711613e634d413785c161102241511';
const defaultCity = 'Manizales';
const icono = document.querySelector(".icono");
const pais = document.querySelector(".pais");
const ciudadElemento = document.querySelector(".ciudad");
const condicion = document.querySelector(".condicion");
const humedad = document.querySelector(".humedad");
const nubosidad = document.querySelector(".nubosidad");
const contenedor = document.querySelector(".info-clima");
const botonTema = document.querySelector(".cambiar-tema");
const inputBuscar = document.querySelector("#buscarCiudad");


const temaGuardado = localStorage.getItem('tema');
if (temaGuardado === 'oscuro') {
    document.body.classList.add('modo-oscuro');
    contenedor.classList.add('tema-oscuro');
}


botonTema.addEventListener('click', () => {
    document.body.classList.toggle('modo-oscuro');
    contenedor.classList.toggle('tema-oscuro');


    const esOscuro = document.body.classList.contains('modo-oscuro');
    localStorage.setItem('tema', esOscuro ? 'oscuro' : 'claro');
});

const cargarClima = async (ciudadBuscar) => {
    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${ciudadBuscar}`;
        const respuesta = await fetch(url);
        contenedor.style.animation = 'none';
        contenedor.offsetHeight; // Forzar un reflow
        contenedor.style.animation = 'aparecer 0.8s ease-out forwards';

        if (!respuesta.ok) {
            throw new Error('Ciudad no encontrada');
        }

        const datos = await respuesta.json();

        temperatura.textContent = `${Math.round(datos.current.temp_c)}°C`;
        icono.setAttribute('src', datos.current.condition.icon);
        pais.textContent = datos.location.country;
        ciudadElemento.textContent = datos.location.name;
        condicion.textContent = datos.current.condition.text;
        humedad.textContent = `💧 ${datos.current.humidity}%`;
        nubosidad.textContent = `☁️ ${datos.current.cloud}%`;

    } catch (error) {
        console.error('Error al cargar datos del clima:', error);
        if (error.message === 'Ciudad no encontrada') {
            contenedor.innerHTML = '<p style="text-align: center;">Ciudad no encontrada. Por favor, intente nuevamente.</p>';
        } else {
            contenedor.innerHTML = '<p style="text-align: center;">Error al cargar datos del clima</p>';
        }
    }
};


inputBuscar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const ciudadBuscada = inputBuscar.value.trim();
        if (ciudadBuscada) {
            cargarClima(ciudadBuscada);
        }
    }
});

cargarClima(defaultCity);