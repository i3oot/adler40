import { Injectable } from 'inject'
import { Session, MongoStore } from 'oak-sessions'


@Injectable()
class Store extends MongoStore {
    constructor(){
        super()
    }
}

@Injectable()
export class SessionService {
    constructor(
        private readonly store: Store
    ){}

    initMiddleware() {
        return Session.initMiddleware(this.store);
    }
}