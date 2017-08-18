import Colors from './Colors';
/**
 * This is a Data object containing details for each server
 * 
 */
// let colors = new Colors();
export class Data {
    /**
     * Creates the server data object
     * 
     * @param {* name of server} serverName
     * @param {* data center} dc
     * @param {* data center cage number} cageNum
     * @param {* host number} hostNum
     * @param {* status of server - Running and Ready, etc.} status
     * @param {* current version installed} version 
     * @param {* server id number} id 
     * @param {* boolean - is production version} prod 
     */
    constructor(serverName, dc, cageNum, hostNum, status, version, id, prod) {
        this._serverName = serverName;
        this._dc = dc;
        this._cageNum = cageNum;
        this._hostNum = hostNum;
        this._status = status;
        this._version = version;
        this._id = id;
        this._prod = prod;
        this.getStatusColor = this.getStatusColor.bind(this);
    }
    /**
     * Returns the color with of the corresponding status.
     */
    getStatusColor() {
        // return colors.getStatusColor(this._status);
        switch (this._status) {
            case 'Running':
                return '#4ee248'; //green
            case 'Timeout':
                return '#ff9335'; //orange
            default:
                return '#f2553c'; //red
        }
    }
}
