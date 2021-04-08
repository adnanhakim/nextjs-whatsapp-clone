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
                     Last active:{' '}
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
                  <AttachFileIcon />
               </IconButton>
               <IconButton>
                  <MoreVertIcon />
               </IconButton>
            </HeaderIcons>
         </Header>

         <MessageContainer>
            {showMessages()}
            <EndOfMessages ref={endOfMessagesRef} />
         </MessageContainer>

         <InputContainer>
            <IconButton>
               <InsertEmoticonIcon />
            </IconButton>

            <Input value={input} onChange={(e) => setInput(e.target.value)} />
            <button hidden disabled={!input} onClick={sendMessage}>
               Send Message
            </button>

            <IconButton>
               <MicIcon />
            </IconButton>
         </InputContainer>
      </Container>
   );
}

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
   position: sticky;
   background-color: white;
   z-index: 100;
   top: 0;
   display: flex;
   align-items: center;
   padding: 0.6875rem;
   height: 5rem;
   border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
   margin-left: 1rem;
   flex: 1;

   > h3 {
      margin-bottom: 0.1875rem;
   }

   > p {
      font-size: 0.875rem;
      color: gray;
   }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
   padding: 1.875rem;
   /* background-color: #e5ded8; */
   background-image: url('https://blog.1a23.com/wp-content/uploads/sites/2/2020/02/Desktop.png');
   background-size: cover;
   background-attachment: fixed;
   min-height: 90vh;
`;

const EndOfMessages = styled.div`
   margin-bottom: 3.125rem;
`;

const InputContainer = styled.form`
   position: sticky;
   background-color: white;
   z-index: 100;
   bottom: 0;
   display: flex;
   align-items: center;
   padding: 0.625rem;
`;

const Input = styled.input`
   flex: 1;
   align-items: center;
   outline: none;
   border: none;
   border-radius: 0.625rem;
   padding: 1.25rem;
   background-color: whitesmoke;
   margin: 0 1rem;
`;
