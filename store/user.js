import ModelModule from './base/ModelModule';

class User extends ModelModule {
    constructor() {
        super('/user');
    }
}

export default new User().getModule();
