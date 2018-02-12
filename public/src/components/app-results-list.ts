/// <reference path="../../bower_components/polymer/types/polymer-element.d.ts" />
/// <reference path="../../bower_components/polymer-decorators/polymer-decorators.d.ts" />

{
  const {customElement, property} = Polymer.decorators;

  interface Result {
    label: string;
    value: string;
    detail?: string;
    type?: string;
    /** Created time in seconds since epoch */
    created: number;
  }
  
  @customElement('app-results-list')
  class MyApp extends Polymer.Element {
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
  
    if (days > 548) {
      return years + ' years ago';
    }
    if (days >= 320 && days <= 547) {
      return 'a year ago';
    }
    if (days >= 45 && days <= 319) {
      return months + ' months ago';
    }
    if (days >= 26 && days <= 45) {
      return 'a month ago';
    }
  
    const hours = Math.floor(seconds / 3600);
  
    if (hours >= 36 && days <= 25) {
      return days + ' days ago';
    }
    if (hours >= 22 && hours <= 35) {
      return 'a day ago';
    }
  
    const minutes = Math.floor(seconds / 60);
  
    if (minutes >= 90 && hours <= 21) {
      return hours + ' hours ago';
    }
    if (seconds >= 90 && minutes <= 89) {
      return 'last hour';
    }
  
    return 'just now';
  }
}
