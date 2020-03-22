//import DeviceInfo from 'react-native-device-info';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

class Centralizer {
    private username: string;

    constructor() {
        this.username = uniqueNamesGenerator({
            dictionaries: [adjectives, animals], // colors can be omitted here as not used
            separator: '',
            style: 'capital',
            length: 2
        });
    }

    getDeviceID() {
        //return this.device_id;
    }

    getUsername(): string {
        return this.username;
    }

    setUsername(username: string) {
        this.username = username;
    }
}

export default new Centralizer();