import { useState, useRef } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import { Avatar, IconButton } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import Message from './Message';
import firebase from 'firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';

function ChatScreen({ chat, messages }) {
   const router = useRouter();
   const [user] = useAuthState(auth);
   const [input, setInput] = useState('');
   const endOfMessagesRef = useRef(null);

   const [messagesSnapshot] = useCollection(
      db
         .collection('chats')
         .doc(router.query.id)
         .collection('messages')
         .orderBy('timestamp', 'asc')
   );

   const [recipientSnapshot] = useCollection(
      db
         .collection('users')
         .where('email', '==', getRecipientEmail(chat.users, user))
   );

   function showMessages() {
      if (messagesSnapshot) {
         return messagesSnapshot.docs.map((message) => (
            <Message
               key={message.id}
               user={message.data().user}
               message={{
                  ...message.data(),
                  timestamp: message.data().timestamp?.toDate().getTime(),
               }}
            />
         ));
      } else {
         return JSON.parse(messages).map((message) => (
            <Message key={message.id} user={message.user} message={message} />
         ));
      }
   }

   function sendMessage(e) {
      e.preventDefault();

      db.collection('users').doc(user.uid).set(
         {
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
         },
         { merge: true }
      );

      db.collection('chats').doc(router.query.id).collection('messages').add({
         timestamp: firebase.firestore.FieldValue.serverTimestamp(),
         message: input,
         user: user.email,
         photoURL: user.photoURL,
      });

      setInput('');
      scrollToBottom();
   }

   function scrollToBottom() {
      endOfMessagesRef.current.scrollIntoView({
         behavior: 'smooth',
         block: 'start',
      });
   }

   const recipient = recipientSnapshot?.docs?.[0]?.data();
   const recipientEmail = getRecipientEmail(chat.users, user);

   return (
      <Container>
         <Header>
            {recipient ? (
               <Avatar src={recipient?.photoURL} />
            ) : (
               <Avatar>{recipientEmail[0]?.toUpperCase()}</Avatar>
            )}

            <HeaderInformation>
               <h3>{recipientEmail}</h3>

               {recipientSnapshot ? (
                  <p>
                     Last seen:{' '}
                     {recipient?.lastSeen?.toDate() ? (
                        <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                     ) : (
                        'Unavailable'
                     )}
                  </p>
               ) : (
                  <p>Loading last active...</p>
               )}
            </HeaderInformation>

            <HeaderIcons>
               <IconButton>
                  <AttachFileIcon style={{ color: '#00000073' }} />
               </IconButton>
               <IconButton>
                  <MoreVertIcon style={{ color: '#00000073' }} />
               </IconButton>
            </HeaderIcons>
         </Header>

         <MessageContainer>
            {showMessages()}
            <EndOfMessages ref={endOfMessagesRef} />
         </MessageContainer>

         <InputContainer>
            <IconButton>
               <InsertEmoticonIcon style={{ color: '#00000073' }} />
            </IconButton>

            <Input
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Type a message"
            />
            <button hidden disabled={!input} onClick={sendMessage}>
               Send Message
            </button>

            <IconButton>
               <MicIcon style={{ color: '#00000073' }} />
            </IconButton>
         </InputContainer>
      </Container>
   );
}

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
   position: sticky;
   background-color: #ededed;
   z-index: 100;
   top: 0;
   display: flex;
   align-items: center;
   padding: 0.625rem 1rem;
   height: 3.6875rem;
   border-bottom: 1px solid #d0d0d0;
`;

const HeaderInformation = styled.div`
   margin-left: 1rem;
   flex: 1;

   > h3 {
      margin-bottom: 0.1875rem;
      font-size: 1rem;
      font-weight: 400;
   }

   > p {
      font-size: 0.8125rem;
      color: #00000099;
   }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
   padding: 1.875rem;
   background-image: url('/img/background.png');
   background-size: cover;
   background-attachment: fixed;
   min-height: calc(100vh - 3.6875rem - 3.875rem);
   display: flex;
   flex-direction: column;
   justify-content: flex-end;
`;

const EndOfMessages = styled.div``;

const InputContainer = styled.form`
   position: sticky;
   background-color: #f0f0f0;
   z-index: 100;
   bottom: 0;
   display: flex;
   align-items: center;
   padding: 0.625rem;
   height: 3.875rem;
`;

const Input = styled.input`
   flex: 1;
   align-items: center;
   outline: none;
   border: none;
   border-radius: 1.3125rem;
   padding: 0.5625rem 0.75rem 0.6875rem;
   background-color: white;
   margin: 0.3125 0.625rem;
`;
