import React from 'react';
// import PropTypes from 'prop-types';

class ActiveUsers extends React.Component {

	render() {
		return(
			<li>
				{this.props.username}
			</li>
		)
	}
}

class MessageBubble extends React.Component {

	render() {
		return(
			<div className="row messagebubble-main-div">
				<div className="all-font messagebubble-outline">
					<div className="messagebubble-username">
						{this.props.data.name}
					</div>
					<div className="messagebubble-user-chat">
						{this.props.data.text}
					</div>
				</div>
			</div>
		)
	}
}

class ChatRoom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: localStorage.getItem('username'),
			allUsers: [{id:1,name:'abc'},{id:2,name:'bcd'}],
			messageList: [
				{id:1,name:'abc',text: 'Hi'},
				{id:2,name:'bcd',text:'Lol Hi heightHi Hi Hi heightHiHi heightHi Hi Hi  Hi Hi heightHiHi'},
				{id:1,name:'abc',text: 'Hi'},
				{id:2,name:'bcd',text:'Lol'},
				{id:1,name:'abc',text: 'Hi'},
				{id:2,name:'bcd',text:'Lol'},
				{id:1,name:'abc',text: 'Hi'},
				{id:2,name:'bcd',text:'Lol'},
				{id:1,name:'abc',text: 'Hi'},
				{id:2,name:'bcd',text:'Lol'},
				{id:1,name:'abc',text: 'Hi'},
				{id:2,name:'bcd',text:'Lol'}
			],
			messageText: '',
		};
		this.editMessage = this.editMessage.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.sendButtonMessage = this.sendButtonMessage.bind(this);
	}

	editMessage(event) {
		this.setState({messageText: event.target.value});
	}

	sendMessage(event) {
		if(event.key == 'Enter') {
			var tempMessageList = this.state.messageList;
			tempMessageList.push({id: 4, name:this.state.username, text:this.state.messageText});
			this.setState({messageList: tempMessageList,messageText: ''});

		}
	}

	sendButtonMessage() {
		var tempMessageList = this.state.messageList;
		tempMessageList.push({id: 4, name:this.state.username, text:this.state.messageText});
		this.setState({messageList: tempMessageList,messageText: ''});
	}

	render() {
		var activeNames = this.state.allUsers.map((station,i)=>{
			return (
				<ActiveUsers key={i} username={station.name} />
			)
		});
		var messageList = this.state.messageList.map((station,i)=> {
			return (
				<MessageBubble key={i} data={station} />
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
					<div className="col-lg-9 col-sm-9 col-md-9 chatroom-chatbox padding-0">
						<div className="col-lg-12 col-md-12 col-sm-12 padding-0" style={{height: '100%'}}>
							<div className="col-lg-12 col-md-12 col-sm-12 chatroom-chatbox-inputbox-fixed">
								<div className="col-lg-12 col-md-12 col-sm-12 chatroom-chatbox-input-bound padding-0">
									<div className="col-lg-11 col-md-11 col-sm-11 padding-0">
										<input type="text" value={this.state.messageText} onKeyPress={this.sendMessage} onChange={this.editMessage} className="frontpage-input-style all-font chatroom-chatbox-input" placeholder="Type your message" />
									</div>
									<div className="col-lg-1 col-md-1 col-sm-1 chatroom-chatbox-send-svg" onClick={this.sendButtonMessage}>
										<svg viewBox="0 0 24 24" width="24" height="24">
											<path opacity=".4" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z">
											</path>
										</svg>
									</div>
								</div>
							</div>
							<div className="chatroom-chatbox-messagebox-div">
								{messageList}
							</div>
						</div>
					</div>
				</div>
			</div>
			);
	}
}

export default ChatRoom;