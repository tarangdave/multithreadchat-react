import React from 'react';
// import PropTypes from 'prop-types';

class ActiveUsers extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<li>
				{this.props.username}
			</li>
		)
	}
}

class ChatRoom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: localStorage.getItem('username'),
			allUsers: [{id:1,name:'abc'},{id:2,name:'bcd'}],
			messageText: '',
		};
		this.editMessage = this.editMessage.bind(this);
	}

	editMessage(event) {
		this.setState({messageText: event.target.value});
	}

	render() {
		var activeNames = this.state.allUsers.map((station)=>{
			return (
				<ActiveUsers username={station.name} />
			)
		})
		return (
			<div>
				<div className="col-lg-12 col-md-12 col-sm-12 chatroom-outerlayout">
					<div className="col-lg-3 col-md-3 col-sm-3 chatroom-activity-box padding-20">
						<div className="row margin-0">
							<div className="chatroom-welcome-div all-font">
								Welcome, <span>{this.state.username}</span>
							</div>
							<div className="chatroom-logo-gif">
								<img src="https://media.giphy.com/media/3o85xjSETVG3OpPyx2/giphy.gif" alt="Appbase GIF" />
							</div>
							<div className="all-font chatroom-visitor-list-title">
								Visitor's List
							</div>
							<div className="chatroom-visitor-list-box">
								{activeNames}
							</div>
						</div>
					</div>
					<div className="col-lg-9 col-sm-9 col-md-9 chatroom-chatbox">
						<div className="row">
							<div className="col-lg-12 col-md-12 col-sm-12 chatroom-chatbox-inputbox-fixed">
								<div className="col-lg-12 col-md-12 col-sm-12 chatroom-chatbox-input-bound padding-0">
									<div className="col-lg-11 col-md-11 col-sm-11 padding-0">
										<input type="text" value={this.state.messageText} onChange={this.editMessage} className="frontpage-input-style all-font chatroom-chatbox-input" placeholder="Type your message" />
									</div>
									<div className="col-lg-1 col-md-1 col-sm-1 chatroom-chatbox-send-svg">
										<svg viewBox="0 0 24 24" width="24" height="24">
											<path opacity=".4" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z">
											</path>
										</svg>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			);
	}
}

export default ChatRoom;