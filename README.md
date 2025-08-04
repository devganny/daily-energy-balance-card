# Daily Energy Balance Card für Home Assistant
# Daily Energy Balance Card for Home Assistant

[🇩🇪 Deutsch](#deutsch) | [🇺🇸 English](#english)

---

## 🇩🇪 Deutsch

Eine moderne, responsive Custom Card für Home Assistant zur dynamischen Darstellung der täglichen Energiebilanz in Ihrem Haushalt.

### 🚀 Features

- **Dynamische Balkendiagramme** mit automatisch positionierter Nullinie
- **Responsive Design** - passt sich automatisch an alle Fenstergrößen an
- **Home Assistant Theme-Erkennung** - automatische Anpassung an helles/dunkles Schema
- **Intelligente Skalierung** - optimale Platzausnutzung ohne Überläufe
- **Home Assistant Standard-Farben** für intuitive Farbkodierung
- **Keine Legende oder Zusammenfassung** - maximale Platzausnutzung für die Balken
- **Smooth Hover-Effekte** für bessere Benutzerinteraktion

### 📦 Installation

#### Über HACS (Empfohlen)

1. **HACS installieren** (falls noch nicht geschehen):
   - Gehen Sie zu [HACS](https://hacs.xyz/) und folgen Sie der Installationsanleitung

2. **Custom Repository hinzufügen**:
   - Öffnen Sie HACS in Home Assistant
   - Gehen Sie zu "Frontend" → "Custom Repositories"
   - Fügen Sie dieses Repository hinzu

3. **Card installieren**:
   - Suchen Sie nach "Daily Energy Balance Card"
   - Klicken Sie auf "Download"
   - Starten Sie Home Assistant neu

#### Manuelle Installation

1. **Datei herunterladen**:
   - Laden Sie `daily-energy-balance-card.js` herunter

2. **In Home Assistant einbinden**:
   - Kopieren Sie die Datei in den `www/` Ordner Ihres Home Assistant
   - Fügen Sie folgendes zu Ihrer `configuration.yaml` hinzu:

```yaml
frontend:
  extra_module_url:
    - /local/daily-energy-balance-card.js
```

### ⚙️ Konfiguration

#### Basis-Konfiguration

```yaml
type: custom:daily-energy-balance-card
title: "Daily Energy Balance"
# Alle Entities sind optional - Standard-Sensoren werden automatisch verwendet
```

#### Vollständige Konfiguration

```yaml
type: custom:daily-energy-balance-card
title: "Tägliche Energiebilanz"
entities:
  pv: sensor.energy_solar
  purchase: sensor.energy_grid_in
  discharge: sensor.energy_battery_out
  house: sensor.energy_consumption_daily
  car: sensor.car_consumption
  sale: sensor.energy_grid_out
  charge: sensor.energy_battery_in
labels:
  pv: "PV"
  purchase: "Kauf"
  discharge: "Batterie"
  house: "Haus"
  car: "Auto"
  sale: "Verkauf"
  charge: "Batterie"
colors:
  pv: "#f39c12"
  purchase: "#e74c3c"
  discharge: "#27ae60"
  house: "#3498db"
  car: "#9b59b6"
  sale: "#e67e22"
  charge: "#2ecc71"
style: |
  ha-card {
    width: 100%;
    height: 400px;
  }
```

### 🔧 Konfigurationsoptionen

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|--------------|
| `title` | string | "Daily Energy Balance" | Titel der Card |
| `entities` | object | - | Entity-IDs für verschiedene Energiequellen |
| `colors` | object | Home Assistant Standard | Farben für die Balken |

### Entity-Konfiguration

Die Card verwendet standardmäßig folgende Sensoren (alle optional):

- **`pv`**: `sensor.energy_solar` - Photovoltaik-Erzeugung (kWh)
- **`purchase`**: `sensor.energy_grid_in` - Netzbezug (kWh)
- **`discharge`**: `sensor.energy_battery_out` - Batterie-Entladung (kWh)
- **`house`**: `sensor.energy_consumption_daily` - Hausverbrauch (kWh)
- **`car`**: `sensor.car_consumption` - Auto-Verbrauch (kWh, optional)
- **`sale`**: `sensor.energy_grid_out` - Netzeinspeisung (kWh)
- **`charge`**: `sensor.energy_battery_in` - Batterie-Ladung (kWh)

**Hinweis:** Alle Entities sind optional. Falls nicht angegeben, werden die Standard-Sensoren verwendet.

### Home Assistant Standard-Farben

```yaml
colors:
  pv: "#f39c12"        # Orange - typisch für Sonnenenergie
  purchase: "#e74c3c"   # Rot - negative Kosten
  discharge: "#27ae60"  # Grün - positive Energie
  house: "#3498db"      # Blau - neutraler Verbrauch
  car: "#9b59b6"        # Lila - spezieller Verbrauch
  sale: "#e67e22"       # Orange-Rot - positive Einnahmen
  charge: "#2ecc71"     # Hellgrün - positive Ladung
```

### 📊 Darstellung

Die Card zeigt eine intuitive Darstellung der Energiebilanz:

#### **Obere Balken** (Energiequellen):
- **PV** (Orange) - Photovoltaik-Erzeugung
- **Kauf** (Rot) - Netzbezug
- **Batterie** (Grün) - Batterie-Entladung

#### **Untere Balken** (Energieverbrauch):
- **Haus** (Blau) - Hausverbrauch
- **Verkauf** (Orange-Rot) - Netzeinspeisung
- **Batterie** (Hellgrün) - Batterie-Ladung

#### **Intelligente Features:**
- **Dynamische Nullinie** - positioniert sich automatisch basierend auf den Daten
- **Responsive Skalierung** - passt sich an alle Fenstergrößen an
- **Optimale Platzausnutzung** - keine Überläufe oder übermäßige Abstände
- **Theme-Erkennung** - automatische Anpassung an helles/dunkles Schema

### 🎨 Theme-Unterstützung

Die Card erkennt automatisch das Home Assistant Farbschema:

#### **Light Mode:**
- Weißer Hintergrund
- Schwarze Nullinie und Texte
- Graue Labels und Werte

#### **Dark Mode:**
- Dunkler Hintergrund
- Weiße Nullinie und Texte
- Hellgraue Labels und Werte

### 📱 Responsive Design

Die Card passt sich automatisch an verschiedene Bildschirmgrößen an:

- **Große Bildschirme:** Optimale Ausnutzung mit 95% der verfügbaren Höhe
- **Kleine Bildschirme:** Intelligente Skalierung ohne Überläufe
- **Mobile Geräte:** Perfekte Darstellung auf allen Auflösungen

### 🔍 Troubleshooting

#### Card wird nicht angezeigt

1. **Entity-IDs überprüfen**:
   ```yaml
   # Testen Sie in Developer Tools
   sensor.pv_generation
   sensor.grid_purchase
   # etc.
   ```

2. **Browser-Cache leeren**:
   - `Ctrl+F5` (Windows) oder `Cmd+Shift+R` (Mac)

3. **Logs überprüfen**:
   - Browser-Konsole für JavaScript-Fehler

#### Balken werden nicht angezeigt

1. **Sensor-Werte prüfen**:
   - Stellen Sie sicher, dass die Sensoren gültige numerische Werte haben
   - Testen Sie: `{{ states('sensor.pv_generation') | float }}`

2. **Einheiten überprüfen**:
   - Alle Sensoren sollten in kWh sein
   - Keine negativen Werte

#### Theme wird nicht erkannt

1. **Home Assistant Version**:
   - Mindestens Version 2023.8.0 erforderlich
   - Aktuellste Version empfohlen

2. **CSS-Variablen**:
   - Die Card verwendet Standard Home Assistant CSS-Variablen
   - Funktioniert automatisch in allen HA-Installationen

### 🧪 Testen

Öffnen Sie `HA-Card-Test.html` in Ihrem Browser zum lokalen Testen:

- **Theme-Umschalter** für Dark/Light Mode
- **Dynamische Größenanpassung**
- **Zufällige Daten-Generator**
- **Vollständige Funktionalität**

---

## 🇺🇸 English

A modern, responsive custom card for Home Assistant to dynamically display the daily energy balance in your household.

### 🚀 Features

- **Dynamic bar charts** with automatically positioned baseline
- **Responsive design** - automatically adapts to all window sizes
- **Home Assistant theme detection** - automatic adaptation to light/dark scheme
- **Intelligent scaling** - optimal space utilization without overflow
- **Home Assistant standard colors** for intuitive color coding
- **No legend or summary** - maximum space utilization for bars
- **Smooth hover effects** for better user interaction

### 📦 Installation

#### Via HACS (Recommended)

1. **Install HACS** (if not already done):
   - Go to [HACS](https://hacs.xyz/) and follow the installation guide

2. **Add custom repository**:
   - Open HACS in Home Assistant
   - Go to "Frontend" → "Custom Repositories"
   - Add this repository

3. **Install card**:
   - Search for "Daily Energy Balance Card"
   - Click "Download"
   - Restart Home Assistant

#### Manual Installation

1. **Download file**:
   - Download `daily-energy-balance-card.js`

2. **Integrate into Home Assistant**:
   - Copy the file to your Home Assistant `www/` folder
   - Add the following to your `configuration.yaml`:

```yaml
frontend:
  extra_module_url:
    - /local/daily-energy-balance-card.js
```

### ⚙️ Configuration

#### Basic Configuration

```yaml
type: custom:daily-energy-balance-card
title: "Daily Energy Balance"
# All entities are optional - default sensors are used automatically
```

#### Complete Configuration

```yaml
type: custom:daily-energy-balance-card
title: "Daily Energy Balance"
entities:
  pv: sensor.energy_solar
  purchase: sensor.energy_grid_in
  discharge: sensor.energy_battery_out
  house: sensor.energy_consumption_daily
  car: sensor.car_consumption
  sale: sensor.energy_grid_out
  charge: sensor.energy_battery_in
labels:
  pv: "PV"
  purchase: "Purchase"
  discharge: "Battery"
  house: "House"
  car: "Car"
  sale: "Sale"
  charge: "Battery"
colors:
  pv: "#f39c12"
  purchase: "#e74c3c"
  discharge: "#27ae60"
  house: "#3498db"
  car: "#9b59b6"
  sale: "#e67e22"
  charge: "#2ecc71"
style: |
  ha-card {
    width: 100%;
    height: 400px;
  }
```

### 🔧 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | "Daily Energy Balance" | Card title |
| `entities` | object | - | Entity IDs for various energy sources |
| `colors` | object | Home Assistant Standard | Colors for the bars |

### Entity Configuration

The card uses the following default sensors (all optional):

- **`pv`**: `sensor.energy_solar` - Photovoltaic generation (kWh)
- **`purchase`**: `sensor.energy_grid_in` - Grid purchase (kWh)
- **`discharge`**: `sensor.energy_battery_out` - Battery discharge (kWh)
- **`house`**: `sensor.energy_consumption_daily` - House consumption (kWh)
- **`car`**: `sensor.car_consumption` - Car consumption (kWh, optional)
- **`sale`**: `sensor.energy_grid_out` - Grid sale (kWh)
- **`charge`**: `sensor.energy_battery_in` - Battery charge (kWh)

**Note:** All entities are optional. If not specified, default sensors are used.

### Home Assistant Standard Colors

```yaml
colors:
  pv: "#f39c12"        # Orange - typical for solar energy
  purchase: "#e74c3c"   # Red - negative costs
  discharge: "#27ae60"  # Green - positive energy
  house: "#3498db"      # Blue - neutral consumption
  car: "#9b59b6"        # Purple - special consumption
  sale: "#e67e22"       # Orange-red - positive income
  charge: "#2ecc71"     # Light green - positive charging
```

### 📊 Display

The card shows an intuitive representation of the energy balance:

#### **Upper bars** (Energy sources):
- **PV** (Orange) - Photovoltaic generation
- **Purchase** (Red) - Grid purchase
- **Battery** (Green) - Battery discharge

#### **Lower bars** (Energy consumption):
- **House** (Blue) - House consumption
- **Sale** (Orange-red) - Grid sale
- **Battery** (Light green) - Battery charge

#### **Intelligent features:**
- **Dynamic baseline** - automatically positions based on data
- **Responsive scaling** - adapts to all window sizes
- **Optimal space utilization** - no overflow or excessive spacing
- **Theme detection** - automatic adaptation to light/dark scheme

### 🎨 Theme Support

The card automatically detects the Home Assistant color scheme:

#### **Light Mode:**
- White background
- Black baseline and texts
- Gray labels and values

#### **Dark Mode:**
- Dark background
- White baseline and texts
- Light gray labels and values

### 📱 Responsive Design

The card automatically adapts to different screen sizes:

- **Large screens:** Optimal utilization with 95% of available height
- **Small screens:** Intelligent scaling without overflow
- **Mobile devices:** Perfect display on all resolutions

### 🔍 Troubleshooting

#### Card not displayed

1. **Check entity IDs**:
   ```yaml
   # Test in Developer Tools
   sensor.pv_generation
   sensor.grid_purchase
   # etc.
   ```

2. **Clear browser cache**:
   - `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

3. **Check logs**:
   - Browser console for JavaScript errors

#### Bars not displayed

1. **Check sensor values**:
   - Make sure sensors have valid numeric values
   - Test: `{{ states('sensor.pv_generation') | float }}`

2. **Check units**:
   - All sensors should be in kWh
   - No negative values

#### Theme not detected

1. **Home Assistant version**:
   - Minimum version 2023.8.0 required
   - Latest version recommended

2. **CSS variables**:
   - The card uses standard Home Assistant CSS variables
   - Works automatically in all HA installations

### 🧪 Testing

Open `HA-Card-Test.html` in your browser for local testing:

- **Theme switcher** for Dark/Light mode
- **Dynamic size adjustment**
- **Random data generator**
- **Full functionality**

---

## 🤝 Contributing

Verbesserungsvorschläge und Bug-Reports sind willkommen! Erstellen Sie einfach ein Issue oder einen Pull Request.

Improvement suggestions and bug reports are welcome! Simply create an issue or pull request.

## 📄 License

Dieses Projekt steht unter der MIT-Lizenz.

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Home Assistant Community für die großartige Plattform
- HACS für die einfache Integration
- Alle Mitwirkenden und Tester

- Home Assistant Community for the great platform
- HACS for the easy integration
- All contributors and testers

---

**Viel Spaß mit Ihrer Daily Energy Balance Card! ⚡**

**Have fun with your Daily Energy Balance Card! ⚡** 