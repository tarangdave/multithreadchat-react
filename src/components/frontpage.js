import React from 'react';
import {hashHistory} from 'react-router';
import Appbase from 'appbase-js';
var appbaseRef = new Appbase({
  url: "https://scalr.api.appbase.io",
  app: "realtimechat",
  credentials: "eRG9LkiEf:2ccad72c-8713-4618-9c37-29608d51a03b"
});
// import PropTypes from 'prop-types';

class WelcomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
		};
		this.editUsername = this.editUsername.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	editUsername(event) {
		this.setState({username: event.target.value});
	}

	handleKeyPress(event) {
		if (event.key === 'Enter') {
			appbaseRef.index({
				  type: "users",
				  body: {
				  	"id": Math.floor((Math.random() * 100000000) + 1),
				    "username": this.state.username
				  }
				}).on('data', function(res) {
				  console.log("successfully indexed: ", res);
				}).on('error', function(err) {
				  console.log("indexing error: ", err);
			})
			localStorage.setItem("username", this.state.username);
			hashHistory.replace("/chatroom");
		}
	}

	componentWillMount() {
		if(localStorage.getItem("username") != null) {
			hashHistory.replace("/chatroom");
		}
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
      						<input type="text" value={this.state.username} onKeyPress={this.handleKeyPress} onChange={this.editUsername} className="frontpage-input-style all-font" placeholder="Enter username"/>
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
