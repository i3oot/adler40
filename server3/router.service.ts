import { Injectable } from 'inject';
import { Router } from "jsr:@oak/oak/router";


@Injectable()
export class RouterService extends Router {

    constructor(){
        super()
        this
            .get("/", (context) => {
                context.response.body = "Hello world!";
            });
    }

}