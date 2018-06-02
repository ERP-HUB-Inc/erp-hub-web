import React, { Component } from "react";
import SideBar from "../components/layout/SideBar";
import Footer from "../components/layout/Footer";
import UserList from "./user/UserList";
import Header from "./layout/Header";
import "../components/layout/styles/Style.css";

export default class App extends Component {
    render() {
        return (
            <div>
                <SideBar />
                <div className="content">
                    <Header />
                    <UserList />
                    <Footer />
                </div>
            </div>
        );
    }
}
