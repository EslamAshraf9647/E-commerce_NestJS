import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { TokenService } from "../Services";
import { Types } from "mongoose";
import { from, map, Observable } from "rxjs";





@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class RealTimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly tokenService: TokenService,
    ){}

    private clients: Map<string, string> = new Map();

    @WebSocketServer()
    io:Server;


    async handleConnection(socket: Socket) {
        try {
            const accesstoken = socket.handshake.auth.accesstoken;

            if (!accesstoken) {
                console.log("User tried to connect without token");
                socket.disconnect(true); 
                return;
            }
            const { user } = await this.tokenService.ValidateAndVerifyToken(accesstoken);
            socket.data.userId = user._id.toString();
            this.clients.set(user._id.toString(), socket.id);

            console.log("Connected clients:", this.clients);
        } catch (err) {
            console.log("Token invalid or expired:", err.message);
            socket.disconnect(true);  
        }
    }


    async handleDisconnect(socket: Socket) {
    const userId = socket.data.userId;
        if (userId) {
            this.clients.delete(userId);
            console.log("Disconnected clients:", this.clients);
        }
    }

    emitProductStockUpdate(productId: Types.ObjectId |string, newStock: number) {
        this.io.emit('product-stock-update', { productId, newStock });
    }

    
// @SubscribeMessage('events')
// onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
//   const event = 'events';
//   const response = [1, 2, 3,4,5,6,7,8,9,10];

//   return from(response).pipe(
//     map(data => ({ event, data })),
//   );
// }
  
}





