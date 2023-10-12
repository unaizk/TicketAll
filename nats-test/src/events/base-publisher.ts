import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";
import { resolve } from "path";

interface Events{
    subject:Subjects,
    data:any
}

export abstract class Publisher<T  extends Events>{
    abstract subject:T['subject']
    private client: Stan

    constructor(client:Stan){
        this.client = client
    }

    publish(data:T['data']):Promise<void>{

        return new Promise((reolve,reject)=>{
            this.client.publish(this.subject,JSON.stringify(data),(err)=>{
                if(err){
                   return reject(err)
                }

                console.log('Event published on',this.subject);
                resolve()
            })
        })
       
    }
}