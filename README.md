# Daily Energy Balance Card für Home Assistant

Eine moderne, responsive Custom Card für Home Assistant zur dynamischen Darstellung der täglichen Energiebilanz in Ihrem Haushalt.

## 🚀 Features

- **Dynamische Balkendiagramme** mit automatisch positionierter Nullinie
- **Responsive Design** - passt sich automatisch an alle Fenstergrößen an
- **Home Assistant Theme-Erkennung** - automatische Anpassung an helles/dunkles Schema
- **Intelligente Skalierung** - optimale Platzausnutzung ohne Überläufe
- **Home Assistant Standard-Farben** für intuitive Farbkodierung
- **Keine Legende oder Zusammenfassung** - maximale Platzausnutzung für die Balken
- **Smooth Hover-Effekte** für bessere Benutzerinteraktion

## 📦 Installation

### Über HACS (Empfohlen)

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

### Manuelle Installation

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

## ⚙️ Konfiguration

### Basis-Konfiguration

```yaml
type: custom:daily-energy-balance-card
title: "Daily Energy Balance"
entities:
  pv: sensor.pv_generation
  purchase: sensor.grid_purchase
  discharge: sensor.battery_discharge
  house: sensor.house_consumption
  car: sensor.car_consumption
  sale: sensor.grid_sale
  charge: sensor.battery_charge
colors:
  pv: "#f39c12"        # Orange für PV
  purchase: "#e74c3c"   # Rot für Netzbezug
  discharge: "#27ae60"  # Grün für Batterie-Entladung
  house: "#3498db"      # Blau für Hausverbrauch
  car: "#9b59b6"        # Lila für Auto
  sale: "#e67e22"       # Orange-Rot für Netzeinspeisung
  charge: "#2ecc71"     # Hellgrün für Batterie-Ladung
```

### Vollständige Konfiguration

```yaml
type: custom:daily-energy-balance-card
title: "Tägliche Energiebilanz"
entities:
  pv: sensor.pv_generation
  purchase: sensor.grid_purchase
  discharge: sensor.battery_discharge
  house: sensor.house_consumption
  car: sensor.car_consumption
  sale: sensor.grid_sale
  charge: sensor.battery_charge
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

## 🔧 Konfigurationsoptionen

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|--------------|
| `title` | string | "Daily Energy Balance" | Titel der Card |
| `entities` | object | - | Entity-IDs für verschiedene Energiequellen |
| `colors` | object | Home Assistant Standard | Farben für die Balken |

### Entity-Konfiguration

Die Card erwartet folgende Sensoren:

- **`pv`**: Photovoltaik-Erzeugung (kWh)
- **`purchase`**: Netzbezug (kWh)
- **`discharge`**: Batterie-Entladung (kWh)
- **`house`**: Hausverbrauch (kWh)
- **`car`**: Auto-Verbrauch (kWh, optional)
- **`sale`**: Netzeinspeisung (kWh)
- **`charge`**: Batterie-Ladung (kWh)

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

## 📊 Darstellung

Die Card zeigt eine intuitive Darstellung der Energiebilanz:

### **Obere Balken** (Energiequellen):
- **PV** (Orange) - Photovoltaik-Erzeugung
- **Kauf** (Rot) - Netzbezug
- **Batterie** (Grün) - Batterie-Entladung

### **Untere Balken** (Energieverbrauch):
- **Haus** (Blau) - Hausverbrauch
- **Verkauf** (Orange-Rot) - Netzeinspeisung
- **Batterie** (Hellgrün) - Batterie-Ladung

### **Intelligente Features:**
- **Dynamische Nullinie** - positioniert sich automatisch basierend auf den Daten
- **Responsive Skalierung** - passt sich an alle Fenstergrößen an
- **Optimale Platzausnutzung** - keine Überläufe oder übermäßige Abstände
- **Theme-Erkennung** - automatische Anpassung an helles/dunkles Schema

## 🎨 Theme-Unterstützung

Die Card erkennt automatisch das Home Assistant Farbschema:

### **Light Mode:**
- Weißer Hintergrund
- Schwarze Nullinie und Texte
- Graue Labels und Werte

### **Dark Mode:**
- Dunkler Hintergrund
- Weiße Nullinie und Texte
- Hellgraue Labels und Werte

## 📱 Responsive Design

Die Card passt sich automatisch an verschiedene Bildschirmgrößen an:

- **Große Bildschirme:** Optimale Ausnutzung mit 95% der verfügbaren Höhe
- **Kleine Bildschirme:** Intelligente Skalierung ohne Überläufe
- **Mobile Geräte:** Perfekte Darstellung auf allen Auflösungen

## 🔍 Troubleshooting

### Card wird nicht angezeigt

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

### Balken werden nicht angezeigt

1. **Sensor-Werte prüfen**:
   - Stellen Sie sicher, dass die Sensoren gültige numerische Werte haben
   - Testen Sie: `{{ states('sensor.pv_generation') | float }}`

2. **Einheiten überprüfen**:
   - Alle Sensoren sollten in kWh sein
   - Keine negativen Werte

### Theme wird nicht erkannt

1. **Home Assistant Version**:
   - Mindestens Version 2023.8.0 erforderlich
   - Aktuellste Version empfohlen

2. **CSS-Variablen**:
   - Die Card verwendet Standard Home Assistant CSS-Variablen
   - Funktioniert automatisch in allen HA-Installationen

## 🧪 Testen

Öffnen Sie `HA-Card-Test.html` in Ihrem Browser zum lokalen Testen:

- **Theme-Umschalter** für Dark/Light Mode
- **Dynamische Größenanpassung**
- **Zufällige Daten-Generator**
- **Vollständige Funktionalität**

## 🤝 Beitragen

Verbesserungsvorschläge und Bug-Reports sind willkommen! Erstellen Sie einfach ein Issue oder einen Pull Request.

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz.

## 🙏 Danksagungen

- Home Assistant Community für die großartige Plattform
- HACS für die einfache Integration
- Alle Mitwirkenden und Tester

---

**Viel Spaß mit Ihrer Daily Energy Balance Card! ⚡** 