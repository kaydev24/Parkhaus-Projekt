let parkplaetzeProEtage = {};
let fahrzeugDaten = {};

document.getElementById("anzahlParkplätze").addEventListener("keydown", 
    function(event) {
    if (event.key === "Enter") {
        let anzahlParkplaetze = Number(document.getElementById("anzahlParkplätze").value);

        if (anzahlParkplaetze > 0) {
            let etageAktuell = document.getElementById("etagenNummer").value;
            parkplaetzeProEtage[etageAktuell] = anzahlParkplaetze;
            addParkplatz(etageAktuell);

            parkplatzNummernHinzufuegen(etageAktuell);
            updateVerfuegbareParkplaetze(etageAktuell);

        } else {
            alert("Bitte eine gültige Zahl eingeben!");
        }
    }
});

document.getElementById("anzahlEtagen").addEventListener("keydown", 
    
    function(event) {
    if (event.key === "Enter") {
        let anzahlEtagen = document.getElementById("anzahlEtagen").value;

        if (anzahlEtagen > 0) {
            let etagenNummer = document.getElementById("etagenNummer");
            etagenNummer.innerHTML = '';

            for (let i = 0; i < anzahlEtagen; i++) {
                let etage = document.createElement("option");
                etage.value = i + 1;
                etage.textContent = (i + 1);
                etagenNummer.appendChild(etage);
            }


            updateVerfuegbareParkplaetze(document.getElementById("etagenNummer").value);
        } else {

            alert("Bitte eine gültige Zahl eingeben!");
        }
    }
});

document.getElementById("etagenNummer").addEventListener("change", 
    function() {
    let etageAktuell = document.getElementById("etagenNummer").value;
    addParkplatz(etageAktuell);
    parkplatzNummernHinzufuegen(etageAktuell);

    behalteFahrzeuge(etageAktuell);
    updateVerfuegbareParkplaetze(etageAktuell);
});


function addParkplatz(etage) {
    const parkingRow = document.getElementById("parkingRow");
    parkingRow.innerHTML = '';

    let count = parkplaetzeProEtage[etage] || 0;
    for (let i = 0; i < count; i++) {
        let parkplatz = document.createElement("div");
        parkplatz.className = "parkplatz";

        let label = document.createElement("span");
        label.textContent = "P" + (i + 1) + "E" + etage;

        parkplatz.appendChild(label);
        parkingRow.appendChild(parkplatz);
    }
    behalteFahrzeuge(etage);
}

function parkplatzNummernHinzufuegen(etage) {
    const parkplatzNummer = document.getElementById("parkplatzNummer");
    parkplatzNummer.innerHTML = '';

    let count = parkplaetzeProEtage[etage] || 0;
    for (let i = 0; i < count; i++) {
        let option = document.createElement("option");

        option.value = i + 1;
        option.textContent = "P" + (i + 1) + "E" + etage;
        parkplatzNummer.appendChild(option);
    }
}

document.getElementById("addFahrzeug").onclick = function() {
    let fahrzeugID = document.getElementById("fahrzeugID").value;
    let parkplatzNummer = document.getElementById("parkplatzNummer").value;
    let etageAktuell = document.getElementById("etagenNummer").value;
    let fahrzeugTyp = document.getElementById("fahrzeugTyp").value;

    if (fahrzeugID in fahrzeugDaten) {
        alert("Die Fahrzeug-ID existiert bereits. Bitte geben Sie eine eindeutige Fahrzeug-ID ein.");
        return;
    }

    if (fahrzeugID && parkplatzNummer) {
        var imageFiles = {
            auto: ["1.png", "2.png", "3.png", "4.png"],
            motorrad: ["motorrad.png"]
        };

        var randomIndex = Math.floor(Math.random() * imageFiles[fahrzeugTyp].length);

        var randomImage = imageFiles[fahrzeugTyp][randomIndex];

        var container = document.querySelector(".parkplatz:nth-child(" + parkplatzNummer + ")");
        if (container) {
            if (container.querySelector("img")) {
                alert("Der Parkplatz ist bereits belegt.");
            } else {
                var fahrzeugImg = document.createElement("img");
                fahrzeugImg.src = "fahrzeuge/" + randomImage;
                fahrzeugImg.width = 50;
                fahrzeugImg.height = 80;

                container.appendChild(fahrzeugImg);

                fahrzeugDaten[fahrzeugID] = {
                    etage: etageAktuell,
                    parkplatz: parkplatzNummer,
                    image: randomImage
                };

                updateVerfuegbareParkplaetze(etageAktuell);
            }
        } else {
            alert("Ungültige Parkplatz-Nummer.");
        }
    } else {
        alert("Bitte geben Sie Fahrzeug-ID und Parkplatz-Nummer ein.");
    }
};

document.getElementById("loescheFahrzeug").onclick = function() {
    let fahrzeugID = document.getElementById("fahrzeugID").value;
    if (fahrzeugID in fahrzeugDaten) {
        let daten = fahrzeugDaten[fahrzeugID];
        let etageAktuell = daten.etage;
        let parkplatzNummer = daten.parkplatz;

        var container = document.querySelector(".parkplatz:nth-child(" + parkplatzNummer + ")");
        if (container && container.querySelector("img")) {
            container.removeChild(container.querySelector("img"));
        }

        delete fahrzeugDaten[fahrzeugID];
        updateVerfuegbareParkplaetze(etageAktuell);

    } else {
        alert("Fahrzeug mit der ID " + fahrzeugID + " wurde nicht gefunden.");
    }
};

document.getElementById("findFahrzeug").onclick = function() {
    let fahrzeugID = document.getElementById("fahrzeugID").value;
    if (fahrzeugID in fahrzeugDaten) {
        let daten = fahrzeugDaten[fahrzeugID];
        alert("Fahrzeug " + fahrzeugID + " befindet sich auf Etage " + daten.etage + " auf Parkplatznummer " + daten.parkplatz);
    } else {
        alert("Fahrzeug mit der ID " + fahrzeugID + " wurde nicht gefunden.");
    }
};

function behalteFahrzeuge(etage) {
    for (let id in fahrzeugDaten) {
        if (fahrzeugDaten[id].etage === etage) {
            let parkplatzNummer = fahrzeugDaten[id].parkplatz;
            if (parkplatzNummer <= parkplaetzeProEtage[etage]) {
                var container = document.querySelector(".parkplatz:nth-child(" + parkplatzNummer + ")");
                if (container) {
                    var existingImg = container.querySelector("img");
                    if (existingImg) {
                        container.removeChild(existingImg);
                    }
                    var fahrzeugImg = document.createElement("img");
                    fahrzeugImg.src = "fahrzeuge/" + fahrzeugDaten[id].image;
                    fahrzeugImg.width = 50;
                    fahrzeugImg.height = 80;

                    container.appendChild(fahrzeugImg);
                }
            } else {

                delete fahrzeugDaten[id];
            }
        }
    }
}

function updateVerfuegbareParkplaetze(etage) {
    var total = parkplaetzeProEtage[etage] || 0;
    var belegte = 0;

    for (var fahrzeugID in fahrzeugDaten) {
        if (fahrzeugDaten.hasOwnProperty(fahrzeugID)) {
            var fahrzeug = fahrzeugDaten[fahrzeugID];
            if (fahrzeug.etage === etage && fahrzeug.parkplatz <= total) {
                belegte++;
            }

        }
    }

    var verfuegbar = total - belegte;
    document.getElementById("verfuegbareParkplaetze").textContent = verfuegbar;
}
