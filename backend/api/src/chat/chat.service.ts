import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { User } from "../users/users.entity";
import { isUuid } from "../utils/utils";

import { Chat } from "./chat.entity";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>
  ) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */

  async GetMessage(): Promise<Chat[]> {
    const message = await this.chatRepository.find();
    if (!message) throw new NotFoundException(`Message not found`);
    return message;
  }

  async GetMessageID(id: string): Promise<Chat> {
    let found = null;
    if (isUuid(id))
      found = await this.chatRepository.findOne({
        where: { id: id },
      });
    if (!found) throw new NotFoundException(`Chat \`${id}' not found`);
    return found;
  }

  async FindTwoChat(id: string, id2: string): Promise<Chat> {
    let found = null;
    if (isUuid(id) && isUuid(id2))
      found = await this.chatRepository.findOne({
        where: { first: id, second: id2 },
      });
    if (!found) {
      found = await this.chatRepository.findOne({
        where: { first: id2, second: id },
      });
    }
    if (!found) throw new NotFoundException(`Chat \`${id}' not found`);
    return found;
  }

  async getHistory(chat: Chat): Promise<{ id: string; message: string }[]> {
    return chat.history;
  }

  async saveChat(chat: Chat): Promise<boolean> {
    this.chatRepository.save(chat);
    return true;
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  async createChat(sender: User, receiver: User): Promise<Chat> {
    const chat = this.chatRepository.create({
      first: sender.id,
      second: receiver.id,
      history: [],
    });
    try {
      await this.chatRepository.save(chat);
    } catch (error) {
      if (error.code == "23505") {
        throw new ConflictException("Chat already exist");
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
    return chat;
  }

  async addParticipant(chat: Chat, user: User): Promise<Chat> {
    try {
      chat.second = user.id;
      await this.chatRepository.save(chat);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
    return chat;
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */

  /* **************************************************************************
  /*                   PATCH                                                    */
  /* ************************************************************************** */
}
