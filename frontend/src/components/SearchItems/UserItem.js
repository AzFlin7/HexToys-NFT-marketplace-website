import React, {useContext} from "react";
import { useHistory } from "react-router";
import "./UserItem.css";
import ThemeContext from '../../context/ThemeContext';

const UserItem = (props) => {
  const {user} = props;
  const { theme } = useContext(ThemeContext)
  const history = useHistory();
  const goToUserProfilePage = () => {
    history.push(`/profile/${user.address}`);
  }
  return (
    <div className="search-user-item" onClick={goToUserProfilePage}>
      <img
        src={user.lowLogo}
        alt={user.name}
      />
      <div className="search-user-item-info">
        <h4 className={`text_color_1_${theme}`}>{user.name}</h4>        
      </div>
    </div>
  );
};

export default UserItem;
