class EnergyFlowCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error('Please define entities');
    }
    this.config = config;
  }

  set hass(hass) {
    this._hass = hass;
    this.updateCard();
  }

  updateCard() {
    if (!this._hass || !this.config) return;

    const config = this.config;

    // Entitäten auslesen
    const data = {
      pv: parseFloat(this._hass.states[config.entities.pv]?.state) || 0,
      netIn: parseFloat(this._hass.states[config.entities.grid_in]?.state) || 0,
      batteryOut: parseFloat(this._hass.states[config.entities.battery_out]?.state) || 0,
      house: parseFloat(this._hass.states[config.entities.house]?.state) || 0,
      car: parseFloat(this._hass.states[config.entities.car]?.state) || 0,
      netOut: parseFloat(this._hass.states[config.entities.grid_out]?.state) || 0,
      batteryIn: parseFloat(this._hass.states[config.entities.battery_in]?.state) || 0
    };

    // Theme Detection
    const isDark = this._hass.themes.darkMode;

    // Größe aus Config oder Default
    const width = config.width || 400;
    const height = config.height || 600;

    // Farben (Home Assistant Standard oder aus Config)
    // Logik: Spezifische Farben (grid_in, battery_out) haben Vorrang vor allgemeinen (net, battery)
    const defaultColors = {
      pv: isDark ? '#ffc800' : '#ff9800',
      net: isDark ? '#488fc2' : '#0288d1',
      battery: isDark ? '#4db6ac' : '#00897b',
      house: isDark ? '#8e24aa' : '#7b1fa2',
      car: isDark ? '#e53935' : '#c62828'
    };

    const colors = {
      pv: config.colors?.pv || defaultColors.pv,
      grid_in: config.colors?.grid_in || config.colors?.net || defaultColors.net,
      grid_out: config.colors?.grid_out || config.colors?.net || defaultColors.net,
      battery_in: config.colors?.battery_in || config.colors?.battery || defaultColors.battery,
      battery_out: config.colors?.battery_out || config.colors?.battery || defaultColors.battery,
      house: config.colors?.house || defaultColors.house,
      car: config.colors?.car || defaultColors.car
    };

    const textColor = isDark ? '#e1e1e1' : '#212121';
    const lineColor = isDark ? '#4d4d4d' : '#d0d0d0';

    // Berechnungen
    const offsetTop = 50;
    const offsetBottom = 50;
    const barWidth = Math.floor((width - 80) / 3);

    const maxIn = Math.max(data.pv, data.netIn, data.batteryOut);
    const maxOut = Math.max(data.house + data.car, data.netOut, data.batteryIn);
    const pixelPerKWh = (height - offsetTop - offsetBottom) / (maxIn + maxOut);
    const zeroLineY = offsetTop + (maxIn * pixelPerKWh);

    // Balken berechnen
    const bars = {
      pv: {
        x: 20,
        y: zeroLineY - (data.pv * pixelPerKWh) - 5,
        height: data.pv * pixelPerKWh,
        color: colors.pv,
        label: 'PV',
        value: data.pv
      },
      netIn: {
        x: 20 + barWidth + 20,
        y: zeroLineY - (data.netIn * pixelPerKWh) - 5,
        height: data.netIn * pixelPerKWh,
        color: colors.grid_in,
        label: 'Kauf',
        value: data.netIn
      },
      batteryOut: {
        x: 20 + 2 * (barWidth + 20),
        y: zeroLineY - (data.batteryOut * pixelPerKWh) - 5,
        height: data.batteryOut * pixelPerKWh,
        color: colors.battery_out,
        label: 'Entladen',
        value: data.batteryOut
      },
      consumption: {
        x: 20,
        y: zeroLineY + 6,
        heightHouse: data.house * pixelPerKWh,
        heightCar: data.car * pixelPerKWh
      },
      netOut: {
        x: 20 + barWidth + 20,
        y: zeroLineY + 6,
        height: data.netOut * pixelPerKWh,
        color: colors.grid_out,
        label: 'Verkauf',
        value: data.netOut
      },
      batteryIn: {
        x: 20 + 2 * (barWidth + 20),
        y: zeroLineY + 6,
        height: data.batteryIn * pixelPerKWh,
        color: colors.battery_in,
        label: 'Laden',
        value: data.batteryIn
      }
    };

    // HTML rendern
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        ha-card {
          padding: 16px;
        }
        .energy-title {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 16px;
          color: ${textColor};
        }
        svg {
          width: 100%;
          height: auto;
        }
      </style>
      <ha-card>
        <div class="energy-title">${config.title || 'Energie heute (kWh)'}</div>
        <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <!-- Nulllinie -->
          <line x1="10" y1="${zeroLineY}" x2="${width - 10}" y2="${zeroLineY}"
                stroke="${lineColor}" stroke-width="2"/>

          <!-- PV Balken -->
          <rect x="${bars.pv.x}" y="${bars.pv.y}" width="${barWidth}" height="${bars.pv.height}"
                fill="${bars.pv.color}" stroke="${bars.pv.color}" stroke-width="3"/>
          <text x="${bars.pv.x + barWidth/2}" y="${bars.pv.y - 25}"
                fill="${textColor}" font-size="11" font-weight="bold" text-anchor="middle">
            ${bars.pv.label}
          </text>
          <text x="${bars.pv.x + barWidth/2}" y="${bars.pv.y - 10}"
                fill="${textColor}" font-size="10" text-anchor="middle">
            ${bars.pv.value.toFixed(1)}
          </text>

          <!-- Netz Kauf -->
          <rect x="${bars.netIn.x}" y="${bars.netIn.y}" width="${barWidth}" height="${bars.netIn.height}"
                fill="${bars.netIn.color}" stroke="${bars.netIn.color}" stroke-width="3"/>
          <text x="${bars.netIn.x + barWidth/2}" y="${bars.netIn.y - 25}"
                fill="${textColor}" font-size="11" font-weight="bold" text-anchor="middle">
            ${bars.netIn.label}
          </text>
          <text x="${bars.netIn.x + barWidth/2}" y="${bars.netIn.y - 10}"
                fill="${textColor}" font-size="10" text-anchor="middle">
            ${bars.netIn.value.toFixed(1)}
          </text>

          <!-- Batterie Entladen -->
          <rect x="${bars.batteryOut.x}" y="${bars.batteryOut.y}" width="${barWidth}" height="${bars.batteryOut.height}"
                fill="${bars.batteryOut.color}" stroke="${bars.batteryOut.color}" stroke-width="3"/>
          <text x="${bars.batteryOut.x + barWidth/2}" y="${bars.batteryOut.y - 25}"
                fill="${textColor}" font-size="11" font-weight="bold" text-anchor="middle">
            ${bars.batteryOut.label}
          </text>
          <text x="${bars.batteryOut.x + barWidth/2}" y="${bars.batteryOut.y - 10}"
                fill="${textColor}" font-size="10" text-anchor="middle">
            ${bars.batteryOut.value.toFixed(1)}
          </text>

          <!-- Verbrauch Haus -->
          <rect x="${bars.consumption.x}" y="${bars.consumption.y}" width="${barWidth}"
                height="${bars.consumption.heightHouse}"
                fill="${colors.house}" stroke="${colors.house}" stroke-width="3"/>

          <!-- Verbrauch Auto -->
          <rect x="${bars.consumption.x}" y="${bars.consumption.y + bars.consumption.heightHouse}"
                width="${barWidth}" height="${bars.consumption.heightCar}"
                fill="${colors.car}" stroke="${colors.car}" stroke-width="3"/>

          <text x="${bars.consumption.x + barWidth/2 - 25}"
                y="${bars.consumption.y + bars.consumption.heightHouse + bars.consumption.heightCar + 20}"
                fill="${textColor}" font-size="11" font-weight="bold" text-anchor="middle">
            Haus /
          </text>
          <text x="${bars.consumption.x + barWidth/2 + 25}"
                y="${bars.consumption.y + bars.consumption.heightHouse + bars.consumption.heightCar + 20}"
                fill="${colors.car}" font-size="11" font-weight="bold" text-anchor="middle">
            Auto
          </text>
          <text x="${bars.consumption.x + barWidth/2 - 5}"
                y="${bars.consumption.y + bars.consumption.heightHouse + bars.consumption.heightCar + 35}"
                fill="${textColor}" font-size="10" text-anchor="end">
            ${data.house.toFixed(1)} /
          </text>
          <text x="${bars.consumption.x + barWidth/2 + 5}"
                y="${bars.consumption.y + bars.consumption.heightHouse + bars.consumption.heightCar + 35}"
                fill="${colors.car}" font-size="10" text-anchor="start">
            ${data.car.toFixed(1)}
          </text>

          <!-- Netz Verkauf -->
          <rect x="${bars.netOut.x}" y="${bars.netOut.y}" width="${barWidth}" height="${bars.netOut.height}"
                fill="${bars.netOut.color}" stroke="${bars.netOut.color}" stroke-width="3"/>
          <text x="${bars.netOut.x + barWidth/2}" y="${bars.netOut.y + bars.netOut.height + 20}"
                fill="${textColor}" font-size="11" font-weight="bold" text-anchor="middle">
            ${bars.netOut.label}
          </text>
          <text x="${bars.netOut.x + barWidth/2}" y="${bars.netOut.y + bars.netOut.height + 35}"
                fill="${textColor}" font-size="10" text-anchor="middle">
            ${bars.netOut.value.toFixed(1)}
          </text>

          <!-- Batterie Laden -->
          <rect x="${bars.batteryIn.x}" y="${bars.batteryIn.y}" width="${barWidth}" height="${bars.batteryIn.height}"
                fill="${bars.batteryIn.color}" stroke="${bars.batteryIn.color}" stroke-width="3"/>
          <text x="${bars.batteryIn.x + barWidth/2}" y="${bars.batteryIn.y + bars.batteryIn.height + 20}"
                fill="${textColor}" font-size="11" font-weight="bold" text-anchor="middle">
            ${bars.batteryIn.label}
          </text>
          <text x="${bars.batteryIn.x + barWidth/2}" y="${bars.batteryIn.y + bars.batteryIn.height + 35}"
                fill="${textColor}" font-size="10" text-anchor="middle">
            ${bars.batteryIn.value.toFixed(1)}
          </text>
        </svg>
      </ha-card>
    `;
  }

  getCardSize() {
    return 6;
  }
}

customElements.define('energy-flow-card', EnergyFlowCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'energy-flow-card',
  name: 'Energy Flow Card',
  description: 'Visualisierung von Energieflüssen'
});
