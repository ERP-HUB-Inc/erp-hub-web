import React from "react";
import Component from "../Component";

export default class User extends Component {
  render() {
    return (
      <div>
        {
          this.props.fetching ? <h2 className="color">Record Loading</h2> : <h2 className="color">Record Loaded</h2>
        }
        {
          <table border={1}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {
                this.props.fetched ? this.props.users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.userName}</td>
                    <td>{user.password}</td>
                  </tr>
                ))
                  :
                  <tr><td colSpan={2}>Loading</td></tr>
              }
            </tbody>
          </table>
        }
      </div>
    );
  }
}