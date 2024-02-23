import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { PublicationsService } from '../service/publications.service';
import { ICustomRequest } from 'src/shared/interfaces/ICustomRequest.interface';

@Injectable()
export class PublicationOwnerGuard implements CanActivate {
  /**
   * Creates an instance of PublicationOwnerGuard.
   * @param {PublicationsService} publicationService - The publications service instance.
   */
  constructor(private readonly publicationService: PublicationsService) {}

  /**
   * Method to determine if the user is the owner of the publication.
   * @param {ExecutionContext} context - The execution context.
   * @returns {Promise<boolean>} A boolean indicating whether the user is the owner of the publication.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const REQUEST = context?.switchToHttp()?.getRequest<ICustomRequest>();
    const USER_ID = REQUEST?.userExtract?.userId;
    const PUBLICATION_ID = REQUEST?.query?.idPublication;

    return await this.publicationService.isUserOwnerOfPublication(
      USER_ID,
      PUBLICATION_ID?.toString(),
    );
  }
}
