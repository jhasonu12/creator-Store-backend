import { StoreSlug, StoreSlugStatus } from '@models/StoreSlug';

export class StoreSlugService {
  /**
   * Check if a slug is available
   * Returns availability status and reason if taken
   */
  async checkSlugAvailability(slug: string): Promise<{
    available: boolean;
    message: string;
  }> {
    // Check if slug exists
    const existingSlug = await StoreSlug.findOne({
      where: { slug },
    });

    if (!existingSlug) {
      return {
        available: true,
        message: 'Slug is available',
      };
    }

    // If slug exists, check its status
    if (existingSlug.status === StoreSlugStatus.RELEASED) {
      return {
        available: true,
        message: 'Slug is available',
      };
    }

    if (existingSlug.status === StoreSlugStatus.ACTIVE) {
      return {
        available: false,
        message: 'Slug is already in use',
      };
    }

    if (existingSlug.status === StoreSlugStatus.RESERVED) {
      // Check if reservation has expired (24 hours)
      const reservationTime = new Date(existingSlug.reservedAt).getTime();
      const currentTime = new Date().getTime();
      const hoursPassed = (currentTime - reservationTime) / (1000 * 60 * 60);

      if (hoursPassed > 24) {
        return {
          available: true,
          message: 'Slug is available',
        };
      }

      return {
        available: false,
        message: 'Slug is reserved. Please try again later',
      };
    }

    return {
      available: false,
      message: 'Slug is unavailable',
    };
  }
}
