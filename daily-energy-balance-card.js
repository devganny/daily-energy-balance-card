class DailyEnergyBalanceCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  
    this._hass = null;
    // defaults for colors
    this._colors = {
      consumption: '#4caf50',
      production: '#ff9800',
      grid_in: '#03a9f4',
      grid_out: '#9c27b0',
      labels: '#ffffff'
    };
}

  setConfig(config) {
    if (!config.entities) {
      throw new Error('Entities müssen konfiguriert werden');
    }

    this.config = {
      title: 'Energiebilanz',
      show_title: true,
      ...config
    };
    // migrate old nested entities to top-level if provided via editor
    if (this.config.entities == null) {
      this.config.entities = {
        consumption: this.config.consumption,
        production: this.config.production,
        grid_in: this.config.grid_in,
        grid_out: this.config.grid_out,
        auto_consumption: this.config.auto_consumption,
        pv_power: this.config.pv_power,
        grid_import: this.config.grid_import,
        battery_discharge: this.config.battery_discharge,
        grid_export: this.config.grid_export,
        battery_charge: this.config.battery_charge,
      };
    }
    this.config.colors = { ...this._colors, ...(this.config.colors || {}) };


    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this._applyLayout();
    this._applyColors();
    this.updateContent();
  }
  get hass() { return this._hass; }

  getCardSize() { return 3; }
  static getConfigElement() { return document.createElement('daily-energy-balance-card-editor'); }
  static getStubConfig(hass, entities, entitiesFallback) {
    const all = hass && hass.states ? Object.keys(hass.states) : [];
    const energy = all.filter(e => e.startsWith('sensor.'));
    return {
      title: "Today's Energy Balance",
      show_title: true,
      entities: {
        consumption: energy[0] || "",
        production:  energy[1] || "",
        grid_in:     energy[2] || "",
        grid_out:    energy[3] || "",
      },
      colors: {
        consumption: '#4caf50',
        production:  '#ff9800',
        grid_in:     '#03a9f4',
        grid_out:    '#9c27b0',
        labels:      '#ffffff'
      }
    };
  }

  getGridOptions() {
    // Enable independent width/height (columns/rows) control in Sections
    return {
      columns: 6,
      rows: 2,
      min_columns: 1,
      min_rows: 1
    };
  }


  _applyColors() {
    const colors = (this.config && this.config.colors) ? this.config.colors : null;
    if (!colors) return;
    if (colors.labels) this.style.setProperty('--debc-labels', colors.labels);
    if (colors.pv) this.style.setProperty('--debc-pv', colors.pv);
    if (colors.netz) this.style.setProperty('--debc-netz', colors.netz);
    if (colors.batterie) this.style.setProperty('--debc-batterie', colors.batterie);
    if (colors.verbrauchHaus) this.style.setProperty('--debc-verbrauch-haus', colors.verbrauchHaus);
    if (colors.verbrauchAuto) this.style.setProperty('--debc-verbrauch-auto', colors.verbrauchAuto);
  }

  _applyLayout() {
    // Allow explicit height via style if user set `height` in config
    if (!this.config) return;
    if (this.config.height) {
      const h = typeof this.config.height === 'number' ? `${this.config.height}px` : String(this.config.height);
      this.style.setProperty('--debc-height', h);
    }
  }


  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--ha-card-font-family, Helvetica, Arial, sans-serif);
        }
        :host{
          display:block;
          height:100%;
          color:#ffffff;
        }
        .title{ color:#ffffff; }
        .card{ color:#ffffff; height:100%; display:flex; flex-direction:column; }
        .content{ flex:1; min-height:0; display:flex; }
        #chart-container{ flex:1; min-height:0; width:100%; }

        
        .card {
          background: var(--ha-card-background, var(--card-background-color, #fff));
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, none);
          overflow: hidden;
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          min-height: 0;
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
        
        .energy-chart { height: 100%;
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
          min-height: 0;
        }
        
        .chart-container svg { height: 100%;
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
        <style>
          /* Fallback bar colors (overridden by inline fills) */
          .bar-consumption, .bar-verbrauch-haus { fill: var(--debc-consumption, #4caf50); }
          .bar-production, .bar-pv  { fill: var(--debc-production,  #ff9800); }
          .bar-grid-in, .bar-netz     { fill: var(--debc-grid-in,    #03a9f4); }
          .bar-grid-out, .bar-batterie    { fill: var(--debc-grid-out,   #9c27b0); }
          .labels          { fill: var(--debc-labels,     #ffffff); }
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
        
    const colors = (this.config && this.config.colors) ? this.config.colors : this._colors;
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
    
    const colors = (this.config && this.config.colors) ? this.config.colors : this._colors;
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

    const defaultColors = {
      verbrauchAuto: "#BABABA",
      pv: "#FF8C00",
      netz: "#4682B4",
      batterie: "#32CD32",
      verbrauchHaus: "#E0E0E0",
      labels: "#FFFFFF"
    };
    const cfgColors = (this.config && this.config.colors) ? this.config.colors : {};
    const colors = { ...defaultColors, ...cfgColors };

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

    svg += `<rect x="${positionPVx}" y="${positionPVy}" width="${balkenBreite}" height="${balkenHoehePV}" stroke="${colors.pv}" fill="${colors.pv}" stroke-width="3"/ class=\"bar-pv\">
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionPVLabelX}.0 ${positionPVLabelY}.0)" y="12.0" font-size="12" font-family="Helvetica-Bold, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125" class=\"labels\" class=\"labels\">PV</text>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionPVWertX}.0 ${positionPVWertY}.0)" y="12.0" font-size="12" font-family="Helvetica, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125" class=\"labels\" class=\"labels\">${wirkLeistungPV}</text>`;

    // Netz in
    const xOffsetNetzIn = wirkLeistungNetzIn >= 10 ? 0 : 5;
    const positionNetzInX = 20 + balkenBreite;
    const balkenHoeheNetzIn = Math.floor(wirkLeistungNetzIn * pixelProKWh);
    const positionNetzInY = positionNullLinie - balkenHoeheNetzIn - 5;
    const positionNetzInLabelY = positionNetzInY - 18;
    const positionNetzInLabelX = Math.floor(positionNetzInX + (balkenBreite / 2) - 15);
    const positionNetzInWertY = positionNetzInY - 30;
    const positionNetzInWertX = Math.floor(positionNetzInX + (balkenBreite / 2) - 16 + xOffsetNetzIn);

    svg += `<rect x="${positionNetzInX}" y="${positionNetzInY}" width="${balkenBreite}" height="${balkenHoeheNetzIn}" stroke="${colors.netz}" fill="${colors.netz}" stroke-width="3"/ class=\"bar-netz\">
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionNetzInLabelX}.0 ${positionNetzInLabelY}.0)" y="12.0" font-size="12" font-family="Helvetica-Bold, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125" class=\"labels\" class=\"labels\">Kauf</text>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionNetzInWertX}.0 ${positionNetzInWertY}.0)" y="12.0" font-size="12" font-family="Helvetica, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125" class=\"labels\" class=\"labels\">${wirkLeistungNetzIn}</text>`;

    // Batterie out
    const xOffsetBatterieOut = wirkLeistungBatterieOut >= 10 ? 0 : 5;
    const positionBatterieOutX = 35 + (2 * balkenBreite);
    const balkenHoeheBatterieOut = Math.floor(wirkLeistungBatterieOut * pixelProKWh);
    const positionBatterieOutY = positionNullLinie - balkenHoeheBatterieOut - 5;
    const positionBatterieOutLabelY = positionBatterieOutY - 18;
    const positionBatterieOutLabelX = Math.floor(positionBatterieOutX + (balkenBreite / 2) - 26);
    const positionBatterieOutWertY = positionBatterieOutY - 30;
    const positionBatterieOutWertX = Math.floor(positionBatterieOutX + (balkenBreite / 2) - 14 + xOffsetBatterieOut);

    svg += `<rect x="${positionBatterieOutX}" y="${positionBatterieOutY}" width="${balkenBreite}" height="${balkenHoeheBatterieOut}" stroke="${colors.batterie}" fill="${colors.batterie}" stroke-width="3"/ class=\"bar-batterie\">
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionBatterieOutLabelX}.0 ${positionBatterieOutLabelY}.0)" y="12.0" font-size="12" font-family="Helvetica-Bold, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125" class=\"labels\" class=\"labels\">Entladen</text>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionBatterieOutWertX}.0 ${positionBatterieOutWertY}.0)" y="12.0" font-size="12" font-family="Helvetica, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125" class=\"labels\" class=\"labels\">${wirkLeistungBatterieOut}</text>`;

    // Verbrauch Haus Balken
    const positionVerbrauchHausY = positionNullLinie + 6;
    const positionVerbrauchHausX = 5;
    const balkenHoeheVerbrauchHaus = Math.floor(wirkLeistungHaus * pixelProKWh);
    const positionVerbrauchHausWertY = positionVerbrauchHausY + balkenHoeheVerbrauchHaus + 15;
    const positionVerbrauchHausWertX = Math.floor(positionVerbrauchHausX + (balkenBreite / 2) - 26);

    svg += `<rect x="${positionVerbrauchHausX}" y="${positionVerbrauchHausY}" width="${balkenBreite}" height="${balkenHoeheVerbrauchHaus}" stroke="${colors.verbrauchHaus}" fill="${colors.verbrauchHaus}" stroke-width="3"/ class=\"bar-verbrauch-haus\">`;

    // Verbrauch Auto Balken
    const positionVerbrauchAutoY = positionVerbrauchHausY + balkenHoeheVerbrauchHaus;
    const positionVerbrauchAutoX = 5;
    const balkenHoeheVerbrauchAuto = Math.floor(wirkLeistungAuto * pixelProKWh);
    const positionVerbrauchAutoLabelY = positionVerbrauchAutoY + balkenHoeheVerbrauchAuto + 3;
    const positionVerbrauchHausLabelX = Math.floor(positionVerbrauchAutoX + (balkenBreite / 2) - 29);
    const positionVerbrauchAutoLabelX = positionVerbrauchHausLabelX + 31;
    const positionVerbrauchAutoWertY = positionVerbrauchAutoY + balkenHoeheVerbrauchAuto + 15;
    const positionVerbrauchAutoWertX = Math.floor(positionVerbrauchAutoX + (balkenBreite / 2) - 26);

    svg += `<rect x="${positionVerbrauchAutoX}" y="${positionVerbrauchAutoY}" width="${balkenBreite}" height="${balkenHoeheVerbrauchAuto}" stroke="${colors.verbrauchAuto}" fill="${colors.verbrauchAuto}" stroke-width="3"/ class=\"bar-verbrauch-auto\">
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionVerbrauchHausLabelX}.0 ${positionVerbrauchAutoLabelY}.0)" y="12.0" font-size="12" font-family="Helvetica-Bold, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125" class=\"labels\" class=\"labels\">Haus/</text>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionVerbrauchAutoLabelX}.0 ${positionVerbrauchAutoLabelY}.0)" y="12.0" font-size="12" font-family="Helvetica-Bold, Helvetica" fill="${colors.verbrauchAuto}" text-decoration="none" x="1.65283203125" class=\"labels\" class=\"labels\">Auto</text>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionVerbrauchAutoWertX}.0 ${positionVerbrauchAutoWertY}.0)" y="12.0" font-size="12" font-family="Helvetica, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125" class=\"labels\" class=\"labels\">${wirkLeistungHaus} / ${wirkLeistungAuto}</text>`;

    // Netz out
    const xOffsetNetzOut = wirkLeistungNetzOut >= 10 ? 0 : 5;
    const positionNetzOutY = positionNullLinie + 6;
    const positionNetzOutX = 20 + balkenBreite;
    const balkenHoeheNetzOut = Math.floor(wirkLeistungNetzOut * pixelProKWh);
    const positionNetzOutLabelY = positionNetzOutY + balkenHoeheNetzOut + 3;
    const positionNetzOutLabelX = Math.floor(positionNetzOutX + (balkenBreite / 2) - 23);
    const positionNetzOutWertY = positionNetzOutY + balkenHoeheNetzOut + 15;
    const positionNetzOutWertX = Math.floor(positionNetzInX + (balkenBreite / 2) - 14 + xOffsetNetzOut);

    svg += `<rect x="${positionNetzOutX}" y="${positionNetzOutY}" width="${balkenBreite}" height="${balkenHoeheNetzOut}" stroke="${colors.netz}" fill="${colors.netz}" stroke-width="3"/ class=\"bar-netz\">
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionNetzOutLabelX}.0 ${positionNetzOutLabelY}.0)" y="12.0" font-size="12" font-family="Helvetica-Bold, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125" class=\"labels\" class=\"labels\">Verkauf</text>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionNetzOutWertX}.0 ${positionNetzOutWertY}.0)" y="12.0" font-size="12" font-family="Helvetica, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125" class=\"labels\" class=\"labels\">${wirkLeistungNetzOut}</text>`;

    // Batterie in
    const xOffsetBatterieIn = wirkLeistungBatterieIn >= 10 ? 0 : 5;
    const positionBatterieInY = positionNullLinie + 6;
    const positionBatterieInX = 35 + (2 * balkenBreite);
    const balkenHoeheBatterieIn = Math.floor(wirkLeistungBatterieIn * pixelProKWh);
    const positionBatterieInLabelY = positionBatterieInY + balkenHoeheBatterieIn + 3;
    const positionBatterieInLabelX = Math.floor(positionBatterieInX + (balkenBreite / 2) - 18);
    const positionBatterieInWertY = positionBatterieInY + balkenHoeheBatterieIn + 15;
    const positionBatterieInWertX = Math.floor(positionBatterieInX + (balkenBreite / 2) - 14 + xOffsetBatterieIn);

    svg += `<rect x="${positionBatterieInX}" y="${positionBatterieInY}" width="${balkenBreite}" height="${balkenHoeheBatterieIn}" stroke="${colors.batterie}" fill="${colors.batterie}" stroke-width="3"/ class=\"bar-batterie\">
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionBatterieInLabelX}.0 ${positionBatterieInLabelY}.0)" y="12.0" font-size="12" font-family="Helvetica-Bold, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125" class=\"labels\" class=\"labels\">Laden</text>
           <text transform="matrix(1.0 0.0 0.0 1.0 ${positionBatterieInWertX}.0 ${positionBatterieInWertY}.0)" y="12.0" font-size="12" font-family="Helvetica, Helvetica" fill="${skinColor}" text-decoration="none" x="1.65283203125" class=\"labels\" class=\"labels\">${wirkLeistungBatterieIn}</text>`;

    svg += '</svg>';
    return svg;
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
    this._config = { show_title: true, colors: {}, ...config };
    this._config.colors = { labels: '#ffffff', ...this._config.colors };
    this._render();
  }
  set hass(hass) {
    this._hass = hass;
    if (this.shadowRoot) {
      const pickers = this.shadowRoot.querySelectorAll('ha-entity-picker');
      pickers.forEach(p => p.hass = hass);
    }
  }
  _update(path, value) {
    const cfg = JSON.parse(JSON.stringify(this._config || {}));
    const segs = path.split('.');
    let ref = cfg;
    while (segs.length > 1) {
      const k = segs.shift();
      if (!ref[k] || typeof ref[k] !== 'object') ref[k] = {};
      ref = ref[k];
    }
    ref[segs[0]] = value;
    // Keep flat fields mirrored to entities (editor uses flat inputs)
    cfg.entities = {
      ...(cfg.entities || {}),
      consumption: cfg.consumption || '',
      production: cfg.production || '',
      grid_in: cfg.grid_in || '',
      grid_out: cfg.grid_out || '',
      auto_consumption: cfg.auto_consumption || '',
      pv_power: cfg.pv_power || '',
      grid_import: cfg.grid_import || '',
      battery_discharge: cfg.battery_discharge || '',
      grid_export: cfg.grid_export || '',
      battery_charge: cfg.battery_charge || '',
    };
    this._config = cfg;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: cfg } }));
  }
  _row(label, html) {
    return `<div class="row"><label>${label}</label>${html}</div>`;
  }
  _colorInput(id, value) {
    const val = value || '#ffffff';
    return `<input type="color" id="${id}" value="${val}" />`;
  }
  _entityPicker(id, value) {
    const val = value || '';
    return `<ha-entity-picker id="${id}" value="${val}" allow-custom-entity></ha-entity-picker>`;
  }
  _render() {
    if (!this.shadowRoot) return;
    const c = this._config || {};
    const colors = c.colors || {};
    const ents = c.entities || {};

    this.shadowRoot.innerHTML = `
      <style>
        .editor { display:grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px; }
        .section { border: 1px solid var(--divider-color); border-radius: 8px; padding: 12px; display:grid; gap:12px; }
        .section h3 { margin: 0 0 4px 0; font-size: 1rem; }
        .row { display:grid; gap:6px; align-items: center; }
        label { font-size: .85rem; color: var(--secondary-text-color); }
        .full { grid-column: 1 / -1; }
      </style>
      <div class="editor">
        <div class="section full">
          <h3>General</h3>
          ${this._row('Title', `<ha-textfield id="title" value="${c.title || ''}"></ha-textfield>`)}
          ${this._row('Show title', `<ha-switch id="show_title" ${c.show_title !== false ? 'checked' : ''}></ha-switch>`)}
          ${this._row('Height (px/rem)', `<ha-textfield id="height" value="${c.height || ''}" placeholder="e.g. 220px"></ha-textfield>`)}
        </div>

        <div class="section">
          <h3>Entities A</h3>
          ${this._row('Consumption', this._entityPicker('consumption', c.consumption || ents.consumption))}
          ${this._row('Production (PV power)', this._entityPicker('pv_power', c.pv_power || ents.pv_power || c.production || ents.production))}
          ${this._row('Grid import', this._entityPicker('grid_import', c.grid_import || ents.grid_import || c.grid_in || ents.grid_in))}
          ${this._row('Grid export', this._entityPicker('grid_export', c.grid_export || ents.grid_export || c.grid_out || ents.grid_out))}
          ${this._row('Auto consumption', this._entityPicker('auto_consumption', c.auto_consumption || ents.auto_consumption))}
        </div>

        <div class="section">
          <h3>Entities B (Battery)</h3>
          ${this._row('Battery charge', this._entityPicker('battery_charge', c.battery_charge || ents.battery_charge))}
          ${this._row('Battery discharge', this._entityPicker('battery_discharge', c.battery_discharge || ents.battery_discharge))}
        </div>

        <div class="section full">
          <h3>Colors</h3>
          ${this._row('Labels', this._colorInput('labels', colors.labels))}
          ${this._row('PV', this._colorInput('pv', colors.pv))}
          ${this._row('Grid', this._colorInput('netz', colors.netz))}
          ${this._row('Battery', this._colorInput('batterie', colors.batterie))}
          ${this._row('House consumption', this._colorInput('verbrauchHaus', colors.verbrauchHaus))}
          ${this._row('Auto consumption', this._colorInput('verbrauchAuto', colors.verbrauchAuto))}
        </div>
      </div>
    `;

    const $ = (id) => this.shadowRoot.getElementById(id);
    const bind = (id, path, ev='change', mapper=(e)=> e.target.value) => {
      const el = $(id);
      if (!el) return;
      el.addEventListener(ev, (e)=> this._update(path, mapper(e)));
      if (ev !== 'change') el.addEventListener('change', (e)=> this._update(path, mapper(e)));
      if ('hass' in el && this._hass) el.hass = this._hass;
    };

    bind('title', 'title', 'input');
    bind('show_title', 'show_title', 'change', (e)=> e.target.checked);
    bind('height', 'height', 'input');

    // Entities
    ['consumption','pv_power','grid_import','grid_export','auto_consumption','battery_charge','battery_discharge'].forEach((f)=>{
      bind(f, f, 'value-changed', (e)=> e.detail?.value ?? e.target?.value);
      bind(f, f, 'change', (e)=> e.detail?.value ?? e.target?.value);
    });

    // Colors
    ['labels','pv','netz','batterie','verbrauchHaus','verbrauchAuto'].forEach((f)=>{
      bind(f, 'colors.'+f, 'input');
    });
  }
}
customElements.define('daily-energy-balance-card-editor', DailyEnergyBalanceCardEditor);
