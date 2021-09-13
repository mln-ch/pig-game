/*
REGOLAMENTO:
- Il gioco è per 2 giocatori
- Ogni turno un giocatore lancia il dado quante volte vuole. Ogni risultato del dado si aggiunge al risultato corrente (Round Score)
- Se il risultato del lancio è 1, il giocatore perde tutto il suo risultato corrente e passa il turno all'altro giocatore.
- Un giocatore può decidere di passare. In questo caso il risultato corrente sarà aggiunto al suo risultato globale e il turno passerà all'altro giocatore
- Il primo giocatore che raggiunge i 100 punti come risultato globale, vince!
*/

// Punteggio globale dei due giocatori
var risGlobale = [0, 0];

// il giocatore attivo in quel momento
var activePlayer = 0;

// il risultato del dado lanciato
var dado;

// buttons
var btnRoll = document.querySelector('.btn-roll');
var btnHold = document.querySelector('.btn-hold');

var punteggioCorrente = 0;
var ultimoTurno;


function passaTurno() {

    // Recupero gli elementi del DOM da modificare
    var diceEl = document.querySelectorAll('.dice');
    var currentEl = document.querySelector('#current-' + activePlayer);

    // Azzero il punteggio
    punteggioCorrente = 0;
    currentEl.textContent = punteggioCorrente;

    // nascondere il dado
    for (let i = 0; i < 2; i++) {
        diceEl[i].classList.add('d-none');
    }

    // passo il turno all'altro giocatore
    document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
    activePlayer = activePlayer === 0 ? 1 : 0;
    document.querySelector('.player-' + activePlayer + '-panel').classList.add('active');
}



document.addEventListener('DOMContentLoaded', function () {
    var diceEl = document.querySelectorAll('.dice');
    gsap.from(diceEl[1], { duration: 2, ease: "bounce.out", y: -500 });
    gsap.from(diceEl[0], { duration: 2, ease: "bounce.out", y: -500, delay: .1 });

    // gestione evento lancio dado
    document.querySelector('.btn-roll').addEventListener('click', function () {
        // recupero gli elementi del dom
        var currentEl = document.querySelector('#current-' + activePlayer);

        // genero un numero casuale tra 1 e 6
        var dadi = [
            dado1 = Math.floor((Math.random() * 6) + 1),
            dado2 = Math.floor((Math.random() * 6) + 1)
        ];

        console.log(dadi[0]);
        console.log(dadi[1]);

        if (dado1 === 1 || dado2 === 1) {
            passaTurno();
        }
        else {
            // mostro il risultato del lancio
            for (let i = 0; i < dadi.length; i++) {
                diceEl[i].src = 'img/dice-' + dadi[i] + '.png';
                diceEl[i].classList.remove('d-none');
            }

            // aggiungo il risultato al punteggio corrente
            punteggioCorrente += dado1 + dado2;

            // mostro il punteggio corrente dell'utente attivo
            currentEl.textContent = punteggioCorrente;

            // se il 6 viene estratto due volte il giocatore perde il turno - SINGOLO DADO
            /*
            dado === 6 && ultimoTurno === 6 ? passaTurno() : '';
            ultimoTurno = dado;
            */

        }
    });

    // gestione evento passa il turno
    document.querySelector('.btn-hold').addEventListener('click', function () {

        // sommare il punteggio corrente al punteggio totale dell'utente attivo
        risGlobale[activePlayer] += punteggioCorrente;

        // mostrare il punteggio globale aggiornato
        document.querySelector('#score-' + activePlayer).textContent = risGlobale[activePlayer];

        // verifico la vittoria dell'utente corrente
        if (risGlobale[activePlayer] >= 20) {
            var btn = document.querySelectorAll('.btn');


            var currentPanel = document.querySelector('.player-' + activePlayer + '-panel');
            currentPanel.classList.remove('active');
            currentPanel.classList.add('winner');

            document.querySelector('#name-' + activePlayer).textContent = "Vittoria!";

            for (let i = 0; i < 2; i++) {
                diceEl[i].classList.add('ani-win');
                diceEl[i].src = 'img/dice-5.png';
            }

            // disabilito i btn per imedire l'avanzamento del gioco
            btnRoll.setAttribute('disabled', true);
            btnHold.setAttribute('disabled', true);



            /* --------------------------- CONFETTI --------------------------- */

            var duration = 15 * 1000;
            var animationEnd = Date.now() + duration;
            var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            var interval = setInterval(function () {
                var timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                var particleCount = 50 * (timeLeft / duration);
                // since particles fall down, start a bit higher than random
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);

            /* --------------------------- CONFETTI --------------------------- */

        }
        else {
            passaTurno();
        }
    });

    // gestione evento nuovo gioco
    document.querySelector('.btn-new').addEventListener('click', function () {
        document.location.href = "";
    });
});