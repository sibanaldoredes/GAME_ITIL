// Hash mit Lösung
var land_stadt = $H({PDSitil: 'PDS', PTSitil: 'PTS', POSitil: 'POS', PESitil: 'PES', PMSCitil: 'PMSC'});
// Punktestand
var punkte = 0;
// Selektoren für Drag- und Drop-Objekte
var sel_drag = '#staedteliste li';
var sel_drop = '#laenderliste li';
// Optionen für Highlight-Effekt:
// bei Erfolg gibt es einen Verlauf von Grün nach Weiß,
// bei Misserfolg von Rot nach Weiß
// die beiden Optionen-Objekte werden mit Prototypes Class.create() erzeugt
var Hinweis = Class.create();
Hinweis.prototype = {
 initialize: function(col) {this.startcolor = col;},
 duration: 2, // Sekunden
 endcolor: '#ffffff',
 restorecolor: '#ffffff' // sonst bleibt bei schnellen Klicks ein Farbrest
};
var roteffekt = new Hinweis('#ff2211');
var grueneffekt = new Hinweis('#11ff22');

var dragSrcEl = null;

function handleDragStart(e) {
    e.dataTransfer.dropEffect='move';
  // Target (this) element is the source node.
  this.style.opacity = '0.4';

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

// nach Laden des Fensters:
function init() {
 // sucht alle Elemente, die zum Selektor passen
 $$(sel_drag).each(function(dragobj) {
  // erzeugt daraus zurückspringende Drag-Objekte
  // und schreibt sie in das Array dragobjekte
  new Draggable(dragobj, {revert: true});
  // weist den Drag-Objekten eine CSS-Klasse zu
  Element.addClassName(dragobj, 'draggable');
 });

 // sucht alle Elemente, die zum Selektor passen
 $$(sel_drop).each(function(dropobj) {
  // erzeugt daraus Drop-Objekte ...
  Droppables.add(dropobj, {
   // ... die nur die CSS-Klasse "draggable" akzeptieren
   accept: 'draggable',
   // nach dem Droppen:
   onDrop: function(dragobj) {
    // passen Drag- und Dropobjekt zusammen?
    if (land_stadt[dropobj.id] == dragobj.id) {
     // ja: Erfolgsmeldung
     $('anleitung').update(dragobj.firstChild.nodeValue + ' é um serviço de ' + dropobj.firstChild.nodeValue + ': Parabéns você marcou 1 ponto ');
     score(1);
    } else {
     $('anleitung').update('Você acbou de perder 1 ponto.');
     score(-1);
     
    }
    
   },
   // CSS-Klasse während des Überfahrens der Drop-Objekte
   hoverclass: 'hervorheben'
  });
 });
}

// Aufruf nach dem Droppen mit +1 oder -1
function score(wert) {
 // aktualisiert Punktestand
 punkte += wert;
 // Rückmeldung mit passendem Highlight-Effekt
 $('punktestand').update(punkte + ' Acerto' + (punkte != 1? 's' : ''));
 new Effect.Highlight('punktestand', wert > 0? grueneffekt : roteffekt);
 // 4 Punkte: Spiel gewonnen
 if(punkte > 22) {
  $('anleitung').update('Parabéns! Você acertou todas!');
  exit(1);
 // -4 Punkte: Spiel verloren
 } else if(punkte < -5) {
  $('anleitung').update("Continue tentando... Aperte F5 para reiniciar");
  exit(0);
 }
}

// beendet das Spiel
function exit(ok) {
 // lässt Spielergebnis fünfmal grün oder rot aufblinken
 $R(1, 5).each(function() {
  var blinker = ok? grueneffekt : roteffekt;
  new Effect.Highlight('anleitung', blinker)
  // warte mit dem nächsten Effekt, bis der aktuelle vorbei ist
  blinker.queue = 'end';
 });
 // Element sind nicht mehr droppable
 $$(sel_drop).each(function(dropobj) {
  Droppables.remove(dropobj.id);
 });
 // Elemente sind nicht mehr draggable und verlieren ihre CSS-Klasse
 Draggables.drags.each(function(dragobj) {
  dragobj.element.removeAttribute('class');
  dragobj.destroy();
 });
}
function findIn2dArray(arr_2d, val){
    var indexArr = $.map(arr_2d, function(arr, i) {
            if($.inArray(val, arr) != -1) {
                return 1;
            }

            return -1;
    });

    return indexArr.indexOf(1);
}

// führt nach Laden des Fensters init() aus (Prototype-Syntax)
Event.observe(window, 'load', init);