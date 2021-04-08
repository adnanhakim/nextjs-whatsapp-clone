import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import moment from 'moment';

function Message({ user, message }) {
   const [userLoggedIn] = useAuthState(auth);

   const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;

   return (
      <Container>
         <TypeOfMessage>
            {message.message}

            <Timestamp>
               {message.timestamp
                  ? moment(message.timestamp).format('LT')
                  : '...'}
            </Timestamp>
         </TypeOfMessage>
      </Container>
   );
}

export default Message;

const Container = styled.div``;

const MessageElement = styled.div`
   width: fit-content;
   padding: 0.375rem 0.4375rem 0.5rem 0.5625rem;
   border-radius: 0.46875rem;
   margin: 0 5% 0.125rem 5%;
   min-width: 3.75rem;
   position: relative;
   text-align: right;
   font-size: 0.875rem;
   display: flex;
   align-items: flex-end;
   gap: 2rem;
`;

const Sender = styled(MessageElement)`
   margin-left: auto;
   background-color: #dcf8c6;
`;

const Receiver = styled(MessageElement)`
   text-align: left;
   background-color: white;
`;

const Timestamp = styled.div`
   color: #00000073;
   font-size: 0.6875rem;
   text-align: right;
`;
