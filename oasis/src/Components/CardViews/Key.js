import React, { Component } from 'react';
import './Card.css';
class Key extends Component {
    constructor(props) {
        super(props)
        // this.changeMini = this.changeMini.bind(this);
        this.showLegendItems = this.showLegendItems.bind(this);
    }
    // changeMini() {
    //     if (this.props.keyState === true) {
    //         this.props.toMini(this.props.tkey);
    //     } else {
    //         this.props.showKey(this.props.tkey);
    //     }
    // }
    showLegendItems() {
        
        // if(this.props.keyState === true) {
            return (
                <div>
                    <div className="keyrow">
                        <svg className="cell" width="10px" height="10px">
                            <rect x="0" y="0" rx="2" ry="2" width="10px" height="10px" fill={'#4ee248'} />
                        </svg>
                        <span className='body'>Running and Ready</span>
                    </div>
                    <div className="keyrow">
                        <svg className="cell" width="10px" height="10px">
                            <rect x="0" y="0" rx="2" ry="2" width="10px" height="10px" fill={'#ff9900'} />
                        </svg>
                        <span className='body'>Response Time Out</span>
                    </div>
                    <div className="keyrow">
                        <svg className="cell" width="10px" height="10px">
                            <rect x="0" y="0" rx="2" ry="2" width="10px" height="10px" fill={'#e53e3e'} />
                        </svg>
                        <span className='body'>Cannot Contact HTTP</span>
                    </div>
                    <div className="keyrow">
                        <svg className="cell" width="10px" height="10px">
                            <rect x="0" y="0" rx="2" ry="2" width="10px" height="10px" fill={'transparent'} stroke={'#ffff00'} strokeWidth="2" />
                        </svg>
                        <span className='body'>Non-Production</span>
                    </div>
                </div>
            );
        // } else {
        //     return null;
        // }
    }
    render() {
        
        return (
            <div className="card-header">
                <span className='title title-hover'>Key</span>
                {/* <span className="button" onClick={this.changeMini}></span> */}
                <span>{this.showLegendItems()}</span>
            </div>
        );
    }
}

export default Key;