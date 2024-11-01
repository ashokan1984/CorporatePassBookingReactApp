import React from 'react';
import { Link } from 'react-router-dom';

interface SideMenuProps {
  onMenuItemClick: (component: string) => void;
}

function SideMenu() {
  return (
    <div className="side-menu">
       <h3>Menu</h3>
      <ul>
      <Link to="/visitor-list">Visitor List</Link>
        <li>About</li>
      </ul>
     </div>
  )
}
// const SideMenu: React.FC<SideMenuProps> = ({ onMenuItemClick }) => {
//   return (
//     <div className="side-menu">
//       <h3>Menu</h3>
//       <ul>
//         <li onClick={() => onMenuItemClick('home')}>Home</li>
//         <li onClick={() => onMenuItemClick('about')}>About</li>
//       </ul>
//     </div>
//   );
// };

export default SideMenu;