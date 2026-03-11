import {readFileSync, existsSync} from "fs";
import {join} from "path";
import {homedir} from "os";

// lis le fichier track.json
const track = JSON.parse(readFileSync("./track.json"));
const root = track.root.replace("~", homedir());

// verifie le dossier ada
const ada = join(homedir(), "ada");
if (existsSync(ada)) {
    console.log("✅ dossier ada");
} else {
    console.log("❌ dossier ada");
}
console.log();

let ok = 0;

for (const projet of track.projects) {
    const chemin = join(root, projet.name);
    const dossierExiste = existsSync(chemin);
    const gitExiste = existsSync(join(chemin, ".git"));

    // cherche les fichiers manquants
    let manquants = [];
    if (dossierExiste) {
        for (const fichier of projet.required) {
            if (!existsSync(join(chemin, fichier))) {
                manquants.push(fichier);
            }
        }
    }

    if (dossierExiste && gitExiste && manquants.length == 0) {
        ok++;
        console.log("✅ dossier du projet " + projet.name);
    } else {
        console.log("❌ dossier du projet " + projet.name);

        if (!dossierExiste) {
            console.log("- le dossier n'existe pas ou n'est pas nommé correctement");
        } else {
            if (!gitExiste) {
                console.log("- le repository git n'est pas initialisé");
            }

            // affichage des fichiers manquants
            if (manquants.length == 1) {
                console.log("- il manque " + manquants[0]);
            }
            if (manquants.length == 2) {
                console.log("- il manque " + manquants[0] + " et " + manquants[1]);
            }
            if (manquants.length > 2) {
                let liste = manquants.slice(0, manquants.length - 1).join(", ");
                console.log("- il manque " + liste + " et " + manquants[manquants.length - 1]);
            }
        }
    }

    console.log();
}

// affichage du pourcentage
const total = track.projects.length;
const pourcentage = Math.round(ok / total * 100);

if (ok == total) {
    console.log("✅ " + pourcentage + "% des projets sont initialisés correctement (" + ok + "/" + total + ")");
} else {
    console.log("❌ " + pourcentage + "% des projets sont initialisés correctement (" + ok + "/" + total + ")");
}
