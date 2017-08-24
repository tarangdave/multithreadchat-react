import React from 'react';
import PropTypes from 'prop-types';
import {hashHistory} from 'react-router';
import Appbase from 'appbase-js';
var appbaseRef = new Appbase({
  url: "https://scalr.api.appbase.io",
  app: "realtimechat",
  credentials: "eRG9LkiEf:2ccad72c-8713-4618-9c37-29608d51a03b"
});

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

	propTypes: {
        	value: PropTypes.string,
        	onClick: PropTypes.func
    	}

	constructor(props) {
		super(props);
		this.state = {
			replyTextBox: false,
			replyText: '',
		}
		this.showReplyTextBox = this.showReplyTextBox.bind(this);
		this.editReply = this.editReply.bind(this);
		this.sendReply = this.sendReply.bind(this);
	}

	showReplyTextBox() {
		this.setState({replyTextBox: true});
	}

	editReply(event) {
		this.setState({replyText: event.target.value});
	}

	sendReply(event) {
		if(event.key == 'Enter') {
			this.props.onClick({id:Math.floor((Math.random() * 1000) + 1),name:localStorage.getItem("username"),text:this.state.replyText,repliedId:this.props.data.id})
			this.setState({replyTextBox: false, replyText: ''});
		}
	}

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
					<div className="messagebubble-reply-text-div" onClick={this.showReplyTextBox}>
						Reply
					</div>
					{
						this.state.replyTextBox ? <input value={this.state.replyText} onKeyPress={this.sendReply} onChange={this.editReply} className="frontpage-input-style all-font" type="text" placeholder="Type your Reply" /> : null
					}
				</div>
				{this.props.children}
			</div>
		)
	}
}

class ChatRoom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: localStorage.getItem('username'),
			allUsers: [],
			allMessage:{
				reply: [
				{id:1,name:'abc',text: 'Hi',reply: [
					{id:13,name:'bcd',text:'kafi low',reply:[
							{id:17,name:'pqr',text:'haha same here nai toh band baja do sale ki...bohot charbi chadhi hai saale ko',reply: []}
						]},
					{id:14,name:'xyz',text:'obviously',reply:[
							{id:15,name:'pqr',text:'haha same here nai toh band baja do sale ki...bohot charbi chadhi hai saale ko',reply:[{id:19,name:'pqr',text:'haha same',reply: []}]}
						]}
					]},
				{id:2,name:'bcd',text:'Lol Hi heightHi Hi Hi heightHiHi heightHi Hi Hi  Hi Hi heightHiHi',reply: [{id:25,name:'terry',text:'lolllaa ',reply: []}]},
				{id:3,name:'abc',text: 'Hi',reply: []},
				{id:4,name:'bcd',text:'Lol',reply: []},
				{id:5,name:'abc',text: 'Hi',reply: []},

			]},
			messageText: '',
			replyValue:'',
		};
		this.editMessage = this.editMessage.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.sendButtonMessage = this.sendButtonMessage.bind(this);
		this.replyClick = this.replyClick.bind(this);
		this.list = this.list.bind(this);
	}

	componentWillMount() {
		var self = this;
		appbaseRef.search({
			  type: "users",
			  body: {
			    query: {
			      match_all: {}
			    }
			  }
			}).on('data', function(res) {
			  console.log("query result: ", res);
			  var oldUsers = self.state.allUsers;
			  for(var i=0;i<res.hits.hits.length;i++){
			  	oldUsers.push({id:res.hits.hits[i]._source.id,name:res.hits.hits[i]._source.username});
			  	self.setState({allUsers: oldUsers});
			  }
			}).on('error', function(err) {
			  console.log("search error: ", err);
		})
		if(localStorage.getItem("username") == null) {
			hashHistory.replace("/");
		}
	}

	componentDidMount() {
		var self = this;
		appbaseRef.searchStream({
			  type: "users",
			  body: {
			    query: {
			      match_all: {}
			    }
			  }
			}).on('data', function(res) {
			  //console.log("query update: ", res);
			  var newUsers = self.state.allUsers;
			  newUsers.push({id:res._source.id,name:res._source.username});
			  self.setState({allUsers: newUsers});
			}).on('error', function(err) {
			  console.log("streaming error: ", err);
			})
	}

	editMessage(event) {
		this.setState({messageText: event.target.value});
	}

	sendMessage(event) {
		if(event.key == 'Enter') {
			var obj = this.state.allMessage
			obj['reply'].push({id: Math.floor((Math.random() * 1000) + 1), name:this.state.username, text:this.state.messageText});
			this.setState({allMessage: obj,messageText: ''});
		}
	}

	sendButtonMessage() {
		var obj = this.state.allMessage
		obj['reply'].push({id: Math.floor((Math.random() * 1000) + 1), name:this.state.username, text:this.state.messageText});
		this.setState({allMessage: obj,messageText: ''});
	}

	static findObjectById(root, id) {
		    if (root.reply) {
		        for (var k in root.reply) {
		            if (root.reply[k].id == id) {
		                return root.reply[k];
		            }
		            else if (root.reply.length) {
		                return ChatRoom.findObjectById(root.reply[k], id);
		            }
		        }
		    }
		}

	replyClick(value) {
		var ob = this.state.allMessage
		var id = value.repliedId;
		var abc = ChatRoom.findObjectById(ob, id);
		abc.reply.push({id: value.id, name: value.name, text: value.text,reply: []});
		this.setState({allMessage: ob});
		
	}

	list(data) {
	  	const children = (items) => {
	    	if (items) {
	      	return <div className="chatroom-chatbox-reply-list-children">{ this.list(items) }</div>
	      }
	    }
		return data.map((node, index) => {
	      return <MessageBubble key={ node.id } data={ node } value={this.state.replyValue} onClick={this.replyClick}>
	        { children(node.reply) }
	      </MessageBubble>
	    })
	  }

	render() {
		var activeNames = this.state.allUsers.map((station,i)=>{
			return (
				<ActiveUsers key={i} username={station.name} />
			)
		});
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
								{this.list(this.state.allMessage.reply)}
							</div>
						</div>
					</div>
				</div>
			</div>
			);
	}
}

export default ChatRoom;