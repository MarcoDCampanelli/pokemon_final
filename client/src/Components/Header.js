import { UserContext } from "./UserContext";
import { useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";

import Banner from "../assets/Banner.jpg";
import styled from "styled-components";

// This component renders the header that is always present on the website
const Header = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <Image src={Banner} alt={"Banner"} />
      <Demo>
        {currentUser ? (
          <UsernameContainer>
            <NameLink to={`/profile/${currentUser}`}>
              Welcome, <Underline>{currentUser}</Underline>
            </NameLink>
            <Link to={"/"}>Return Home</Link>
            <div>
              <Button
                onClick={() => {
                  window.localStorage.clear();
                  setCurrentUser(null);
                }}
              >
                Log out
              </Button>
            </div>
          </UsernameContainer>
        ) : (
          <UsernameContainer>
            <Link to={"/"}>Return Home</Link>
            <div>
              <Button onClick={() => navigate("/signin")}>Sign In</Button>
            </div>
          </UsernameContainer>
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

// Anything else that I want to belong to the header that isn't the image needs to be in here and given a position of relative. Without it, everything else would also have an opacity of 0.5
const Demo = styled.div`
  position: relative;
`;

// Container of currentUser, Home page and button when logged in
const UsernameContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
`;

// This will style the username
const NameLink = styled(NavLink)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: black;

  &.active {
    color: blue;
  }
`;

// This will only underline the name of the signed in user
const Underline = styled.span`
  text-decoration: underline;
`;

// Stlying for the NavLink
const Link = styled(NavLink)`
  text-decoration: underline;
  color: black;

  &.active {
    color: blue;
  }
`;

// This will style the signout/signin button
const Button = styled.button`
  padding: 0.5rem;
  border-radius: 5px;
  overflow: hidden;

  &:hover {
    color: white;
    background-color: lightblue;
  }
`;
