// Energy Distribution Card - Correct Version
// Für Home Assistant über HACS

window.customCards = window.customCards || [];
window.customCards.push({
    type: "energy-distribution-correct",
    name: "Energy Distribution Correct",
    description: "Energieverteilung - korrekte Version mit Stapel-Logik"
});

function EnergyDistributionCorrect() {
    return {
        type: "custom:energy-distribution-correct",
        title: "Energie heute (kWh)",
        entities: {
            pv: "sensor.pv_generation",
            purchase: "sensor.grid_purchase", 
            discharge: "sensor.battery_discharge",
            house: "sensor.house_consumption",
            car: "sensor.car_consumption",
            sale: "sensor.grid_sale",
            charge: "sensor.battery_charge"
        },
        colors: {
            pv: "#FFD700",
            purchase: "#FF4444",
            discharge: "#44FF44",
            house: "#FFFFFF",
            car: "#CCCCCC",
            sale: "#FF6666",
            charge: "#66FF66"
        }
    };
}

// Direkte Render-Funktion
function renderEnergyCard(config, hass, containerHeight = 400) {
    const data = {};
    Object.keys(config.entities).forEach(key => {
        const entityId = config.entities[key];
        const entity = hass.states[entityId];
        data[key] = entity ? parseFloat(entity.state) || 0 : 0;
    });

    // KORREKTE LOGIK: Maximale Höhe aus höchstem oberen + höchstem unteren Balken
    const maxAbove = Math.max(data.pv, data.purchase, data.discharge);
    const maxBelow = Math.max(data.house, data.sale, data.charge);
    const maxTotalHeight = maxAbove + maxBelow; // Summe der höchsten Balken
    
    // Verfügbare Höhe für die Card (dynamisch basierend auf Container-Größe)
    const offsetRand = 20; // Reduzierter Rand für Labels und Werte
    
    // Berechne die tatsächliche verfügbare Höhe (Container minus Padding)
    const availableHeight = containerHeight - 20; // 10px oben + 10px unten
    
    // Pixel pro kWh berechnen - komplett dynamisch
    // Berechne automatisch den optimalen Skalierungsfaktor basierend auf verfügbarer Höhe
    const minReserve = 40; // Minimaler Platz für Labels und Abstände
    const maxUsage = 0.95; // Maximal 95% der Höhe nutzen
    
    // Dynamischer Skalierungsfaktor: Je kleiner das Fenster, desto konservativer
    const scaleFactor = Math.max(0.6, Math.min(maxUsage, (availableHeight - minReserve) / availableHeight));
    const pixelProKWh = (availableHeight * scaleFactor) / maxTotalHeight;
    
    // Null-Linie Position berechnen - komplett dynamisch
    const nullLinePosition = (maxAbove / maxTotalHeight) * (availableHeight * scaleFactor) + 30;
    
    // Funktion zur Berechnung der Balkenhöhe (wie in Ihrem PHP-Code)
    function getBarHeight(value) {
        return Math.max(4, Math.round(value * pixelProKWh));
    }

    return `
        <style>
            .energy-card {
                background: var(--card-background, var(--ha-card-background, linear-gradient(135deg, #2c3e50, #34495e)));
                border-radius: 12px;
                padding: 10px;
                box-shadow: var(--card-shadow, var(--ha-card-box-shadow, 0 8px 32px rgba(0,0,0,0.3)));
                color: var(--primary-text-color, white);
                font-family: 'Roboto', sans-serif;
                height: 100%;
                display: flex;
                flex-direction: column;
            }
            

            
            .chart-container {
                position: relative;
                flex: 1;
                min-height: ${Math.max(availableHeight, 300)}px;
                margin: 0;
                height: 100%;
            }
            
            .baseline {
                position: absolute;
                top: ${nullLinePosition}px;
                left: 0;
                right: 0;
                height: 2px;
                background: var(--primary-text-color, white);
                z-index: 1;
            }
            
            .bars-container {
                position: absolute;
                left: 0;
                right: 0;
                display: flex;
                justify-content: space-around;
                padding: 0 10px;
            }
            
            .bar-group {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
                width: 100%;
                flex: 1;
                min-width: 40px;
                margin: 0 1px;
            }
            
            .bars-container.above {
                top: 0;
                height: ${nullLinePosition - 2}px;
                align-items: flex-end;
                padding-bottom: 26px;
            }
            
            .bars-container.below {
                top: ${nullLinePosition + 2}px;
                height: ${availableHeight - nullLinePosition - 2}px;
                align-items: flex-start;
                padding-top: 2px;
            }
            
            .bar {
                border-radius: 4px;
                transition: all 0.3s ease;
                position: relative;
                min-width: 40px;
                width: 100%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                margin-bottom: 2px;
            }
            
            .bar.above {
                margin-bottom: 2px;
            }
            
            .bar.below {
                margin-top: 2px;
            }
            
            .bar-group.above {
                flex-direction: column-reverse;
            }
            
            .bar:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 16px rgba(0,0,0,0.4);
            }
            
            .bar-label {
                font-size: 11px;
                font-weight: 500;
                text-align: center;
                margin-top: 0px;
                color: var(--secondary-text-color, #bdc3c7);
            }
            
            .bar-value {
                position: absolute;
                font-size: 10px;
                font-weight: 600;
                text-align: center;
                width: 100%;
                color: var(--secondary-text-color, #bdc3c7);
            }
            
            .bar-value.above {
                position: relative;
                bottom: auto;
                top: auto;
                margin-bottom: 4px;
            }
            
            .bar-value.below {
                position: relative;
                bottom: auto;
                top: auto;
                margin-top: 0px;
            }
        </style>
        
        <div class="energy-card">
            <div class="chart-container">
                <div class="baseline"></div>
                <div class="bars-container above">
                    <div class="bar-group above">
                        <div class="bar above" style="
                            height: ${getBarHeight(data.pv)}px;
                            background: ${config.colors.pv};
                        "></div>
                        <div class="bar-value above">${data.pv.toFixed(1)}</div>
                        <div class="bar-label">PV</div>
                    </div>
                    <div class="bar-group above">
                        <div class="bar above" style="
                            height: ${getBarHeight(data.purchase)}px;
                            background: ${config.colors.purchase};
                        "></div>
                        <div class="bar-value above">${data.purchase.toFixed(1)}</div>
                        <div class="bar-label">Kauf</div>
                    </div>
                    <div class="bar-group above">
                        <div class="bar above" style="
                            height: ${getBarHeight(data.discharge)}px;
                            background: ${config.colors.discharge};
                        "></div>
                        <div class="bar-value above">${data.discharge.toFixed(1)}</div>
                        <div class="bar-label">Entladen</div>
                    </div>
                </div>
                <div class="bars-container below">
                    <div class="bar-group">
                        <div class="bar below" style="
                            height: ${getBarHeight(data.house)}px;
                            background: ${config.colors.house};
                        "></div>
                        <div class="bar-label">Haus</div>
                        <div class="bar-value below">${data.house.toFixed(1)}</div>
                    </div>
                    <div class="bar-group">
                        <div class="bar below" style="
                            height: ${getBarHeight(data.sale)}px;
                            background: ${config.colors.sale};
                        "></div>
                        <div class="bar-label">Verkauf</div>
                        <div class="bar-value below">${data.sale.toFixed(1)}</div>
                    </div>
                    <div class="bar-group">
                        <div class="bar below" style="
                            height: ${getBarHeight(data.charge)}px;
                            background: ${config.colors.charge};
                        "></div>
                        <div class="bar-label">Laden</div>
                        <div class="bar-value below">${data.charge.toFixed(1)}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
} 