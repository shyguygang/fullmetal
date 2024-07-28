const characters = [
    {
        name: "Edward Elric",
        image: "./images/ed200.avif",
        description: "The Fullmetal Alchemist, a State Alchemist and the main protagonist."
    },
    {
        name: "Alphonse Elric",
        image: "./images/al200.avif",
        description: "Edward's younger brother, whose soul is bound to a suit of armor."
    },
    {
        name: "Roy Mustang",
        image: "./images/mustang.jpg",
        description: "The Flame Alchemist, a State Alchemist and Edward's superior officer."
    },
    // Add more characters as needed
];

function loadCharacters(contentDiv) {
    const charactersGrid = document.createElement('div');
    charactersGrid.className = 'characters-grid';

    characters.forEach(character => {
        const characterCard = createCharacterCard(character);
        charactersGrid.appendChild(characterCard);
    });

    contentDiv.appendChild(charactersGrid);
}

function createCharacterCard(character) {
    const card = document.createElement('div');
    card.className = 'character-card';

    const image = document.createElement('img');
    image.src = character.image;
    image.alt = character.name;
    image.loading = 'lazy';

    const name = document.createElement('h3');
    name.textContent = character.name;

    const description = document.createElement('p');
    description.textContent = character.description;

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(description);

    return card;
}