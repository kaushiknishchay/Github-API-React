import React from 'react';

export default function withBottomScroll(WrappedComponent, name, refreshMethod) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.isBottom = this.isBottom.bind(this);
      this.bottomDetect = this.bottomDetect.bind(this);
    }

    componentDidMount() {
      document.addEventListener('scroll', this.bottomDetect);
    }

    componentWillUnmount() {
      document.removeEventListener('scroll', this.bottomDetect);
    }

    bottomDetect() {
      const bodyTag = document.getElementsByTagName('body')[0];
      let isTabActive = true;
      if (document.getElementById(name)) {
        isTabActive = document.getElementById(name).classList.contains('active');
      }

      if (isTabActive && this.isBottom(bodyTag)) {
        refreshMethod();
      }
    }

    // eslint-disable-next-line class-methods-use-this
    isBottom(el) {
      return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
