import React from "react"
import { Nav } from "react-bootstrap";
import {NavLink} from "react-router-dom"
import './Sidebar.css'

/* Data for sidebar */
const sidebarData = [
    {
        title: 'My Dashboard',
        path: '/dashboard/',
        subNav:[
            {
                title:'Reports',
                path: 'dashboard/Reports/',
            }
        ]
    },
    {
        title: 'About',
        path: '/About',
        subNav:[],
    }
]

function dashboard() {
    return(
        <div className="sidebar">
            <div className="sidebarwrap">
                    <Nav className="flex-column ml-auto">
                        {sidebarData.map((item, index) => {
                            return (
                                <Nav.Link to={item.path} as={NavLink}>
                                    <div className="sidebardata">                                
                                        {item.title} {"\n"} 
                                    </div>
                                </Nav.Link>
                            );
                        })}
                    </Nav>
            </div>
        </div>
    )
}

export default dashboard;