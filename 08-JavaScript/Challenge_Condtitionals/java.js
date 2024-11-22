const temperatura = document.querySelector('.temperatura');
const apiKey = 'be8815c39feb426fa51145548242211';
const defaultCity = 'Manizales';
const icono = document.querySelector(".icono");
const pais = document.querySelector(".pais");
const ciudadElemento = document.querySelector(".ciudad");
const condicion = document.querySelector(".condicion");
const humedad = document.querySelector(".humedad");
const nubosidad = document.querySelector(".nubosidad");
const contenedor = document.querySelector(".info-clima");
const inputBuscar = document.querySelector("#buscarCiudad");

const cambiarTemaDinamicamente = (horaActual) => {
    if (horaActual >= 18 || horaActual < 6) {

        document.body.classList.add('modo-oscuro');
        contenedor.classList.add('tema-oscuro');
    } else {

        document.body.classList.remove('modo-oscuro');
        contenedor.classList.remove('tema-oscuro');
    }
};

const cargarClima = async (ciudadBuscar) => {
    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${ciudadBuscar}`;
        const respuesta = await fetch(url);
        contenedor.style.animation = 'none';
        contenedor.offsetHeight;
        contenedor.style.animation = 'aparecer 0.8s ease-out forwards';

        if (!respuesta.ok) {
            throw new Error('Ciudad no encontrada');
        }

        const datos = await respuesta.json();


        const horaLocal = new Date(datos.location.localtime).getHours();

        temperatura.textContent = `${Math.round(datos.current.temp_c)}°C`;
        icono.setAttribute('src', datos.current.condition.icon);
        pais.textContent = datos.location.country;
        ciudadElemento.textContent = datos.location.name;
        condicion.textContent = datos.current.condition.text;
        humedad.textContent = `💧 ${datos.current.humidity}%`;
        nubosidad.textContent = `☁️ ${datos.current.cloud}%`;


        cambiarTemaDinamicamente(horaLocal);

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