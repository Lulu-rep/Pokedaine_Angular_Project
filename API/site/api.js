export async function getTaches() {
    const res = await fetch('http://localhost:3000/taches');
    return res.json();
}

export async function removeTaches(tache) {
    const res = await fetch('http://localhost:3000/taches/' + tache._id, {
        method: 'DELETE'
    });
    return res.json();
}

export async function ajoutTaches(tache) {
    console.log(tache);
    const res = await fetch('http://localhost:3000/taches', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tache)
    });
    return res.json();
}

export async function updateTaches(tache) {
    let tempTache = { "titre": tache.titre, "termine": tache.termine }
    const res = await fetch('http://localhost:3000/taches/' + tache._id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tempTache)
    });
    return res.json();
}