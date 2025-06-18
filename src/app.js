// --- Three.js Earth background ---
const earthContainer = document.getElementById('earth-bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
earthContainer.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(7, 64, 64); // Bigger earth
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
const material = new THREE.MeshPhongMaterial({ map: earthTexture });
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

camera.position.z = 13;

function animateEarth() {
    requestAnimationFrame(animateEarth);
    earth.rotation.y += 0.002;
    renderer.render(scene, camera);
}
animateEarth();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Weather Effects ---
const effectCanvas = document.getElementById('weather-effect');
const ctx = effectCanvas.getContext('2d');
let effectAnimation;
let currentEffect = null;

function resizeEffectCanvas() {
    effectCanvas.width = window.innerWidth;
    effectCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeEffectCanvas);
resizeEffectCanvas();

function clearEffect() {
    cancelAnimationFrame(effectAnimation);
    ctx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
    currentEffect = null;
}

// Sun rays for Clear
function sunEffect() {
    function draw() {
        ctx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
        // Sun
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(effectCanvas.width - 100, 100, 40, 0, Math.PI * 2);
        ctx.fillStyle = "#FFD700";
        ctx.fill();
        // Rays
        for (let i = 0; i < 12; i++) {
            ctx.save();
            ctx.translate(effectCanvas.width - 100, 100);
            ctx.rotate((Math.PI * 2 * i) / 12 + Date.now() * 0.0005);
            ctx.beginPath();
            ctx.moveTo(0, 50);
            ctx.lineTo(0, 70);
            ctx.strokeStyle = "#FFD700";
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.restore();
        }
        ctx.restore();
        effectAnimation = requestAnimationFrame(draw);
    }
    draw();
}

// Clouds
function cloudsEffect() {
    const clouds = [];
    for (let i = 0; i < 6; i++) {
        clouds.push({
            x: Math.random() * effectCanvas.width,
            y: 40 + Math.random() * 120,
            speed: 0.2 + Math.random() * 0.3,
            size: 60 + Math.random() * 40
        });
    }
    function draw() {
        ctx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
        ctx.globalAlpha = 0.5;
        for (let c of clouds) {
            ctx.beginPath();
            ctx.ellipse(c.x, c.y, c.size, c.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fillStyle = "#fff";
            ctx.fill();
            c.x += c.speed;
            if (c.x - c.size > effectCanvas.width) c.x = -c.size;
        }
        ctx.globalAlpha = 1;
        effectAnimation = requestAnimationFrame(draw);
    }
    draw();
}

// Rain effect
function rainEffect() {
    const drops = [];
    for (let i = 0; i < 100; i++) {
        drops.push({
            x: Math.random() * effectCanvas.width,
            y: Math.random() * effectCanvas.height,
            l: 10 + Math.random() * 10,
            xs: -2 + Math.random() * 4,
            ys: 10 + Math.random() * 10
        });
    }
    function draw() {
        ctx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
        ctx.strokeStyle = 'rgba(174,194,224,0.5)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        for (let i = 0; i < drops.length; i++) {
            let d = drops[i];
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d.x + d.xs, d.y + d.l);
            ctx.stroke();
            d.x += d.xs;
            d.y += d.ys;
            if (d.y > effectCanvas.height) {
                d.x = Math.random() * effectCanvas.width;
                d.y = -20;
            }
        }
        effectAnimation = requestAnimationFrame(draw);
    }
    draw();
}

// Snow effect
function snowEffect() {
    const flakes = [];
    for (let i = 0; i < 80; i++) {
        flakes.push({
            x: Math.random() * effectCanvas.width,
            y: Math.random() * effectCanvas.height,
            r: 1 + Math.random() * 3,
            d: Math.random() * 1
        });
    }
    function draw() {
        ctx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        for (let i = 0; i < flakes.length; i++) {
            let f = flakes[i];
            ctx.moveTo(f.x, f.y);
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
        }
        ctx.fill();
        for (let i = 0; i < flakes.length; i++) {
            let f = flakes[i];
            f.y += 1 + f.d;
            f.x += Math.sin(f.y * 0.01);
            if (f.y > effectCanvas.height) {
                f.x = Math.random() * effectCanvas.width;
                f.y = -10;
            }
        }
        effectAnimation = requestAnimationFrame(draw);
    }
    draw();
}

// Fog/Mist/Haze/Smoke
function fogEffect() {
    let t = 0;
    function draw() {
        ctx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
        for (let i = 0; i < 4; i++) {
            ctx.globalAlpha = 0.12 + 0.04 * i;
            ctx.beginPath();
            ctx.ellipse(
                (effectCanvas.width / 4) * i + (Math.sin(t / 60 + i) * 40),
                120 + i * 40 + Math.cos(t / 80 + i) * 10,
                effectCanvas.width / 2,
                60 + i * 10,
                0,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = "#ccc";
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        t++;
        effectAnimation = requestAnimationFrame(draw);
    }
    draw();
}

// Sand/Dust/Ash
function dustEffect() {
    const particles = [];
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * effectCanvas.width,
            y: Math.random() * effectCanvas.height,
            r: 2 + Math.random() * 2,
            s: 0.5 + Math.random(),
            c: `rgba(194,178,128,${0.2 + Math.random() * 0.3})`
        });
    }
    function draw() {
        ctx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
        for (let p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.c;
            ctx.fill();
            p.x += p.s;
            if (p.x > effectCanvas.width) {
                p.x = -p.r;
                p.y = Math.random() * effectCanvas.height;
            }
        }
        effectAnimation = requestAnimationFrame(draw);
    }
    draw();
}

