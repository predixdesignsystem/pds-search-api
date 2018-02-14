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
    let AppResultsList = class AppResultsList extends Polymer.Element {
        connectedCallback() {
            super.connectedCallback();
            this.now = Date.now();
            /* Update the seed time every minute */
            setInterval(() => {
                this.now = Date.now();
            }, 60000);
        }
        _formatTime(now, created) {
            return fromNow(new Date(now), new Date(created));
        }
    };
    __decorate([
        property({ type: String }),
        __metadata("design:type", String)
    ], AppResultsList.prototype, "title", void 0);
    __decorate([
        property({ type: Array }),
        __metadata("design:type", Array)
    ], AppResultsList.prototype, "results", void 0);
    __decorate([
        property({ type: Number }),
        __metadata("design:type", Number)
    ], AppResultsList.prototype, "now", void 0);
    AppResultsList = __decorate([
        customElement('app-results-list')
    ], AppResultsList);
    /**
     * Formats the time since a date passed as a human-readable string.
     *
     * @example
     *
     *     var pastDate = new Date('2017-10-01T02:30');
     *     var message = fromNow(pastDate);
     *     //=> '2 days ago'
     */
    function fromNow(now, date) {
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        const years = Math.floor(seconds / 31536000);
        const months = Math.floor(seconds / 2592000);
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor(seconds / 60);
        if (days > 548)
            return `${years} ${this.localize('years ago')}`;
        if (days >= 320 && days <= 547)
            return this.localize('a year ago');
        if (days >= 45 && days <= 319)
            return `${months} ${this.localize('months ago')}`;
        if (days >= 26 && days <= 45)
            return this.localize('a month ago');
        if (hours >= 36 && days <= 25)
            return `${days} ${this.localize('days ago')}`;
        if (hours >= 22 && hours <= 35)
            return this.localize('a day ago');
        if (minutes >= 90 && hours <= 21)
            return `${hours} ${this.localize('hours ago')}`;
        if (minutes >= 45 && minutes <= 89)
            return this.localize('an hour ago');
        if (seconds >= 90 && minutes <= 44)
            return `${minutes} ${this.localize('minutes ago')}`;
        if (seconds >= 45 && seconds <= 89)
            return this.localize('a minute ago');
        if (seconds >= 0 && seconds <= 45)
            return this.localize('a few seconds ago');
        return 'just now';
    }
}
//# sourceMappingURL=app-results-list.js.map