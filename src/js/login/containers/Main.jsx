import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import appendQuery from 'append-query';

import LoadingIndicator from '../../common/components/LoadingIndicator';
import Modal from '../../common/components/Modal';
import environment from '../../common/helpers/environment';
import { getUserData, addEvent, getLoginUrls, getVerifyUrl, handleLogin } from '../../common/helpers/login-helpers';

import { updateLoggedInStatus, updateSessionExpiresSoon, updateLogoutUrl, updateLogInUrls, updateVerifyUrl, toggleLoginModal } from '../actions';
import SearchHelpSignIn from '../components/SearchHelpSignIn';
import Signin from '../components/Signin';
import Verify from '../components/Verify';
import SessionRefreshModal from '../components/SessionRefreshModal';

class Main extends React.Component {

  componentDidMount() {
    if (sessionStorage.userToken) {
      this.getLogoutUrl();
      this.getVerifyUrl();
    }
    this.getLoginUrls();
    addEvent(window, 'message', (evt) => {
      this.setMyToken(evt);
    });
    this.bindNavbarLinks();
    // In some cases this component is mounted on a url that is part of the login process and doesn't need to make another
    // request, because that data will be passed to the parent window and done there instead.
    if (!window.location.pathname.includes('auth/login/callback')) {
      window.onload = () => {
        this.loginUrlRequest.then(this.checkTokenStatus);
      };
    }
  }

  componentDidUpdate(prevProps) {
    const shouldGetVerifyUrl =
      !prevProps.login.currentlyLoggedIn &&
      this.props.login.currentlyLoggedIn &&
      !this.props.login.verifyUrl;

    if (shouldGetVerifyUrl) {
      this.getVerifyUrl();
    }
  }

  componentWillUnmount() {
    this.loginUrlRequest.abort();
    this.verifyUrlRequest.abort();
    this.logoutUrlRequest.abort();
    this.unbindNavbarLinks();
  }

  getVerifyUrl = () => {
    const { currentlyLoggedIn, verifyUrl } = this.props.login;
    if (currentlyLoggedIn && !verifyUrl) {
      this.verifyUrlRequest = getVerifyUrl(this.props.updateVerifyUrl);
    }
  }

  setMyToken = (event) => {
    if (event.data === sessionStorage.userToken) {
      this.props.getUserData();
      this.getLogoutUrl();
    }
  }

  getLoginUrls = () => {
    this.loginUrlRequest = this.props.getLoginUrls();
  }

  getLogoutUrl = () => {
    this.logoutUrlRequest = fetch(`${environment.API_URL}/v0/sessions`, {
      method: 'DELETE',
      headers: new Headers({
        Authorization: `Token token=${sessionStorage.userToken}`
      })
    }).then(response => {
      return response.json();
    }).then(json => {
      if (json.logout_via_get) {
        this.props.updateLogoutUrl(json.logout_via_get);
      }
    });
  }

