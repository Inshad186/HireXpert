import { OrderType } from "@/types/Type";
import { BaseRepository } from "../BaseRepository/implementation";
import Order from "@/models/orderModel";
import { IOrderRepository } from "../Interface/IOrderRepository";

export class OrderRepository extends BaseRepository<OrderType> implements IOrderRepository{
    constructor(){
        super(Order)
    }
}