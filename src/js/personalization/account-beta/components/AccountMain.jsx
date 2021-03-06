import React from 'react';
import recordEvent from '../../../../platform/monitoring/record-event';
import AcceptTermsPrompt from '../../../../platform/user/authorization/components/AcceptTermsPrompt';
import LoadingIndicator from '@department-of-veterans-affairs/jean-pants/LoadingIndicator';
import Modal from '@department-of-veterans-affairs/jean-pants/Modal';

import AccountVerification from './AccountVerification';
import LoginSettings from './LoginSettings';
import MultifactorMessage from './MultifactorMessage';
import TermsAndConditions from './TermsAndConditions';
import BetaTools from '../containers/BetaTools';

class AccountMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  openModal = () => {
    recordEvent({ event: 'terms-shown-profile' });
    this.setState({ modalOpen: true }, () => {
      if (!this.props.terms.termsContent) {
        this.props.fetchLatestTerms('mhvac');
      }
    });
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  }

  acceptAndClose = (arg) => {
    this.props.acceptTerms(arg);
    this.closeModal();
  }

  renderModalContents() {
    const { terms } = this.props;

    if (!this.state.modalOpen) { return null; }

    if (terms.loading) {
      return <LoadingIndicator setFocus message="Loading your information..."/>;
    }

    if (terms.accepted) {
      return (
        <div>
          <h3>You have already accepted the terms and conditions.</h3>
          <div><button type="submit" onClick={this.closeModal}>Ok</button></div>
        </div>
      );
    }

    return <AcceptTermsPrompt terms={terms} cancelPath="/account-beta" onAccept={this.acceptAndClose} isInModal/>;
  }

  render() {
    const {
      profile: {
        loa,
        multifactor
      },
      terms
    } = this.props;

    return (
      <div>
        <AccountVerification loa={loa}/>
        <MultifactorMessage multifactor={multifactor}/>
        <LoginSettings/>
        <TermsAndConditions terms={terms} openModal={this.openModal}/>
        <h4>Have questions about signing in to Vets.gov?</h4>
        <p>
          Get answers to frequently asked questions about how to sign in, common issues with verifying your identity, and your privacy and security on Vets.gov.<br/>
          <a href="/faq">Go to Vets.gov FAQs</a>
        </p>
        <BetaTools/>
        <Modal
          cssClass="va-modal-large"
          contents={this.renderModalContents()}
          id="mhvac-modal"
          visible={this.state.modalOpen}
          onClose={this.closeModal}/>
      </div>
    );
  }
}

export default AccountMain;
