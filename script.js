// ---- Konfiguration ----
  const DEVICE      = 'AU_STUDENT1';
  const SERVER_URL  = 'https://iot-paia-production.up.railway.app';
  const BASE        = SERVER_URL + '/api/env-sensors/' + DEVICE;

  // ---- Hjælpefunktioner ----
  function fmt(v, dec = 1) {
    return v != null ? Number(v).toFixed(dec) : '—';
  }

  function fmtHel(v) {
    return v != null ? Number(v).toFixed(0) : '—';
  }

  function fmtTid(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('da-DK', {
      dateStyle: 'short',
      timeStyle: 'medium'
    });
  }

  // ---- SSE: live data ----
  const statusEl    = document.getElementById('status');
  const opdateretEl = document.getElementById('opdateret');

  // Alle felter der skal opdateres — { feltId: [nøgle, decimaler] }
  const FELTER = {
    // BME680
    temperature_c:   ['temperature_c',   1],
    humidity_pct:    ['humidity_pct',     1],
    pressure_hpa:    ['pressure_hpa',     0],
    gas_kohms:       ['gas_kohms',        1],
    altitude_m:      ['altitude_m',       1],
    // PMS5003
    pm10_env:        ['pm10_env',         1],
    pm25_env:        ['pm25_env',         1],
    pm100_env:       ['pm100_env',        1],
    particles_03um:  ['particles_03um',   0],
    particles_05um:  ['particles_05um',   0],
    particles_10um:  ['particles_10um',   0],
    particles_25um:  ['particles_25um',   0],
    particles_50um:  ['particles_50um',   0],
    particles_100um: ['particles_100um',  0],
    // AS7341
    f1_415nm:        ['f1_415nm',         0],
    f2_445nm:        ['f2_445nm',         0],
    f3_480nm:        ['f3_480nm',         0],
    f4_515nm:        ['f4_515nm',         0],
    f5_555nm:        ['f5_555nm',         0],
    f6_590nm:        ['f6_590nm',         0],
    f7_630nm:        ['f7_630nm',         0],
    f8_680nm:        ['f8_680nm',         0],
    clear:           ['clear',            0],
    nir:             ['nir',              0],
    flicker_hz:      ['flicker_hz',       0],
    // Mikrofon
    spl_db:          ['spl_db',           1],
  };

  function setStatus(tekst, cls) {
    statusEl.textContent = tekst;
    statusEl.className   = cls;
  }

  function opdaterKort(d) {
    for (const [id, [nøgle, dec]] of Object.entries(FELTER)) {
      const el = document.getElementById(id);
      if (el) el.textContent = fmt(d[nøgle], dec);
    }
    opdateretEl.textContent = 'Sidst opdateret: ' + new Date().toLocaleTimeString('da-DK');
  }

  function forbindSSE() {
    const es = new EventSource(BASE + '/stream');

    es.onopen = () => setStatus('Forbundet — modtager live data', 'ok');

    es.onmessage = (event) => {
      try {
        opdaterKort(JSON.parse(event.data));
      } catch {
        // ugyldig besked — ignorer
      }
    };

    es.onerror = () => {
      setStatus('Forbindelsesfejl — prøver igen om 5 sek', 'err');
      es.close();
      setTimeout(forbindSSE, 5000);
    };
  }

  forbindSSE();

  // ---- Fetch: historik ----
  async function hentHistorik() {
    const tbody = document.getElementById('tbody');
    try {
      const svar = await fetch(BASE + '/history?limit=20');
      if (!svar.ok) throw new Error('HTTP ' + svar.status);
      const rækker = await svar.json();

      if (!rækker.length) {
        tbody.innerHTML = '<tr><td colspan="27" style="color:#999">Ingen data fundet</td></tr>';
        return;
      }

      tbody.innerHTML = rækker.map(r => `
        <tr>
          <td>${fmtTid(r.Created_At)}</td>
          <td>${fmt(r.temperature_c)}</td>
          <td>${fmt(r.humidity_pct)}</td>
          <td>${fmtHel(r.pressure_hpa)}</td>
          <td>${fmt(r.gas_kohms)}</td>
          <td>${fmt(r.altitude_m)}</td>
          <td>${fmt(r.pm10_env)}</td>
          <td>${fmt(r.pm25_env)}</td>
          <td>${fmt(r.pm100_env)}</td>
          <td>${fmtHel(r.particles_03um)}</td>
          <td>${fmtHel(r.particles_05um)}</td>
          <td>${fmtHel(r.particles_10um)}</td>
          <td>${fmtHel(r.particles_25um)}</td>
          <td>${fmtHel(r.particles_50um)}</td>
          <td>${fmtHel(r.particles_100um)}</td>
          <td>${fmtHel(r.f1_415nm)}</td>
          <td>${fmtHel(r.f2_445nm)}</td>
          <td>${fmtHel(r.f3_480nm)}</td>
          <td>${fmtHel(r.f4_515nm)}</td>
          <td>${fmtHel(r.f5_555nm)}</td>
          <td>${fmtHel(r.f6_590nm)}</td>
          <td>${fmtHel(r.f7_630nm)}</td>
          <td>${fmtHel(r.f8_680nm)}</td>
          <td>${fmtHel(r.clear)}</td>
          <td>${fmtHel(r.nir)}</td>
          <td>${fmtHel(r.flicker_hz)}</td>
          <td>${fmt(r.spl_db)}</td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="27" style="color:red">Fejl ved hentning: ${err.message}</td></tr>`;
    }
  }

  hentHistorik();