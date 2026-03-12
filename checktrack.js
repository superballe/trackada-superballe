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
// console.log() supprimé ici, le saut de ligne est géré via "\n" dans les messages suivants

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

    if (dossierExiste && gitExiste && manquants.length === 0) {
        ok++;
        console.log("\n✅ dossier du projet " + projet.name);
    } else {
        console.log("\n❌ dossier du projet " + projet.name);

        if (!dossierExiste) {
            console.log("- le dossier n'existe pas ou n'est pas nommé correctement");
        } else {
            if (!gitExiste) {
                console.log("- le repository git n'est pas initialisé");
            }

            // affichage des fichiers manquants
            if (manquants.length > 0) {
                const liste = manquants.slice(0, -1).join(", ");
                const dernier = manquants[manquants.length - 1];
                const msg = manquants.length === 1 ? dernier : liste + " et " + dernier;
                console.log("- il manque " + msg);
            }
        }
    }
}

// affichage du pourcentage
const total = track.projects.length;
const pourcentage = Math.round(ok / total * 100);
const symbole = ok === total ? "✅" : "❌"; // La ternaire symbole évite la duplication du console.log de fin

console.log("\n" + symbole + " " + pourcentage + "% des projets sont initialisés correctement (" + ok + "/" + total + ")");
