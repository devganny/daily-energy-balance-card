# Daily Energy Balance Card

Eine HomeAssistant-Karte zur grafischen Darstellung von kumulierten Leistungsdaten für PV-Anlagen, Batteriespeicher und Netzbezug/-einspeisung.

## Features

- **Echtzeit-Datenvisualisierung**: Zeigt aktuelle Leistungswerte für PV, Netzbezug, Batterie und Verbrauch
- **Responsive Design**: Passt sich automatisch an verschiedene Bildschirmgrößen an
- **Dark/Light Mode**: Unterstützt automatische Skin-Erkennung
- **HACS Integration**: Einfache Installation über HACS
- **Konfigurierbar**: Alle Sensoren und Farben können angepasst werden

## Installation

### Über HACS (empfohlen)

1. Fügen Sie dieses Repository zu HACS hinzu:
   - Gehen Sie zu HACS → Frontend
   - Klicken Sie auf "Repository hinzufügen"
   - Wählen Sie "Custom repository"
   - Geben Sie die URL dieses Repositories ein
   - Wählen Sie "Lovelace" als Kategorie

2. Installieren Sie die Karte über HACS

3. Fügen Sie die Karte zu Ihrem Dashboard hinzu

### Manuelle Installation

1. Laden Sie die Dateien herunter
2. Kopieren Sie den Inhalt von `daily-energy-balance-card.js` in Ihre `configuration.yaml`
3. Fügen Sie die Karte zu Ihrem Dashboard hinzu

## Konfiguration

```yaml
type: custom:daily-energy-balance-card
entities:
  pv_power: sensor.pv_power
  grid_import: sensor.grid_import
  grid_export: sensor.grid_export
  battery_charge: sensor.battery_charge
  battery_discharge: sensor.battery_discharge
  consumption: sensor.consumption
  auto_consumption: sensor.auto_consumption
  skin_mode: sensor.skin_mode
title: "Energiebilanz"
show_title: true
```

## Verfügbare Optionen

| Name | Typ | Standard | Beschreibung |
|------|-----|----------|--------------|
| `entities` | object | **required** | Konfiguration der Sensoren |
| `title` | string | `"Energiebilanz"` | Titel der Karte |
| `show_title` | boolean | `true` | Titel anzeigen/verstecken |
| `box_height` | number | `300` | Höhe der Karte in Pixeln |
| `box_width` | number | `182` | Breite der Karte in Pixeln |

## Entity-Konfiguration

| Entity | Beschreibung | Beispiel |
|--------|--------------|----------|
| `pv_power` | PV-Leistung in kW | `sensor.pv_power` |
| `grid_import` | Netzbezug in kW | `sensor.grid_import` |
| `grid_export` | Netzeinspeisung in kW | `sensor.grid_export` |
| `battery_charge` | Batterie-Ladeleistung in kW | `sensor.battery_charge` |
| `battery_discharge` | Batterie-Entladeleistung in kW | `sensor.battery_discharge` |
| `consumption` | Gesamtverbrauch in kW | `sensor.consumption` |
| `auto_consumption` | Auto-Verbrauch in kW | `sensor.auto_consumption` |
| `skin_mode` | Skin-Modus (0=Auto, 1=Dark, 2=Light) | `sensor.skin_mode` |

## Beispiel-Konfiguration

```yaml
type: custom:daily-energy-balance-card
entities:
  pv_power: sensor.solar_power
  grid_import: sensor.grid_import_power
  grid_export: sensor.grid_export_power
  battery_charge: sensor.battery_charge_power
  battery_discharge: sensor.battery_discharge_power
  consumption: sensor.total_consumption
  auto_consumption: sensor.ev_charging_power
  skin_mode: sensor.theme_mode
title: "Tägliche Energiebilanz"
show_title: true
box_height: 350
box_width: 200
```

## Unterstützung

Bei Fragen oder Problemen erstellen Sie bitte ein Issue in diesem Repository.

## Lizenz

MIT License
