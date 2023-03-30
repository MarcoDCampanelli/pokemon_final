import { UserContext } from "./UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Banner from "../assets/Banner.jpg";
import styled from "styled-components";

const Header = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  console.log(currentUser);

  return (
    <HeaderContainer>
      <Image src={Banner} />
      <Demo>
        {currentUser ? (
          <UsernameContainer>
            <Name>Welcome, {currentUser}</Name>
            <Button
              onClick={() => {
                window.localStorage.clear();
                setCurrentUser(null);
              }}
            >
              Log out
            </Button>
          </UsernameContainer>
        ) : (
          <SigninContainer>
            <Button onClick={() => navigate("/signin")}>Sign In</Button>
          </SigninContainer>
        )}
      </Demo>
    </HeaderContainer>
  );
};

export default Header;

// Styles the entire Header component, it's position is relative to allow for the image to overlap it.
const HeaderContainer = styled.div`
  position: relative;
  height: 15vh;
  line-height: 15vh;
`;

// The image is given a position of absolite and is placed on top of the page with the same height as the header.
const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0.5;
  height: 15vh;
`;

// Anything else that I want to belong to the header that isn't the image needs to be in here and given a position of relative
const Demo = styled.div`
  position: relative;
`;

// This will give space to the username and the button
const UsernameContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
`;

// This will style the username
const Name = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

// This will style the signout/signin button
const Button = styled.button`
  margin: auto 0;
  padding: 0.5rem;
  border-radius: 5px;

  &:hover {
    color: white;
    background-color: lightblue;
  }
`;

const SigninContainer = styled.div`
  padding: 0 1rem;
  text-align: right;
`;
