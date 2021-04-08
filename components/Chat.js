import { Avatar } from '@material-ui/core';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import getRecipientEmail from '../utils/getRecipientEmail';
import { auth, db } from '../firebase';
import { useRouter } from 'next/router';

function Chat({ id, users }) {
   const router = useRouter();
   const [user] = useAuthState(auth);
   const [recipientSnapshot] = useCollection(
      db
         .collection('users')
         .where('email', '==', getRecipientEmail(users, user))
   );

   function enterChat() {
      router.push(`/chat/${id}`);
   }

   const recipient = recipientSnapshot?.docs?.[0]?.data();
   const recipientEmail = getRecipientEmail(users, user);

   return (
      <Container onClick={enterChat}>
         {recipient ? (
            <UserAvatar src={recipient?.photoURL} />
         ) : (
            <UserAvatar>{recipientEmail[0]?.toUpperCase()}</UserAvatar>
         )}
         <p style={{ fontSize: '1.0625rem' }}>{recipientEmail}</p>
      </Container>
   );
}

export default Chat;

const Container = styled.div`
   display: flex;
   align-items: center;
   cursor: pointer;
   padding: 15px;
   word-wrap: break-word;
   border-bottom: 1px solid #e2e2e2;

   :hover {
      background-color: #f5f5f5;
   }
`;

const UserAvatar = styled(Avatar)`
   margin: 0rem;
   margin-right: 1rem;
`;
