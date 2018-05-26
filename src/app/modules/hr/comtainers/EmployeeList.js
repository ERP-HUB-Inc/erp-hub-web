import { connect } from "react-redux";
import EmployeeList from "../components/EmployeeList";
import { addEmployee } from "../actions";
import { setActiveLanguage } from "react-localize-redux";

function mapStateToProps(state) {
    const {employees} = state;
    return {employees};
}

function mapDispatchTopProps(dispatch) {
    return {
        todoOnClick: employee => {
            dispatch(addEmployee(employee));
        },
        changeLanguage: language => {
            dispatch(setActiveLanguage(language));
        }
    };
}

export default connect(mapStateToProps, mapDispatchTopProps)(EmployeeList);