  bindNavbarLinks() {
    [...document.querySelectorAll('.login-required')].forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const nextQuery = { next: el.getAttribute('href') };
        const nextPath = appendQuery('/', nextQuery);
        history.pushState({}, el.textContent, nextPath);
        this.props.toggleLoginModal(true);
      });
    });
  }

  unbindNavbarLinks() {
    [...document.querySelectorAll('.login-required')].forEach(el => {
      el.removeEventListener('click');
    });
  }

  handleLogout = () => {
    window.dataLayer.push({ event: 'logout-link-clicked' });
    const myLogoutUrl = this.props.login.logoutUrl;
    if (myLogoutUrl) {
      window.dataLayer.push({ event: 'logout-link-opened' });
      const receiver = window.open(myLogoutUrl, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
      receiver.focus();
    }
  }

  handleSignup = () => {
    window.dataLayer.push({ event: 'register-link-clicked' });
    const myLoginUrl = this.props.login.loginUrls.idme;
    if (myLoginUrl) {
      window.dataLayer.push({ event: 'register-link-opened' });
      const receiver = window.open(`${myLoginUrl}&op=signup`, 'signinPopup', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
      receiver.focus();
    }
  }

  handleLogin = (loginUrl = 'idme') => {
    this.loginUrlRequest = handleLogin(this.props.login.loginUrls[loginUrl], this.props.updateLogInUrls);
  }

  checkTokenStatus = () => {
    if (sessionStorage.userToken) {
      if (this.props.getUserData()) {
        this.props.updateLoggedInStatus(true);
      }
    } else {
      this.props.updateLoggedInStatus(false);
    }
  }

  handleCloseModal = () => {
    this.props.toggleLoginModal(false);
    window.dataLayer.push({ event: 'login-modal-closed' });
  }

  renderModalContent() {
    const currentlyLoggedIn = this.props.login.currentlyLoggedIn;

    if (this.props.login.loginUrls) {
      return (<Signin
        onLoggedIn={() => this.props.toggleLoginModal(false)}
        currentlyLoggedIn={currentlyLoggedIn}
        handleSignup={this.handleSignup}
        handleLogin={this.handleLogin}/>);
    }

    if (this.props.login.loginUrlsError) {
      return (
        <div>
          <br/>
          <h3>Something went wrong on our end</h3>
          <p>Please refresh this page or try again later. You can also call the Vets.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY: <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).</p>
        </div>
      );
    }

    return <LoadingIndicator message="Loading the application..."/>;
  }

  render() {
    switch (this.props.renderType) {
      case 'navComponent': {
        return (
          <div>
            <SearchHelpSignIn onUserLogout={this.handleLogout}/>
            <Modal
              cssClass="va-modal-large"
              visible={this.props.login.showModal}
              focusSelector="button"
              onClose={this.handleCloseModal}
              id="signin-signup-modal"
              title="Sign in to Vets.gov">
              {this.renderModalContent()}
            </Modal>
            <SessionRefreshModal
              updateSessionExpiresSoon={this.props.updateSessionExpiresSoon}
              login={this.props.login}
              profile={this.props.profile}
              visible={this.props.login.showSessionRefreshModal}
              sessionExpiresAfterMinutes={this.props.sessionExpiresAfterMinutes}
              sessionExpirationIntervalSeconds={this.props.sessionExpirationIntervalSeconds}
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}/>
          </div>
        );
      }
      case 'verifyPage':
        return this.props.profile.loading ?
          (<LoadingIndicator message="Loading the application..."/>) :
          (<Verify
            shouldRedirect={this.props.shouldRedirect}
            login={this.props.login}
            profile={this.props.profile}
            handleLogin={this.handleLogin}/>);
      default:
        return null;
    }
  }
}

const mapStateToProps = (state) => {
  const userState = state.user;
  return {
    login: userState.login,
    profile: userState.profile
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLoginUrls: () => {
      return getLoginUrls(dispatch);
    },
    updateLogInUrls: (update) => {
      dispatch(updateLogInUrls(update));
    },
    updateVerifyUrl: (update) => {
      dispatch(updateVerifyUrl(update));
    },
    updateLogoutUrl: (update) => {
      dispatch(updateLogoutUrl(update));
    },
    updateLoggedInStatus: (update) => {
      dispatch(updateLoggedInStatus(update));
    },
    updateSessionExpiresSoon: (update) => {
      dispatch(updateSessionExpiresSoon(update));
    },
    toggleLoginModal: (update) => {
      dispatch(toggleLoginModal(update));
    },
    getUserData: () => {
      getUserData(dispatch);
    },
  };
};

Main.propTypes = {
  onLoggedIn: PropTypes.func,
  renderType: PropTypes.oneOf([
    'navComponent',
    'verifyPage',
  ]).isRequired,
  shouldRedirect: PropTypes.bool,
  sessionExpiresAfterMinutes: PropTypes.number,
  sessionExpirationIntervalSeconds: PropTypes.number,
};

Main.defaultProps = {
  sessionExpiresAfterMinutes: 60,
  sessionExpirationIntervalSeconds: 10
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
export { Main };
