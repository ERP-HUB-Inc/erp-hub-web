import React from "react";
import Component from "./Component";
import Header from "../../common/components/Header";
import Footer from "../../common/components/Footer";
import UserList from "../../common/containers/UserList";

export default class App extends Component {
    render() {
        return (
            <div>
            	<Header />
                <UserList/>
                <this.Modal />
                <this.Table />
                <Footer />
            </div>
        );
    }
}