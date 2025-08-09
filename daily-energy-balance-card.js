class DailyEnergyBalanceCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  
    this._hass = null;}

  setConfig(config) {
    if (!config.entities) {
      throw new Error('Entities müssen konfiguriert werden');
    }

    this.config = {
      title: 'Energiebilanz',
      show_title: true,
      ...config
    };

    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.updateContent();
  }

  get hass() {
    return this._hass;
  }

  getCardSize() {
    return 3;
  }

  static getConfigElement() {
    return document.createElement('daily-energy-balance-card-editor');
  }

  static getStubConfig(hass, entities, entitiesFallback) {
    // Try to prefill with energy-related sensors
    const all = hass && hass.states ? Object.keys(hass.states) : [];
    const energySensors = all.filter(e => e.startsWith('sensor.') && (hass.states[e].attributes?.device_class === 'energy' || /(energy|verbrauch|erzeug)/i.test(e)));
    return {
      title: "Today's Energy Balance",
      show_title: true,
      entities: {
        consumption: energySensors[0] || '',
        production: energySensors[1] || '',
        grid_in: energySensors[2] || '',
        grid_out: energySensors[3] || ''
      }
    };
  }


  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--ha-card-font-family, Helvetica, Arial, sans-serif);
        }
        /* Color tokens */
        :host {
          --debc-label-color: var(--primary-text-color);
          --debc-muted-color: var(--secondary-text-color);
        }
        @media (prefers-color-scheme: dark) {
          :host {
            /* brighter labels in dark mode */
            --debc-label-color: #e9e9e9;
            --debc-muted-color: #c7c7c7;
          }
        }
        
        .card {
          color: var(--debc-label-color);
          background: var(--ha-card-background, var(--card-background-color, #fff));
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, none);
          padding: var(--tile-padding, 12px);
          overflow: hidden;
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          min-height: 200px;
        }
        
        .card-header {
          padding: 16px 16px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }
        
        .card-title {
          color: var(--primary-text-color);
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }
        
        .card-content {
          padding: 16px;
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 0;
        }
        
        .energy-chart {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .chart-container {
          position: relative;
          display: inline-block;
          width: 100%;
          height: 100%;
          min-height: 150px;
        }
        
        .chart-container svg {
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
        }
        
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          color: var(--secondary-text-color);
        }
        
        .error {
          color: var(--error-color, #f44336);
          text-align: center;
          padding: 20px;
        }
      </style>
      
      <ha-card class="card">
        ${this.config.show_title ? `
          <div class="card-header">
            <h1 class="card-title">${this.config.title}</h1>
          </div>
        ` : ''}
        <div class="card-content">
          <div class="energy-chart">
            <div class="chart-container" id="chart-container">
              <div class="loading">Lade Daten...</div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  updateContent() {
    if (!this._hass || !this.config) return;

    try {
      const values = this.getEntityValues();
      const svg = this.generateSVG(values);
      
      const container = this.shadowRoot.getElementById('chart-container');
      if (container) {
        container.innerHTML = svg;
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Karte:', error);
      const container = this.shadowRoot.getElementById('chart-container');
      if (container) {
        container.innerHTML = `<div class="error">Fehler beim Laden der Daten: ${error.message}</div>`;
      }
    }
  }

  getEntityValues() {
    const entities = this.config.entities;
    const hass = this._hass;

    const getValue = (entityId) => {
      if (!entityId) return 0;
      const entity = hass.states[entityId];
      if (!entity) return 0;
      const value = parseFloat(entity.state);
      return isNaN(value) ? 0 : Math.round(value * 10) / 10;
    };

    const wirkLeistungAuto = getValue(entities.auto_consumption);
    const wirkLeistungPV = getValue(entities.pv_power);
    const wirkLeistungNetzIn = getValue(entities.grid_import);
    const wirkLeistungBatterieOut = getValue(entities.battery_discharge);
    const wirkLeistungVerbrauch = getValue(entities.consumption);
    const wirkLeistungHaus = wirkLeistungVerbrauch - wirkLeistungAuto;
    const wirkLeistungNetzOut = getValue(entities.grid_export);
    const wirkLeistungBatterieIn = getValue(entities.battery_charge);

    return {
      wirkLeistungAuto,
      wirkLeistungPV,
      wirkLeistungNetzIn,
      wirkLeistungBatterieOut,
      wirkLeistungVerbrauch,
      wirkLeistungHaus,
      wirkLeistungNetzOut,
      wirkLeistungBatterieIn
    };
  }

  generateSVG(values) {
    const {
      wirkLeistungAuto,
      wirkLeistungPV,
      wirkLeistungNetzIn,
      wirkLeistungBatterieOut,
      wirkLeistungVerbrauch,
      wirkLeistungHaus,
      wirkLeistungNetzOut,
      wirkLeistungBatterieIn
    } = values;

    const colors = {
      verbrauchAuto: "#BABABA",
      pv: "#FF8C00",
      netz: "#4682B4",
      batterie: "#32CD32",
      verbrauchHaus: "#E0E0E0"
    };

    // Einfache Dark Mode Erkennung
    const isDark = document.body.classList.contains('dark');
    const skinColor = isDark ? '#ffffff' : '#333333';

    // Feste Größe
    const boxBreite = 182;
    const boxHoehe = 300;
    const offsetRand = 33;
    const balkenBreite = Math.floor((boxBreite - 40) / 3);

    // Max-Werte ermitteln
    const maxWertBezug = Math.max(wirkLeistungPV, wirkLeistungNetzIn, wirkLeistungBatterieOut);
    const maxWertVerbrauch = Math.max(wirkLeistungVerbrauch, wirkLeistungNetzOut, wirkLeistungBatterieIn);
    const pixelProKWh = (boxHoehe - (2 * offsetRand)) / Math.max(maxWertBezug + maxWertVerbrauch, 1);
    const positionNullLinie = Math.floor(offsetRand + (maxWertBezug * pixelProKWh));

    // SVG generieren
    let svg = `<svg width="${boxBreite}px" height="${boxHoehe}px" viewBox="0 0 ${boxBreite} ${boxHoehe}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">`;

    // Null-Linie
    const breiteNullLinie = boxBreite - 9;
    svg += `<rect x="4" y="${positionNullLinie}" width="${breiteNullLinie}" height="1" stroke="${skinColor}" fill="${skinColor}" stroke-width="1"/>`;

    // PV Balken
    const xOffsetPV = wirkLeistungPV >= 10 ? 0 : 5;
    const balkenHoehePV = Math.floor(wirkLeistungPV * pixelProKWh);
    const positionPVx = 5;
    const positionPVy = positionNullLinie - balkenHoehePV - 5;
    const positionPVLabelY = positionPVy - 18;
    const positionPVLabelX = Math.floor(positionPVx + (balkenBreite / 2) - 10);
    const positionPVWertY = positionPVy - 30;
    const positionPVWertX = Math.floor(positionPVx + (balkenBreite / 2) - 14 + xOffsetPV);

    svg += `<rect x="${positionPVx}" y="${positionPVy}" width="${balkenBreite}" height="${balkenHoehePV}" stroke="${colors.pv}" fill="${colors.pv}" stroke-width="3"/>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionPVLabelX}.0 ${positionPVLabelY}.0)" y="12.0" font-size="12" font-family="Helvetica-Bold, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125">PV</text>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionPVWertX}.0 ${positionPVWertY}.0)" y="12.0" font-size="12" font-family="Helvetica, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125">${wirkLeistungPV}</text>`;

    // Netz in
    const xOffsetNetzIn = wirkLeistungNetzIn >= 10 ? 0 : 5;
    const positionNetzInX = 20 + balkenBreite;
    const balkenHoeheNetzIn = Math.floor(wirkLeistungNetzIn * pixelProKWh);
    const positionNetzInY = positionNullLinie - balkenHoeheNetzIn - 5;
    const positionNetzInLabelY = positionNetzInY - 18;
    const positionNetzInLabelX = Math.floor(positionNetzInX + (balkenBreite / 2) - 15);
    const positionNetzInWertY = positionNetzInY - 30;
    const positionNetzInWertX = Math.floor(positionNetzInX + (balkenBreite / 2) - 16 + xOffsetNetzIn);

    svg += `<rect x="${positionNetzInX}" y="${positionNetzInY}" width="${balkenBreite}" height="${balkenHoeheNetzIn}" stroke="${colors.netz}" fill="${colors.netz}" stroke-width="3"/>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionNetzInLabelX}.0 ${positionNetzInLabelY}.0)" y="12.0" font-size="12" font-family="Helvetica-Bold, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125">Kauf</text>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionNetzInWertX}.0 ${positionNetzInWertY}.0)" y="12.0" font-size="12" font-family="Helvetica, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125">${wirkLeistungNetzIn}</text>`;

    // Batterie out
    const xOffsetBatterieOut = wirkLeistungBatterieOut >= 10 ? 0 : 5;
    const positionBatterieOutX = 35 + (2 * balkenBreite);
    const balkenHoeheBatterieOut = Math.floor(wirkLeistungBatterieOut * pixelProKWh);
    const positionBatterieOutY = positionNullLinie - balkenHoeheBatterieOut - 5;
    const positionBatterieOutLabelY = positionBatterieOutY - 18;
    const positionBatterieOutLabelX = Math.floor(positionBatterieOutX + (balkenBreite / 2) - 26);
    const positionBatterieOutWertY = positionBatterieOutY - 30;
    const positionBatterieOutWertX = Math.floor(positionBatterieOutX + (balkenBreite / 2) - 14 + xOffsetBatterieOut);

    svg += `<rect x="${positionBatterieOutX}" y="${positionBatterieOutY}" width="${balkenBreite}" height="${balkenHoeheBatterieOut}" stroke="${colors.batterie}" fill="${colors.batterie}" stroke-width="3"/>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionBatterieOutLabelX}.0 ${positionBatterieOutLabelY}.0)" y="12.0" font-size="12" font-family="Helvetica-Bold, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125">Entladen</text>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionBatterieOutWertX}.0 ${positionBatterieOutWertY}.0)" y="12.0" font-size="12" font-family="Helvetica, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125">${wirkLeistungBatterieOut}</text>`;

    // Verbrauch Haus Balken
    const positionVerbrauchHausY = positionNullLinie + 6;
    const positionVerbrauchHausX = 5;
    const balkenHoeheVerbrauchHaus = Math.floor(wirkLeistungHaus * pixelProKWh);
    const positionVerbrauchHausWertY = positionVerbrauchHausY + balkenHoeheVerbrauchHaus + 15;
    const positionVerbrauchHausWertX = Math.floor(positionVerbrauchHausX + (balkenBreite / 2) - 26);

    svg += `<rect x="${positionVerbrauchHausX}" y="${positionVerbrauchHausY}" width="${balkenBreite}" height="${balkenHoeheVerbrauchHaus}" stroke="${colors.verbrauchHaus}" fill="${colors.verbrauchHaus}" stroke-width="3"/>`;

    // Verbrauch Auto Balken
    const positionVerbrauchAutoY = positionVerbrauchHausY + balkenHoeheVerbrauchHaus;
    const positionVerbrauchAutoX = 5;
    const balkenHoeheVerbrauchAuto = Math.floor(wirkLeistungAuto * pixelProKWh);
    const positionVerbrauchAutoLabelY = positionVerbrauchAutoY + balkenHoeheVerbrauchAuto + 3;
    const positionVerbrauchHausLabelX = Math.floor(positionVerbrauchAutoX + (balkenBreite / 2) - 29);
    const positionVerbrauchAutoLabelX = positionVerbrauchHausLabelX + 31;
    const positionVerbrauchAutoWertY = positionVerbrauchAutoY + balkenHoeheVerbrauchAuto + 15;
    const positionVerbrauchAutoWertX = Math.floor(positionVerbrauchAutoX + (balkenBreite / 2) - 26);

    svg += `<rect x="${positionVerbrauchAutoX}" y="${positionVerbrauchAutoY}" width="${balkenBreite}" height="${balkenHoeheVerbrauchAuto}" stroke="${colors.verbrauchAuto}" fill="${colors.verbrauchAuto}" stroke-width="3"/>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionVerbrauchHausLabelX}.0 ${positionVerbrauchAutoLabelY}.0)" y="12.0" font-size="12" font-family="Helvetica-Bold, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125">Haus/</text>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionVerbrauchAutoLabelX}.0 ${positionVerbrauchAutoLabelY}.0)" y="12.0" font-size="12" font-family="Helvetica-Bold, Helvetica" fill="${colors.verbrauchAuto}" text-decoration="none" x="1.65283203125">Auto</text>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionVerbrauchAutoWertX}.0 ${positionVerbrauchAutoWertY}.0)" y="12.0" font-size="12" font-family="Helvetica, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125">${wirkLeistungHaus} / ${wirkLeistungAuto}</text>`;

    // Netz out
    const xOffsetNetzOut = wirkLeistungNetzOut >= 10 ? 0 : 5;
    const positionNetzOutY = positionNullLinie + 6;
    const positionNetzOutX = 20 + balkenBreite;
    const balkenHoeheNetzOut = Math.floor(wirkLeistungNetzOut * pixelProKWh);
    const positionNetzOutLabelY = positionNetzOutY + balkenHoeheNetzOut + 3;
    const positionNetzOutLabelX = Math.floor(positionNetzOutX + (balkenBreite / 2) - 23);
    const positionNetzOutWertY = positionNetzOutY + balkenHoeheNetzOut + 15;
    const positionNetzOutWertX = Math.floor(positionNetzInX + (balkenBreite / 2) - 14 + xOffsetNetzOut);

    svg += `<rect x="${positionNetzOutX}" y="${positionNetzOutY}" width="${balkenBreite}" height="${balkenHoeheNetzOut}" stroke="${colors.netz}" fill="${colors.netz}" stroke-width="3"/>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionNetzOutLabelX}.0 ${positionNetzOutLabelY}.0)" y="12.0" font-size="12" font-family="Helvetica-Bold, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125">Verkauf</text>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionNetzOutWertX}.0 ${positionNetzOutWertY}.0)" y="12.0" font-size="12" font-family="Helvetica, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125">${wirkLeistungNetzOut}</text>`;

    // Batterie in
    const xOffsetBatterieIn = wirkLeistungBatterieIn >= 10 ? 0 : 5;
    const positionBatterieInY = positionNullLinie + 6;
    const positionBatterieInX = 35 + (2 * balkenBreite);
    const balkenHoeheBatterieIn = Math.floor(wirkLeistungBatterieIn * pixelProKWh);
    const positionBatterieInLabelY = positionBatterieInY + balkenHoeheBatterieIn + 3;
    const positionBatterieInLabelX = Math.floor(positionBatterieInX + (balkenBreite / 2) - 18);
    const positionBatterieInWertY = positionBatterieInY + balkenHoeheBatterieIn + 15;
    const positionBatterieInWertX = Math.floor(positionBatterieInX + (balkenBreite / 2) - 14 + xOffsetBatterieIn);

    svg += `<rect x="${positionBatterieInX}" y="${positionBatterieInY}" width="${balkenBreite}" height="${balkenHoeheBatterieIn}" stroke="${colors.batterie}" fill="${colors.batterie}" stroke-width="3"/>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionBatterieInLabelX}.0 ${positionBatterieInLabelY}.0)" y="12.0" font-size="12" font-family="Helvetica-Bold, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125">Laden</text>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionBatterieInWertX}.0 ${positionBatterieInWertY}.0)" y="12.0" font-size="12" font-family="Helvetica, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125">${wirkLeistungBatterieIn}</text>`;

    svg += '</svg>';
    return svg;
  }

  static getStubConfig() {
    return {
      entities: {
        pv_power: 'sensor.power_solar',
        grid_import: 'sensor.power_grid_in',
        grid_export: 'sensor.power_grid_out',
        battery_charge: 'sensor.power_battery_in',
        battery_discharge: 'sensor.power_battery_out',
        consumption: 'sensor.power_consumption',
        auto_consumption: 'sensor.power_solar_used_by_wallbox'
      },
      title: 'Energiebilanz',
      show_title: true
    };
  }
}

// HACS Konfiguration
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'daily-energy-balance-card',
  name: 'Daily Energy Balance Card',
  description: 'Eine Karte zur grafischen Darstellung von kumulierten Leistungsdaten für PV-Anlagen, Batteriespeicher und Netzbezug/-einspeisung.',
  preview: true,
  documentationURL: 'https://github.com/your-username/daily-energy-balance-card'
});

