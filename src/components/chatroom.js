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
			<div className="col-lg-12 col-md-12 col-sm-12 activeusers-main-div">
				<div className="col-lg-11 col-md-11 col-sm-11 all-font allusers-active-names-div">
					{this.props.username}
				</div>
				<div className="col-lg-1 col-md-1 col-sm-1 allUsers-active-main-div">
					<div className="allusers-active-div">
					</div>
				</div>
			</div>
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
			timeago: '',
		}
		this.showReplyTextBox = this.showReplyTextBox.bind(this);
		this.editReply = this.editReply.bind(this);
		this.sendReply = this.sendReply.bind(this);
	}
	/*show the textbox when reply is clicked*/
	showReplyTextBox() {
		this.setState({replyTextBox: true});
	}
	/*editing the reply*/
	editReply(event) {
		const replyText = event.target.value;
		this.setState({ replyText });
	}
	/*key event handler which sends the callback to the parent component - ChatRoom*/
	sendReply(event) {
		if(event.key === 'Enter') {
			if(this.state.replyText !== '') {
				this.props.onClick({id:Math.floor((Math.random() * 100000000000) + 1),name:localStorage.getItem("username"),time:Math.floor(Date.now()),text:this.state.replyText,repliedId:this.props.data.id})
				this.setState({replyTextBox: false, replyText: ''});
			}
			else {

			}
		}
	}

	static timeDifference(current, previous) {
		var msPerMinute = 60 * 1000;
    	var msPerHour = msPerMinute * 60;
    	var msPerDay = msPerHour * 24;
    	var msPerMonth = msPerDay * 30;
    	var msPerYear = msPerDay * 365;
    
    	var elapsed = current - previous;
    
    	if (elapsed < msPerMinute) {
    	     return Math.round(elapsed/1000) + ' sec ago';   
    	}
    
    	else if (elapsed < msPerHour) {
    	     return Math.round(elapsed/msPerMinute) + ' min ago';   
    	}
    	
    	else if (elapsed < msPerDay ) {
    	     return Math.round(elapsed/msPerHour ) + ' hr ago';   
    	}

    	else if (elapsed < msPerMonth) {
    	     return Math.round(elapsed/msPerDay) + ' d ago';   
    	}
    
    	else if (elapsed < msPerYear) {
    	     return Math.round(elapsed/msPerMonth) + ' m ago';   
    	}
    	
    	else {
    	     return Math.round(elapsed/msPerYear ) + ' yr ago';   
    	}
	}

	componentDidMount() {
		var current = Math.floor(Date.now());
		this.setState({timeago: MessageBubble.timeDifference(current,this.props.data.time)});

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
					<div className="messagebubble-time-div">
						{this.state.timeago}
					</div>
					<div className="messagebubble-reply-text-div" onClick={this.showReplyTextBox}>
						Reply
					</div>
					{
						this.state.replyTextBox ? <input autoFocus value={this.state.replyText} onKeyPress={this.sendReply} onChange={this.editReply} className="frontpage-input-style all-font" type="text" placeholder="Type your Reply" /> : null
					}
				</div>
				{
					/*to render the children i.e. the new replies*/
				}
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
			allMessage:{reply: []},
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
		/*Also, if a new user accesses this link without entering the username, it will be redirected to frontpage*/
		if(localStorage.getItem("username") == null) {
			hashHistory.replace("/");
		}
	}

	componentDidMount() {
		var self = this;
		var id;
		setTimeout(()=>{
			appbaseRef.search({
			  type: "activeUsers",
			  body: {
			    query: {
			      match: {
			      	"username": localStorage.getItem("username")
			      }
			    }
			  }
			}).on('data', function(res) {
				console.log(res);
			  localStorage.setItem("id",res.hits.hits[0]._id);
			  appbaseRef.update({
				  type: "activeUsers",
				  id: localStorage.getItem("id"),
				  body: {
				    doc: {
				      "time": Math.floor(Date.now())
				    }
				  }
				}).on('data', function(res) {

				}).on('error', function(err) {
				  console.log("update document error: ", err);
				})
			}).on('error', function(err) {
			  console.log("search error: ", err);
			})
		},1000);
		setInterval(()=>{
			appbaseRef.update({
			  type: "activeUsers",
			  id: localStorage.getItem("id"),
			  body: {
			    doc: {
			      "time": Math.floor(Date.now())
			    }
			  }
			}).on('data', function(res) {

			}).on('error', function(err) {
			  console.log("update document error: ", err);
			})
		},30000)
		var self = this;
		/*search for the message JSON and setting the state to pass it as a prop to the child component - MessageBubble*/
		appbaseRef.search({
			  type: "messages",
			  body: {
			    query: {
			      match_all: {}
			    }
			  }
			}).on('data', function(res) {
				var obj = self.state.allMessage;
				for(var i=0;i<res.hits.hits[0]._source.reply.length;i++){
					obj['reply'].push(res.hits.hits[0]._source.reply[i]);
					self.setState({allMessage: obj});
				}
				var objDiv = document.getElementById("chatbox-scroll");
				objDiv.scrollTop = objDiv.scrollHeight;
			}).on('error', function(err) {
			  console.log("search error: ", err);
		})
			/*stream the messages if a new message hits the table at the particular*/
		appbaseRef.getStream({
			  type: "messages",
			  id: "AV4YjNzJGGwAESeFuDSb"
			}).on('data', function(res) {
			  self.setState({allMessage: res._source});
			}).on('error', function(err) {
			  console.log("streaming error: ", err);
			})
			/*stream the users data as soon as a user logs in the chatroom*/
			appbaseRef.searchStream({
			  type: "activeUsers",
			  body: {
			    query: {
			      match_all: {}
			    }
			  }
			}).on('data', function(res) {
			  console.log("query update: ", res);	  
				  appbaseRef.search({
					  type: "activeUsers",
					  body: {
					    query: {
					      match_all: {}
					    }
					  }
					}).on('data', function(res) {
					  var oldUsers = [];
					  for(var i=0;i<res.hits.hits.length;i++){
						var currentTime = Math.floor(Date.now());
						if((currentTime - res.hits.hits[i]._source.time) < 60000){
							oldUsers.push({id:res.hits.hits[i]._source.id,name:res.hits.hits[i]._source.username});
						}			  	
					  	self.setState({allUsers: oldUsers});
					  }
					}).on('error', function(err) {
					  console.log("search error: ", err);
				})
			}).on('error', function(err) {
			  console.log("streaming error: ", err);
			})
	}
	/*typing the main message */
	editMessage(event) {
		this.setState({messageText: event.target.value});
	}
	/*key event handler to send the main message*/
	sendMessage(event) {
		if(event.key === 'Enter') {
			if(this.state.messageText !== '') {
				var obj = this.state.allMessage
				obj['reply'].push({"id": Math.floor((Math.random() * 10000000000) + 1), "name":this.state.username,"time": Math.floor(Date.now()), "text":this.state.messageText,"reply":[]});
				this.setState({allMessage: obj,messageText: ''});
				var self = this;
				appbaseRef.index({
					  type: "messages",
					  id: "AV4YjNzJGGwAESeFuDSb",
					  body: self.state.allMessage
					}).on('data', function(res) {
					  //console.log("successfully indexed: ", res);
					  var objDiv = document.getElementById("chatbox-scroll");
						objDiv.scrollTop = objDiv.scrollHeight;
					}).on('error', function(err) {
					  console.log("indexing error: ", err);
				})
			}
			else {

			}
		}
	}
	/*button click handler to send main message*/
	sendButtonMessage() {
		if(this.state.messageText !== '') {
			var obj = this.state.allMessage
			obj['reply'].push({"id": Math.floor((Math.random() * 10000000000) + 1), "name":this.state.username,"time": Math.floor(Date.now()), "text":this.state.messageText,"reply":[]});
			this.setState({allMessage: obj,messageText: ''});
			var objDiv = document.getElementById("chatbox-scroll");
			objDiv.scrollTop = objDiv.scrollHeight;
			var self = this;
				appbaseRef.index({
					  type: "messages",
					  id: "AV4YjNzJGGwAESeFuDSb",
					  body: self.state.allMessage
					}).on('data', function(res) {
					  //console.log("successfully indexed: ", res);
					}).on('error', function(err) {
					  console.log("indexing error: ", err);
				})
		}
		else {

		}
	}
	/*static function to get the object at a particular (key,value) pair*/
	static getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(ChatRoom.getObjects(obj[i], key, val));    
        } else 
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}
	/*function that gets the callback value from the child component - MessageBubble*/
	replyClick(value) {
		var ob = this.state.allMessage
		var id = value.repliedId;
		/*call the function getObjects() to push the new message reply.*/
		var abc = ChatRoom.getObjects(ob,'id',id);
		abc[0].reply.push({"id": value.id, "name": value.name,"time":value.time, "text": value.text,"reply": []});
		this.setState({allMessage: ob});
		var self = this;
			appbaseRef.index({
				  type: "messages",
				  id: "AV4YjNzJGGwAESeFuDSb",
				  body: self.state.allMessage
				}).on('data', function(res) {
				  //console.log("successfully indexed: ", res);
				}).on('error', function(err) {
				  console.log("indexing error: ", err);
			})
		
	}
	/*maps the messages json and renders the MessageBubble*/
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
								Online Users
							</div>
							<div className="row chatroom-visitor-list-box">
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
							<div className="chatroom-chatbox-messagebox-div" id="chatbox-scroll">
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