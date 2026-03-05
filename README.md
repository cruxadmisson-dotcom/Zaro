# Zaro Fashion Shop

Ein moderner Fashion-Shop, gebaut mit Next.js 15, Tailwind CSS und Framer Motion.

## 🚀 Deployment (Online bringen)

### Schritt 1: GitHub
1.  Erstelle ein neues Repository auf [GitHub.com](https://github.com/new).
2.  Führe folgende Befehle in deinem Terminal aus:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/DEIN_USERNAME/DEIN_REPO_NAME.git
    git push -u origin main
    ```

### Schritt 2: Vercel
1.  Gehe auf [Vercel.com](https://vercel.com) und melde dich mit GitHub an.
2.  Klicke auf **"Add New..."** -> **"Project"**.
3.  Wähle dein `kleidung-shop` Repository aus und klicke **Import**.
4.  Klicke **Deploy**.

## ⚠️ WICHTIG: Admin Panel & Produkte

Da dieser Shop **keine externe Datenbank** verwendet (um es einfach und kostenlos zu halten), funktioniert das Admin-Panel (`/admin`) **nur lokal auf deinem PC**.

**So fügst du neue Produkte hinzu:**
1.  Starte den Shop auf deinem PC: `npm run dev`.
2.  Gehe auf `http://localhost:3000/admin`.
3.  Erstelle Produkte, lade Bilder hoch, etc.
4.  **Speichere** alles. Die Daten werden in `src/data/products.json` gespeichert.
5.  Damit die Änderungen **online** gehen, musst du sie zu GitHub "pushen":
    ```bash
    git add .
    git commit -m "Neue Produkte hinzugefügt"
    git push
    ```
6.  Vercel aktualisiert die Website dann **automatisch** (dauert ca. 1-2 Minuten).

## Features
*   Modernes Design
*   Admin Dashboard (Lokal)
*   Bilder Upload (Lokal)
*   Farb-Varianten mit Bild-Wechsel
*   Unterschiedliche Checkout-Links pro Farbe
