{
  const {customElement, property} = Polymer.decorators;

  // Gesture events like tap and track generated from touch will not be
  // preventable, allowing for better scrolling performance.
  Polymer.setPassiveTouchGestures(true);

  @customElement('app-shell')
  class AppShell extends Polymer.Element {
    @property({ type: Array })
    searches: Result[] = [];

    @property({ type: Array })
    views: Result[] = [];

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
        this.searches = [{label, value, created, detail, type}, ...this.searches];
      });

      /* Listen for new view events and add them to the page */
      const viewRef = firebase.database().ref('/view').limitToLast(50);
      viewRef.on('child_added', data => {
        const child = data.val();
        const label = pathToSectionTitle(child.path);
        const value = child.name;
        const created = child._createdAt;
        this.views = [{label, value, created}, ...this.views];
      });
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

}