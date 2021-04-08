import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Avatar, IconButton } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';

function ChatScreen({ chat, messages }) {
   const router = useRouter();
   const [user] = useAuthState(auth);

   return (
      <Container>
         <Header>
            <Avatar />

            <HeaderInformation>
               <h3>Rec email</h3>
               <p>Last seen...</p>
            </HeaderInformation>

            <HeaderIcons>
               <IconButton>
                  <AttachFileIcon />
               </IconButton>
               <IconButton>
                  <MoreVertIcon />
               </IconButton>
            </HeaderIcons>

            <MessageContainer>
               <EndOfMessage />
            </MessageContainer>
         </Header>
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

const MessageContainer = styled.div``;

const EndOfMessage = styled.div``;
