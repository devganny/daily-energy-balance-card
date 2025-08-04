# Energy Distribution Card für Home Assistant

Eine moderne, animierte Custom Card für Home Assistant zur dynamischen Darstellung der Energieverteilung in Ihrem Haushalt.

## 🚀 Features

- **Dynamische Balkendiagramme** mit horizontaler Baseline
- **Farbkodierte Darstellung** für verschiedene Energiequellen und -verbraucher
- **Smooth Animationen** und Hover-Effekte
- **Automatische Updates** in konfigurierbaren Intervallen
- **Responsive Design** für verschiedene Bildschirmgrößen
- **Detaillierte Zusammenfassung** mit Autarkiegrad
- **Zwei Versionen**: Basic und Enhanced

## 📦 Installation

### Option 1: Über HACS (Empfohlen)

1. **HACS installieren** (falls noch nicht geschehen):
   - Gehen Sie zu [HACS](https://hacs.xyz/) und folgen Sie der Installationsanleitung

2. **Custom Repository hinzufügen**:
   - Öffnen Sie HACS in Home Assistant
   - Gehen Sie zu "Frontend" → "Custom Repositories"
   - Fügen Sie dieses Repository hinzu

3. **Card installieren**:
   - Suchen Sie nach "Energy Distribution Card"
   - Klicken Sie auf "Download"
   - Starten Sie Home Assistant neu

### Option 2: Manuelle Installation

1. **Dateien herunterladen**:
   - Laden Sie `energy-distribution-card.js` oder `energy-distribution-card-enhanced.js` herunter

2. **In Home Assistant einbinden**:
   - Kopieren Sie die Datei in den `www/` Ordner Ihres Home Assistant
   - Fügen Sie folgendes zu Ihrer `configuration.yaml` hinzu:

```yaml
frontend:
  extra_module_url:
    - /local/energy-distribution-card.js
    # oder
    - /local/energy-distribution-card-enhanced.js
```

## ⚙️ Konfiguration

### Basic Card

```yaml
type: custom:energy-distribution-card
title: "Energie heute (KW/h)"
entities:
  pv: sensor.pv_generation
  purchase: sensor.grid_purchase
  discharge: sensor.battery_discharge
  house: sensor.house_consumption
  car: sensor.car_consumption
  sale: sensor.grid_sale
  charge: sensor.battery_charge
```

### Enhanced Card

```yaml
type: custom:energy-distribution-card-enhanced
title: "Energie heute (KW/h)"
show_animations: true
update_interval: 30
entities:
  pv: sensor.pv_generation
  purchase: sensor.grid_purchase
  discharge: sensor.battery_discharge
  house: sensor.house_consumption
  car: sensor.car_consumption
  sale: sensor.grid_sale
  charge: sensor.battery_charge
colors:
  pv: "#FFD700"
  purchase: "#FF4444"
  discharge: "#44FF44"
  house: "#FFFFFF"
  car: "#CCCCCC"
  sale: "#FF6666"
  charge: "#66FF66"
labels:
  pv: "PV"
  purchase: "Kauf"
  discharge: "Entladen"
  house: "Haus"
  car: "Auto"
  sale: "Verkauf"
  charge: "Laden"
```

## 🔧 Konfigurationsoptionen

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|--------------|
| `title` | string | "Energie heute (KW/h)" | Titel der Card |
| `show_animations` | boolean | true | Animationen aktivieren/deaktivieren |
| `update_interval` | number | 30 | Update-Intervall in Sekunden |
| `entities` | object | - | Entity-IDs für verschiedene Energiequellen |
| `colors` | object | - | Farben für die Balken |
| `labels` | object | - | Benutzerdefinierte Labels |

### Entity-Konfiguration

Die Card erwartet folgende Sensoren:

- **`pv`**: Photovoltaik-Erzeugung
- **`purchase`**: Netzbezug
- **`discharge`**: Batterie-Entladung
- **`house`**: Hausverbrauch
- **`car`**: Auto-Verbrauch (optional)
- **`sale`**: Netzeinspeisung
- **`charge`**: Batterie-Ladung

### Farben anpassen

```yaml
colors:
  pv: "#FFD700"        # Gelb für PV
  purchase: "#FF4444"   # Rot für Netzbezug
  discharge: "#44FF44"  # Grün für Batterie-Entladung
  house: "#FFFFFF"      # Weiß für Hausverbrauch
  car: "#CCCCCC"        # Grau für Auto
  sale: "#FF6666"       # Hellrot für Einspeisung
  charge: "#66FF66"     # Hellgrün für Batterie-Ladung
```

## 📊 Darstellung

Die Card zeigt:

1. **Obere Balken** (Energiequellen):
   - Photovoltaik (gelb)
   - Netzbezug (rot)
   - Batterie-Entladung (grün)

2. **Untere Balken** (Energieverbrauch):
   - Hausverbrauch (weiß)
   - Netzeinspeisung (rot)
   - Batterie-Ladung (grün)

3. **Zusammenfassung**:
   - Gesamterzeugung
   - Gesamtverbrauch
   - Netzsaldo
   - Autarkiegrad

## 🎨 Anpassungen

### Dunkles Theme

Die Card ist standardmäßig für dunkle Themes optimiert. Für helle Themes können Sie das CSS anpassen:

```yaml
style: |
  ha-card {
    background: white !important;
    color: black !important;
  }
```

### Größe anpassen

```yaml
style: |
  ha-card {
    width: 400px;
    height: 600px;
  }
```

## 🔍 Troubleshooting

### Card wird nicht angezeigt

1. **Überprüfen Sie die Entity-IDs**:
   - Stellen Sie sicher, dass alle konfigurierten Sensoren existieren
   - Testen Sie die Sensoren in der Developer Tools

2. **Browser-Cache leeren**:
   - Drücken Sie `Ctrl+F5` (Windows) oder `Cmd+Shift+R` (Mac)

3. **Logs überprüfen**:
   - Schauen Sie in die Browser-Konsole für JavaScript-Fehler

### Werte werden nicht aktualisiert

1. **Update-Intervall prüfen**:
   - Erhöhen Sie `update_interval` auf 60 Sekunden

2. **Sensor-Updates**:
   - Stellen Sie sicher, dass Ihre Sensoren regelmäßig aktualisiert werden

## 🤝 Beitragen

Verbesserungsvorschläge und Bug-Reports sind willkommen! Erstellen Sie einfach ein Issue oder einen Pull Request.

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz.

## 🙏 Danksagungen

- Home Assistant Community für die großartige Plattform
- HACS für die einfache Integration
- Alle Mitwirkenden und Tester

---

**Viel Spaß mit Ihrer neuen Energy Distribution Card! ⚡** 