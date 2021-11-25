import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Notification, NotificationInputCreation } from "../models/Notification";


@Resolver(Notification)
export class NotificationsResolver {
    private notificationRepo = getRepository(Notification);

    // retourne tous les notifications
    @Query(() => [Notification])
    async getNotifications(): Promise<Notification[]> {
        return await this.notificationRepo.find();
    }

    // retourne une notification par son Id
    @Query(() => [Notification])
    async getNotificationById(@Arg('id', () => ID) id: number): Promise<Notification> {
        return await this.notificationRepo.findOne(id);
    }

    //crée une notification
    @Mutation(() => Notification)
    async createNotification(@Arg('data', () => NotificationInputCreation) notification: NotificationInputCreation): Promise<Notification> {
        const newNotification = this.notificationRepo.create(notification);
        await newNotification.save();
        return newNotification;
    }

// supprime une notification
    @Mutation(() => Notification, { nullable: true })
    async deleteNotification(@Arg('id', () => ID) id: number): Promise<Notification | null> {
        const notification = await this.notificationRepo.findOne(id);
        if (notification) {
            await notification.remove();
        }
        return notification;
    }
}