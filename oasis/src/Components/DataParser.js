import { Component } from 'react';
import { Data } from './../Components/Data';
import axios from 'axios';

// Below are the URLs which contain the JSON information of the app's servers
// Use same format when adding more servers
const hostNessy = 'http://dtord01dop01p.dc.dotomi.net:8083/master/gas/nsy.php';
const hostBiddy = 'http://dtord01dop01p.dc.dotomi.net:8083/master/gas/rtb.php';
const hostDMA = 'http://dtord01dop01p.dc.dotomi.net:8083/master/gas/dma.php';
const hostSasquatch = 'http://dtord01dop01p.dc.dotomi.net:8083/master/gas/dcs.php';
const hostBessy = 'http://dtord01dop01p.dc.dotomi.net:8083/master/gas/bsy.php';
const hostCGI = 'http://dtord01dop01p.dc.dotomi.net:8083/master/gas/cg.php';
const hostMaestro = 'http://dtord01dop01p.dc.dotomi.net:8083/master/gas/maestro.php';
const hostMaelstrom = 'http://dtord01dop01p.dc.dotomi.net:8083/master/gas/maelstrom.php';
const hostTestProd = 'http://dtord01dop01p.dc.dotomi.net:8083/master/gas/testprod.php';

// const hostNessy = 'http://localhost:3004/nsy';
// const hostBiddy = 'http://localhost:3004/rtb';
// const hostDMA = 'http://localhost:3004/dma';
// const hostSasquatch = 'http://localhost:3004/dcs';
// const hostBessy = 'http://localhost:3004/bsy';

/**
 * This class retrieves JSON from various URLs listed above. It then parses
 * the JSON into multiple arrays depending on the component and passes
 * one large array back to the App.js class.
 */
export default class DataParser extends Component {
    constructor(props) {
        super(props)
        this.get = this.get.bind(this);
        this.containsNull = this.containsNull.bind(this);
        this.checkLength = this.checkLength.bind(this);
        this.getData = this.getData.bind(this);
        this.getType = this.getType.bind(this);
        this.getAttributes = this.getAttributes.bind(this);
        this.getServerName = this.getServerName.bind(this);
        this.getServers = this.getServers.bind(this);
        this.getServerDc = this.getServerDc.bind(this);
        this.getServerCageNum = this.getServerCageNum.bind(this);
        this.getServerHostNum = this.getServerHostNum.bind(this);
        this.getServerValue = this.getServerValue.bind(this);
        this.getServerStatus = this.getServerStatus.bind(this);
        this.getServerVersion = this.getServerVersion.bind(this);
        this.getServerId = this.getServerId.bind(this);
    }

    /**
     * axios helper function that returns a promise
     * @param {*} url 
     */
    get(url) {
        // Return a new promise.
        return new Promise(function (resolve, reject) {
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();
            req.open('GET', url);

            req.onload = function () {
                // This is called even on 404 etc
                // so check the status
                if (req.status === 200) {
                    // Resolve the promise with the response text
                    resolve(req.response);
                }
                else {
                    // Otherwise reject with the status text
                    // Thomas was here()
                    // which will hopefully be a meaningful error
                    reject(Error(req.statusText));
                }
            };
            // Handle network errors
            req.onerror = function () {
                reject(Error("Network Error"));
            };
            // Make the request
            req.send();
        });

    }

    /**
     * Determines the type of the servers from the given url,
     * if more servers are added in the future, just simply add more cases with the format below
     * @param {*} url - The url
     * @return String of the type
     */
    getType(url) {
        var type;
        switch (true) {
            case /nsy/.test(url):
                type = "Nessy";
                break;
            case /rtb/.test(url):
                type = "Biddy";
                break;
            case /dma/.test(url):
                type = "DMA";
                break;
            case /dcs/.test(url):
                type = "Sasquatch";
                break;
            case /bsy/.test(url):
                type = "Bessy";
                break;
            case /cg/.test(url):
                type = "CG";
                break;
            case /maestro/.test(url):
                type = "Maestro";
                break;
            case /maelstrom/.test(url):
                type = "Maelstrom";
                break;
            case /testprod/.test(url):
                type = "Test Prod";
                break;
            // Example
            // case /watever/.test(url):
            //     type = "Name of server";
            //     break;
            default:
                console.log("Unknown Server URL");
        }
        return type;
    }

