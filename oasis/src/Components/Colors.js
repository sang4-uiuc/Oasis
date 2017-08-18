export class Colors {
    constructor(){
        let running = '#4ee248';
        let timeout = '#ff9335';
        let down = '#f2553c';
    }
    getStatusColor(status) {
        console.log('colors');
        switch (status) {
            case 'Running':
                return '#4ee248'; //green
            case 'Timeout':
                return '#ff9335'; //orange
            default:
                return '#f2553c'; //red
        }
    }
}