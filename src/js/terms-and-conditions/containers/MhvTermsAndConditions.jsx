import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import appendQuery from 'append-query';
import URLSearchParams from 'url-search-params';

import AlertBox from '@department-of-veterans-affairs/jean-pants/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/jean-pants/LoadingIndicator';

import { getScrollOptions } from '../../../platform/utilities/ui';

import {
  acceptTerms,
  fetchLatestTerms,
  fetchTermsAcceptance
} from '../actions';

const ScrollElement = Scroll.Element;
const scroller = Scroll.scroller;

const TERMS_NAME = 'mhvac';

const unagreedBannerProps = {
  headline: 'Using Vets.gov Health Tools',
  content: 'Before you can use the health tools on Vets.gov, you’ll need to read and agree to the Terms and Conditions below. This will give us your permission to show you your VA medical information on this site.'
};

export class MhvTermsAndConditions extends React.Component {
  constructor(props) {
    super(props);

    const searchParams = new URLSearchParams(window.location.search);
    this.redirectUrl = searchParams.get('tc_redirect');

    this.state = {
      isAgreementChecked: false,
      showAcceptedMessage: false,
      showCanceledMessage: false
    };
  }

  componentDidMount() {
    this.props.fetchLatestTerms(TERMS_NAME);
    if (sessionStorage.userToken) { this.props.fetchTermsAcceptance(TERMS_NAME); }
  }

  redirect = () =>  {
    if (this.redirectUrl) {
      const newUrl = appendQuery(this.redirectUrl, { tc_accepted: true }); // eslint-disable-line camelcase
      window.location.replace(newUrl);
    }
  }

  handleAgreementCheck = () => {
    this.setState({ isAgreementChecked: !this.state.isAgreementChecked });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.acceptTerms(TERMS_NAME);
    this.setState({ showAcceptedMessage: true }, () => {
      scroller.scrollTo('banner', getScrollOptions());
      this.redirect();
    });
  }

  handleCancel = (e) => {
    e.preventDefault();
    this.setState({ showCanceledMessage: true }, () => {
      scroller.scrollTo('banner', getScrollOptions());
    });
  }

  handleCloseBanner = () => {
    this.setState({
      showAcceptedMessage: false,
      showCanceledMessage: false
    });
  }

  renderBanner = () => {
    let bannerProps = null;

    if (this.state.showAcceptedMessage) {
      bannerProps = {
        headline: 'You’ve accepted the Terms and Conditions for using Vets.gov health tools',
        content: ''
      };
    } else if (this.state.showCanceledMessage) {
      bannerProps = unagreedBannerProps;
    }

    return bannerProps && (
      <ScrollElement name="banner">
        <AlertBox
          {...bannerProps}
          isVisible
          status="success"
          onCloseAlert={this.handleCloseBanner}/>
      </ScrollElement>
    );
  }

  renderAgreementSection = () => {
    if (!this.props.isLoggedIn || this.props.accepted) { return null; }

    const yesCheckbox = (
      <div>
        <input
          type="checkbox"
          id="agreement-checkbox"
          value="yes"
          checked={this.state.isAgreementChecked}
          onChange={this.handleAgreementCheck}/>
        <label
          className="agreement-label"
          htmlFor="agreement-checkbox">
          {this.props.attributes.yesContent}
        </label>
      </div>
    );

    const submitButton = (
      <button
        className="usa-button submit-button"
        disabled={!this.state.isAgreementChecked}>
        Submit
      </button>
    );

    const cancelButton = (
      <button
        className="usa-button usa-button-secondary"
        type="button"
        onClick={this.handleCancel}>
        Cancel
      </button>
    );

    return (
      <div>
        {yesCheckbox}
        <div className="tc-buttons">
          {submitButton}
          {cancelButton}
        </div>
      </div>
    );
  }

  /* eslint-disable react/no-danger */
  renderTermsAndConditions = () => {
    const { loading } = this.props;

    if (loading.tc || loading.acceptance) {
      return <LoadingIndicator setFocus message="Loading terms and conditions..."/>;
    }

    const { title, headerContent, termsContent } = this.props.attributes;

    const header = !this.props.accepted && (
      <div>
        <div className="usa-alert usa-alert-info no-background-image">
          <h3>{unagreedBannerProps.headline}</h3>
          <p>{unagreedBannerProps.content}</p>
        </div>
        <div className="va-introtext" dangerouslySetInnerHTML={{ __html: headerContent }}/>
        <h3>Terms and Conditions</h3>
      </div>
    );

    return (
      <form onSubmit={this.handleSubmit}>
        <h1>{title}</h1>
        {header}
        <hr/>
        <div dangerouslySetInnerHTML={{ __html: termsContent }}/>
        <hr/>
        {this.renderAgreementSection()}
      </form>
    );
  }
  /* eslint-enable react/no-danger */

  render() {
    return (
      <main className="terms-and-conditions">
        <div className="container">
          <div className="row primary">
            {this.renderBanner()}
            <div className="columns small-12" role="region" aria-label="Terms and Conditions">
              {this.renderTermsAndConditions()}
            </div>
          </div>
        </div>
      </main>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.termsAndConditions,
  isLoggedIn: state.user.login.currentlyLoggedIn
});

const mapDispatchToProps = {
  acceptTerms,
  fetchLatestTerms,
  fetchTermsAcceptance
};

export default connect(mapStateToProps, mapDispatchToProps)(MhvTermsAndConditions);
