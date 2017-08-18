import React, { Component } from 'react';
import './Card.css';
class Alerts extends Component {
    render() {
        return (
            <div className="card-header">
                <span className='title'>Alerts</span>
                <div >
                    <div className="keyrow">
                        <svg className="cell" width="10px" height="10px">
                            <circle cx="5" cy="5" r="6" fill={'#4ee248'} />
                        </svg>
                        <span className='body'>Running and Ready</span>
                    </div>
                    <div className="keyrow">
                        <svg className="cell" width="10px" height="10px">
                            <circle cx="5" cy="5" r="6" fill={'#ffff00'} />
                        </svg>
                        <span className='body'>Running and Not Ready</span>
                    </div>
                    <div className="keyrow">
                        <svg className="cell" width="10px" height="10px">
                            <circle cx="5" cy="5" r="6" fill={'#ff9900'} />
                        </svg>
                        <span className='body'>Response Time Out</span>
                    </div>
                    <div className="keyrow">
                        <svg className="cell" width="10px" height="10px">
                            <circle cx="5" cy="5" r="6" fill={'#e53e3e'} />
                        </svg>
                        <span className='body'>Cannot Contact HTTP</span>
                    </div>
                </div>
            </div>

        );
    }
}


export default Alerts;