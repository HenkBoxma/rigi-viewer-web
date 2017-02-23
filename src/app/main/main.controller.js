export class MainController {
  constructor($log, $rootScope, $window) {
    'ngInject';
    this.$log = $log;
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.init();
  }

  init() {
    this.log = [];
    this.url = '';
    this.signature = '';
    this.translation = '';
    this.isLoaded = false;
  }

  getPreview() {
    this.url += `/context/signature/${this.signature}`;
    let targetWindow = this.$window.open(this.url, "Preview", "toolbar=0");
    this.start = true;
    this.buildChannel(targetWindow);
  }

  buildChannel(targetWindow) {
    const channel = Channel.build({
      window: targetWindow,
      origin: "*",
      scope: "rigiAPIScope",
      reconnect: true,
      onReady: () => {
        this.channel = channel;
        this.$window.channel = this.channel;
        this.isLoaded = true;
        channel.bind("onStringSelected", (trans, signature) => {
          this.logEntry('from', 'OnStringSelected', signature, true);
        });
        channel.bind("onPublishSignatures", (trans, signatures) => {
          this.logEntry('from', 'OnPublishSignatures', signatures, true);
        });
      },
      onError: err => this.$log.err(err)
    });
  }

  logEntry(direction, event, data, apply) {
    apply = apply || false;
    const append = (direction, event, data) => {
      this.log.push({
        time: Date.now(),
        direction: direction === 'from' ? 'RIGI -> Viewer' : 'Viewer -> RIGI',
        event,
        data
      });
    };

    if (!apply) {
      return append(direction, event, data);
    }

    return this.$rootScope.$apply(() => {
      append(direction, event, data);
    });
  }

  selectSignature() {
    this.logEntry('to', 'Select', this.signature);
    this.channel.notify({
      method: "select",
      params: this.signature
    });
  }

  translateSignature() {
    this.logEntry('to', 'Translate', `${this.signature}-${this.translation}`);
    this.channel.notify({
      method: "translate",
      params: {signature: this.signature, translation: this.translation}
    });
    this.logEntry('from', 'Translate', `${this.signature}-${this.translation}`, true);
  }
}
