import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Menu } from 'semantic-ui-react'
import '../pages/style/navigation.css';
export default function Navigation({ user, setUser }) {
  const history = useHistory();
  async function logout() {
    await fetch("/api/signout");
    setUser(null);
    history.push('/')
  }
  const [activeItem, setActiveItem] = useState('home');

  const handleItemClick = (e, { name }) => setActiveItem(name);

  return (
    <Menu>
      {user && (
        <p className="username">Hello {user.first_name}</p>
      )}

      <Menu.Item
        name='home'
        active={activeItem === 'home'}
        onClick={handleItemClick}
        link
        as={Link}
        to="/"
      >
        Home
      </Menu.Item>
      {user && (
        <Menu.Item
          name='favorites'
          active={activeItem === 'favorites'}
          onClick={handleItemClick}
          link
          as={Link}
          to="/favorites"
        >
          Favorites
        </Menu.Item>
      )}
      {!user ? (
        <Menu.Item
          name='signup'
          active={activeItem === 'signup'}
          onClick={handleItemClick}
          position="left"
          link
          as={Link}
          to="/signup"
        >
          Sign Up
        </Menu.Item>
      ) : null}

      {user ? (
        <Menu.Item
          name='logout'
          active={activeItem === 'logout'}
          onClick={logout}
          position="right"

        >
          Logout
        </Menu.Item>
      ) :
        <Menu.Item
          name='login'
          active={activeItem === 'login'}
          onClick={handleItemClick}
          position="right"
          link
          as={Link}
          to="/login"
        >
          Login
        </Menu.Item>

      }

    </Menu>
  );
}
