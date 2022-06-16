import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { isUuid } from "../utils/utils";

import { Chat } from "./chat.entity";

export class ChatRelationPicker {
  withParticipants?: boolean;
}

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

  async GetMessageID(
    id: string,
    RelationsPicker?: ChatRelationPicker[]
  ): Promise<Chat> {
    const relations: string[] = [];
    if (RelationsPicker) {
      for (const relation of RelationsPicker) {
        relation.withParticipants && relations.push("participants");
      }
      let found = null;
      if (isUuid(id))
        found = await this.chatRepository.findOne({
          where: { id: id },
          relations,
        });
      if (!found) throw new NotFoundException(`Channel \`${id}' not found`);
      return found;
    }
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */

  /* **************************************************************************
  /*                   PATCH                                                    */
  /* ************************************************************************** */
}
