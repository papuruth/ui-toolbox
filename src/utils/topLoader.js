import NProgress from 'nprogress';

const apiInProgress = [];

class TopLoader {
  constructor() {
    NProgress.configure({ trickleSpeed: 150 });
  }

  hideLoaderTimeout = '';

  show(showTopLoader, apiId) {
    const noApiInProgress = !apiInProgress.length;
    if (showTopLoader) {
      apiInProgress.push(apiId);
      clearTimeout(this.hideLoaderTimeout);
    }

    if (showTopLoader && noApiInProgress) {
      document.documentElement.classList.remove('nprogress-done');
      NProgress.start();
    }
  }

  hide(showTopLoader, apiId) {
    const apiInProgressIndex = apiInProgress.findIndex((current) => current === apiId);

    if (apiInProgressIndex > -1) {
      apiInProgress.splice(apiInProgressIndex, 1);
    }

    const noApiInProgress = !apiInProgress.length;
    if (showTopLoader && noApiInProgress) {
      this.hideLoaderTimeout = setTimeout(() => {
        document.documentElement.classList.add('nprogress-done');
        NProgress.done();
      }, 250);
    }
  }
}

export default new TopLoader();
