interface AnimalSpecies {
    name: string;
    requiredBiome: string;
    needsWater: boolean;
    requiredArea: number;
    typeOfFood: string;
    isPredator: boolean;
}

interface ZooEnclosure {
    name: string;
    biome: string;
    area: number;
    hasWater: boolean;
    animals: ZooAnimal[];
}

interface ZooAnimal {
    name: string;
    species: AnimalSpecies;
    foodConsumption: number;
}

const enclosures: ZooEnclosure[] = [];

function addEnclosure() {
    const name = (document.getElementById('enclosure-name') as HTMLInputElement).value;
    const biome = (document.getElementById('enclosure-biome') as HTMLInputElement).value;
    const area = parseInt((document.getElementById('enclosure-area') as HTMLInputElement).value);
    const hasWater = (document.getElementById('enclosure-water') as HTMLInputElement).checked;
   
    if (!name || !biome || (isNaN(area) || area <= 0)){
        alert('Please fill in all fields.');

        return
    }

    if (alreadyCreated(enclosures, name)){
        alert('Enclosure already created.');

        return
    }


    const enclosure: ZooEnclosure = {
        name,
        biome,
        area,
        hasWater,
        animals: []
    };
    enclosures.push(enclosure);
    displayEnclosures();
}

function addAnimal() {
    const   name = (document.getElementById('animal-name') as HTMLInputElement).value;
    const   speciesName = (document.getElementById('animal-species') as HTMLInputElement).value;
    const   requiredBiome = (document.getElementById('animal-biome') as HTMLInputElement).value;
    const   requiredArea= parseInt((document.getElementById('animal-area') as HTMLInputElement).value);
    const   typeOfFood= (document.getElementById('animal-diet') as HTMLInputElement).value;
    const   foodConsumption = parseInt((document.getElementById('animal-consumption') as HTMLInputElement).value);
    const   isPredator= (document.getElementById('animal-predator') as HTMLInputElement).checked;
    const   needsWater= (document.getElementById('animal-water') as HTMLInputElement).checked;
    const   toEnclosure = (document.getElementById('animal-to-enclosure') as HTMLInputElement).value;

    if (!name || !toEnclosure || !speciesName || !requiredBiome || isNaN(requiredArea) || !typeOfFood || isNaN(foodConsumption)) {
        alert('Please fill in all fields.');
        return
    }
    
    const species: AnimalSpecies = {
        name: speciesName,
        requiredBiome: requiredBiome,
        needsWater: needsWater,
        requiredArea:requiredArea,
        typeOfFood: typeOfFood,
        isPredator: isPredator
    };
   
    
    const animal: ZooAnimal = {
        name,
        species,
        foodConsumption
    };

    const enclosure= enclosures.find(enclosure => enclosure.name === toEnclosure)
    if (enclosure && canAddAnimal(enclosure, animal)){
            enclosure.animals.push(animal);
        }
  

    displayEnclosures();
}

function removeAnimalFromEnclosure(enclosureName: string, animalName: string): boolean {
    const enclosure = enclosures.find(enc => enc.name === enclosureName);

    if (!enclosure) {
        alert('Enclosure not found.');
        return false;
    }

    const animalIndex = enclosure.animals.findIndex(animal => animal.name === animalName);

    if (animalIndex === -1) {
        alert('Animal not found in this enclosure.');
        return false;
    }

    enclosure.animals.splice(animalIndex, 1);
    alert(`Animal ${animalName} removed from enclosure ${enclosureName}.`);
    displayEnclosures();
    return true;
}

function canAddAnimal(enclosure: ZooEnclosure, animal: ZooAnimal): string | boolean {
    if (enclosure.biome !== animal.species.requiredBiome) {
        alert("Unsuitable Biome. Required: ${animal.species.requiredBiome}");

        return false;
    }
    if (animal.species.needsWater && !enclosure.hasWater) {
        alert("The animal needs water.");

        return false;
    }
    const currentAreaUsed = enclosure.animals.reduce((sum, a) => sum + a.species.requiredArea, 0);
    if (currentAreaUsed + animal.species.requiredArea > enclosure.area) {
        alert("Not enough space in the enclosure.");

        return false;
    }
    if (animal.species.isPredator) {
        if (enclosure.animals.length > 0 &&
            (enclosure.animals.some(a => a.species.name !== animal.species.name) ||
             enclosure.animals.some(a => !a.species.isPredator))) {
                alert("Predators can only live with the same species.");

                return false;
        }
    } else {
        if (enclosure.animals.some(a => a.species.isPredator)) {
            alert("Cannot live with predators.");

            return false;
        }
    }

    return true;
}

function getTotalFood() {
    const totalFood = enclosures.reduce((total, enclosure) => {
        return total + enclosure.animals.reduce((sum, animal) => sum + animal.foodConsumption, 0);
    }, 0);
    document.getElementById('total-food')!.innerText = `Total food required: ${totalFood} units.`;
}


function alreadyCreated(array: ZooEnclosure[], name: string): boolean {
    return array.some(entity => entity.name === name);
}

function displayEnclosures(): void {
    const enclosuresContainer = document.getElementById('enclosures')!;
    enclosuresContainer.innerHTML = '';
    enclosures.forEach((enclosure) => {
        const div = document.createElement('div');
        div.classList.add('enclosure');
        div.innerHTML = `
            <h3>Name: ${enclosure.name}</h3>
            <p>Biome: ${enclosure.biome}</p>
            <p>Area: ${enclosure.area}</p>
            <p>Has Water: ${enclosure.hasWater}</p>
            <p>Animals: ${enclosure.animals.map(animal => animal.name).join(', ')}</p>
            <button onclick="removeAnimalFromEnclosure('${enclosure.name}', prompt('Enter animal name to delete:'))">Delete Animal</button>
        `;
        enclosuresContainer.appendChild(div);
    });
}