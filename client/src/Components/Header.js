import { UserContext } from "./UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Banner from "../assets/Banner.jpg";
import styled from "styled-components";

const Header = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <Image src={Banner} />
      <Demo>
        {currentUser ? (
          <>
            <div>Hello {currentUser}</div>
            <button
              onClick={() => {
                window.localStorage.clear();
                setCurrentUser(null);
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <button onClick={() => navigate("/signin")}>Log in</button>
        )}
      </Demo>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.div`
  position: relative;
  height: 15vh;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0.5;
  height: 15vh;
`;

const Demo = styled.div`
  position: relative;
`;
