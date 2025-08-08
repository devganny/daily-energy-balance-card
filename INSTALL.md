# Installationsanleitung - Daily Energy Balance Card

## Voraussetzungen

- HomeAssistant Version 2023.8.0 oder höher
- HACS (Home Assistant Community Store) installiert
- Sensoren für PV-Leistung, Netzbezug, Batterie und Verbrauch konfiguriert

## Installation über HACS (empfohlen)

### 1. HACS Repository hinzufügen

1. Öffnen Sie HomeAssistant in Ihrem Browser
2. Navigieren Sie zu **HACS** → **Frontend**
3. Klicken Sie auf **"Repository hinzufügen"**
4. Wählen Sie **"Custom repository"**
5. Geben Sie die URL dieses Repositories ein:
   ```
   https://github.com/your-username/daily-energy-balance-card
   ```
6. Wählen Sie **"Lovelace"** als Kategorie
7. Klicken Sie auf **"Hinzufügen"**

### 2. Karte installieren

1. Suchen Sie nach **"Daily Energy Balance Card"** in der HACS-Übersicht
2. Klicken Sie auf die Karte
3. Klicken Sie auf **"Download"**
4. Warten Sie, bis der Download abgeschlossen ist
5. Starten Sie HomeAssistant neu

### 3. Karte zu Dashboard hinzufügen

1. Öffnen Sie Ihr Dashboard im Bearbeitungsmodus
2. Klicken Sie auf **"Karte hinzufügen"**
3. Wählen Sie **"Daily Energy Balance Card"**
4. Konfigurieren Sie die erforderlichen Sensoren (siehe Konfiguration)
5. Speichern Sie die Karte

## Manuelle Installation

### 1. Dateien herunterladen

1. Laden Sie alle Dateien aus diesem Repository herunter
2. Kopieren Sie `daily-energy-balance-card.js` in Ihren `config/www/` Ordner

### 2. Ressource in configuration.yaml hinzufügen

Fügen Sie folgende Zeile zu Ihrer `configuration.yaml` hinzu:

```yaml
frontend:
  extra_module_url:
    - /local/daily-energy-balance-card.js
```

### 3. HomeAssistant neu starten

1. Speichern Sie die `configuration.yaml`
2. Starten Sie HomeAssistant neu

### 4. Karte zu Dashboard hinzufügen

1. Öffnen Sie Ihr Dashboard im Bearbeitungsmodus
2. Klicken Sie auf **"Karte hinzufügen"**
3. Wählen Sie **"Daily Energy Balance Card"**
4. Konfigurieren Sie die erforderlichen Sensoren

## Konfiguration

### Erforderliche Sensoren

Die folgenden Sensoren müssen konfiguriert werden:

| Sensor | Beschreibung | Beispiel |
|--------|--------------|----------|
| `pv_power` | PV-Leistung in kW | `sensor.solar_power` |
| `grid_import` | Netzbezug in kW | `sensor.grid_import_power` |
| `grid_export` | Netzeinspeisung in kW | `sensor.grid_export_power` |
| `battery_charge` | Batterie-Ladeleistung in kW | `sensor.battery_charge_power` |
| `battery_discharge` | Batterie-Entladeleistung in kW | `sensor.battery_discharge_power` |
| `consumption` | Gesamtverbrauch in kW | `sensor.total_consumption` |
| `auto_consumption` | Auto-Verbrauch in kW | `sensor.ev_charging_power` |

### Optionale Sensoren

| Sensor | Beschreibung | Standard |
|--------|--------------|----------|
| `skin_mode` | Skin-Modus (0=Auto, 1=Dark, 2=Light) | Automatisch |

### Karten-Optionen

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|--------------|
| `title` | string | `"Energiebilanz"` | Titel der Karte |
| `show_title` | boolean | `true` | Titel anzeigen/verstecken |
| `box_height` | number | `300` | Höhe der Karte in Pixeln |
| `box_width` | number | `182` | Breite der Karte in Pixeln |

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

## Fehlerbehebung

### Karte wird nicht angezeigt

1. Überprüfen Sie, ob alle erforderlichen Sensoren konfiguriert sind
2. Stellen Sie sicher, dass die Sensoren gültige numerische Werte zurückgeben
3. Überprüfen Sie die Browser-Konsole auf JavaScript-Fehler
4. Starten Sie HomeAssistant neu

### Sensoren zeigen 0 an

1. Überprüfen Sie die Entity-IDs in der Konfiguration
2. Stellen Sie sicher, dass die Sensoren in HomeAssistant verfügbar sind
3. Überprüfen Sie die Einheiten der Sensoren (sollten in kW sein)

### Skin-Modus funktioniert nicht

1. Stellen Sie sicher, dass der `skin_mode` Sensor konfiguriert ist
2. Der Sensor sollte Werte 0, 1 oder 2 zurückgeben
3. Bei 0 wird der automatische Modus verwendet

## Support

Bei Problemen oder Fragen:

1. Überprüfen Sie die [README.md](README.md) für weitere Informationen
2. Erstellen Sie ein Issue in diesem Repository
3. Stellen Sie sicher, dass Sie die neueste Version verwenden

## Updates

### Über HACS

1. Gehen Sie zu HACS → Frontend
2. Suchen Sie nach "Daily Energy Balance Card"
3. Klicken Sie auf "Update" wenn verfügbar
4. Starten Sie HomeAssistant neu

### Manuell

1. Laden Sie die neueste Version herunter
2. Ersetzen Sie die alte `daily-energy-balance-card.js`
3. Starten Sie HomeAssistant neu
