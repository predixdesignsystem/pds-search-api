var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
{
    const { customElement, property } = Polymer.decorators;
    // Gesture events like tap and track generated from touch will not be
    // preventable, allowing for better scrolling performance.
    Polymer.setPassiveTouchGestures(true);
    let AppShell = class AppShell extends Polymer.Element {
        constructor() {
            super(...arguments);
            this.searches = [];
            this.views = [];
            this.views10d = 0;
            this.views24h = 0;
        }
        connectedCallback() {
            super.connectedCallback();
            /* Listen for new search events and add them to the page */
            const searchRef = firebase.database().ref('/search').limitToLast(50);
            searchRef.on('child_added', data => {
                const child = data.val();
                const label = 'Term';
                const value = child.term;
                const created = child._createdAt;
                const detail = child.resultsCount === 1 ? `${child.resultsCount} result` : `${child.resultsCount} results`;
                const type = child.resultsCount > 0 ? 'info' : 'important';
                const animal = gaToAnonAnimal(child._ga);
                this.searches = [{ label, value, created, detail, type, animal }, ...this.searches];
            });
            let statsInitialized = false;
            /* Listen for new view events and add them to the page */
            const viewRef = firebase.database().ref('/view').limitToLast(50);
            viewRef.on('child_added', data => {
                const child = data.val();
                const label = pathToSectionTitle(child.path);
                const value = child.name;
                const created = child._createdAt;
                const animal = gaToAnonAnimal(child._ga);
                this.views = [{ label, value, created, animal }, ...this.views];
                if (statsInitialized) {
                    this.views10d++;
                    this.views24h++;
                }
            });
            /* Fetch stats for the last 10 days */
            fetch('https://us-central1-pds-search-api.cloudfunctions.net/stats10d')
                .then(response => response.json())
                .then((data) => {
                this.views10d = this.views10d + data.totalViews10d;
                this.views24h = this.views24h + data.totalViews24h;
                if (data.topPages10d[0].name === 'Home') {
                    /* Remove home from the top pages reponse to it does not skew the chart */
                    data.topPages10d = data.topPages10d.slice(1);
                }
                this.topPages = data.topPages10d;
                this.topSections = data.topSections10d;
                statsInitialized = true;
                console.log(data);
            });
        }
        _getPagesChartLabels(pages) {
            return pages.slice(0, 7).map(p => p.name);
        }
        _getSectionsChartLabels(sections) {
            return sections.slice(0, 7).map(p => p.section);
        }
        _getChartData(source) {
            return source.slice(0, 7).map(p => p.count);
        }
    };
    __decorate([
        property({ type: Array }),
        __metadata("design:type", Array)
    ], AppShell.prototype, "searches", void 0);
    __decorate([
        property({ type: Array }),
        __metadata("design:type", Array)
    ], AppShell.prototype, "views", void 0);
    __decorate([
        property({ type: Number }),
        __metadata("design:type", Number)
    ], AppShell.prototype, "views10d", void 0);
    __decorate([
        property({ type: Number }),
        __metadata("design:type", Number)
    ], AppShell.prototype, "views24h", void 0);
    __decorate([
        property({ type: Array }),
        __metadata("design:type", Array)
    ], AppShell.prototype, "topPages", void 0);
    __decorate([
        property({ type: Array }),
        __metadata("design:type", Array)
    ], AppShell.prototype, "topSections", void 0);
    AppShell = __decorate([
        customElement('app-shell')
    ], AppShell);
    /**
     * Capitalizes the first letter of a string and returns it.
     */
    function capitalize(str) {
        return str[0].toUpperCase() + str.slice(1);
    }
    /**
     * Turns page paths into human-readable section titles for
     * the website.
     */
    function pathToSectionTitle(path) {
        const section = path.split('/')[2];
        if (section) {
            if (section === 'elements') {
                return 'Component Docs';
            }
            if (section === 'css') {
                return 'CSS Docs';
            }
            if (section === 'develop') {
                return 'Developer Guides';
            }
            if (section === 'design') {
                return 'Design Guidelines';
            }
            if (section === 'about') {
                return 'Getting Started';
            }
            return capitalize(section);
        }
        return 'Unknown';
    }
    const anonAnimalCache = {};
    const animals = [
        'alligator',
        'anteater',
        'armadillo',
        'auroch',
        'axolotl',
        'badger',
        'bat',
        'beaver',
        'buffalo',
        'camel',
        'capybara',
        'chameleon',
        'cheetah',
        'chinchilla',
        'chipmunk',
        'chupacabra',
        'cormorant',
        'coyote',
        'crow',
        'dingo',
        'dinosaur',
        'dolphin',
        'duck',
        'elephant',
        'ferret',
        'fox',
        'frog',
        'giraffe',
        'gopher',
        'grizzly',
        'hedgehog',
        'hippo',
        'hyena',
        'ibex',
        'ifrit',
        'iguana',
        'jackal',
        'kangaroo',
        'koala',
        'kraken',
        'lemur',
        'leopard',
        'liger',
        'llama',
        'manatee',
        'mink',
        'monkey',
        'moose',
        'narwhal',
        'orangutan',
        'otter',
        'panda',
        'penguin',
        'platypus',
        'pumpkin',
        'python',
        'quagga',
        'rabbit',
        'raccoon',
        'rhino',
        'sheep',
        'shrew',
        'skunk',
        'squirrel',
        'tiger',
        'turtle',
        'walrus',
        'wolf',
        'wolverine',
        'wombat'
    ];
    const colors = [
        'Aqua',
        'Black',
        'Blue',
        'BlueViolet',
        'Brown',
        'CadetBlue',
        'Chocolate',
        'Coral',
        'CornflowerBlue',
        'Crimson',
        'DarkBlue',
        'DarkCyan',
        'DarkGoldenRod',
        'DarkGreen',
        'DarkKhaki',
        'DarkMagenta',
        'DarkOliveGreen',
        'Darkorange',
        'DarkOrchid',
        'DarkRed',
        'DarkSalmon',
        'DarkSeaGreen',
        'DarkSlateBlue',
        'DarkSlateGray',
        'DarkSlateGrey',
        'DarkTurquoise',
        'DarkViolet',
        'DeepPink',
        'DeepSkyBlue',
        'DimGray',
        'DimGrey',
        'DodgerBlue',
        'FireBrick',
        'ForestGreen',
        'Fuchsia',
        'GoldenRod',
        'Gray',
        'Grey',
        'Green',
        'HotPink',
        'IndianRed',
        'Indigo',
        'Magenta',
        'Maroon',
        'MediumBlue',
        'MediumOrchid',
        'MediumPurple',
        'MediumSeaGreen',
        'MediumSlateBlue',
        'MediumVioletRed',
        'MidnightBlue',
        'Navy',
        'Olive',
        'OliveDrab',
        'Orange',
        'OrangeRed',
        'Orchid',
        'PaleVioletRed',
        'Peru',
        'Pink',
        'Plum',
        'Purple',
        'Red',
        'RosyBrown',
        'RoyalBlue',
        'SaddleBrown',
        'Salmon',
        'SandyBrown',
        'SeaGreen',
        'Sienna',
        'SlateBlue',
        'SlateGray',
        'SlateGrey',
        'SteelBlue',
        'Tan',
        'Teal',
        'Tomato',
        'Turquoise',
        'Violet',
        'Yellow',
        'YellowGreen'
    ];
    /**
     * Takes a Google Analytics key and returns a unique
     * animal and color for this session.
     */
    function gaToAnonAnimal(key) {
        if (anonAnimalCache[key]) {
            return anonAnimalCache[key];
        }
        let animal = getRandomAnimal();
        while (isAnimalUsed(animal, anonAnimalCache)) {
            animal = getRandomAnimal();
        }
        anonAnimalCache[key] = animal;
        return animal;
    }
    /** Checks if the anonymous animal is already in use */
    function isAnimalUsed(animal, cache) {
        const _animal = JSON.stringify(animal);
        const keys = Object.keys(cache);
        for (let i = 0; i < keys.length; i++) {
            if (JSON.stringify(cache[keys[i]]) === _animal) {
                return true;
            }
        }
        return false;
    }
    /** Generates a random anonymous animal */
    function getRandomAnimal() {
        return {
            name: getRandomEntry(animals),
            color: getRandomEntry(colors)
        };
    }
    /** Gets a random entry from an array */
    function getRandomEntry(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}
//# sourceMappingURL=app-shell.js.map