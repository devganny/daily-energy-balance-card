# Daily Energy Balance Card für Home Assistant
# Daily Energy Balance Card for Home Assistant

[🇩🇪 Deutsch](#deutsch) | [🇺🇸 English](#english)

---

## 🇩🇪 Deutsch

### 🚀 Installation

#### Option 1: HACS (Empfohlen)
1. Stellen Sie sicher, dass [HACS](https://hacs.xyz/) installiert ist
2. Fügen Sie dieses Repository zu HACS hinzu
3. Suchen Sie nach "Daily Energy Balance Card" in HACS
4. Klicken Sie auf "Download"
5. Starten Sie Home Assistant neu

#### Option 2: Manuelle Installation
1. Laden Sie `daily-energy-balance-card.js` herunter
2. Kopieren Sie die Datei in `/config/www/`
3. Fügen Sie zu Ihrer `configuration.yaml` hinzu:
```yaml
frontend:
  extra_module_url:
    - /local/daily-energy-balance-card.js
```
4. Starten Sie Home Assistant neu

### 📋 Konfiguration

#### Minimale Konfiguration
```yaml
type: custom:daily-energy-balance-card
```

#### Vollständige Konfiguration
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
  purchase: "Kauf"
  discharge: "Batterie"
  house: "Haus"
  car: "Auto"
  sale: "Verkauf"
  charge: "Batterie"
```

### 🔧 Konfigurationsoptionen

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|--------------|
| `title` | string | "Daily Energy Balance" | Titel der Card |
| `entities` | object | Standard-Sensoren | Entity-IDs für verschiedene Energiequellen |
| `labels` | object | Standard-Labels | Benutzerdefinierte Labels für die Balken |

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

### Label-Konfiguration

Die Labels können benutzerdefiniert angepasst werden:

```yaml
labels:
  pv: "Solar"
  purchase: "Netzbezug"
  discharge: "Batterie-Entladung"
  house: "Verbrauch"
  car: "Auto"
  sale: "Netzeinspeisung"
  charge: "Batterie-Ladung"
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
- **Helles Theme** - helle Hintergründe und dunkle Texte
- **Dunkles Theme** - dunkle Hintergründe und helle Texte
- **Home Assistant Standard-Farben** - konsistente Darstellung

### 📱 Responsive Design

Die Card passt sich automatisch an verschiedene Bildschirmgrößen an:
- **Desktop** - optimale Darstellung auf großen Bildschirmen
- **Tablet** - angepasste Skalierung für mittlere Bildschirme
- **Mobile** - kompakte Darstellung auf kleinen Bildschirmen

### 🔍 Troubleshooting

#### Card wird nicht angezeigt
1. Überprüfen Sie die Browser-Entwicklertools (F12) auf Fehler
2. Stellen Sie sicher, dass die Datei korrekt in `/config/www/` liegt
3. Überprüfen Sie die `configuration.yaml` Syntax
4. Starten Sie Home Assistant neu

#### Fehlende Daten
1. Überprüfen Sie, ob die Sensor-Entities existieren
2. Stellen Sie sicher, dass die Entities gültige numerische Werte haben
3. Überprüfen Sie die Entity-IDs in der Konfiguration

#### Darstellungsprobleme
1. Löschen Sie den Browser-Cache
2. Überprüfen Sie die Theme-Einstellungen
3. Testen Sie mit der Standard-Konfiguration

### 🧪 Testing

Testen Sie die Card lokal mit der Datei `HA-Card-Test.html`:
1. Öffnen Sie `HA-Card-Test.html` in Ihrem Browser
2. Testen Sie verschiedene Größen und Daten
3. Überprüfen Sie die Console-Logs für Debug-Informationen

---

## 🇺🇸 English

### 🚀 Installation

#### Option 1: HACS (Recommended)
1. Make sure [HACS](https://hacs.xyz/) is installed
2. Add this repository to HACS
3. Search for "Daily Energy Balance Card" in HACS
4. Click "Download"
5. Restart Home Assistant

#### Option 2: Manual Installation
1. Download `daily-energy-balance-card.js`
2. Copy the file to `/config/www/`
3. Add to your `configuration.yaml`:
```yaml
frontend:
  extra_module_url:
    - /local/daily-energy-balance-card.js
```
4. Restart Home Assistant

### 📋 Configuration

#### Minimal Configuration
```yaml
type: custom:daily-energy-balance-card
```

#### Full Configuration
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
```

### 🔧 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | "Daily Energy Balance" | Card title |
| `entities` | object | Default sensors | Entity IDs for various energy sources |
| `labels` | object | Default labels | Custom labels for the bars |

### Entity Configuration

The card uses the following sensors by default (all optional):

- **`pv`**: `sensor.energy_solar` - Photovoltaic generation (kWh)
- **`purchase`**: `sensor.energy_grid_in` - Grid purchase (kWh)
- **`discharge`**: `sensor.energy_battery_out` - Battery discharge (kWh)
- **`house`**: `sensor.energy_consumption_daily` - House consumption (kWh)
- **`car`**: `sensor.car_consumption` - Car consumption (kWh, optional)
- **`sale`**: `sensor.energy_grid_out` - Grid feed-in (kWh)
- **`charge`**: `sensor.energy_battery_in` - Battery charging (kWh)

**Note:** All entities are optional. If not specified, default sensors will be used.

### Label Configuration

Labels can be customized:

```yaml
labels:
  pv: "Solar"
  purchase: "Grid In"
  discharge: "Battery Out"
  house: "Consumption"
  car: "Car"
  sale: "Grid Out"
  charge: "Battery In"
```

### 📊 Display

The card shows an intuitive representation of energy balance:

#### **Upper bars** (Energy sources):
- **PV** (Orange) - Photovoltaic generation
- **Purchase** (Red) - Grid purchase
- **Battery** (Green) - Battery discharge

#### **Lower bars** (Energy consumption):
- **House** (Blue) - House consumption
- **Sale** (Orange-red) - Grid feed-in
- **Battery** (Light green) - Battery charging

#### **Smart Features:**
- **Dynamic baseline** - automatically positioned based on data
- **Responsive scaling** - adapts to all window sizes
- **Optimal space utilization** - no overflows or excessive spacing
- **Theme detection** - automatic adaptation to light/dark scheme

### 🎨 Theme Support

The card automatically detects the Home Assistant color scheme:
- **Light Theme** - light backgrounds and dark text
- **Dark Theme** - dark backgrounds and light text
- **Home Assistant Standard Colors** - consistent appearance

### 📱 Responsive Design

The card automatically adapts to different screen sizes:
- **Desktop** - optimal display on large screens
- **Tablet** - adapted scaling for medium screens
- **Mobile** - compact display on small screens

### 🔍 Troubleshooting

#### Card not displayed
1. Check browser developer tools (F12) for errors
2. Make sure the file is correctly in `/config/www/`
3. Check the `configuration.yaml` syntax
4. Restart Home Assistant

#### Missing data
1. Check if sensor entities exist
2. Make sure entities have valid numeric values
3. Check entity IDs in configuration

#### Display issues
1. Clear browser cache
2. Check theme settings
3. Test with default configuration

### 🧪 Testing

Test the card locally with the file `HA-Card-Test.html`:
1. Open `HA-Card-Test.html` in your browser
2. Test different sizes and data
3. Check console logs for debug information 