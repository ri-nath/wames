//import DeviceInfo from 'react-native-device-info';
import UsernameGenerator from 'username-generator';

class Centralizer {
    constructor() {
        //this.device_id = DeviceInfo.getUniqueId();
        this.username = UsernameGenerator.generateUsername('', 6);
    }

    getDeviceID() {
        //return this.device_id;
    }

    getUsername() {
        return this.username;
    }

    setUsername(username) {
        this.username = username;
    }
}

export default new Centralizer();