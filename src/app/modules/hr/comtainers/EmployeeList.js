import { connect } from "react-redux";
import EmployeeList from "../components/EmployeeList";
import { addEmployee } from "../actions";

function mapStateToProps(state) {
    const {employees} = state;
    return {employees};
}

function mapDispatchTopProps(dispatch) {
    return {
        todoOnClick: employee => {
            dispatch(addEmployee(employee));
        }
    };
}

export default connect(mapStateToProps, mapDispatchTopProps)(EmployeeList);