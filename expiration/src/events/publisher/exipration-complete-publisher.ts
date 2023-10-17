import { ExpirationCompleteEvent, Publisher, Subjects } from "@unaiztickets/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}