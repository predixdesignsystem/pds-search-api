{
  const {customElement, property} = Polymer.decorators;
  
  @customElement('app-results-list')
  class AppResultsList extends Polymer.Element {
    @property({ type: String })
    title: string;
  
    @property({ type: Array })
    results: Result[];
  
    @property({ type: Number })
    now: number;

    connectedCallback() {
      super.connectedCallback();
      this.now = Date.now();

      /* Update the seed time every minute */
      setInterval(() => {
        this.now = Date.now();
      }, 60000);
    }

    _formatTime(now: number, created: number): string {
      return fromNow(new Date(now), new Date(created));
    }
  }
  
  /**
   * Formats the time since a date passed as a human-readable string.
   *
   * @example
   *
   *     var pastDate = new Date('2017-10-01T02:30');
   *     var message = fromNow(pastDate);
   *     //=> '2 days ago'
   */
  function fromNow(now: Date, date: Date): string {
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const years = Math.floor(seconds / 31536000);
    const months = Math.floor(seconds / 2592000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60);

    if (days > 548)                   return `${years} ${this.localize('years ago')}`;
    if (days >= 320 && days <= 547)   return this.localize('a year ago');
    if (days >= 45 && days <= 319)    return `${months} ${this.localize('months ago')}`;
    if (days >= 26 && days <= 45)     return this.localize('a month ago');
    if (hours >= 36 && days <= 25)    return `${days} ${this.localize('days ago')}`;
    if (hours >= 22 && hours <= 35)   return this.localize('a day ago');
    if (minutes >= 90 && hours <= 21) return `${hours} ${this.localize('hours ago')}`;
    if (minutes >= 45 && minutes <= 89) return this.localize('an hour ago');
    if (seconds >= 90 && minutes <= 44) return `${minutes} ${this.localize('minutes ago')}`;
    if (seconds >= 45 && seconds <= 89) return this.localize('a minute ago');
    if (seconds >= 0 && seconds <= 45)  return this.localize('a few seconds ago');
    return 'just now';
  }
}
