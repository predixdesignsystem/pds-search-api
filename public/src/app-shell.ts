{
  const {customElement, property} = Polymer.decorators;

  interface StatsResponse {
    totalViews10d: number; 
    totalViews24h: number;
    topPages10d: StatsPage[];
    topSections10d: StatsSection[];
  }

  interface StatsPage {
    name: string;
    count: number
  }

  interface StatsSection {
    section: string;
    count: number;
  }

  // Gesture events like tap and track generated from touch will not be
  // preventable, allowing for better scrolling performance.
  Polymer.setPassiveTouchGestures(true);

  @customElement('app-shell')
  class AppShell extends Polymer.Element {
    @property({ type: Array })
    searches: Result[] = [];

    @property({ type: Array })
    views: Result[] = [];

    @property({ type: Number })
    views10d: number = 0;

    @property({ type: Number })
    views24h: number = 0;

    @property({ type: Array })
    topPages: StatsPage[];

    @property({ type: Array })
    topSections: StatsSection[];

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
        this.searches = [{label, value, created, detail, type, animal}, ...this.searches];
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
        this.views = [{label, value, created, animal}, ...this.views];
        if (statsInitialized) {
          this.views10d++;
          this.views24h++;
        }
      });

      /* Fetch stats for the last 10 days */
      fetch('https://us-central1-pds-search-api.cloudfunctions.net/stats10d')
        .then(response => response.json())
        .then((data: StatsResponse) => {
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

    _getPagesChartLabels(pages: StatsPage[]) {
      return pages.slice(0,7).map(p => p.name);
    }

    _getSectionsChartLabels(sections: StatsSection[]) {
      return sections.slice(0,7).map(p => p.section);
    }

    _getChartData(source: Array<StatsPage|StatsSection>) {
      return source.slice(0,7).map(p => p.count);
    }
  }

  /**
   * Capitalizes the first letter of a string and returns it.
   */
  function capitalize(str: string): string {
    return str[0].toUpperCase() + str.slice(1);
  }

  /**
   * Turns page paths into human-readable section titles for
   * the website.
   */
  function pathToSectionTitle(path: string): string {
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

  
  interface AnonAnimalCache {
    [key: string]: AnonAnimal;
  }

  const anonAnimalCache: AnonAnimalCache = {}

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
  ]

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
  ]

  /**
   * Takes a Google Analytics key and returns a unique
   * animal and color for this session.
   */
  function gaToAnonAnimal(key: string): AnonAnimal {
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
  function isAnimalUsed(animal: AnonAnimal, cache: AnonAnimalCache): boolean {
    const _animal = JSON.stringify(animal);
    const keys = Object.keys(cache);
    for (let i=0; i<keys.length; i++) {
      if (JSON.stringify(cache[keys[i]]) === _animal) {
        return true;
      }
    }
    return false;
  }

  /** Generates a random anonymous animal */
  function getRandomAnimal(): AnonAnimal {
    return {
      name: getRandomEntry(animals),
      color: getRandomEntry(colors)
    }
  }

  /** Gets a random entry from an array */
  function getRandomEntry(arr: string[]): string {
    return arr[Math.floor(Math.random()*arr.length)]
  }
}

