# Home Assistant Installation Guide

## 🚀 Schnelle Installation

### Schritt 1: Datei herunterladen
- Laden Sie `daily-energy-balance-card.js` herunter

### Schritt 2: In Home Assistant kopieren
```bash
# Kopieren Sie die Datei in Ihr Home Assistant Verzeichnis:
cp daily-energy-balance-card.js /path/to/homeassistant/config/www/
```

### Schritt 3: Configuration.yaml anpassen
Fügen Sie zu Ihrer `configuration.yaml` hinzu:
```yaml
frontend:
  extra_module_url:
    - /local/daily-energy-balance-card.js
```

### Schritt 4: Home Assistant neu starten
- Starten Sie Home Assistant neu
- Oder führen Sie "Restart" in den Developer Tools aus

### Schritt 5: Card verwenden
Fügen Sie zu Ihrem Dashboard hinzu:
```yaml
type: custom:daily-energy-balance-card
title: "Daily Energy Balance"
```

## 🔧 HACS Installation (Empfohlen)

1. **HACS installieren** (falls noch nicht geschehen)
2. **Custom Repository hinzufügen**:
   - HACS → Frontend → Custom Repositories
   - Repository hinzufügen
3. **Card installieren**:
   - Nach "Daily Energy Balance Card" suchen
   - Download klicken
4. **Home Assistant neu starten**

## ✅ Testen

1. **Lokaler Test**: Öffnen Sie `HA-Card-Test.html` in Ihrem Browser
2. **Home Assistant Test**: Fügen Sie die Card zu einem Dashboard hinzu
3. **Console-Logs**: Öffnen Sie F12 für Debug-Informationen

## 🆘 Troubleshooting

### Card wird nicht angezeigt
- Überprüfen Sie die Browser-Console (F12)
- Stellen Sie sicher, dass die Datei in `/config/www/` liegt
- Überprüfen Sie die `configuration.yaml` Syntax

### Fehlende Daten
- Überprüfen Sie, ob die Sensor-Entities existieren
- Stellen Sie sicher, dass die Entities gültige numerische Werte haben

### Darstellungsprobleme
- Löschen Sie den Browser-Cache
- Testen Sie mit der Standard-Konfiguration 