    containsNull(a) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === null) {
                console.log("null at " + (i + 1));
                a[i] = "";
                return true;

            }
        }
        return false;
    }

    checkLength(a) {
        for (var i = 0; i < a.length; i++) {
            if (a[i].length < 1) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns an array of all the attributes from the servers
     * @param {*} file - the JSON file
     * @return An array of Data objects
     */
    getAttributes(url) {

        var arr = [];
        //Assuming that every server name has a corresponding JSON bracket
        //Lining up servVal with servName

        var servName = this.getServers(url);
        var servVal = this.getServerValue(url);
        try {
            if (this.checkLength(servName)) throw "At least 1 server name is invalid; Please check JSON file";
            if (this.containsNull(servVal)) throw "At least 1 server field is null; Please check JSON file";
        }
        catch (err) {
            console.log("Error: " + err + ".");
        }

        for (let i = 0; i < servName.length; i++) {
            arr[i] = new Data(
                this.getServerName(servName[i]),
                this.getServerDc(servName[i], servVal[i]),
                this.getServerCageNum(servName[i]),
                this.getServerHostNum(servName[i]),
                this.getServerStatus(servVal[i]),
                this.getServerVersion(servVal[i]),
                this.getServerId(servVal[i]),
                this.getProd(servVal[i]))
        }
        return arr;
    }
    getProd = (server) => {
        // Assume it is production if no field is given
        if (server["prod"] === undefined) {
            return true;
        }
        return server["prod"];
    }
    /**
     * Returns the entire server name
     * @param {*} name - The JSON variable
     * @return An array of server names
     */
    getServers(name) {
        return Object.keys(name);
    }
    getServerName(server) {
        let res = server.split('_');
        return res[0];
    }
    /**
     * The three helper methods below that parse the server name are all dependent on position
     * So if in the future there's a drastic name change, or an increase of servers to the triple digits,
     * You will have to change the slice of the server name(format"dtams01nsy01p") accordingly 
     */



    /**
     * Returns the data center
     * @param {*} server - The server name
     * @return A string of dc
     */
    getServerDc(server, serverVal) {
        // These check are for CG because the data is not passed in standardly through JSON due
        // to unique key issues if using the servername as the key
        if (server.length !== 13) {
            if (serverVal.id !== undefined && serverVal.id.length > 5) {
                return serverVal.id.slice(2, 5);
            }
        } else if (server.length < 4) {
            console.log(server);
            return server;
        }
        // Standard ad stack servers retrieve dc from server name
        return server.slice(2, 5);
    }

    /**
     * Returns the cage number
     * @param {*} server - The server name
     * @return An int of cageNum
     */
    getServerCageNum(server) {
        if (server.length < 13) {
            return "";
        }
        return parseInt(server.slice(5, 7), 10);
    }

    /**
     * Returns the host number
     * @param {*} server - The server name
     * @return A string of hostNum
     */
    getServerHostNum(server) {
        if (server.length < 13) {
            return "";
        }
        return server.slice(10, 12);
    }

    /**
     * Returns all the corresponding values from server name
     * @param {*} name - The JSON variable
     * @return An array of objects
     */
    getServerValue(name) {
        return Object.values(name);
    }

    /**
     * Returns server status
     * @param {*} server - An object containing values
     * @return A string of status
     */
    getServerStatus(server) {
        if (Object.values(server).length === 0) {
            return "down";
        }
        else {
            if (server.state) {
                if (/running/i.test(server.state)) return "Running";
                else return server.state;
            }
            else {
                return "invalid state(status)";
                
            }
        }
    }

    /**
     * Returns server version
     * @param {*} server - An object containing values
     * @return A string of version
     * * Also, the name Oasis sucks
     */
    getServerVersion(server) {
        if (Object.values(server).length === 0) {
            return "";
        }
        else if (Object.values(server).length === 1) {
            return "";
        }
        else {
            if (server["build-label"]) {
                return server["build-label"];
            }

            //When there's a dash character in the JSON property, JS is unable to decipher
            //So you have to use brackets with quotes
            else {
                return "";
                
            }
        }
    }

    /**
     * Returns server id
     * @param {*} server - An object containing values
     * @return A string of id
     */
    getServerId(server) {
        if (Object.values(server).length <= 1) {
            return "";
        }
        else {
            if (server.id) {
                return server.id;
            }
            else {
                return "";
                
            }
        }
    }

    /**
     * Returns an array of data objects
     * This is where all the asynchronous good stuff happens
     * Add more servers here in the future, there's an example down there already
     */
    getData() {
        var nessyArr = axios.get(hostNessy).then(res => {
            const serverObj = res.data;

            var dataObj =
                {
                    name: this.getType(hostNessy),
                    data: this.getAttributes(serverObj),
                };
            return dataObj;
        });

        var biddyArr = axios.get(hostBiddy).then(res => {
            const serverObj = res.data;

            var dataObj =
                {
                    name: this.getType(hostBiddy),
                    data: this.getAttributes(serverObj),
                };
            return dataObj;
        });

        var dmaArr = axios.get(hostDMA).then(res => {
            const serverObj = res.data;

            var dataObj =
                {
                    name: this.getType(hostDMA),
                    data: this.getAttributes(serverObj),
                };
            return dataObj;
        });

        var sasquatchArr = axios.get(hostSasquatch).then(res => {
            const serverObj = res.data;

            var dataObj =
                {
                    name: this.getType(hostSasquatch),
                    data: this.getAttributes(serverObj),
                };
            return dataObj;
        });

        var bessyArr = axios.get(hostBessy).then(res => {
            const serverObj = res.data;

            var dataObj =
                {
                    name: this.getType(hostBessy),
                    data: this.getAttributes(serverObj),
                };
            return dataObj;
        });

        var cgArr = axios.get(hostCGI).then(res => {
            const serverObj = res.data;

            var dataObj =
                {
                    name: this.getType(hostCGI),
                    data: this.getAttributes(serverObj),
                };
            return dataObj;
        });

        var maestroArr = axios.get(hostMaestro).then(res => {
            const serverObj = res.data;

            var dataObj =
                {
                    name: this.getType(hostMaestro),
                    data: this.getAttributes(serverObj),
                };
            return dataObj;
        });

        var maelstromArr = axios.get(hostMaelstrom).then(res => {
            const serverObj = res.data;

            var dataObj =
                {
                    name: this.getType(hostMaelstrom),
                    data: this.getAttributes(serverObj),
                };
            return dataObj;
        });
        var testProdArr = axios.get(hostTestProd).then(res => {
            const serverObj = res.data;

            var dataObj =
                {
                    name: this.getType(hostTestProd),
                    data: this.getAttributes(serverObj),
                };
            return dataObj;
        });

        // var exampleArr = axios.get(hostExample).then(res => {
        //     const serverObj = res.data;

        //     var dataObj =
        //         {
        //             name: this.getType(hostExample),
        //             data: this.getAttributes(serverObj),
        //         };
        //     return dataObj;
        // })


        var self = this;
        Promise.all([nessyArr, biddyArr, dmaArr, sasquatchArr, bessyArr, cgArr, maestroArr, maelstromArr, testProdArr /*exampleArr*/]).then(function (result) {
            self.props.dataState({ data: result });

        }).catch(function (error) {
            // This is almost a catch all for all errors happening in DataParser
            // but when some stuff breaks in other components, this also appears
            // so please be aware of errors in other components, since DataParser has been tested a bunch of times already
            console.log("Error Retrieving JSON files");
        });
    }

    /**
     * This method makes sure the props were received from the super class.
     * We receive the setDataState function, so we are able to set the state of
     * the data to the JSON info recieved via the urls.
     * 
     * Not sure if this is necessary since it's never used and that it also throws a warning
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        //nextProps.setDataState;
    }

    /**
     * Built in function that is executed once on call of this class.
     * Calls to set the state of the data retrieved every 10 seconds.
     */
    componentDidMount() {
        this.getData();
        this.timerID = setInterval(
            () => this.getData(), 10000
        );
    }

    /**
     * Built in function 
     */
    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        return null;
    }
}
