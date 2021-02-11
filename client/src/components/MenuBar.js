import React, { useContext } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

const MenuBar = () => {
    const context = useContext(AuthContext);
    //const pathname = window.location.pathname;
    //const path = pathname === "/" ? "home" : pathname.substr(1);
    //context.changeActiveMenuItem(path);
    //const [activeItem, setActiveItem] = useState(path);
    //const handleItemClick = (e, {name}) => setActiveItem(name);
    const handleItemClick = (e, {name}) => context.changeActiveMenuItem(name);

    const menuBar = context.user ? (
        <Menu pointing secondary color="teal">
          <Menu.Item
            name={context.user.username}
            onClick={handleItemClick}
            active
            as={Link}
            to="/"
          />
          <Menu.Item
      name='accounts'
      active={context.activeMenuItem === 'accounts'}
      onClick={handleItemClick}
      as={Link} 
      to="/accounts"
    />
    <Menu.Item
      name='pay'
      active={context.activeMenuItem === 'pay'}
      onClick={handleItemClick}
      as={Link}
      to="/pay"
    />
          
          <Menu.Menu position='right'>
            <Menu.Item
              name='logout'
              onClick={context.logout}
            />
            
          </Menu.Menu>
        </Menu>
    ) : (<Menu pointing secondary color="teal">
    <Menu.Item
      name='home'
      active={context.activeMenuItem === 'home'}
      onClick={handleItemClick}
      as={Link}
      to="/"
    />
    
    <Menu.Menu position='right'>
      <Menu.Item
        name='login'
        active={context.activeMenuItem === 'login'}
        onClick={handleItemClick}
        as={Link}
        to="/login"
      />
      <Menu.Item
        name='register'
        active={context.activeMenuItem === 'register'}
        onClick={handleItemClick}
        as={Link}
        to="/register"
      />
    </Menu.Menu>
  </Menu>);

    return menuBar;
}
 
export default MenuBar;