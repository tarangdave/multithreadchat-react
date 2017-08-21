import React from 'react';
// import PropTypes from 'prop-types';

class WelcomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
		};
		this.editUsername = this.editUsername.bind(this);
	}

	editUsername(event) {
		this.setState({username: event.target.value});
	}

  render() {
    return (
      <div>
      	<div className="frontpage-display-layout">
      		<div className="frontpage-input-background col-lg-4 col-md-4 col-sm-4">
      			<div className="frontpage-input-header">
      			</div>
      			<div className="row frontpage-input-content margin-0">
      				<div className="all-font frontpage-input-title">Enter your chat name</div>
      				<div className="col-lg-12 col-md-12 col-sm-12 frontpage-input-image-logo">
      					<div className="col-lg-6 col-md-6 col-sm-6 ">
      						<div>
      							<img src="https://appbase.io/images/logo-blue.png" alt="Appbase Logo"/>
      						</div>
      					</div>
      					<div className="col-lg-6 col-md-6 col-sm-6">
      						<input type="text" value={this.state.username} onChange={this.editUsername} className="frontpage-input-style all-font" placeholder="Enter username"/>
      					</div>
      				</div>
      			</div>
      			<div className="frontpage-input-footer">
      			</div>
      		</div>
      	</div>
      </div>
    );
  }
}
export default WelcomePage;
