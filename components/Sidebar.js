import { Avatar, IconButton } from '@material-ui/core';
import styled from 'styled-components';
import Chat from './Chat';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import AddIcon from '@material-ui/icons/Add';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import { auth, db } from '../firebase';

function Sidebar() {
   const [user] = useAuthState(auth);
   const userChatRef = db
      .collection('chats')
      .where('users', 'array-contains', user?.email);
   const [chatsSnapshot] = useCollection(userChatRef);

   function createChat() {
      const input = prompt(
         'Please enter an email address for the user you wish to chat with'
      );

      if (!input) return null;

      if (
         EmailValidator.validate(input) &&
         input !== user.email &&
         !chatAlreadyExists(input)
      ) {
         // We add the chat if the input is valid, not same as current user and doesn't already exist
         db.collection('chats').add({
            users: [user.email, input],
         });
      }
   }

   function chatAlreadyExists(receipientEmail) {
      return !!chatsSnapshot?.docs.find(
         (chat) =>
            chat.data().users.find((user) => user === receipientEmail)?.length >
            0
      );
   }

   return (
      <Container>
         <Header>
            <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />

            <IconsContainer>
               <IconButton>
                  <AddIcon
                     onClick={createChat}
                     style={{ color: '#00000073' }}
                  />
               </IconButton>
               <IconButton>
                  <ChatIcon style={{ color: '#00000073' }} />
               </IconButton>
               <IconButton>
                  <MoreVertIcon style={{ color: '#00000073' }} />
               </IconButton>
            </IconsContainer>
         </Header>

         <Search>
            <SearchContainer>
               <SearchIcon style={{ fontSize: '1.2rem', color: '#00000073' }} />
               <SearchInput placeholder="Search or start new chat" />
            </SearchContainer>
         </Search>

         {chatsSnapshot?.docs.map((chat) => (
            <Chat key={chat.id} id={chat.id} users={chat.data().users} />
         ))}
      </Container>
   );
}

export default Sidebar;

const Container = styled.div`
   flex: 0.45;
   border-right: 1px solid #d0d0d0;
   height: 100vh;
   min-width: 300px;
   max-width: 350px;
   overflow-y: scroll;

   ::-webkit-scrollbar {
      display: none; /* Chrome, Safari and Opera */
   }

   -ms-overflow-style: none; /* IE and Edge */
   scrollbar-width: none; /* Firefox */
`;

const Header = styled.div`
   display: flex;
   position: sticky;
   top: 0;
   background-color: #ededed;
   z-index: 1;
   justify-content: space-between;
   align-items: center;
   padding: 0.625rem 1rem;
   height: 3.6875rem;
   border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
   cursor: pointer;

   :hover {
      opacity: 0.8;
   }
`;

const IconsContainer = styled.div``;

const Search = styled.div`
   display: flex;
   align-items: center;
   height: 3.0625rem;
   padding: 0.625rem 1rem;
   border-radius: 2px;
   background: #f6f6f6;
   border-bottom: 1px solid #dddddd;
`;

const SearchContainer = styled.div`
   display: flex;
   align-items: center;
   background: white;
   flex: 1;
   padding: 0.5rem 0.875rem;
   border-radius: 1.3125rem;
`;

const SearchInput = styled.input`
   outline: none;
   border: none;
   flex: 1;
   margin: 0rem 0.5rem;
   margin-left: 1.5rem;
`;
