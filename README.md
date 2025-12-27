# Space Invader

Un clone del classico gioco arcade Space Invaders, sviluppato in HTML5, CSS e JavaScript vanilla.

## 🎮 Descrizione
Il giocatore controlla una navicella spaziale e deve difendere la Terra da ondate di alieni invasori. L'obiettivo è ottenere il punteggio più alto possibile distruggendo gli alieni prima che raggiungano il fondo dello schermo o che il giocatore esaurisca le vite.

## ✨ Caratteristiche
* **Gameplay Arcade**: Movimento fluido e meccaniche di sparo classiche.
* **Sistema di Ondate**: La difficoltà aumenta progressivamente; ogni volta che si eliminano tutti gli alieni, inizia una nuova ondata più veloce.
* **Punteggio**:
    * 10 punti per ogni alieno distrutto.
    * 100 punti bonus al completamento di un'ondata.
* **Vite**: Il giocatore inizia con 3 vite.

## 🕹️ Controlli
Il gioco supporta sia i tasti freccia che i tasti WASD per il movimento.

* **Muovi a Sinistra**: `Freccia Sinistra` o `A`
* **Muovi a Destra**: `Freccia Destra` o `D`
* **Spara**: `Barra Spaziatrice`

## 🚀 Come Giocare
1.  Scarica o clona la repository.
2.  Assicurati che i file `index.html`, `style.css` e `action.js` siano nella stessa cartella.
3.  Apri il file `index.html` nel tuo browser web preferito.

## 📂 Struttura dei File
* **index.html**: Struttura principale della pagina e container del gioco.
* **style.css**: Stile grafico, include il font 'Courier New' e il layout scuro.
* **action.js**: Logica del gioco, inclusi il loop di gioco, la gestione delle collisioni e l'intelligenza degli alieni.

## 🛠️ Personalizzazione
Puoi modificare le variabili in `action.js` per cambiare il gioco:
* `lives`: Modifica le vite iniziali.
* `gameSpeed`: Cambia la velocità di gioco.
