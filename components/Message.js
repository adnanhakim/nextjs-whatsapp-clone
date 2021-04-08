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

const MessageElement = styled.p`
   width: fit-content;
   padding: 1rem;
   border-radius: 0.5rem;
   margin: 0.625rem;
   min-width: 3.75rem;
   padding-bottom: 1.625rem;
   position: relative;
   text-align: right;
`;

const Sender = styled(MessageElement)`
   margin-left: auto;
   background-color: #dcf8c6;
`;

const Receiver = styled(MessageElement)`
   text-align: left;
   background-color: whitesmoke;
`;

const Timestamp = styled.span`
   color: gray;
   padding: 0.625rem;
   font-size: 0.5625rem;
   position: absolute;
   bottom: 0;
   text-align: right;
   right: 0;
`;