// Squall/Tornado (swirling lines)
function windEffect() {
    let t = 0;
    function draw() {
        ctx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
        ctx.strokeStyle = "rgba(120,120,120,0.3)";
        ctx.lineWidth = 3;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            for (let a = 0; a < Math.PI * 2; a += 0.1) {
                let r = 40 + 10 * i + 8 * Math.sin(a * 3 + t / 10 + i);
                let x = effectCanvas.width - 120 + Math.cos(a + t / 40 + i) * r;
                let y = 120 + Math.sin(a + t / 40 + i) * r;
                if (a === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        t++;
        effectAnimation = requestAnimationFrame(draw);
    }
    draw();
}

// Set effect based on weather
function setWeatherEffect(mainWeather) {
    clearEffect();
    if (mainWeather === 'Clear') {
        sunEffect();
    } else if (mainWeather === 'Clouds') {
        cloudsEffect();
    } else if (mainWeather === 'Rain' || mainWeather === 'Drizzle' || mainWeather === 'Thunderstorm') {
        rainEffect();
    } else if (mainWeather === 'Snow') {
        snowEffect();
    } else if (['Mist', 'Fog', 'Haze', 'Smoke'].includes(mainWeather)) {
        fogEffect();
    } else if (['Sand', 'Dust', 'Ash'].includes(mainWeather)) {
        dustEffect();
    } else if (['Squall', 'Tornado'].includes(mainWeather)) {
        windEffect();
    }
}

// --- Weather App Logic ---
const apiKey = '903fd66843b0fb7a91f6408e7461a42a';
const weatherForm = document.getElementById('weather-form');
const weatherInput = document.getElementById('weather-input');
const weatherOutput = document.getElementById('weather-output');

weatherForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = weatherInput.value;
    fetchWeather(city);
});

function fetchWeather(city) {
    weatherOutput.innerHTML = `<p>Loading...</p>`;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            weatherOutput.innerHTML = `<p>${error.message}</p>`;
        });
}

function displayWeather(data) {
    const { name, main, weather, wind } = data;
    const temperature = main.temp;
    const description = weather[0].description;
    const icon = weather[0].icon;
    const humidity = main.humidity;
    const windSpeed = wind.speed;

    // Pre-defined background colors for main weather types
    const backgroundColors = {
        Clear: '#87ceeb',
        Clouds: '#b0c4de',
        Rain: '#778899',
        Drizzle: '#a9a9a9',
        Thunderstorm: '#4f4f4f',
        Snow: '#fffafa',
        Mist: '#cfcfcf',
        Smoke: '#d3d3d3',
        Haze: '#e0e0e0',
        Fog: '#e5e5e5',
        Sand: '#f4e2d8',
        Dust: '#e0cda9',
        Ash: '#b2beb5',
        Squall: '#708090',
        Tornado: '#808080'
    };

    const mainWeather = weather[0].main;
    document.body.style.background = backgroundColors[mainWeather] || '#ffffff';
    setWeatherEffect(mainWeather);

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    weatherOutput.innerHTML = `
        <h2>Weather in ${name}</h2>
        <img src="${iconUrl}" alt="${description}" width="80" height="80">
        <p>Temperature: ${temperature} °C</p>
        <p>Description: ${description}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
}
// --- World Clock ---
const timezones = [
    { city: "Los Angeles", tz: "America/Los_Angeles" },
    { city: "London", tz: "Europe/London" },
    { city: "Toronto", tz: "America/Toronto" },
    { city: "Dubai", tz: "Asia/Dubai" },
    { city: "Tokyo", tz: "Asia/Tokyo" }
];

function createWorldClock() {
    const clockBar = document.createElement('div');
    clockBar.id = 'world-clock-bar';
    clockBar.innerHTML = timezones.map(tz =>
        `<div class="clock-item" data-tz="${tz.tz}">
            <span class="clock-city">${tz.city}</span>
            <span class="clock-time">--:--</span>
        </div>`
    ).join('');
    document.body.prepend(clockBar);
}

function updateWorldClock() {
    document.querySelectorAll('.clock-item').forEach(item => {
        const tz = item.getAttribute('data-tz');
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: tz
        });
        item.querySelector('.clock-time').textContent = time;
    });
}

createWorldClock();
updateWorldClock();
setInterval(updateWorldClock, 1000);

function fetchWeather(city) {
    weatherOutput.innerHTML = `<p>Loading...</p>`;
    document.getElementById('forecast-output').innerHTML = '';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            fetchForecast(city);
        })
        .catch(error => {
            weatherOutput.innerHTML = `<p>${error.message}</p>`;
            document.getElementById('forecast-output').innerHTML = '';
        });
}

function fetchForecast(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(() => {
            document.getElementById('forecast-output').innerHTML = '<p>Forecast unavailable.</p>';
        });
}

function displayForecast(data) {
    if (!data.list) {
        document.getElementById('forecast-output').innerHTML = '<p>Forecast unavailable.</p>';
        return;
    }
    // Get one forecast per day at 12:00
    const daily = {};
    data.list.forEach(item => {
        if (item.dt_txt.includes('12:00:00')) {
            const date = item.dt_txt.split(' ')[0];
            daily[date] = item;
        }
    });
    const days = Object.values(daily).slice(0, 5);
    const html = `
        <h3>5-Day Forecast</h3>
        <div class="forecast-grid">
            ${days.map(day => `
                <div class="forecast-day">
                    <div>${new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}" width="50">
                    <div>${Math.round(day.main.temp)}°C</div>
                    <div style="font-size:0.9em;">${day.weather[0].main}</div>
                </div>
            `).join('')}
        </div>
    `;
    document.getElementById('forecast-output').innerHTML = html;
}