// Custom Element registrieren
customElements.define('daily-energy-balance-card', DailyEnergyBalanceCard);



class DailyEnergyBalanceCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
  }

  setConfig(config) {
    this._config = { show_title: true, ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _update(key, value) {
    this._config = { ...this._config, [key]: value };
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config } }));
    this._render();
  }

  _updateEntity(key, ev) {
    const val = ev.detail?.value ?? ev.target?.value;
    const entities = { ...(this._config.entities || {}) , [key]: val || '' };
    this._update('entities', entities);
  }

  _render() {
    if (!this.shadowRoot) return;
    const cfg = this._config || {};
    const ents = cfg.entities || {};

    const style = `
      <style>
        .editor {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          padding: 12px;
        }
        .row {
          display: grid;
          gap: 8px;
        }
        ha-entity-picker, ha-textfield {
          width: 100%;
        }
        label {
          font-size: 0.85rem;
          color: var(--secondary-text-color);
        }
      </style>
    `;

    // Use HA components if available, but fall back to native inputs
    const titleField = `
      <div class="row">
        <label>Title</label>
        <ha-textfield .value="${cfg.title ?? ''}" placeholder="Today's Energy Balance"
          @input="${(e)=>{}}" ></ha-textfield>
      </div>`;

    // We can't bind events directly in a string; reconstruct below.
    this.shadowRoot.innerHTML = style + `
      <div class="editor">
        <div class="row">
          <label>Title</label>
          <ha-textfield id="title" value="${cfg.title ?? ''}" placeholder="Today's Energy Balance"></ha-textfield>
        </div>
        <div class="row">
          <label>Show title</label>
          <ha-switch id="show_title" ${cfg.show_title !== false ? 'checked' : ''}></ha-switch>
        </div>
        <div class="row">
          <label>Consumption entity</label>
          <ha-entity-picker id="consumption" .hass="${this._hass}" value="${ents.consumption ?? ''}" allow-custom-entity></ha-entity-picker>
        </div>
        <div class="row">
          <label>Production entity</label>
          <ha-entity-picker id="production" .hass="${this._hass}" value="${ents.production ?? ''}" allow-custom-entity></ha-entity-picker>
        </div>
        <div class="row">
          <label>Grid import entity</label>
          <ha-entity-picker id="grid_in" .hass="${this._hass}" value="${(ents.grid_in ?? '')}" allow-custom-entity></ha-entity-picker>
        </div>
        <div class="row">
          <label>Grid export entity</label>
          <ha-entity-picker id="grid_out" .hass="${this._hass}" value="${(ents.grid_out ?? '')}" allow-custom-entity></ha-entity-picker>
        </div>
      </div>
    `;

    // Attach listeners
    const $ = (id) => this.shadowRoot.getElementById(id);
    const titleEl = $('title');
    if (titleEl) titleEl.addEventListener('input', (e) => this._update('title', e.target.value));
    const showTitleEl = $('show_title');
    if (showTitleEl) showTitleEl.addEventListener('change', (e) => this._update('show_title', e.target.checked));
    const fields = ['consumption','production','grid_in','grid_out'];
    fields.forEach(f => {
      const el = $(f);
      if (el) el.addEventListener('value-changed', (ev) => this._updateEntity(f, ev));
      if (el) el.addEventListener('change', (ev) => this._updateEntity(f, ev));
      if (this._hass) el.hass = this._hass;
    });
  }
}
customElements.define('daily-energy-balance-card-editor', DailyEnergyBalanceCardEditor);
