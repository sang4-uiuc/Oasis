import React, { Component } from 'react';
import '../App.css';
import logo from '../favicon.png';
import backdrop from '../..//public/light_grey.png';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import BackArrow from 'material-ui/svg-icons/navigation/chevron-right';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
/**
 * This class renders the Header containing the title and navigation
 */
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { open: false };
        //this.reset = this.reset.bind(this);
    }

    reset = () => {
        localStorage.clear();
        this.forceUpdate();
    }
    /**
     * Handles menu functionality
     */
    handleToggle = () => this.setState({ open: !this.state.open });
    render() {
        return (
            <div>
                <AppBar
                    style={{ backgroundColor: "#323b44" }}
                    titleStyle={{ lineHeight: 'normal' }}
                    title={
                        <div>
                            <div style={{ height: 40, marginTop: 5, fontWeight: 200, fontFamily: 'Bowlby One SC, cursive', letterSpacing: 3, fontSize: 30 }}>OASIS</div>
                            <div style={{ fontSize: 'small', fontWeight: 200, fontFamily: 'Roboto, sans serif' }}>Site Reliability Engineering</div>
                        </div>
                    }
                    iconElementLeft={<img src={logo} style={{ verticalAlign: 'middle', display: 'inline-block', marginTop: 5 }} className="App-logo" alt="logo" />}
                    iconElementRight={<IconButton><MenuIcon onTouchTap={this.handleToggle} /></IconButton>}
                />
                <Drawer style={{ backgroundColor: { backdrop } }} openSecondary={true} open={this.state.open}>
                    <AppBar
                        style={{ backgroundColor: "#323b44" }}
                        iconElementLeft={<IconButton><BackArrow onTouchTap={this.handleToggle} /></IconButton>}
                    />
                    <Menu>
                        <MenuItem primaryText="Reset Local Storage" onTouchTap={this.reset}/>
                    </Menu>
                    {/* <MenuItem onTouchTap={this.handleKey}>{this.getKeyState()}</MenuItem>
                    <MenuItem onTouchTap={this.handleAlerts}>{this.getAlertState()}</MenuItem> */}
                    {/*<MenuItem onTouchTap={console.log("get props.resetLayout here when it is passed from App.js")}>Reset Layout</MenuItem>*/}
                </Drawer>
            </div>
        );
    }
}

export default Header;
