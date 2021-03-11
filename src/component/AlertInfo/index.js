import React from 'react';
import { AlertInfoStyle } from './style'



class AlertInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true,
        }
    }


    componentDidMount() {
        setTimeout(
            function () {
                this.setState({ show: false });
            }
                .bind(this),
            10000
        );

    }

    render() {
        return (
            <>
                {this.state.show &&
                    <AlertInfoStyle variant={this.props.variant} >{this.props.description} </AlertInfoStyle>}
            </>
        );
    }
}
export default AlertInfo;